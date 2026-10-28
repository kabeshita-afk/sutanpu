import React, { useState, useEffect } from 'react';
import { X, Sparkles, HelpCircle, CheckCircle2, AlertCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { Spot, SpotQuizData } from '../types';
import { soundManager } from '../utils/audio';

interface QuizModalProps {
  spot: Spot | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ spot, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState<SpotQuizData | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  useEffect(() => {
    if (isOpen && spot) {
      setSelectedOption(null);
      setIsAnswered(false);
      loadTriviaAndQuiz(spot);
    }
  }, [isOpen, spot]);

  const loadTriviaAndQuiz = async (targetSpot: Spot) => {
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spotName: targetSpot.name,
          spotCategory: targetSpot.category,
          description: targetSpot.shortDesc,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned non-200');
      }

      const data = await response.json();
      if (data && data.trivia && data.quizQuestion && Array.isArray(data.quizOptions)) {
        setQuizData(data);
        setIsAiGenerated(true);
      } else {
        throw new Error('Invalid format');
      }
    } catch {
      // Graceful fallback to pre-baked rich spot trivia & quiz
      setQuizData({
        trivia: targetSpot.fallbackTrivia,
        quizQuestion: targetSpot.fallbackQuiz.question,
        quizOptions: targetSpot.fallbackQuiz.options,
        correctIndex: targetSpot.fallbackQuiz.correctIndex,
        explanation: targetSpot.fallbackQuiz.explanation,
      });
      setIsAiGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !spot) return null;

  const handleSelectOption = (index: number) => {
    if (isAnswered || !quizData) return;

    setSelectedOption(index);
    setIsAnswered(true);

    if (index === quizData.correctIndex) {
      soundManager.playStampSound();
    } else {
      soundManager.playErrorSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">
                  スポット豆知識＆クイズ
                </span>
                <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded-full">
                  {isAiGenerated ? 'Gemini AI生成' : 'スポット特製'}
                </span>
              </div>
              <p className="text-[11px] text-white/90 line-clamp-1">{spot.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="閉じる"
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">
                Gemini APIがこのスポットの豆知識とクイズを作成中...
              </p>
              <p className="text-[11px] text-slate-400">ちょっと待ってね！</p>
            </div>
          ) : quizData ? (
            <>
              {/* Section 1: Spot Trivia */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>思わず誰かに話したくなる豆知識</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {quizData.trivia}
                </p>
              </div>

              {/* Section 2: Spot Mini Quiz */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                  <HelpCircle className="w-4 h-4 text-orange-500" />
                  <span>ミニクイズに挑戦！</span>
                </div>

                <p className="text-sm font-bold text-slate-900 mb-3 leading-snug">
                  {quizData.quizQuestion}
                </p>

                {/* 3 Options */}
                <div className="space-y-2">
                  {quizData.quizOptions.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === quizData.correctIndex;

                    let btnStyle =
                      'bg-slate-50 border-slate-200 text-slate-700 hover:bg-orange-50/50 hover:border-orange-300';

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-800 font-medium';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswered}
                        className={`w-full min-h-[44px] p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {isAnswered && (
                          <div className="shrink-0">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isSelected ? (
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback & Explanation */}
                {isAnswered && (
                  <div
                    className={`mt-3 p-3 rounded-xl text-xs leading-relaxed animate-stamp ${
                      selectedOption === quizData.correctIndex
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                        : 'bg-amber-50 border border-amber-200 text-amber-950'
                    }`}
                  >
                    <div className="font-extrabold mb-0.5 flex items-center gap-1">
                      {selectedOption === quizData.correctIndex ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>正解！お見事です！🎉</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>おしい！正解は「{quizData.quizOptions[quizData.correctIndex]}」でした！</span>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">
                      {quizData.explanation}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : null}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
