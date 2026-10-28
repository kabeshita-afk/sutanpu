import React, { useState, useEffect, useRef } from 'react';
import { COURSES } from './data/courses';
import { Course, Spot, StampProgress } from './types';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { StampCardSheet } from './components/StampCardSheet';
import { SpotCard } from './components/SpotCard';
import { CelebrationModal } from './components/CelebrationModal';
import { QuizModal } from './components/QuizModal';
import { ResetModal } from './components/ResetModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { soundManager } from './utils/audio';
import { Award, Compass, MapPin, Sparkles, Footprints } from 'lucide-react';

const STORAGE_KEY = 'stamp_rally_storage_v2';

export default function App() {
  // Course Selection
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSES[0].id);
  
  // Stamp Progress Map per Course
  const [progressMap, setProgressMap] = useState<Record<string, StampProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {};
  });

  // Sound Mute State
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getMuted());

  // Modal States
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [activeQuizSpot, setActiveQuizSpot] = useState<Spot | null>(null);

  // Active current course
  const currentCourse: Course =
    COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  // Current course progress
  const currentProgress: StampProgress = progressMap[currentCourse.id] || {
    courseId: currentCourse.id,
    stampedSpotIds: [],
    stampedAtMap: {},
    participantName: 'スタンプ探検隊員',
  };

  const isAllCompleted =
    currentProgress.stampedSpotIds.length >= currentCourse.spots.length &&
    currentCourse.spots.length > 0;

  // Save to localStorage on any progress change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap));
    } catch (err) {
      console.error('Failed to save stamp progress to localStorage', err);
    }
  }, [progressMap]);

  // Handle course switch
  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
  };

  // Toggle sound
  const handleToggleMute = () => {
    const nextMuted = soundManager.toggleMute();
    setIsMuted(nextMuted);
  };

  // Handle successful stamp
  const handleStampSuccess = (spotId: string) => {
    const now = new Date().toISOString();
    const updatedStampedIds = Array.from(
      new Set([...currentProgress.stampedSpotIds, spotId])
    );
    const updatedStampedAt = {
      ...currentProgress.stampedAtMap,
      [spotId]: now,
    };

    const willBeAllCompleted =
      updatedStampedIds.length >= currentCourse.spots.length;

    let completedAt = currentProgress.completedAt;
    let certificateId = currentProgress.certificateId;

    if (willBeAllCompleted && !completedAt) {
      completedAt = now;
      certificateId = `STAMP-${currentCourse.id.toUpperCase().slice(0, 4)}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;
      // Play celebratory fanfare
      setTimeout(() => {
        soundManager.playFanfare();
        setShowCelebrationModal(true);
      }, 500);
    }

    setProgressMap((prev) => ({
      ...prev,
      [currentCourse.id]: {
        ...currentProgress,
        stampedSpotIds: updatedStampedIds,
        stampedAtMap: updatedStampedAt,
        completedAt,
        certificateId,
      },
    }));
  };

  // Reset current course progress
  const handleConfirmReset = () => {
    setProgressMap((prev) => ({
      ...prev,
      [currentCourse.id]: {
        courseId: currentCourse.id,
        stampedSpotIds: [],
        stampedAtMap: {},
        completedAt: undefined,
        certificateId: undefined,
        participantName: currentProgress.participantName || 'スタンプ探検隊員',
      },
    }));
  };

  // Update participant name
  const handleUpdateParticipantName = (newName: string) => {
    setProgressMap((prev) => ({
      ...prev,
      [currentCourse.id]: {
        ...currentProgress,
        participantName: newName,
      },
    }));
  };

  // Scroll to spot
  const handleScrollToSpot = (spotId: string) => {
    const el = document.getElementById(`spot-${spotId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 flex flex-col font-sans">
      {/* Top App Header */}
      <Header
        currentCourse={currentCourse}
        allCourses={COURSES}
        onSelectCourse={handleSelectCourse}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenReset={() => setShowResetModal(true)}
      />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3 space-y-4">
        {/* Festive Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs border border-orange-100 bg-white">
          <div className="relative h-36 sm:h-44 w-full overflow-hidden">
            <img
              src="/src/assets/images/stamp_rally_hero_1793151593659.jpg"
              alt="街歩きスタンプラリー"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Soft gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[11px] font-bold text-amber-300 tracking-wider">
                🏮 {currentCourse.badge}開催中！
              </span>
              <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                {currentCourse.title}
              </h1>
              <p className="text-xs text-white/90 line-clamp-1 mt-0.5">
                {currentCourse.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Summary Card */}
        <ProgressBar
          currentCount={currentProgress.stampedSpotIds.length}
          totalCount={currentCourse.spots.length}
          onOpenCertificate={() => setShowCelebrationModal(true)}
          isAllCompleted={isAllCompleted}
        />

        {/* Stamp Card Sheet (Visual Hanko collection) */}
        <StampCardSheet
          spots={currentCourse.spots}
          progress={currentProgress}
          onSpotClick={handleScrollToSpot}
          onOpenCertificate={() => setShowCelebrationModal(true)}
          isAllCompleted={isAllCompleted}
        />

        {/* Section Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-orange-500" />
            <h2 className="text-sm font-extrabold text-slate-800">
              スポット一覧 ({currentCourse.spots.length}か所)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            合言葉を入力して押印
          </span>
        </div>

        {/* Spot List */}
        <div className="space-y-3">
          {currentCourse.spots.map((spot) => {
            const isStamped = currentProgress.stampedSpotIds.includes(spot.id);
            const stampedAt = currentProgress.stampedAtMap[spot.id];

            return (
              <SpotCard
                key={spot.id}
                spot={spot}
                isStamped={isStamped}
                stampedAt={stampedAt}
                onStampSuccess={handleStampSuccess}
                onOpenQuiz={(target) => setActiveQuizSpot(target)}
              />
            );
          })}
        </div>
      </main>

      {/* Floating Bottom Quick Bar for Mobile (15% height limit strictly observed) */}
      {isAllCompleted && (
        <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/90 backdrop-blur-md border-t border-amber-200 z-40 flex items-center justify-center shadow-lg">
          <div className="max-w-2xl w-full flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                完
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-800">全スポット達成！</div>
                <div className="text-[10px] text-slate-500">おめでとうございます🎉</div>
              </div>
            </div>

            <button
              onClick={() => setShowCelebrationModal(true)}
              className="min-h-[44px] px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-extrabold shadow-sm hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>達成証を見る</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CelebrationModal
        isOpen={showCelebrationModal}
        onClose={() => setShowCelebrationModal(false)}
        course={currentCourse}
        progress={currentProgress}
        onUpdateParticipantName={handleUpdateParticipantName}
      />

      <QuizModal
        spot={activeQuizSpot}
        isOpen={Boolean(activeQuizSpot)}
        onClose={() => setActiveQuizSpot(null)}
      />

      <ResetModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirmReset={handleConfirmReset}
        currentCount={currentProgress.stampedSpotIds.length}
      />

      <HowToPlayModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />
    </div>
  );
}
