import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { attemptApi, quizApi, batchApi } from '../api/apiClient';
import { Attempt } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';



export default function HistoryPage() {
  const { user } = useAuthStore();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [batchMap, setBatchMap] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return { label: t('history.status.submitted'), color: 'bg-chart-2/10 text-chart-2', icon: <CheckCircle2 className="h-4 w-4" /> };
      case 'EXPIRED':
        return { label: t('history.status.expired'), color: 'bg-destructive/10 text-destructive', icon: <XCircle className="h-4 w-4" /> };
      case 'RESET_BY_ADMIN':
        return { label: t('history.status.reset_by_admin'), color: 'bg-chart-1/10 text-chart-1', icon: <AlertTriangle className="h-4 w-4" /> };
      default:
        return { label: t('history.status.active'), color: 'bg-muted text-muted-foreground', icon: <Clock className="h-4 w-4" /> };
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const [attemptsData, batchesData] = await Promise.all([
          attemptApi.getByStudentId(user.id),
          batchApi.getAll()
        ]);

        setAttempts(attemptsData);

        const map: Record<string, any> = {};
        batchesData.forEach(b => {
          map[b.id] = b;
        });
        setBatchMap(map);

      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user?.id]);

  const completedAttempts = attempts.filter(a =>
    ['SUBMITTED', 'EXPIRED', 'RESET_BY_ADMIN'].includes(a.status)
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{t('history.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('history.desc')}
        </p>
      </div>

      {completedAttempts.length > 0 ? (
        <div className="space-y-4">
          {completedAttempts.map((attempt) => {
            const config = getStatusConfig(attempt.status);
            const submittedDate = attempt.submittedAt
              ? new Date(attempt.submittedAt)
              : new Date(attempt.createdAt);

            return (
              <Card key={attempt.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={config.color}>
                          {config.icon}
                          <span className="ml-1">{config.label}</span>
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {batchMap[attempt.batchId]?.name || `Batch: ${attempt.batchId}`}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {t('history.card.answers_count', { count: attempt.answers.length })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {submittedDate.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    {attempt.score !== undefined && (
                      <div className="text-right">
                        <p className="text-3xl font-bold text-foreground">
                          {Math.round(attempt.score)}
                        </p>
                        <p className="text-sm text-muted-foreground">{t('history.card.score')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('history.empty.title')}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              {t('history.empty.desc')}
            </p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
