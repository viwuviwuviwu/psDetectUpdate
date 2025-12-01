import React from 'react';
import { AnalysisResult, VerdictType } from '../types';
import { CheckCircle, AlertTriangle, AlertOctagon, HelpCircle, Search, Cpu, Camera } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface AnalysisReportProps {
  result: AnalysisResult;
}

const VerdictBadge: React.FC<{ verdict: VerdictType }> = ({ verdict }) => {
  switch (verdict) {
    case VerdictType.REAL:
      return (
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Camera className="w-5 h-5" />
          <span className="font-bold uppercase tracking-wider">Authentic Image</span>
        </div>
      );
    case VerdictType.AI:
      return (
        <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Cpu className="w-5 h-5" />
          <span className="font-bold uppercase tracking-wider">AI Generated</span>
        </div>
      );
    case VerdictType.TAMPERED:
      return (
        <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-2 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-bold uppercase tracking-wider">Manipulated</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-2 rounded-full border border-amber-500/20">
          <HelpCircle className="w-5 h-5" />
          <span className="font-bold uppercase tracking-wider">Inconclusive</span>
        </div>
      );
  }
};

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result }) => {
  const chartData = [
    { name: 'Confidence', value: result.confidence, fill: 
      result.verdict === VerdictType.REAL ? '#10b981' : 
      result.verdict === VerdictType.AI ? '#6366f1' : 
      result.verdict === VerdictType.TAMPERED ? '#ef4444' : '#f59e0b' 
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Result Section */}
      <div className="p-6 md:p-8 border-b border-slate-800 bg-slate-800/20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <h2 className="text-slate-400 text-sm font-mono uppercase mb-2 tracking-widest">Analysis Conclusion</h2>
            <div className="flex flex-wrap items-center gap-4">
              <VerdictBadge verdict={result.verdict} />
              <div className="h-px w-8 bg-slate-700 hidden md:block" />
              <span className="text-slate-300 font-light">{result.summary}</span>
            </div>
          </div>
          
          <div className="relative w-24 h-24 flex-shrink-0">
             <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="80%" 
                outerRadius="100%" 
                barSize={10} 
                data={chartData} 
                startAngle={90} 
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={30} // Use a number instead of string for cornerRadius
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-lg font-bold text-white">{result.confidence}%</span>
              <span className="text-[10px] text-slate-500 uppercase">Confidence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Evidence Section */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Forensic Breakdown</h3>
        </div>

        <div className="space-y-4">
          {result.evidence.map((point, idx) => (
            <div 
              key={idx} 
              className="group p-4 rounded-lg bg-slate-800/40 border border-slate-700 hover:bg-slate-800/60 hover:border-slate-600 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {result.verdict === VerdictType.REAL ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500/50 group-hover:text-emerald-400" />
                  ) : (
                    <AlertOctagon className="w-5 h-5 text-red-500/50 group-hover:text-red-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-slate-200 font-medium mb-1">{point.feature}</h4>
                  <p className="text-slate-400 text-sm mb-2">{point.description}</p>
                  <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-900/50 p-2 rounded">
                    <span className="font-mono text-blue-400 shrink-0">LOGIC:</span>
                    <span>{point.reasoning}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
