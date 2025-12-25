import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuizStore } from '@/stores/quizStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Calendar,
  Clock,
  Users,
  Play,
  Pause,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const statusColors: Record<string, string> = {
  scheduled: 'bg-chart-1/10 text-chart-1',
  active: 'bg-chart-2/10 text-chart-2',
  frozen: 'bg-destructive/10 text-destructive',
  finished: 'bg-muted text-muted-foreground'
};

export default function BatchesPage() {
  const { batches, quizzes, fetchBatches, fetchQuizzes, freezeBatch, resumeBatch, isLoading } = useQuizStore();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchBatches();
    fetchQuizzes();
  }, []);

  const handleFreeze = async (batchId: string) => {
    try {
      await freezeBatch(batchId);
      await freezeBatch(batchId);
      toast({
        title: t('batches.actions.toast_freeze_success'),
        description: t('batches.actions.toast_freeze_desc')
      });
    } catch (error) {
      toast({
        title: t('batches.actions.toast_freeze_fail'),
        variant: "destructive"
      });
    }
  };

  const handleResume = async (batchId: string) => {
    try {
      await resumeBatch(batchId);
      toast({
        title: t('batches.actions.toast_resume_success'),
        description: t('batches.actions.toast_resume_desc')
      });
    } catch (error) {
      toast({
        title: t('batches.actions.toast_resume_fail'),
        variant: "destructive"
      });
    }
  };

  const activeBatches = batches.filter(b => b.status === 'active' || b.status === 'frozen');
  const scheduledBatches = batches.filter(b => b.status === 'scheduled');
  const finishedBatches = batches.filter(b => b.status === 'finished');

  const renderBatchCard = (batch: typeof batches[0]) => {
    const quiz = quizzes.find(q => q.id === batch.quizId);
    const startDate = new Date(batch.startTime);
    const endDate = new Date(batch.endTime);

    return (
      <Card key={batch.id} className="border-border hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge className={statusColors[batch.status]}>
                {t(`batches.status.${batch.status}`)}
              </Badge>
              {batch.type && (
                <Badge variant="outline">
                  {t(`batches.type.${batch.type}`)}
                </Badge>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`/batches/${batch.id}`}>
                    {t('batches.actions.view_detail')}
                  </Link>
                </DropdownMenuItem>
                {(batch.status === 'active' || batch.status === 'frozen') && (
                  <DropdownMenuItem asChild>
                    <Link to={`/batches/${batch.id}/live`} className="font-medium text-blue-600 focus:text-blue-700">
                      <Activity className="h-4 w-4 mr-2" />
                      {t('batches.actions.live_monitor')}
                    </Link>
                  </DropdownMenuItem>
                )}
                {batch.status === 'active' && (
                  <DropdownMenuItem onClick={() => handleFreeze(batch.id)}>
                    <Pause className="h-4 w-4 mr-2" />
                    {t('batches.actions.freeze')}
                  </DropdownMenuItem>
                )}
                {batch.status === 'frozen' && (
                  <DropdownMenuItem onClick={() => handleResume(batch.id)}>
                    <Play className="h-4 w-4 mr-2" />
                    {t('batches.actions.resume')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/reports?batchId=${batch.id}`}>
                    {t('batches.actions.view_report')}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="text-lg mt-2">{batch.title}</CardTitle>
          <CardDescription>
            {quiz?.title || t('batches.card.quiz_not_found')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {startDate.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })} - {endDate.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{t('batches.card.duration', { count: batch.duration })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{t('batches.card.participants', { count: batch.allowedParticipants.length })}</span>
            </div>
          </div>

          {batch.status === 'active' && (
            <div className="mt-4 p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
              <div className="flex items-center gap-2 text-chart-2 text-sm font-medium">
                <Play className="h-4 w-4" />
                {t('batches.card.ongoing_label')}
              </div>
            </div>
          )}

          {batch.status === 'frozen' && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                {t('batches.card.frozen_label')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t('batches.card.frozen_at', { time: batch.frozenAt && new Date(batch.frozenAt).toLocaleTimeString(i18n.language === 'id' ? 'id-ID' : 'en-US') })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('batches.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('batches.desc')}
          </p>
        </div>
        <Link to="/batches/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('batches.schedule_exam')}
          </Button>
        </Link>
      </div>

      {/* Active / Frozen Batches */}
      {activeBatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-chart-2" />
            {t('batches.in_progress')} ({activeBatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeBatches.map(renderBatchCard)}
          </div>
        </div>
      )}

      {/* Scheduled Batches */}
      {scheduledBatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-chart-1" />
            {t('batches.scheduled')} ({scheduledBatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledBatches.map(renderBatchCard)}
          </div>
        </div>
      )}

      {/* Finished Batches */}
      {finishedBatches.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
            {t('batches.finished')} ({finishedBatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {finishedBatches.map(renderBatchCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {batches.length === 0 && (
        <Card className="border-border">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('batches.empty_title')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {t('batches.empty_desc')}
            </p>
            <Link to="/batches/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('batches.schedule_exam')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
