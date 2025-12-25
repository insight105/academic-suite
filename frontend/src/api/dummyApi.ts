import {
  User, AuthTokens, Institution, Faculty, Department, ClassRoom, Subject,
  Quiz, Question, ExamBatch, Attempt, Answer, EventLog, BatchReport,
  UserRole, QuestionType, ExamType, BatchStatus, AttemptStatus, BatchType
} from '@/types';
import { Console } from 'console';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data Storage (simulating database)
const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@eduexam.com',
    name: 'Dr. Admin Utama',
    role: 'admin',
    institutionId: 'inst-1',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'teacher-1',
    email: 'guru@eduexam.com',
    name: 'Pak Budi Santoso',
    role: 'teacher',
    institutionId: 'inst-1',
    createdAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'student-1',
    email: 'siswa@eduexam.com',
    name: 'Andi Pratama',
    role: 'student',
    institutionId: 'inst-1',
    createdAt: '2024-02-01T00:00:00Z'
  }
];

const mockInstitutions: Institution[] = [
  {
    id: 'inst-1',
    name: 'SMA Negeri 1 Jakarta',
    type: 'school',
    address: 'Jl. Pendidikan No. 1, Jakarta',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

const mockSubjects: Subject[] = [
  {
    id: 'subj-1',
    departmentId: 'dept-1',
    name: 'Matematika',
    code: 'MAT101',
    credits: 4,
    teacherId: 'teacher-1'
  },
  {
    id: 'subj-2',
    departmentId: 'dept-1',
    name: 'Bahasa Indonesia',
    code: 'BIN101',
    credits: 3,
    teacherId: 'teacher-1'
  }
];

const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    subjectId: 'subj-1',
    title: 'Ulangan Harian - Persamaan Kuadrat',
    description: 'Ujian tentang persamaan kuadrat dan aplikasinya',
    examType: 'daily_quiz',
    totalPoints: 100,
    passingScore: 70,
    questions: [
      {
        id: 'q-1',
        quizId: 'quiz-1',
        type: 'mcq',
        text: 'Berapakah akar-akar dari persamaan x² - 5x + 6 = 0?',
        points: 20,
        options: [
          { id: 'opt-1', text: 'x = 2 dan x = 3', isCorrect: true },
          { id: 'opt-2', text: 'x = 1 dan x = 6', isCorrect: false },
          { id: 'opt-3', text: 'x = -2 dan x = -3', isCorrect: false },
          { id: 'opt-4', text: 'x = 2 dan x = -3', isCorrect: false }
        ],
        orderIndex: 0
      },
      {
        id: 'q-2',
        quizId: 'quiz-1',
        type: 'mcq',
        text: 'Diskriminan dari persamaan ax² + bx + c = 0 adalah...',
        points: 20,
        options: [
          { id: 'opt-5', text: 'D = b² - 4ac', isCorrect: true },
          { id: 'opt-6', text: 'D = b² + 4ac', isCorrect: false },
          { id: 'opt-7', text: 'D = 4ac - b²', isCorrect: false },
          { id: 'opt-8', text: 'D = 2ac - b', isCorrect: false }
        ],
        orderIndex: 1
      },
      {
        id: 'q-3',
        quizId: 'quiz-1',
        type: 'true_false',
        text: 'Persamaan kuadrat selalu memiliki dua akar real.',
        points: 20,
        options: [
          { id: 'opt-9', text: 'Benar', isCorrect: false },
          { id: 'opt-10', text: 'Salah', isCorrect: true }
        ],
        orderIndex: 2
      },
      {
        id: 'q-4',
        quizId: 'quiz-1',
        type: 'mcq',
        text: 'Jika x₁ dan x₂ adalah akar-akar persamaan x² + px + q = 0, maka x₁ + x₂ = ...',
        points: 20,
        options: [
          { id: 'opt-11', text: '-p', isCorrect: true },
          { id: 'opt-12', text: 'p', isCorrect: false },
          { id: 'opt-13', text: 'q', isCorrect: false },
          { id: 'opt-14', text: '-q', isCorrect: false }
        ],
        orderIndex: 3
      },
      {
        id: 'q-5',
        quizId: 'quiz-1',
        type: 'mcq',
        text: 'Bentuk umum persamaan kuadrat adalah...',
        points: 20,
        options: [
          { id: 'opt-15', text: 'ax² + bx + c = 0, dengan a ≠ 0', isCorrect: true },
          { id: 'opt-16', text: 'ax + b = 0', isCorrect: false },
          { id: 'opt-17', text: 'ax³ + bx² + cx + d = 0', isCorrect: false },
          { id: 'opt-18', text: 'a + b + c = 0', isCorrect: false }
        ],
        orderIndex: 4
      }
    ],
    createdBy: 'teacher-1',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-10T00:00:00Z'
  }
];

