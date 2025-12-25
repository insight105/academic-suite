import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { attemptApi } from '@/api/apiClient';
import { useAuthStore } from '@/stores/authStore';
import { useQuizStore } from '@/stores/quizStore';
import { ExamTimer } from '@/components/exam/ExamTimer';
import { QuestionCard } from '@/components/exam/QuestionCard';
import { QuestionNavigator } from '@/components/exam/QuestionNavigator';
import { AutosaveIndicator } from '@/components/exam/AutosaveIndicator';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ChevronLeft, ChevronRight, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ExamPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    currentQuiz,
    currentBatch,
    currentAttempt,
    localAnswers,
    currentQuestionIndex,
    remainingTime,
    isLoading,
    fetchQuizById,
    fetchBatchById,
    startAttempt,
    saveAnswer,
    submitAttempt,
    setCurrentQuestion,
    nextQuestion,
    prevQuestion
  } = useQuizStore();

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for Heartbeat to avoid clearing interval on state change
  const attemptRef = useRef(currentAttempt);
  const questionIdxRef = useRef(currentQuestionIndex);

  useEffect(() => {
    attemptRef.current = currentAttempt;
    questionIdxRef.current = currentQuestionIndex;
  }, [currentAttempt, currentQuestionIndex]);

  useEffect(() => {
    const loadExam = async () => {
      if (!batchId || !user) return;

      try {
        const batch = await fetchBatchById(batchId);
        if (!batch) {
          toast({ title: t('exam.error.batch_not_found'), variant: "destructive" });
          navigate('/dashboard');
          return;
        }

        await fetchQuizById(batch.quizId);

        // Start attempt
        if (!currentAttempt || currentAttempt.batchId !== batchId || currentAttempt.studentId !== user.id) {
          await startAttempt(batchId, user.id);
        }
      } catch (error) {
        toast({
          title: t('exam.error.load_failed'),
          description: error instanceof Error ? error.message : t('common.error_default'),
          variant: "destructive"
        });
        navigate('/dashboard');
      }
    };

    loadExam();

    // Security Listeners
    const handleVisibilityChange = () => {
      if (document.hidden && attemptRef.current?.id) {
        attemptApi.logEvent(attemptRef.current.id, 'FOCUS_LOST', 'Tab hidden or minimized');
        toast({
          title: `⚠️ ${t('exam.security.focus_lost')}`,
          description: t('exam.security.focus_lost_desc'),
          variant: "destructive"
        });
      }
    };

    const handleWindowBlur = () => {
      if (attemptRef.current?.id) {
        attemptApi.logEvent(attemptRef.current.id, 'FOCUS_LOST', 'Window lost focus');
        toast({
          title: `⚠️ ${t('exam.security.window_blur')}`,
          description: t('exam.security.window_blur_desc'),
          variant: "destructive"
        });
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      if (attemptRef.current?.id) {
        attemptApi.logEvent(attemptRef.current.id, 'COPY_ATTEMPT', 'Ctrl+C used');
        toast({ title: `❌ ${t('exam.security.copy')}`, variant: "destructive" });
      }
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      if (attemptRef.current?.id) {
        attemptApi.logEvent(attemptRef.current.id, 'PASTE_ATTEMPT', 'Ctrl+V used');
        toast({ title: `❌ ${t('exam.security.paste')}`, variant: "destructive" });
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast({ title: `❌ ${t('exam.security.context_menu')}`, variant: "destructive" });
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [batchId, user?.id, currentAttempt]); // currentAttempt is needed for the initial check in loadExam

  // Separate Effect for Heartbeat
  useEffect(() => {
    const pingInterval = setInterval(() => {
      const att = attemptRef.current;
      // Ping if we have an attempt ID, regardless of status (Active/Submitted)
      // This ensures students appear "Online" even if they are just reviewing results.
      if (att?.id) {
        attemptApi.ping(att.id, questionIdxRef.current);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(pingInterval);
  }, []); // Run once on mount

  const handleTimeUp = useCallback(() => {
    setShowTimeUpDialog(true);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitAttempt();
      toast({
        title: t('exam.submitted.success_title'),
        description: t('exam.submitted.success_desc', { score: result.score, total: currentQuiz?.totalPoints || 100 })
      });
      navigate('/history');
    } catch (error) {
      toast({
        title: t('exam.submitted.fail_title'),
        description: error instanceof Error ? error.message : t('common.error_default'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
      setShowTimeUpDialog(false);
    }
  };

  const currentQuestion = currentQuiz?.questions[currentQuestionIndex];
  const totalQuestions = currentQuiz?.questions.length || 0;
  const answeredCount = Object.keys(localAnswers).length;

  const isMismatch = currentAttempt && user && (currentAttempt.batchId !== batchId || currentAttempt.studentId !== user.id);

  if (isLoading || !currentQuiz || !currentBatch || !currentAttempt || isMismatch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('exam.loading')}</p>
        </div>
      </div>
    );
  }

  if (currentAttempt.status === 'SUBMITTED') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto mb-6">
            <Send className="h-10 w-10 text-chart-2" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('exam.submitted.title')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('exam.submitted.score', { score: currentAttempt.score, total: currentQuiz.totalPoints })}
          </p>
          <Button onClick={() => navigate('/history')}>
            {t('exam.submitted.view_history')}
          </Button>
        </div>
      </div>
    );
  }

  if (currentAttempt.status === 'FROZEN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 rounded-full bg-chart-1/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-chart-1" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('exam.frozen.title')}</h1>
          <p className="text-muted-foreground mb-6">
            {t('exam.frozen.desc')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('exam.frozen.safe_note')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-foreground truncate max-w-md">
              {currentBatch.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('exam.header.question_nav', { current: currentQuestionIndex + 1, total: totalQuestions })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <AutosaveIndicator />
            <ExamTimer onTimeUp={handleTimeUp} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-24 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3">
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                answer={localAnswers[currentQuestion.id]}
                onAnswerChange={(answer) => saveAnswer(currentQuestion.id, answer)}
                disabled={currentAttempt.status !== 'ACTIVE'}
              />
            )}
          </div>

          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <QuestionNavigator
                questions={currentQuiz.questions}
                currentIndex={currentQuestionIndex}
                answers={localAnswers}
                onNavigate={setCurrentQuestion}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('exam.footer.prev')}
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {t('exam.footer.answered_count', { count: answeredCount, total: totalQuestions })}
            </span>
            <Button onClick={() => setShowSubmitDialog(true)}>
              <Send className="h-4 w-4 mr-2" />
              {t('exam.footer.submit')}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={nextQuestion}
            disabled={currentQuestionIndex === totalQuestions - 1}
          >
            {t('exam.footer.next')}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </footer>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('exam.dialog.submit.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('exam.dialog.submit.desc', { answered: answeredCount, total: totalQuestions })}
              {answeredCount < totalQuestions && (
                <span className="block mt-2 text-chart-1">
                  ⚠️ {t('exam.dialog.submit.warning', { count: totalQuestions - answeredCount })}
                </span>
              )}
              <span className="block mt-2">
                {t('exam.dialog.submit.irrevocable')}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>{t('exam.dialog.submit.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('exam.dialog.submit.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Up Dialog */}
      <AlertDialog open={showTimeUpDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t('exam.dialog.time_up.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('exam.dialog.time_up.desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('exam.dialog.time_up.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
