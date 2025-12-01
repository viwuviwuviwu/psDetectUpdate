import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      onImageSelected(files[0]);
    }
  }, [onImageSelected]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImageSelected(files[0]);
    }
  }, [onImageSelected]);

  return (
    <div 
      className={`relative group rounded-xl border-2 border-dashed transition-all duration-300 h-64 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10 scale-[1.01] shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
          : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'
        }
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input 
        id="file-upload" 
        type="file" 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50 pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center p-6">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-slate-300 font-mono animate-pulse">Running Deep Analysis Protocol...</p>
          </div>
        ) : (
          <>
            <div className={`p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 ${isDragging ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">
              {isDragging ? 'Drop Image to Analyze' : 'Upload Image for Analysis'}
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto">
              Drag & drop or click to browse. Supports JPG, PNG, WEBP.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
