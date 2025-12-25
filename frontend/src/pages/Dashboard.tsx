import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { useQuizStore } from '@/stores/quizStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { attemptApi } from '@/api/apiClient';
import { Attempt } from '@/types';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { quizzes, batches, fetchQuizzes, fetchBatches } = useQuizStore();
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  useEffect(() => {
    fetchQuizzes();
    fetchBatches();
    if (user) {
      attemptApi.getByStudentId(user.id).then(setAttempts).catch(console.error);
    }
  }, [user]);

  const activeBatches = (batches || []).filter(b => b.status === 'active');
  const scheduledBatches = (batches || []).filter(b => b.status === 'scheduled');

  const stats = [
    {
      label: t('dashboard.stats.total_quiz'),
      value: (quizzes || []).length,
      icon: BookOpen,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: t('dashboard.stats.active_batch'),
      value: activeBatches.length,
      icon: Play,
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      label: t('dashboard.stats.scheduled'),
      value: scheduledBatches.length,
      icon: Calendar,
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      label: t('dashboard.stats.finished'),
      value: (batches || []).filter(b => b.status === 'finished').length,
      icon: CheckCircle2,
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {t('dashboard.welcome', { name: user?.name })}
        </h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === 'admin' && t('dashboard.role_desc_admin')}
          {user?.role === 'teacher' && t('dashboard.role_desc_teacher')}
          {user?.role === 'student' && t('dashboard.role_desc_student')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Exams */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5 text-chart-2" />
              {t('dashboard.active_exams.title')}
            </CardTitle>
            <CardDescription>{t('dashboard.active_exams.desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {activeBatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeBatches.map((batch) => {
                  const quiz = quizzes.find(q => q.id === batch.quizId);
                  const existingAttempt = attempts.find(a => a.batchId === batch.id && (a.status === 'SUBMITTED' || a.status === 'EXPIRED'));
                  const isCompleted = !!existingAttempt;

                  return (
                    <Card key={batch.id} className={`border-chart-2 ${isCompleted ? 'bg-muted/50 border-muted' : 'border-chart-2/50 bg-chart-2/5'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <Badge className={isCompleted ? "bg-muted text-muted-foreground" : "bg-chart-2/10 text-chart-2"}>
                            {isCompleted ? t('dashboard.active_exams.completed') : t('dashboard.active_exams.in_progress')}
                          </Badge>
                          <Badge variant="outline">{batch.type}</Badge>
                        </div>
                        <CardTitle className="mt-2 text-lg">{batch.title}</CardTitle>
                        <CardDescription>{quiz?.title}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {t('dashboard.active_exams.duration_min', { count: batch.duration })}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {t('dashboard.active_exams.questions_count', { count: quiz?.questions.length })}
                          </span>
                        </div>
                        {isCompleted ? (
                          <Button className="w-full" variant="secondary" disabled>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('dashboard.active_exams.already_taken')}
                          </Button>
                        ) : (
                          user?.role === 'student' ? (
                            <Link to={`/exam/${batch.id}`}>
                              <Button className="w-full">
                                <Play className="h-4 w-4 mr-2" />
                                {t('dashboard.active_exams.start_exam')}
                              </Button>
                            </Link>
                          ) : (
                            <Link to={`/batches/${batch.id}`}>
                              <Button variant="outline" className="w-full">
                                {t('dashboard.active_exams.monitor')}
                              </Button>
                            </Link>
                          )
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('dashboard.active_exams.no_active')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scheduled Exams */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-chart-1" />
              {t('dashboard.scheduled_exams.title')}
            </CardTitle>
            <CardDescription>{t('dashboard.scheduled_exams.desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledBatches.length > 0 ? (
              <div className="space-y-3">
                {scheduledBatches.slice(0, 5).map((batch) => {
                  const quiz = quizzes.find(q => q.id === batch.quizId);
                  const startDate = new Date(batch.startTime);
                  return (
                    <div
                      key={batch.id}
                      className="p-4 rounded-lg bg-accent/50 border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{batch.title}</h4>
                          <p className="text-sm text-muted-foreground">{quiz?.title}</p>
                          <div className="flex items-center gap-1 mt-2 text-xs text-chart-1">
                            <Clock className="h-3 w-3" />
                            {startDate.toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-chart-1/10 text-chart-1">
                          {batch.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('dashboard.scheduled_exams.no_scheduled')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions for Teacher/Admin */}
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle>{t('dashboard.quick_actions.title')}</CardTitle>
              <CardDescription>{t('dashboard.quick_actions.desc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/quizzes/new">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span>{t('dashboard.quick_actions.create_quiz')}</span>
                  </Button>
                </Link>
                <Link to="/batches/new">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <Calendar className="h-6 w-6" />
                    <span>{t('dashboard.quick_actions.schedule_exam')}</span>
                  </Button>
                </Link>
                <Link to="/reports">
                  <Button variant="outline" className="w-full h-24 flex-col gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>{t('dashboard.quick_actions.view_reports')}</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
