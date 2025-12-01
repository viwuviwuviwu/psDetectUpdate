// App.tsx (部分修改)
import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { AnalysisReport } from './components/AnalysisReport';
import { ForensicViewer } from './components/ForensicViewer';
import { ExifDataPanel } from './components/ExifDataPanel'; // 导入新组件
import { analyzeImage } from './services/geminiService';
import { extractExifData } from './services/exifService'; // 导入 EXIF 服务
import { AnalysisResult, AnalysisState } from './types';
import { AlertCircle, Cpu } from 'lucide-react';

// 扩展 AnalysisState 类型以包含 EXIF 数据
interface ExtendedAnalysisState extends AnalysisState {
  exifData: Record<string, any> | null;
}

const App: React.FC = () => {
  const [state, setState] = useState<ExtendedAnalysisState>({
    isLoading: false,
    error: null,
    result: null,
    imagePreview: null,
    exifData: null, // 添加 EXIF 数据字段
  });

  const handleImageSelect = async (file: File) => {
    // 创建预览
    const objectUrl = URL.createObjectURL(file);
    
    setState({
      isLoading: true,
      error: null,
      result: null,
      imagePreview: objectUrl,
      exifData: null,
    });

    try {
      // 提取 EXIF 数据
      const exifData = await extractExifData(file);
      
      // 更新状态以显示 EXIF 数据
      setState(prev => ({
        ...prev,
        exifData
      }));
      
      // 分析图像
      const result: AnalysisResult = await analyzeImage(file);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        result
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "An unexpected error occurred."
      }));
    }
  };

  const resetAnalysis = () => {
    if (state.imagePreview) {
      URL.revokeObjectURL(state.imagePreview);
    }
    setState({
      isLoading: false,
      error: null,
      result: null,
      imagePreview: null,
      exifData: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Intro Section */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">数字图像取证实验室</h2>
          <p className="text-slate-400 text-lg">
            专业分析<span className="text-blue-400">字体操纵</span>、布局不一致性和AI伪造特征，结合<span className="text-green-400">EXIF元数据分析</span>，使用多模态Gemini 2.5。
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Column: Upload & Preview */}
          <div className="lg:col-span-2 space-y-6">
            {!state.imagePreview ? (
              <UploadZone onImageSelected={handleImageSelect} isLoading={state.isLoading} />
            ) : (
              <ForensicViewer 
                imageUrl={state.imagePreview} 
                result={state.result} 
                isLoading={state.isLoading} 
                onReset={resetAnalysis} 
              />
            )}

            {/* EXIF Data Panel - 添加 EXIF 数据面板 */}
            {state.imagePreview && (
              <ExifDataPanel exifData={state.exifData} />
            )}

            {/* Error Message */}
            {state.error && (
              <div className="bg-red-900/20 border border-red-900/50 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{state.error}</p>
              </div>
            )}
            
            {/* Guide Info - 修改指南信息以包含 EXIF 分析 */}
             {!state.result && !state.isLoading && !state.imagePreview && (
               <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 space-y-4">
                 <h4 className="font-semibold text-slate-300 text-sm uppercase tracking-wider">核心取证能力</h4>
                 <ul className="space-y-3 text-sm text-slate-400">
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/>
                     <span className="text-slate-200">字体与排版分析</span>
                     <span className="text-xs text-slate-500 block">(笔画粗细、抗锯齿)</span>
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"/>
                     <span className="text-slate-200">布局与几何完整性</span>
                     <span className="text-xs text-slate-500 block">(对齐、透视)</span>
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>
                     <span className="text-slate-200">EXIF元数据分析</span>
                     <span className="text-xs text-slate-500 block">(软件信息、时间戳、设备信息)</span>
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/>
                     元数据与时空逻辑
                   </li>
                   <li className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"/>
                     AI生成伪造特征
                   </li>
                 </ul>
               </div>
             )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-3">
            {/* 其余部分保持不变 */}
            {/* ... */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