const startedAt = new Date('2025-12-22T10:20:00').toISOString();
const durationMinutes = 45;

const endTime = new Date(
  new Date(startedAt).getTime() + durationMinutes * 60 * 1000
).toISOString();

const mockBatches: ExamBatch[] = [
  {
    id: 'batch-1',
    quizId: 'quiz-1',
    type: 'REGULAR',
    title: 'UH Matematika - Kelas XI IPA 1',
    startTime: startedAt,
    endTime: endTime,
    duration: durationMinutes,
    status: 'active',
    allowedParticipants: ['student-1'],
    waitlist: [],
    createdBy: 'teacher-1',
    createdAt: '2024-12-15T00:00:00Z'
  }
];

// Helper to load/save attempts from localStorage
const STORAGE_KEY = 'mock_attempts_v1';

const loadAttempts = (): Attempt[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load mock attempts', e);
    return [];
  }
};

const saveAttempts = (attempts: Attempt[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
  } catch (e) {
    console.error('Failed to save mock attempts', e);
  }
};

let mockAttempts: Attempt[] = loadAttempts();
let mockEventLogs: EventLog[] = [];

// API Functions

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('User tidak ditemukan');
    if (password.length < 3) throw new Error('Password salah');

    const tokens: AuthTokens = {
      accessToken: `jwt_access_${user.id}_${Date.now()}`,
      refreshToken: `jwt_refresh_${user.id}_${Date.now()}`,
      expiresAt: Date.now() + 3600000 // 1 hour
    };
    console.log(tokens);
    return { user, tokens };
  },

  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    await delay(200);
    return {
      accessToken: `jwt_access_refreshed_${Date.now()}`,
      refreshToken: `jwt_refresh_new_${Date.now()}`,
      expiresAt: Date.now() + 3600000
    };
  },

  logout: async (): Promise<void> => {
    await delay(200);
  },

  getProfile: async (): Promise<User> => {
    await delay(300);
    return mockUsers[0];
  }
};

// Institution API
export const institutionApi = {
  getAll: async (): Promise<Institution[]> => {
    await delay(300);
    return mockInstitutions;
  },

  getById: async (id: string): Promise<Institution | undefined> => {
    await delay(200);
    return mockInstitutions.find(i => i.id === id);
  },

  create: async (data: Partial<Institution>): Promise<Institution> => {
    await delay(400);
    const newInstitution: Institution = {
      id: `inst-${Date.now()}`,
      name: data.name || '',
      type: data.type || 'school',
      address: data.address || '',
      createdAt: new Date().toISOString()
    };
    mockInstitutions.push(newInstitution);
    return newInstitution;
  }
};

// Subject API
export const subjectApi = {
  getAll: async (): Promise<Subject[]> => {
    await delay(300);
    return mockSubjects;
  },

  getById: async (id: string): Promise<Subject | undefined> => {
    await delay(200);
    return mockSubjects.find(s => s.id === id);
  },

  create: async (data: Partial<Subject>): Promise<Subject> => {
    await delay(400);
    const newSubject: Subject = {
      id: `subj-${Date.now()}`,
      departmentId: data.departmentId || '',
      name: data.name || '',
      code: data.code || '',
      credits: data.credits || 0,
      teacherId: data.teacherId || ''
    };
    mockSubjects.push(newSubject);
    return newSubject;
  }
};

