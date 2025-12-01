// services/geminiService.ts
import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION, JSON_SCHEMA_PROMPT } from "../constants";
import { AnalysisResult, VerdictType } from "../types";
import { extractExifData } from "./exifService"; // 导入 EXIF 服务

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImage = async (file: File): Promise<AnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing via process.env.API_KEY");
  }

  // 提取 EXIF 数据
  const exifData = await extractExifData(file);
  console.log("提取的 EXIF 数据:", exifData);
  
  // 将 EXIF 数据格式化为字符串
  const exifText = formatExifData(exifData);
  
  const imagePart = await fileToGenerativePart(file);

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
          imagePart, 
          { 
            text: `图像的 EXIF 元数据信息:\n${exifText}\n\n${JSON_SCHEMA_PROMPT}` 
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              enum: [VerdictType.REAL, VerdictType.AI, VerdictType.TAMPERED, VerdictType.UNCERTAIN],
            },
            confidence: {
              type: Type.INTEGER,
            },
            summary: {
              type: Type.STRING,
            },
            evidence: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  description: { type: Type.STRING },
                  reasoning: { type: Type.STRING },
                  boundingBox: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: "Bounding box [ymin, xmin, ymax, xmax] normalized 0-1.",
                  }
                },
                required: ["feature", "description", "reasoning"],
              },
            },
          },
          required: ["verdict", "confidence", "summary", "evidence"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

// 格式化 EXIF 数据为易读的字符串
function formatExifData(exifData: Record<string, any>): string {
  if (!exifData || Object.keys(exifData).length === 0) {
    return "未检测到 EXIF 数据";
  }
  
  let result = "";
  for (const [key, value] of Object.entries(exifData)) {
    // 过滤掉二进制数据和过大的字段
    if (key !== "MakerNote" && key !== "UserComment" && typeof value !== 'object') {
      result += `${key}: ${value}\n`;
    }
  }
  
  return result || "提取的 EXIF 数据不包含文本信息";
}
