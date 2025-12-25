import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuizzesPage from "./pages/QuizzesPage";
import QuizDetailsPage from "./pages/QuizDetailsPage";
import QuizBuilderPage from "./pages/QuizBuilderPage";
import BatchesPage from "./pages/BatchesPage";
import BatchDetailsPage from "./pages/BatchDetailsPage";
import LiveMonitorPage from '@/pages/LiveMonitorPage';
import MyExamsPage from "./pages/MyExamsPage";
import ExamPage from "./pages/ExamPage";
import HistoryPage from "./pages/HistoryPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import UsersPage from "./pages/UsersPage";
import InstitutionsPage from "./pages/InstitutionsPage";
import ClassesPage from './pages/ClassesPage';
import ClassFormPage from './pages/ClassFormPage';
import SubjectsPage from "./pages/SubjectsPage";
import NotFound from "./pages/NotFound";

import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Index />}
      />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      {/* Protected Routes - All Roles */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['admin', 'maintainer']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/institutions"
        element={
          <ProtectedRoute allowedRoles={['admin', 'maintainer']}>
            <InstitutionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute allowedRoles={['admin', 'maintainer']}>
            <SubjectsPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Admin & Teacher */}
      <Route
        path="/quizzes"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'maintainer']}>
            <QuizzesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizzes/:quizId"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'maintainer']}>
            <QuizDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizzes/new"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <QuizBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quizzes/:quizId/edit"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <QuizBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/batches"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'maintainer']}>
            <BatchesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/batches/:batchId"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'maintainer']}>
            <BatchDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/batches/:batchId/live"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'maintainer']}>
            <LiveMonitorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'maintainer']}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'maintainer']}>
            <ClassesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes/new"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <ClassFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <ClassFormPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Student */}
      <Route
        path="/my-exams"
        element={
          <ProtectedRoute allowedRoles={['student', 'maintainer']}>
            <MyExamsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam/:batchId"
        element={
          <ProtectedRoute allowedRoles={['student', 'maintainer']}>
            <ExamPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={['student', 'maintainer']}>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
