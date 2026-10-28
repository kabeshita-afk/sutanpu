import React from 'react';
import { X, MapPin, KeyRound, Award, Sparkles, BookOpen } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-200" />
            <span className="font-extrabold text-base">スタンプラリーの遊び方</span>
          </div>
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-orange-50/60 border border-orange-100">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  スポットを巡ろう
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  コース一覧から気になるスポットを訪れます。「合言葉の看板はどこ？」を押すと、案内板の場所がわかります。
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  看板の「合言葉」を入力
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  スポットの看板に書かれた合言葉を入力して「スタンプを押す」をタップ！ひらがな・カタカナどちらでもOKです。
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-rose-600" />
                  全スポット達成で達成証GET！
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  すべてのスタンプが揃うと、達成日時入りの「完走証」が表示されます！案内所でスタッフに見せて記念品を受け取りましょう。
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            💡 <span className="font-bold text-slate-700">安心保存機能:</span> ブラウザを閉じたり再読み込みしても、集めたスタンプは消えずにそのまま保存されます。
          </div>

          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            さっそくスタート！
          </button>
        </div>
      </div>
    </div>
  );
};
