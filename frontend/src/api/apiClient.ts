import axios, { AxiosError } from 'axios';
import {
    User, AuthTokens, Institution, Subject,
    Quiz, ExamBatch, Attempt, Answer, EventLog, BatchReport, BatchStatus, Class
} from '@/types';

// Configuration

// Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8060/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
apiClient.interceptors.request.use((config) => {
    try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            const { state } = JSON.parse(authStorage);
            if (state?.tokens?.accessToken) {
                config.headers.Authorization = `Bearer ${state.tokens.accessToken}`;
            }
        }
    } catch (e) {
        console.error('Error attaching token', e);
    }
    return config;
});

// Response interceptor to handle 401 (Unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        // If error is 401, logout
        if (error.response?.status === 401) {
            // Use Zustand store outside of React component
            // We import it dynamically or assume the store is available globally?
            // Better: Circular dependency risk if we import store here directly if store uses api.
            // Solution: Access localStorage directly to clear or dispatch event, OR import store carefully.
            // Since store imports authApi from here, we have a circular dependency if we import store here.
            // Break cycle:
            // 1. Just clear localStorage and custom window event.
            // 2. OR Move authApi to separate file.
            // Quickest: Clear local storage and reload/redirect.

            // Let's try to do it cleanly.
            // Actually, we can just clear storage and redirect to /login
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Helper to handle axios errors
const handlegetError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || error.message);
    }
    throw error;
};

