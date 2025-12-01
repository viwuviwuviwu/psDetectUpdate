import React from 'react';
import { ShieldCheck, Eye } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 py-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">TrueSight <span className="text-blue-500">Forensics</span></h1>
            <p className="text-xs text-slate-400 font-mono tracking-wide">MULTIMODAL IMAGE AUTHENTICITY PROTOCOL</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Gemini 2.5 Powered Verification</span>
        </div>
      </div>
    </header>
  );
};
