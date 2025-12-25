import { create } from 'zustand';
import { Quiz, ExamBatch, Attempt, Answer, Question } from '@/types';
import { quizApi, batchApi, attemptApi, subjectApi } from '../api/apiClient';

interface QuizState {
  // Quiz data
  quizzes: Quiz[];
  currentQuiz: Quiz | null;

  // Batch data
  batches: ExamBatch[];
  currentBatch: ExamBatch | null;

  // Attempt data
  currentAttempt: Attempt | null;
  localAnswers: Record<string, Answer>;
  currentQuestionIndex: number;

  // Timer
  remainingTime: number;
  serverTime: string | null;

  // UI State
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Quiz Actions
  fetchQuizzes: () => Promise<void>;
  fetchQuizById: (id: string) => Promise<Quiz | undefined>;
  createQuiz: (data: Partial<Quiz>) => Promise<Quiz>;
  updateQuiz: (id: string, data: Partial<Quiz>) => Promise<Quiz>;

  // Batch Actions
  fetchBatches: () => Promise<void>;
  fetchBatchById: (id: string) => Promise<ExamBatch | undefined>;
  createBatch: (data: Partial<ExamBatch>) => Promise<ExamBatch>;
  freezeBatch: (id: string) => Promise<void>;
  resumeBatch: (id: string) => Promise<void>;

  // Attempt Actions
  startAttempt: (batchId: string, studentId: string) => Promise<Attempt>;
  saveAnswer: (questionId: string, answer: Partial<Answer>) => void;
  submitAttempt: () => Promise<Attempt>;
  syncServerTime: () => Promise<void>;

  // Navigation
  setCurrentQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Timer
  decrementTimer: () => void;
  setRemainingTime: (time: number) => void;

  // Utils
  clearError: () => void;
  reset: () => void;
}

// Encryption key for localStorage (simplified for demo)
const getStorageKey = (attemptId: string) => {
  return `quiz_answers_${btoa(attemptId)} `;
};

