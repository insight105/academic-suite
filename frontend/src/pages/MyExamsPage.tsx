import { useEffect, useState } from 'react';
import { useQuizStore } from '@/stores/quizStore';
import { useAuthStore } from '@/stores/authStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Play,
  BookOpen,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { attemptApi } from '@/api/apiClient';
import { Attempt } from '@/types';

export default function MyExamsPage() {
  const { user } = useAuthStore();
  const { t, i18n } = useTranslation();
  const { batches, quizzes, fetchBatches, fetchQuizzes } = useQuizStore();
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    fetchBatches();
    fetchQuizzes();
    if (user) {
      attemptApi.getByStudentId(user.id).then(setAttempts).catch(console.error);
    }
  }, [user]);

  // Filter batches where student is allowed OR if allowedParticipants is empty (public)
  const myBatches = batches.filter(b =>
    (b.allowedParticipants.length === 0 || b.allowedParticipants.includes(user?.id || '')) &&
    (b.status === 'active' || b.status === 'scheduled')
  );

  const activeBatches = myBatches.filter(b => b.status === 'active');
  const upcomingBatches = myBatches.filter(b => b.status === 'scheduled');

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('my_exams.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('my_exams.desc')}
        </p>
      </div>

      {/* Active Exams */}
      {activeBatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-chart-2" />
            {t('my_exams.active.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBatches.map((batch) => {
              const quiz = quizzes.find(q => q.id === batch.quizId);
              const existingAttempt = attempts.find(a => a.batchId === batch.id && (a.status === 'SUBMITTED' || a.status === 'EXPIRED'));
              const isCompleted = !!existingAttempt;

              return (
                <Card key={batch.id} className={`border-chart-2 ${isCompleted ? 'bg-muted/50 border-muted' : 'border-chart-2/50 bg-chart-2/5'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={isCompleted ? "bg-muted text-muted-foreground" : "bg-chart-2/10 text-chart-2"}>
                        {isCompleted ? t('batches.status.finished') : t('batches.status.active')}
                      </Badge>
                      <Badge variant="outline">{t(`batches.type.${batch.type}`)}</Badge>
                    </div>
                    <CardTitle className="mt-2">{batch.title}</CardTitle>
                    <CardDescription>{quiz?.title}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {t('batches.card.duration', { count: batch.duration })}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {t('quizzes.card.questions', { count: quiz?.questions.length })}
                      </span>
                    </div>
                    {isCompleted ? (
                      <Button className="w-full" variant="secondary" disabled>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {t('my_exams.actions.already_taken')}
                      </Button>
                    ) : (
                      <Link to={`/exam/${batch.id}`}>
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          {t('my_exams.actions.start')}
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Exams */}
      {upcomingBatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-chart-1" />
            {t('my_exams.upcoming.title')}
          </h2>
          <div className="space-y-4">
            {upcomingBatches.map((batch) => {
              const quiz = quizzes.find(q => q.id === batch.quizId);
              const startDate = new Date(batch.startTime);
              return (
                <Card key={batch.id} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-chart-1/10 text-chart-1">
                            {t('my_exams.upcoming.scheduled_badge')}
                          </Badge>
                          <Badge variant="outline">{t(`batches.type.${batch.type}`)}</Badge>
                        </div>
                        <h3 className="font-semibold text-foreground">{batch.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz?.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {startDate.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {startDate.toLocaleTimeString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} • {t('batches.card.duration', { count: batch.duration })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {myBatches.length === 0 && (
        <Card className="border-border">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('my_exams.empty.title')}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {t('my_exams.empty.desc')}
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
