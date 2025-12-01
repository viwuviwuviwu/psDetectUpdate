// components/ExifDataPanel.tsx
import React from 'react';
import { Database } from 'lucide-react';

interface ExifDataPanelProps {
  exifData: Record<string, any> | null;
}

export const ExifDataPanel: React.FC<ExifDataPanelProps> = ({ exifData }) => {
  if (!exifData || Object.keys(exifData).length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-slate-400 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4 text-slate-500" />
          <span className="text-slate-300 font-medium">EXIF 元数据</span>
        </div>
        <p>未检测到 EXIF 数据</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Database className="w-4 h-4 text-blue-400" />
        <span className="text-slate-300 font-medium">EXIF 元数据</span>
      </div>
      
      <div className="max-h-60 overflow-y-auto text-xs font-mono">
        <table className="w-full">
          <tbody>
            {Object.entries(exifData).map(([key, value]) => (
              // 过滤掉二进制数据和过大的字段
              key !== "MakerNote" && key !== "UserComment" && typeof value !== 'object' ? (
                <tr key={key} className="border-b border-slate-800 last:border-0">
                  <td className="py-1 pr-4 text-slate-400 whitespace-nowrap">{key}</td>
                  <td className="py-1 text-slate-300 break-all">{String(value)}</td>
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
