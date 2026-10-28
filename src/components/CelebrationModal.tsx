import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Award, Sparkles, CheckCircle2, Share2, Copy, Check, Calendar, User } from 'lucide-react';
import { Course, StampProgress } from '../types';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  progress: StampProgress;
  onUpdateParticipantName: (name: string) => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  onClose,
  course,
  progress,
  onUpdateParticipantName,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.participantName || 'スタンプ探検隊員');

  useEffect(() => {
    if (isOpen) {
      // Launch celebratory confetti bursts
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const completionDate = progress.completedAt
    ? new Date(progress.completedAt)
    : new Date();

  const formattedDate = completionDate.toLocaleString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const certificateId =
    progress.certificateId ||
    `STAMP-${course.id.toUpperCase().slice(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSaveName = () => {
    onUpdateParticipantName(tempName.trim() || 'スタンプ探検隊員');
    setIsEditingName(false);
  };

  const handleCopySummary = async () => {
    const text = `🎉【スタンプラリー完全達成！】🎉\nコース: ${course.title}\n参加者: ${progress.participantName}\n達成日時: ${formattedDate}\n引換番号: ${certificateId}\n#スタンプラリー #街歩き`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-6 animate-stamp">
        {/* Decorative Festive Top Ribbon */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 text-white text-center relative">
          <button
            onClick={onClose}
            aria-label="閉じる"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            CONGRATULATIONS
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            全スポット達成おめでとう！
          </h2>
          <p className="text-xs text-white/90 mt-0.5">
            {course.title}の合言葉をすべて見つけました！
          </p>
        </div>

        {/* Certificate Body */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-amber-50/40 to-white text-center">
          {/* Badge Image / Medallion */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto -mt-2 mb-3 relative">
            <img
              src="/src/assets/images/stamp_rally_badge_1793151593277.jpg"
              alt="完走記念メダル"
              className="w-full h-full object-contain drop-shadow-md rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Certificate Title */}
          <div className="border-t-2 border-b-2 border-amber-200 py-2 mb-4">
            <span className="text-[11px] font-extrabold tracking-widest text-amber-800 uppercase block">
              CERTIFICATE OF COMPLETION
            </span>
            <span className="text-lg font-black text-slate-800 tracking-tight">
              デジタル完走認定証
            </span>
          </div>

          {/* Participant Name */}
          <div className="mb-4 bg-white rounded-xl border border-amber-200/80 p-3 shadow-xs">
            <div className="text-[11px] font-bold text-slate-400 mb-1 flex items-center justify-center gap-1">
              <User className="w-3.5 h-3.5" />
              参加者名
            </div>
            {isEditingName ? (
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={15}
                  placeholder="お名前を入力"
                  className="px-2.5 py-1 text-sm border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-200 text-center font-bold"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1 bg-orange-500 text-white rounded-md text-xs font-bold hover:bg-orange-600"
                >
                  保存
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-slate-800">
                  {progress.participantName || 'スタンプ探検隊員'} 様
                </span>
                <button
                  onClick={() => {
                    setTempName(progress.participantName || 'スタンプ探検隊員');
                    setIsEditingName(true);
                  }}
                  className="text-[11px] text-orange-600 hover:text-orange-700 underline font-semibold"
                >
                  名前を変更
                </button>
              </div>
            )}
          </div>

          {/* Completion Timestamp (Required Feature) */}
          <div className="bg-amber-50/80 rounded-xl border border-amber-200/60 p-3 mb-4 text-center">
            <div className="text-[11px] font-bold text-amber-800 mb-0.5 flex items-center justify-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              達成日時
            </div>
            <div className="text-sm sm:text-base font-extrabold text-amber-950 tracking-tight">
              {formattedDate}
            </div>
          </div>

          {/* Stamped Seals Summary Strip */}
          <div className="mb-4">
            <div className="text-[11px] font-bold text-slate-400 mb-1.5">
              獲得スタンプ（全{course.spots.length}か所）
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {course.spots.map((spot) => (
                <div
                  key={spot.id}
                  className="w-9 h-9 rounded-full border border-rose-500 bg-rose-50 flex flex-col items-center justify-center text-[9px] font-extrabold text-rose-600 shadow-2xs select-none"
                  title={spot.name}
                >
                  <span>{spot.sealText}</span>
                  <span className="text-[7px] leading-none text-rose-500">済</span>
                </div>
              ))}
            </div>
          </div>

          {/* Staff Verification Code */}
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 mb-4 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              景品引換・スタッフ確認コード
            </span>
            <span className="text-sm font-mono font-black text-slate-800 tracking-wider">
              {certificateId}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              ※ゴール案内所やイベント受付のスタッフにこの画面をご提示ください
            </p>
          </div>

          {/* Action Buttons: Copy / Share & Close */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCopySummary}
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">コピーしました！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>達成テキストをコピー</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>スタンプ画面に戻る</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
