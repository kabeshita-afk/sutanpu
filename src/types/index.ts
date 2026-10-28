export interface Spot {
  id: string;
  order: number;
  name: string;
  category: string;
  shortDesc: string;
  locationHint: string;
  secretCode: string;
  acceptedCodes: string[];
  clueHint: string;
  sealText: string;
  accentColor: string;
  themeIcon: string;
  fallbackTrivia: string;
  fallbackQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  spots: Spot[];
}

export interface StampProgress {
  courseId: string;
  stampedSpotIds: string[];
  stampedAtMap: Record<string, string>; // spotId -> ISO string
  completedAt?: string; // ISO string
  participantName: string;
  certificateId?: string;
}

export interface SpotQuizData {
  trivia: string;
  quizQuestion: string;
  quizOptions: string[];
  correctIndex: number;
  explanation: string;
}
