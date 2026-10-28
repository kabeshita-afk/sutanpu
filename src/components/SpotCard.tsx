import React, { useState } from 'react';
import {
  MapPin,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Stamp,
  Coffee,
  BookOpen,
  Gift,
  Smile,
  UtensilsCrossed,
} from 'lucide-react';
import { Spot } from '../types';
import { checkSecretCode } from '../utils/codeNormalizer';
import { soundManager } from '../utils/audio';

interface SpotCardProps {
  spot: Spot;
  isStamped: boolean;
  stampedAt?: string;
  onStampSuccess: (spotId: string) => void;
  onOpenQuiz: (spot: Spot) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  isStamped,
  stampedAt,
  onStampSuccess,
  onOpenQuiz,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showLocationHint, setShowLocationHint] = useState(false);
  const [showClueHint, setShowClueHint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStamped) return;

    if (!inputCode.trim()) {
      triggerError('合言葉を入力してください');
      return;
    }

    setIsSubmitting(true);

    const isCorrect = checkSecretCode(inputCode, spot.acceptedCodes, spot.secretCode);

    if (isCorrect) {
      setErrorMessage(null);
      soundManager.playStampSound();
      onStampSuccess(spot.id);
      setInputCode('');
    } else {
      soundManager.playErrorSound();
      triggerError('合言葉がちがうみたい… もう一度看板をたしかめてみてね！');
    }

    setIsSubmitting(false);
  };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 450);
  };

  const formattedStampTime = stampedAt
    ? new Date(stampedAt).toLocaleString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  // Icon mapping
  const renderIcon = () => {
    switch (spot.themeIcon) {
      case 'Coffee':
        return <Coffee className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'Gift':
        return <Gift className="w-4 h-4" />;
      case 'Smile':
        return <Smile className="w-4 h-4" />;
      case 'UtensilsCrossed':
        return <UtensilsCrossed className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div
      id={`spot-${spot.id}`}
      className={`rounded-2xl border transition-all scroll-mt-24 ${
        isStamped
          ? 'bg-rose-50/30 border-rose-200/80 shadow-xs'
          : 'bg-white border-slate-200/90 shadow-xs hover:border-orange-200'
      }`}
    >
      {/* Spot Card Header */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          {/* Order and Category */}
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                isStamped
                  ? 'bg-rose-500 text-white'
                  : 'bg-orange-500 text-white'
              }`}
            >
              #{spot.order}
            </span>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
              {renderIcon()}
              {spot.category}
            </span>
          </div>

          {/* Stamped Status Badge */}
          {isStamped ? (
            <div className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100/80 border border-rose-200 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
              <span>押印済み</span>
            </div>
          ) : (
            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-200/60">
              未押印
            </span>
          )}
        </div>

        {/* Spot Title & Description */}
        <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-1">
          {spot.name}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {spot.shortDesc}
        </p>

        {/* Location Hint Accordion */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowLocationHint(!showLocationHint)}
            className="flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>合言葉の看板はどこ？</span>
            {showLocationHint ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          {showLocationHint && (
            <div className="mt-1.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
              📍 <span className="font-bold">看板の設置場所:</span> {spot.locationHint}
            </div>
          )}
        </div>

        {/* State A: Stamped View (Prevent double stamping & show Hanko stamp) */}
        {isStamped ? (
          <div className="bg-white rounded-xl border border-rose-200 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Hanko Seal */}
              <div className="w-14 h-14 rounded-full border-2 border-rose-600 bg-rose-50 flex flex-col items-center justify-center shrink-0 shadow-inner select-none animate-stamp">
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

              <div>
                <div className="text-xs font-bold text-slate-800">
                  スタンプを獲得しました！
                </div>
                <div className="text-[11px] text-slate-500">
                  押印日時: <span className="font-medium text-slate-700">{formattedStampTime}</span>
                </div>
                <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                  ※このスポットは押印済みです（二重押し防止）
                </div>
              </div>
            </div>

            {/* AI Trivia & Quiz Button */}
            <button
              onClick={() => onOpenQuiz(spot)}
              className="w-full sm:w-auto min-h-[44px] px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold shadow-xs hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>AI豆知識＆クイズ</span>
            </button>
          </div>
        ) : (
          /* State B: Unstamped Input Form */
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="看板に書かれた「合言葉」を入力"
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    isShaking
                      ? 'border-rose-500 ring-2 ring-rose-200 animate-shake'
                      : 'border-slate-300 focus:border-orange-500 focus:ring-orange-200'
                  }`}
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[44px] px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-bold shadow-sm hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Stamp className="w-4 h-4" />
                <span>スタンプを押す</span>
              </button>
            </div>

            {/* Error Message Alert Banner */}
            {errorMessage && (
              <div
                className={`p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-700 leading-snug ${
                  isShaking ? 'animate-shake' : ''
                }`}
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                  {!showClueHint && (
                    <button
                      type="button"
                      onClick={() => setShowClueHint(true)}
                      className="ml-2 font-bold underline hover:text-rose-900"
                    >
                      ヒントを見る？
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Clue Hint Accordion */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setShowClueHint(!showClueHint)}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-orange-600 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>合言葉のヒント</span>
                {showClueHint ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
              {showClueHint && (
                <div className="mt-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                  💡 <span className="font-bold">ヒント:</span> {spot.clueHint}
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