const saveToLocalStorage = (attemptId: string, answers: Record<string, Answer>) => {
  try {
    const key = getStorageKey(attemptId);
    localStorage.setItem(key, JSON.stringify(answers));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = (attemptId: string): Record<string, Answer> => {
  try {
    const key = getStorageKey(attemptId);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return {};
  }
};

const clearLocalStorage = (attemptId: string) => {
  try {
    const key = getStorageKey(attemptId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};

export const useQuizStore = create<QuizState>((set, get) => ({
  quizzes: [],
  currentQuiz: null,
  batches: [],
  currentBatch: null,
  currentAttempt: null,
  localAnswers: {},
  currentQuestionIndex: 0,
  remainingTime: 0,
  serverTime: null,
  isLoading: false,
  isSaving: false,
  error: null,

  // Quiz Actions
  fetchQuizzes: async () => {
    set({ isLoading: true, error: null });
    try {
      const quizzes = await quizApi.getAll();
      set({ quizzes: quizzes || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal memuat quiz',
        isLoading: false
      });
    }
  },

  fetchQuizById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const quiz = await quizApi.getById(id);
      if (quiz) set({ currentQuiz: quiz });
      set({ isLoading: false });
      return quiz;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal memuat quiz',
        isLoading: false
      });
      return undefined;
    }
  },

  createQuiz: async (data: Partial<Quiz>) => {
    set({ isLoading: true, error: null });
    try {
      const quiz = await quizApi.create(data);
      set(state => ({
        quizzes: [...state.quizzes, quiz],
        isLoading: false
      }));
      return quiz;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal membuat quiz',
        isLoading: false
      });
      throw error;
    }
  },

  updateQuiz: async (id: string, data: Partial<Quiz>) => {
    set({ isLoading: true, error: null });
    try {
      const quiz = await quizApi.update(id, data);
      set(state => ({
        quizzes: state.quizzes.map(q => q.id === id ? quiz : q),
        currentQuiz: state.currentQuiz?.id === id ? quiz : state.currentQuiz,
        isLoading: false
      }));
      return quiz;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal mengupdate quiz',
        isLoading: false
      });
      throw error;
    }
  },

  // Batch Actions
  fetchBatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const batches = await batchApi.getAll();
      set({ batches: batches || [], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal memuat batch',
        isLoading: false
      });
    }
  },

  fetchBatchById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const batch = await batchApi.getById(id);
      if (batch) set({ currentBatch: batch });
      set({ isLoading: false });
      return batch;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal memuat batch',
        isLoading: false
      });
      return undefined;
    }
  },

  createBatch: async (data: Partial<ExamBatch>) => {
    set({ isLoading: true, error: null });
    try {
      const batch = await batchApi.create(data);
      set(state => ({
        batches: [...state.batches, batch],
        isLoading: false
      }));
      return batch;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal membuat batch',
        isLoading: false
      });
      throw error;
    }
  },

  freezeBatch: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const batch = await batchApi.freeze(id);
      set(state => ({
        batches: state.batches.map(b => b.id === id ? batch : b),
        currentBatch: state.currentBatch?.id === id ? batch : state.currentBatch,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal mem-freeze batch',
        isLoading: false
      });
    }
  },

  resumeBatch: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const batch = await batchApi.resume(id);
      set(state => ({
        batches: state.batches.map(b => b.id === id ? batch : b),
        currentBatch: state.currentBatch?.id === id ? batch : state.currentBatch,
        isLoading: false
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal me-resume batch',
        isLoading: false
      });
    }
  },

  // Attempt Actions
  startAttempt: async (batchId: string, studentId: string) => {
    set({ isLoading: true, error: null });
    try {
      // First try to check if there is an existing attempt
      const attempts = await attemptApi.getByStudentId(studentId);
      let attempt = attempts.find(
        a => a.batchId === batchId &&
          ['ACTIVE', 'FROZEN'].includes(a.status)
      );

      // If no active attempt, start a new one
      if (!attempt) {
        attempt = await attemptApi.start(batchId, studentId);
      }

      // Resume logic (applies to both new and existing)
      const savedAnswers = loadFromLocalStorage(attempt.id);

      // Get server time immediately to sync timer
      const { serverTime, remainingTime } = await attemptApi.getServerTime(attempt.id);

      set({
        currentAttempt: attempt,
        localAnswers: savedAnswers,
        remainingTime: remainingTime,
        serverTime: serverTime,
        currentQuestionIndex: 0,
        isLoading: false
      });
      return attempt;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal memulai ujian',
        isLoading: false
      });
      throw error;
    }
  },

  saveAnswer: (questionId: string, answer: Partial<Answer>) => {
    const { currentAttempt, localAnswers } = get();
    if (!currentAttempt) return;

    const fullAnswer: Answer = {
      questionId,
      selectedOptionId: answer.selectedOptionId,
      textAnswer: answer.textAnswer,
      answeredAt: new Date().toISOString()
    };

    const updatedAnswers = {
      ...localAnswers,
      [questionId]: fullAnswer
    };

    set({ localAnswers: updatedAnswers, isSaving: true });

    // Save to localStorage
    saveToLocalStorage(currentAttempt.id, updatedAnswers);

    // Brief delay to show saving indicator
    setTimeout(() => set({ isSaving: false }), 300);
  },

  submitAttempt: async () => {
    const { currentAttempt, localAnswers } = get();
    if (!currentAttempt) throw new Error('Tidak ada attempt aktif');

    set({ isLoading: true, error: null });
    try {
      const answersArray = Object.values(localAnswers);
      const attempt = await attemptApi.submit(currentAttempt.id, answersArray);

      // Clear localStorage after successful submit
      clearLocalStorage(currentAttempt.id);

      set({
        currentAttempt: attempt,
        isLoading: false
      });
      return attempt;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Gagal submit ujian',
        isLoading: false
      });
      throw error;
    }
  },

  syncServerTime: async () => {
    const { currentAttempt } = get();
    if (!currentAttempt) return;

    try {
      const { serverTime, remainingTime } = await attemptApi.getServerTime(currentAttempt.id);
      set({ serverTime, remainingTime });
    } catch (error) {
      console.error('Failed to sync server time:', error);
    }
  },

  // Navigation
  setCurrentQuestion: (index: number) => set({ currentQuestionIndex: index }),

  nextQuestion: () => {
    const { currentQuestionIndex, currentQuiz } = get();
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      set({ currentQuestionIndex: currentQuestionIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ currentQuestionIndex: currentQuestionIndex - 1 });
    }
  },

  // Timer
  decrementTimer: () => {
    const { remainingTime } = get();
    if (remainingTime > 0) {
      set({ remainingTime: remainingTime - 1 });
    }
  },

  setRemainingTime: (time: number) => set({ remainingTime: time }),

  // Utils
  clearError: () => set({ error: null }),

  reset: () => set({
    currentQuiz: null,
    currentBatch: null,
    currentAttempt: null,
    localAnswers: {},
    currentQuestionIndex: 0,
    remainingTime: 0,
    serverTime: null,
    error: null
  })
}));
