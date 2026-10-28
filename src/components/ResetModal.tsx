import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
  currentCount: number;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  isOpen,
  onClose,
  onConfirmReset,
  currentCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden p-5 text-center">
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-black text-slate-900 mb-1.5">
          最初からやり直しますか？
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          現在集めたスタンプ <span className="font-bold text-rose-600">{currentCount}個</span> や達成記録がすべて消去されます。この操作は取り消せません。
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            キャンセル
          </button>
          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>リセットする</span>
          </button>
        </div>
      </div>
    </div>
  );
};
