import React from 'react';
import { Volume2, VolumeX, RotateCcw, HelpCircle, MapPin, Sparkles } from 'lucide-react';
import { Course } from '../types';

interface HeaderProps {
  currentCourse: Course;
  allCourses: Course[];
  onSelectCourse: (courseId: string) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  onOpenReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCourse,
  allCourses,
  onSelectCourse,
  isMuted,
  onToggleMute,
  onOpenHelp,
  onOpenReset,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-xs">
      <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Wordmark & Mascot Icon */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-800">
                街歩きスタンプラリー
              </span>
              <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200/60 px-1.5 py-0.5 rounded-md">
                {currentCourse.badge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">
              合言葉を見つけてスタンプを集めよう！
            </p>
          </div>
        </div>

        {/* Action Controls: Sound, Help, Reset */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'サウンドをオンにする' : 'サウンドをミュートする'}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            title={isMuted ? '音声: オフ' : '音声: オン'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-orange-500" />}
          </button>

          <button
            onClick={onOpenHelp}
            aria-label="遊び方ガイドを見る"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            title="遊び方"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={onOpenReset}
            aria-label="最初からやり直す"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="最初からやり直す"
          >
            <RotateCcw className="w-4 h-4 text-slate-400 hover:text-rose-500" />
          </button>
        </div>
      </div>

      {/* Course Switcher (Pill tab buttons) */}
      <div className="max-w-3xl mx-auto px-4 pb-2 pt-0.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-bold text-slate-400 shrink-0">コース:</span>
        <div className="flex items-center gap-1.5">
          {allCourses.map((c) => {
            const isSelected = c.id === currentCourse.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCourse(c.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.title} ({c.spots.length}か所)
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