// Auth API
export const authApi = {
    login: async (email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> => {
        try {
            const response = await apiClient.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
        // Backend doesn't support refresh yet, return mock for now or error
        // For seamless migration, let's just return a self-renewed mock to satisfy type
        return {
            accessToken: 'mock_renewed_access',
            refreshToken: refreshToken,
            expiresAt: Date.now() + 3600000
        };
    },

    logout: async (): Promise<void> => {
        // No backend logout needed for JWT usually, handled client side
        return Promise.resolve();
    },

    getProfile: async (): Promise<User> => {
        try {
            const response = await apiClient.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    forgotPassword: async (email: string): Promise<{ message: string }> => {
        try {
            const response = await apiClient.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
        try {
            const response = await apiClient.post('/auth/reset-password', { token, newPassword });
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    }
};

// Institution API
export const institutionApi = {
    getAll: async (): Promise<Institution[]> => {
        try {
            const response = await apiClient.get('/institutions');
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    getById: async (id: string): Promise<Institution | undefined> => {
        // Backend doesn't have specific getById for public yet, but usually list is small
        // Or we can implement client side find from getAll if lazy
        // Or add backend handler.
        // Let's rely on getAll for now as list is small
        try {
            const response = await apiClient.get('/institutions');
            return response.data.find((i: Institution) => i.id === id);
        } catch (error) {
            throw handlegetError(error);
        }
    },

    create: async (data: Partial<Institution>): Promise<Institution> => {
        try {
            const response = await apiClient.post('/institutions', data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    }
};

export const classApi = {
    getAll: () => apiClient.get<Class[]>('/classes').then(res => res.data),
    getById: (id: string) => apiClient.get<Class>(`/classes/${id}`).then(res => res.data),
    create: (data: Omit<Class, 'id' | 'createdAt'>) => apiClient.post<Class>('/classes', data).then(res => res.data),
    update: (id: string, data: Partial<Class>) => apiClient.put<Class>(`/classes/${id}`, data).then(res => res.data),
    delete: (id: string) => apiClient.delete(`/classes/${id}`).then(res => res.data),
};

// Attempt interface moved to types.ts or imported from top.
// Removing duplicate definition here if it exists.

// Class interface moved to types/index.ts

// Subject API
export const subjectApi = {
    getAll: async (institutionId?: string): Promise<Subject[]> => {
        try {
            const query = institutionId ? `?institutionId=${institutionId}` : '';
            const response = await apiClient.get(`/subjects${query}`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    getById: async (id: string): Promise<Subject | undefined> => {
        try {
            const response = await apiClient.get(`/subjects/${id}`);
            return response.data;
        } catch (error) {
            return undefined;
        }
    },

    create: async (data: Partial<Subject>): Promise<Subject> => {
        try {
            const response = await apiClient.post('/subjects', data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    update: async (id: string, data: Partial<Subject>): Promise<Subject> => {
        try {
            const response = await apiClient.put(`/subjects/${id}`, data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/subjects/${id}`);
        } catch (error) {
            throw handlegetError(error);
        }
    }
};

// Quiz API
export const quizApi = {
    getAll: async (): Promise<Quiz[]> => {
        try {
            const response = await apiClient.get('/quizzes');
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    getById: async (id: string): Promise<Quiz | undefined> => {
        try {
            const response = await apiClient.get(`/quizzes/${id}`);
            return response.data;
        } catch (error) {
            return undefined;
        }
    },

    create: async (data: Partial<Quiz>): Promise<Quiz> => {
        try {
            const response = await apiClient.post('/quizzes', data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    update: async (id: string, data: Partial<Quiz>): Promise<Quiz> => {
        try {
            const response = await apiClient.put(`/quizzes/${id}`, data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    delete: async (id: string): Promise<void> => {
        throw new Error("Delete Quiz not implemented in backend yet");
    }
};

// Exam Batch API
export const batchApi = {
    getAll: async (): Promise<ExamBatch[]> => {
        try {
            const response = await apiClient.get('/batches');
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    getById: async (id: string): Promise<ExamBatch | undefined> => {
        // Rely on getAll for now or add getById to backend
        // Backend has GetBatches -> All.
        // Optimization: Filter client side
        try {
            const response = await apiClient.get('/batches');
            return response.data.find((b: ExamBatch) => b.id === id);
        } catch (error) {
            throw handlegetError(error);
        }
    },

    getByQuizId: async (quizId: string): Promise<ExamBatch[]> => {
        try {
            const response = await apiClient.get('/batches');
            return response.data.filter((b: ExamBatch) => b.quizId === quizId);
        } catch (error) {
            throw handlegetError(error);
        }
    },

    create: async (data: Partial<ExamBatch>): Promise<ExamBatch> => {
        try {
            const response = await apiClient.post('/batches', data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    update: async (id: string, data: Partial<ExamBatch>): Promise<ExamBatch> => {
        try {
            const response = await apiClient.put(`/batches/${id}`, data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    updateStatus: async (id: string, status: BatchStatus): Promise<ExamBatch> => {
        try {
            const response = await apiClient.put(`/batches/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    freeze: async (id: string): Promise<ExamBatch> => {
        return batchApi.updateStatus(id, 'frozen');
    },

    resume: async (id: string): Promise<ExamBatch> => {
        return batchApi.updateStatus(id, 'active');
    },

    getBatchReportsSafe: async (id: string): Promise<any> => {
        try {
            return await reportApi.getBatchReport(id);
        } catch (e) {
            console.error("Failed to fetch reports for batch details", e);
            return null;
        }
    },

    getBatchLiveStatus: async (id: string): Promise<any> => {
        try {
            const response = await apiClient.get(`/batches/${id}/live`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    }
};

// Attempt API
export const attemptApi = {
    getByBatchId: async (batchId: string): Promise<Attempt[]> => {
        try {
            const response = await apiClient.get(`/attempts?batchId=${batchId}`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    getByStudentId: async (studentId: string): Promise<Attempt[]> => {
        try {
            const response = await apiClient.get(`/attempts?studentId=${studentId}`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    start: async (batchId: string, studentId: string): Promise<Attempt> => {
        try {
            const response = await apiClient.post('/attempts/start', { batchId, studentId });
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    saveAnswer: async (attemptId: string, answer: Answer): Promise<Attempt> => {
        try {
            const response = await apiClient.post(`/attempts/${attemptId}/answers`, answer);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    submit: async (attemptId: string, answers: Answer[]): Promise<Attempt> => {
        try {
            const response = await apiClient.post(`/attempts/${attemptId}/submit`, answers);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    getServerTime: async (attemptId: string): Promise<{ serverTime: string; remainingTime: number }> => {
        try {
            const response = await apiClient.get(`/attempts/${attemptId}/time`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    logEvent: async (attemptId: string, eventType: string, details: string): Promise<void> => {
        try {
            await apiClient.post(`/attempts/${attemptId}/log`, { eventType, details });
        } catch (error) {
            // Silently fail or log to console
            console.error("Failed to log security event", error);
        }
    },

    pauseAttempt: async (attemptId: string): Promise<any> => {
        try {
            const response = await apiClient.post(`/attempts/${attemptId}/pause`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    resumeAttempt: async (attemptId: string): Promise<any> => {
        try {
            const response = await apiClient.post(`/attempts/${attemptId}/resume`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    forceSubmitAttempt: async (attemptId: string): Promise<any> => {
        try {
            const response = await apiClient.post(`/attempts/${attemptId}/force-submit`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    ping: async (attemptId: string, currentQuestionIdx?: number): Promise<void> => {
        try {
            await apiClient.post(`/attempts/${attemptId}/ping`, { currentQuestionIdx });
        } catch (error) {
            // Silently fail on ping
            console.warn("Ping failed", error);
        }
    }
};

// User API
export const userApi = {
    getAll: async (params?: { page?: number; limit?: number; search?: string; institutionId?: string; role?: string }): Promise<{ data: User[]; meta: { page: number; limit: number; total: number; totalPages: number } }> => {
        try {
            const response = await apiClient.get('/users', { params });
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    create: async (data: Partial<User> & { password?: string }): Promise<User> => {
        try {
            const response = await apiClient.post('/users', data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    update: async (id: string, data: Partial<User>): Promise<User> => {
        try {
            const response = await apiClient.put(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    }
};

// Report API (Mocked for now as backend doesn't implement reports yet)
export const reportApi = {
    getBatchReport: async (batchId: string): Promise<BatchReport> => {
        try {
            const response = await apiClient.get(`/reports/batch?batchId=${batchId}`);
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    },

    getEventLogs: async (batchId?: string): Promise<EventLog[]> => {
        try {
            const query = batchId ? `?batchId=${batchId}` : '';
            const response = await apiClient.get(`/reports/logs${query}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch event logs", error);
            return [];
        }
    },

    exportBatchReport: async (batchId: string): Promise<Blob> => {
        try {
            const response = await apiClient.get(`/reports/export?batchId=${batchId}`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw handlegetError(error);
        }
    }
}

export const importApi = {
    importUsers: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/import/users', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    importQuestions: async (quizId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post(`/import/questions/${quizId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
}
