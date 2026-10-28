import React from 'react';
import { Award, Sparkles, Footprints } from 'lucide-react';

interface ProgressBarProps {
  currentCount: number;
  totalCount: number;
  onOpenCertificate: () => void;
  isAllCompleted: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentCount,
  totalCount,
  onOpenCertificate,
  isAllCompleted,
}) => {
  const percentage = Math.round((currentCount / totalCount) * 100);
  const remaining = totalCount - currentCount;

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500">スタンプ集めの進み具合</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-800 tracking-tight">
                {currentCount}
              </span>
              <span className="text-sm font-bold text-slate-400">/ {totalCount} 個</span>
              <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full ml-1">
                {percentage}%
              </span>
            </div>
          </div>
        </div>

        {isAllCompleted ? (
          <button
            onClick={onOpenCertificate}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-bold shadow-md hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>達成証を表示</span>
          </button>
        ) : (
          <div className="text-right">
            <span className="text-xs font-bold text-slate-500">
              あと <span className="text-orange-600 font-extrabold">{remaining}</span> か所！
            </span>
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isAllCompleted
              ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500'
              : 'bg-gradient-to-r from-orange-400 to-amber-500'
          }`}
          style={{ width: `${Math.max(percentage, 4)}%` }}
        />
      </div>
    </div>
  );
};
