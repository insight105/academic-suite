// User & Auth Types
export type UserRole = 'admin' | 'teacher' | 'student' | 'maintainer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Institution Types
export interface Institution {
  id: string;
  name: string;
  type: 'school' | 'university';
  address: string;
  createdAt: string;
}

export interface Faculty {
  id: string;
  institutionId: string;
  name: string;
  code: string;
}

export interface Department {
  id: string;
  facultyId: string;
  name: string;
  code: string;
}

export interface ClassRoom {
  id: string;
  departmentId: string;
  name: string;
  academicYear: string;
  studentCount: number;
}

export interface Subject {
  id: string;
  departmentId: string;
  name: string;
  code: string;
  credits: number;
  teacherId?: string; // Deprecated
  teacherIds?: string[];
  teachers?: User[]; // Resolved teacher objects
}

export interface Class {
  id: string;
  name: string;
  subjectId: string;
  teacherId: string;
  studentIds: string; // JSON string of IDs
  createdAt: string;
}

// Quiz & Question Types
export type QuestionType = 'mcq' | 'true_false' | 'short_answer' | 'essay';
export type ExamType = 'daily_quiz' | 'midterm' | 'final' | 'practice';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  text: string;
  points: number;
  options?: QuestionOption[];
  correctAnswer?: string;
  explanation?: string;
  orderIndex: number;
}

export interface Quiz {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  examType: ExamType;
  totalPoints: number;
  passingScore: number;
  status?: string; // 'active' | 'archived' | 'draft'
  questions: Question[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Exam Batch Types
export type BatchType = 'REGULAR' | 'MAKEUP';
export type BatchStatus = 'scheduled' | 'active' | 'frozen' | 'finished';

export interface ExamBatch {
  id: string;
  quizId: string;
  classId?: string;
  type: BatchType;
  name: string; // Renamed from title to match backend
  title?: string; // Optional for backward compatibility if needed
  token: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: BatchStatus;
  allowedParticipants: string[]; // student IDs
  waitlist: string[];
  createdBy: string;
  createdAt: string;
  frozenAt?: string;
  resumedAt?: string;
}

// Attempt Types
export type AttemptStatus =
  | 'NOT_STARTED'
  | 'ACTIVE'
  | 'SUBMITTED'
  | 'EXPIRED'
  | 'FROZEN'
  | 'INTERRUPTED'
  | 'RESET_BY_ADMIN';

export interface Answer {
  questionId: string;
  selectedOptionId?: string;
  textAnswer?: string;
  answeredAt: string;
}

export interface Attempt {
  id: string;
  batchId: string;
  studentId: string;
  status: AttemptStatus;
  answers: Answer[];
  score?: number;
  startedAt?: string;
  submittedAt?: string;
  expiredAt?: string;
  frozenAt?: string;
  remainingTime: number; // in seconds
  serverTime: string;
  createdAt: string;
}

// Event Log Types
export type EventType =
  | 'ATTEMPT_STARTED'
  | 'ANSWER_SAVED'
  | 'ATTEMPT_SUBMITTED'
  | 'ATTEMPT_EXPIRED'
  | 'BATCH_FROZEN'
  | 'BATCH_RESUMED'
  | 'ATTEMPT_INTERRUPTED'
  | 'ATTEMPT_RESET'
  | 'FOCUS_LOST'
  | 'TAB_SWITCH'
  | 'FULLSCREEN_EXIT'
  | 'ATTEMPT_PAUSED'
  | 'ATTEMPT_RESUMED'
  | 'ATTEMPT_FORCE_SUBMITTED'
  | string;

export interface EventLog {
  id: string;
  eventType: EventType;
  batchId?: string;
  attemptId?: string;
  userId?: string;
  studentId?: string;
  details: string;
  timestamp: string;
  createdAt: string;
}

// Report Types
export interface AttemptReport {
  attemptId: string;
  studentName: string;
  studentId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  status: AttemptStatus;
  duration: number;
  submittedAt?: string;
}

export interface BatchReport {
  batchId: string;
  batchType: BatchType;
  quizTitle: string;
  totalParticipants: number;
  submittedCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  attempts: AttemptReport[];
}