// Quiz API
export const quizApi = {
  getAll: async (): Promise<Quiz[]> => {
    await delay(300);
    return mockQuizzes;
  },

  getById: async (id: string): Promise<Quiz | undefined> => {
    await delay(200);
    return mockQuizzes.find(q => q.id === id);
  },

  create: async (data: Partial<Quiz>): Promise<Quiz> => {
    await delay(500);
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      subjectId: data.subjectId || '',
      title: data.title || '',
      description: data.description || '',
      examType: data.examType || 'daily_quiz',
      totalPoints: data.totalPoints || 0,
      passingScore: data.passingScore || 0,
      questions: data.questions || [],
      createdBy: data.createdBy || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockQuizzes.push(newQuiz);
    return newQuiz;
  },

  update: async (id: string, data: Partial<Quiz>): Promise<Quiz> => {
    await delay(400);
    const index = mockQuizzes.findIndex(q => q.id === id);
    if (index === -1) throw new Error('Quiz tidak ditemukan');

    mockQuizzes[index] = {
      ...mockQuizzes[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return mockQuizzes[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockQuizzes.findIndex(q => q.id === id);
    if (index !== -1) mockQuizzes.splice(index, 1);
  }
};

// Exam Batch API
export const batchApi = {
  getAll: async (): Promise<ExamBatch[]> => {
    await delay(300);
    return mockBatches;
  },

  getById: async (id: string): Promise<ExamBatch | undefined> => {
    await delay(200);
    return mockBatches.find(b => b.id === id);
  },

  getByQuizId: async (quizId: string): Promise<ExamBatch[]> => {
    await delay(250);
    return mockBatches.filter(b => b.quizId === quizId);
  },

  create: async (data: Partial<ExamBatch>): Promise<ExamBatch> => {
    await delay(500);
    const newBatch: ExamBatch = {
      id: `batch-${Date.now()}`,
      quizId: data.quizId || '',
      type: data.type || 'REGULAR',
      title: data.title || '',
      startTime: data.startTime || new Date().toISOString(),
      endTime: data.endTime || new Date().toISOString(),
      duration: data.duration || 60,
      status: 'scheduled',
      allowedParticipants: data.allowedParticipants || [],
      waitlist: data.waitlist || [],
      createdBy: data.createdBy || '',
      createdAt: new Date().toISOString()
    };
    mockBatches.push(newBatch);
    return newBatch;
  },

  updateStatus: async (id: string, status: BatchStatus): Promise<ExamBatch> => {
    await delay(300);
    const batch = mockBatches.find(b => b.id === id);
    if (!batch) throw new Error('Batch tidak ditemukan');

    batch.status = status;
    if (status === 'frozen') batch.frozenAt = new Date().toISOString();
    if (status === 'active' && batch.frozenAt) batch.resumedAt = new Date().toISOString();

    return batch;
  },

  freeze: async (id: string): Promise<ExamBatch> => {
    return batchApi.updateStatus(id, 'frozen');
  },

  resume: async (id: string): Promise<ExamBatch> => {
    return batchApi.updateStatus(id, 'active');
  }
};

// Attempt API
export const attemptApi = {
  getByBatchId: async (batchId: string): Promise<Attempt[]> => {
    await delay(250);
    return mockAttempts.filter(a => a.batchId === batchId);
  },

  getByStudentId: async (studentId: string): Promise<Attempt[]> => {
    await delay(250);
    return mockAttempts.filter(a => a.studentId === studentId);
  },

  start: async (batchId: string, studentId: string): Promise<Attempt> => {
    await delay(400);

    // Check if student already has an active attempt
    const existingAttempt = mockAttempts.find(
      a => a.batchId === batchId && a.studentId === studentId &&
        !['SUBMITTED', 'EXPIRED', 'RESET_BY_ADMIN'].includes(a.status)
    );

    if (existingAttempt) {
      throw new Error('Anda sudah memiliki attempt aktif untuk batch ini');
    }

    const batch = mockBatches.find(b => b.id === batchId);
    if (!batch) throw new Error('Batch tidak ditemukan');

    const batchEndTime = new Date(batch.endTime).getTime();
    const now = Date.now();
    const secondsUntilBatchEnd = Math.floor((batchEndTime - now) / 1000);
    const allowedDurationSeconds = batch.duration * 60;

    // Initial remaining time capped by batch end
    const initialRemaining = Math.max(0, Math.min(allowedDurationSeconds, secondsUntilBatchEnd));

    const newAttempt: Attempt = {
      id: `attempt-${Date.now()}`,
      batchId,
      studentId,
      status: 'ACTIVE',
      answers: [],
      startedAt: new Date().toISOString(),
      remainingTime: initialRemaining,
      serverTime: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    mockAttempts.push(newAttempt);
    saveAttempts(mockAttempts);

    // Log event
    mockEventLogs.push({
      id: `event-${Date.now()}`,
      eventType: 'ATTEMPT_STARTED',
      batchId,
      attemptId: newAttempt.id,
      userId: studentId,
      details: { startedAt: newAttempt.startedAt },
      timestamp: new Date().toISOString()
    });

    return newAttempt;
  },

  saveAnswer: async (attemptId: string, answer: Answer): Promise<Attempt> => {
    await delay(100);
    const attempt = mockAttempts.find(a => a.id === attemptId);
    if (!attempt) throw new Error('Attempt tidak ditemukan');
    if (attempt.status !== 'ACTIVE') throw new Error('Attempt tidak aktif');

    const existingIndex = attempt.answers.findIndex(a => a.questionId === answer.questionId);
    if (existingIndex >= 0) {
      attempt.answers[existingIndex] = answer;
    } else {
      attempt.answers.push(answer);
    }

    saveAttempts(mockAttempts);

    return attempt;
  },

  submit: async (attemptId: string, answers: Answer[]): Promise<Attempt> => {
    await delay(500);
    const attempt = mockAttempts.find(a => a.id === attemptId);
    if (!attempt) throw new Error('Attempt tidak ditemukan');
    if (attempt.status !== 'ACTIVE' && attempt.status !== 'FROZEN') {
      throw new Error('Attempt tidak dapat di-submit');
    }

    attempt.answers = answers;
    attempt.status = 'SUBMITTED';
    attempt.submittedAt = new Date().toISOString();

    // Calculate score
    const batch = mockBatches.find(b => b.id === attempt.batchId);
    const quiz = mockQuizzes.find(q => q.id === batch?.quizId);

    if (quiz) {
      let score = 0;
      answers.forEach(ans => {
        const question = quiz.questions.find(q => q.id === ans.questionId);
        if (question && question.options) {
          const correctOption = question.options.find(o => o.isCorrect);
          if (correctOption && ans.selectedOptionId === correctOption.id) {
            score += question.points;
          }
        }
      });
      attempt.score = score;
    }

    saveAttempts(mockAttempts);

    // Log event
    mockEventLogs.push({
      id: `event-${Date.now()}`,
      eventType: 'ATTEMPT_SUBMITTED',
      batchId: attempt.batchId,
      attemptId: attempt.id,
      userId: attempt.studentId,
      details: { score: attempt.score, answersCount: answers.length },
      timestamp: new Date().toISOString()
    });

    return attempt;
  },

  getServerTime: async (attemptId: string): Promise<{ serverTime: string; remainingTime: number }> => {
    await delay(100);
    const attempt = mockAttempts.find(a => a.id === attemptId);
    if (!attempt) throw new Error('Attempt tidak ditemukan');

    // Simulate time passing: calculate remaining based on strict end time
    const now = Date.now();
    const batch = mockBatches.find(b => b.id === attempt.batchId);

    if (!batch) throw new Error('Batch tidak ditemukan');

    const startedAt = new Date(attempt.startedAt!).getTime();
    const batchEndTime = new Date(batch.endTime).getTime();

    // Time elapsed since attempt start
    const elapsedSeconds = Math.floor((now - startedAt) / 1000);

    // Max duration assigned to this attempt (e.g. 60 mins)
    const allowedDurationSeconds = batch.duration * 60;

    // Absolute hard stop at batch end time
    const secondsUntilBatchEnd = Math.floor((batchEndTime - now) / 1000);

    // Remaining is: Allowed Duration - Elapsed, BUT chopped if it exceeds Batch End
    let remaining = Math.max(0, allowedDurationSeconds - elapsedSeconds);

    // Enforce batch end time (anti-cheating: cannot go past batch end)
    if (remaining > secondsUntilBatchEnd) {
      remaining = Math.max(0, secondsUntilBatchEnd);
    }

    return {
      serverTime: new Date().toISOString(),
      remainingTime: remaining
    };
  }
};

// Report API
export const reportApi = {
  getBatchReport: async (batchId: string): Promise<BatchReport> => {
    await delay(400);
    const batch = mockBatches.find(b => b.id === batchId);
    const quiz = mockQuizzes.find(q => q.id === batch?.quizId);
    const attempts = mockAttempts.filter(a => a.batchId === batchId);

    const scores = attempts.filter(a => a.score !== undefined).map(a => a.score!);

    return {
      batchId,
      batchType: batch?.type || 'REGULAR',
      quizTitle: quiz?.title || '',
      totalParticipants: attempts.length,
      submittedCount: attempts.filter(a => a.status === 'SUBMITTED').length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      attempts: attempts.map(a => ({
        attemptId: a.id,
        studentName: mockUsers.find(u => u.id === a.studentId)?.name || '',
        studentId: a.studentId,
        score: a.score || 0,
        totalPoints: quiz?.totalPoints || 100,
        percentage: ((a.score || 0) / (quiz?.totalPoints || 100)) * 100,
        status: a.status,
        duration: a.startedAt && a.submittedAt
          ? Math.floor((new Date(a.submittedAt).getTime() - new Date(a.startedAt).getTime()) / 1000)
          : 0,
        submittedAt: a.submittedAt
      }))
    };
  },

  getEventLogs: async (batchId?: string): Promise<EventLog[]> => {
    await delay(300);
    if (batchId) {
      return mockEventLogs.filter(e => e.batchId === batchId);
    }
    return mockEventLogs;
  }
};
