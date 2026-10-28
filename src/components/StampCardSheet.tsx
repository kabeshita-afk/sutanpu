import React from 'react';
import { Check, Sparkles, Award } from 'lucide-react';
import { Spot, StampProgress } from '../types';

interface StampCardSheetProps {
  spots: Spot[];
  progress: StampProgress;
  onSpotClick: (spotId: string) => void;
  onOpenCertificate: () => void;
  isAllCompleted: boolean;
}

export const StampCardSheet: React.FC<StampCardSheetProps> = ({
  spots,
  progress,
  onSpotClick,
  onOpenCertificate,
  isAllCompleted,
}) => {
  return (
    <div className="bg-gradient-to-b from-amber-50/70 to-orange-50/40 rounded-2xl border-2 border-dashed border-amber-300/80 p-4 shadow-xs relative overflow-hidden">
      {/* Decorative Stamp Sheet Header */}
      <div className="flex items-center justify-between mb-3 border-b border-amber-200/80 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-black text-xs">
            台
          </div>
          <span className="font-bold text-sm text-amber-950">
            スタンプコレクションシート
          </span>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
          {progress.stampedSpotIds.length} / {spots.length} 個 押印完了
        </span>
      </div>

      {/* Grid of Stamp Circles */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {spots.map((spot) => {
          const isStamped = progress.stampedSpotIds.includes(spot.id);
          const stampedDate = progress.stampedAtMap[spot.id]
            ? new Date(progress.stampedAtMap[spot.id])
            : null;

          return (
            <button
              key={spot.id}
              onClick={() => onSpotClick(spot.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                isStamped
                  ? 'bg-white shadow-xs border border-rose-200 hover:border-rose-300'
                  : 'bg-white/60 border border-dashed border-slate-300 hover:bg-white hover:border-orange-300'
              }`}
            >
              {/* Stamp Circle Container */}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center relative transition-transform active:scale-95 ${
                  isStamped
                    ? 'border-2 border-rose-600 bg-rose-50/40 animate-stamp shadow-inner'
                    : 'border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400'
                }`}
              >
                {isStamped ? (
                  <div className="flex flex-col items-center justify-center select-none">
                    <span className="text-[9px] font-black tracking-widest text-rose-600 leading-none">
                      済
                    </span>
                    <span className="text-sm font-extrabold text-rose-600 tracking-tight leading-tight">
                      {spot.sealText}
                    </span>
                    <span className="text-[8px] font-medium text-rose-500/90 leading-none scale-90">
                      押印
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-slate-400">
                      #{spot.order}
                    </span>
                    <span className="text-[9px] text-slate-400">未</span>
                  </div>
                )}
              </div>

              {/* Spot Mini Name */}
              <span className="mt-1 text-[11px] font-bold text-slate-700 truncate w-full">
                {spot.name.replace(/（.*）/, '')}
              </span>

              {/* Stamped Time or Action */}
              <span className="text-[9px] text-slate-400 leading-tight">
                {isStamped && stampedDate
                  ? `${stampedDate.getHours().toString().padStart(2, '0')}:${stampedDate.getMinutes().toString().padStart(2, '0')}`
                  : 'タップで移動'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Completion Banner inside Stamp Card */}
      {isAllCompleted && (
        <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>全スポットコンプリート達成！</span>
          </div>
          <button
            onClick={onOpenCertificate}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-xs font-extrabold shadow-sm hover:from-amber-600 hover:to-orange-600 flex items-center gap-1 transition-all active:scale-95"
          >
            <Award className="w-3.5 h-3.5" />
            達成証を見る
          </button>
        </div>
      )}
    </div>
  );
};
