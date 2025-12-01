// services/exifService.ts
export const extractExifData = async (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        
        // 使用浏览器端的 EXIF 解析库
        // 这里我们使用一个简单的方法，实际项目中可能需要引入专门的 EXIF 解析库如 exif-js
        const exifData = await parseExifFromArrayBuffer(arrayBuffer);
        resolve(exifData);
      } catch (error) {
        console.error("EXIF 提取错误:", error);
        resolve({}); // 即使提取失败也返回空对象，不阻止流程
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

// 简单的 EXIF 解析函数，实际项目中建议使用成熟的库
const parseExifFromArrayBuffer = async (buffer: ArrayBuffer): Promise<Record<string, any>> => {
  // 这里是一个简化版的实现，实际应用中应使用专业的 EXIF 解析库
  const exifData: Record<string, any> = {};
  
  try {
    // 检查是否为 JPEG 格式（JPEG 文件头以 FF D8 开始）
    const view = new DataView(buffer);
    if (view.getUint8(0) !== 0xFF || view.getUint8(1) !== 0xD8) {
      return { format: "非JPEG格式，无法提取标准EXIF" };
    }
    
    // 简单提取一些基本信息（实际应用中需要完整的 EXIF 解析）
    exifData.fileSize = `${(buffer.byteLength / 1024).toFixed(2)} KB`;
    
    // 在实际应用中，这里需要实现完整的 EXIF 解析逻辑
    // 或者引入专门的库如 exif-js
    
    return exifData;
  } catch (error) {
    console.error("EXIF 解析错误:", error);
    return { error: "EXIF 解析失败" };
  }
};
