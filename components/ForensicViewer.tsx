
import React from 'react';
import { Trash2 } from 'lucide-react';
import { AnalysisResult, EvidencePoint } from '../types';

interface ForensicViewerProps {
  imageUrl: string;
  result: AnalysisResult | null;
  isLoading: boolean;
  onReset: () => void;
}

export const ForensicViewer: React.FC<ForensicViewerProps> = ({ imageUrl, result, isLoading, onReset }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg relative group min-h-[300px] flex justify-center items-center p-4">
      {/* 
        Container must be relative and fit the content exactly (inline-block/flex item) 
        so that absolute children (bounding boxes) are positioned relative to the image size, 
        not the parent container size.
      */}
      <div className="relative inline-block max-w-full">
        {/* Main Image */}
        <img 
          src={imageUrl} 
          alt="Analysis Subject" 
          className={`block max-w-full max-h-[70vh] w-auto h-auto object-contain transition-opacity duration-500 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100'}`} 
        />

        {/* Scan Overlay Effect */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 animate-[scan_2s_ease-in-out_infinite] pointer-events-none" />
        )}

        {/* Bounding Boxes */}
        {!isLoading && result && result.evidence.map((point: EvidencePoint, idx: number) => {
          if (!point.boundingBox || point.boundingBox.length !== 4) return null;
          
          const [ymin, xmin, ymax, xmax] = point.boundingBox;
          
          return (
            <div
              key={idx}
              className="absolute border-2 border-red-500 bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.5)] group/box hover:bg-red-500/30 transition-colors cursor-help"
              style={{
                top: `${ymin * 100}%`,
                left: `${xmin * 100}%`,
                height: `${(ymax - ymin) * 100}%`,
                width: `${(xmax - xmin) * 100}%`,
              }}
            >
              {/* Corner Markers for "Forensic" look */}
              <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-red-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-red-400" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-red-400" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-red-400" />

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900/95 text-white text-xs p-2 rounded whitespace-nowrap opacity-0 group-hover/box:opacity-100 transition-opacity z-20 pointer-events-none border border-slate-700 shadow-xl">
                <span className="font-bold text-red-400 block mb-1">{point.feature}</span>
                <span className="text-slate-300">{point.description.substring(0, 50)}{point.description.length > 50 ? '...' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset Button (Outside relative container to stick to top right of card) */}
      <div className="absolute top-4 right-4 z-30">
        <button 
          onClick={onReset}
          disabled={isLoading}
          className="bg-slate-900/80 backdrop-blur text-slate-400 p-2 rounded-full hover:bg-red-500/20 hover:text-red-300 transition-colors border border-slate-700 shadow-lg"
          title="Reset Analysis"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
