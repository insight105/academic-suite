import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuizStore } from '@/stores/quizStore';
import { reportApi } from '../api/apiClient';
import { BatchReport, EventLog } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  Users,
  FileText,
  Download,
  Activity,
  Search,
  ArrowUpDown,
  AlertTriangle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { id as idLocale, enUS as enLocale } from 'date-fns/locale';
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from 'react-i18next';

const statusColors: Record<string, string> = {
  SUBMITTED: 'bg-chart-2/10 text-chart-2',
  EXPIRED: 'bg-destructive/10 text-destructive',
  ACTIVE: 'bg-chart-1/10 text-chart-1',
  FROZEN: 'bg-muted text-muted-foreground'
};

export default function ReportsPage() {
  const [searchParams] = useSearchParams();
  const { batches, fetchBatches, quizzes, fetchQuizzes } = useQuizStore();
  const [selectedBatchId, setSelectedBatchId] = useState<string>(searchParams.get('batchId') || '');
  const [report, setReport] = useState<BatchReport | null>(null);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t, i18n } = useTranslation();

  // Enhancement State
  const [activeTab, setActiveTab] = useState('attempts');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
  const [loadingLogs, setLoadingLogs] = useState(false);

  useEffect(() => {
    fetchBatches();
    fetchQuizzes();
  }, []);

  useEffect(() => {
    const loadReport = async () => {
      if (!selectedBatchId) return;
      setIsLoading(true);
      setLogs([]); // Reset logs
      setSelectedStudent(null);
      try {
        const reportData = await reportApi.getBatchReport(selectedBatchId);
        setReport(reportData);
        // We don't fetch all logs initially anymore to improve performance
      } catch (error) {
        console.error('Failed to load report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReport();
  }, [selectedBatchId]);

  const fetchLogs = async (studentId: string) => {
    setLoadingLogs(true);
    try {
      const allLogs = await reportApi.getEventLogs(selectedBatchId);
      const studentLogs = allLogs.filter(l => l.studentId === studentId);
      setLogs(studentLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast({ title: t('reports.toast.load_fail'), variant: "destructive" });
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredParticipants = useMemo(() => {
    if (!report?.attempts) return [];
    let data = [...report.attempts];

    // Filter
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      data = data.filter((p: any) =>
        p.studentName.toLowerCase().includes(lower) ||
        p.status.toLowerCase().includes(lower)
      );
    }

    // Sort
    if (sortConfig) {
      data.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [report, searchQuery, sortConfig]);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('reports.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('reports.subtitle')}
          </p>
        </div>
        <Button variant="outline" onClick={async () => {
          if (selectedBatchId) {
            try {
              const batch = batches.find(b => b.id === selectedBatchId);
              const blob = await reportApi.exportBatchReport(selectedBatchId);
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `Laporan-${batch?.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'Batch'}.xlsx`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              document.body.removeChild(a);
            } catch (error) {
              toast({ title: t('reports.toast.export_fail'), description: t('reports.toast.export_fail_desc'), variant: "destructive" });
            }
          } else {
            toast({ title: t('reports.toast.select_batch'), description: t('reports.toast.select_batch_req'), variant: "default" });
          }
        }}>
          <Download className="h-4 w-4 mr-2" />
          {t('reports.export')}
        </Button>
      </div>

      {/* Batch Selector */}
      <Card className="border-border mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">{t('reports.select_batch')}:</label>
            <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder={t('reports.select_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => {
                  const quiz = quizzes.find(q => q.id === batch.quizId);
                  return (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.title || batch.name} ({quiz?.title})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {report && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('reports.stats.participants')}</p>
                    <p className="text-3xl font-bold text-foreground">{report.totalParticipants}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('reports.stats.avg_score')}</p>
                    <p className="text-3xl font-bold text-foreground">{Math.round(report.averageScore)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-chart-2/10">
                    <TrendingUp className="h-6 w-6 text-chart-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('reports.stats.highest_score')}</p>
                    <p className="text-3xl font-bold text-foreground">{Math.round(report.highestScore)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-chart-1/10">
                    <TrendingUp className="h-6 w-6 text-chart-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('reports.stats.submitted')}</p>
                    <p className="text-3xl font-bold text-foreground">{report.submittedCount}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-chart-3/10">
                    <FileText className="h-6 w-6 text-chart-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="attempts">{t('reports.tabs.attempts')}</TabsTrigger>
              <TabsTrigger value="logs">{t('reports.tabs.logs')}</TabsTrigger>
            </TabsList>

            <TabsContent value="attempts" className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('reports.search_participant')}
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>{t('reports.tabs.attempts')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left cursor-pointer hover:bg-muted-foreground/10" onClick={() => handleSort('studentName')}>
                            <div className="flex items-center gap-1">{t('reports.table.student')} <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th className="p-3 text-left cursor-pointer hover:bg-muted-foreground/10" onClick={() => handleSort('status')}>
                            <div className="flex items-center gap-1">{t('reports.table.status')} <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th className="p-3 text-right cursor-pointer hover:bg-muted-foreground/10" onClick={() => handleSort('score')}>
                            <div className="flex items-center justify-end gap-1">{t('reports.table.score')} <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th className="p-3 text-right">{t('reports.table.percentage')}</th>
                          <th className="p-3 text-right">{t('reports.table.duration')}</th>
                          <th className="p-3 text-right">{t('reports.table.submitted')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredParticipants.length > 0 ? (
                          filteredParticipants.map((attempt) => (
                            <tr
                              key={attempt.attemptId}
                              className={cn(
                                "border-t cursor-pointer hover:bg-muted/50 transition-colors",
                                selectedStudent?.id === attempt.studentId && "bg-muted font-medium"
                              )}
                              onClick={() => {
                                setSelectedStudent({ id: attempt.studentId, name: attempt.studentName });
                                fetchLogs(attempt.studentId);
                                setActiveTab('logs');
                                setActiveTab('logs');
                                toast({ description: `${t('reports.toast.viewing_log')} ${attempt.studentName}` });
                              }}
                            >
                              <td className="p-3">{attempt.studentName}</td>
                              <td className="p-3">
                                <Badge className={statusColors[attempt.status] || 'bg-secondary'}>
                                  {attempt.status}
                                </Badge>
                              </td>
                              <td className="p-3 text-right font-medium">
                                {Math.round(attempt.score)}/{attempt.totalPoints}
                              </td>
                              <td className="p-3 text-right">
                                {attempt.percentage?.toFixed(1) || 0}%
                              </td>
                              <td className="p-3 text-right text-muted-foreground">
                                {Math.round(attempt.duration / 60)} {t('common.minutes_short')}
                              </td>
                              <td className="p-3 text-right text-muted-foreground">
                                {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString(i18n.language === 'id' ? 'id-ID' : 'en-US') : '-'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-muted-foreground">
                              {t('reports.no_data')}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {t('reports.logs.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('reports.logs.subtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!selectedStudent ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-orange-50 border-orange-200">
                      <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
                      <h3 className="text-lg font-bold text-orange-700">{t('reports.logs.select_student')}</h3>
                      <p className="text-muted-foreground text-center max-w-md mt-2">
                        {t('reports.logs.select_student_desc')}
                      </p>
                      <Button variant="outline" className="mt-4" onClick={() => setActiveTab('attempts')}>
                        {t('reports.logs.back_to_results')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {t('reports.logs.activity_log')}: <span className="text-primary">{selectedStudent.name}</span>
                        </h3>
                        <Button size="sm" variant="ghost" onClick={() => fetchLogs(selectedStudent.id)}>
                          {t('reports.logs.refresh')}
                        </Button>
                      </div>

                      {loadingLogs ? (
                        <div className="p-8 text-center text-muted-foreground">{t('reports.logs.loading')}</div>
                      ) : logs.length > 0 ? (
                        <div className="space-y-3">
                          {logs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-start gap-3 p-3 rounded-lg bg-accent/50"
                            >
                              <div className={cn("w-2 h-2 mt-2 rounded-full flex-shrink-0",
                                log.eventType === 'FOCUS_LOST' ? "bg-destructive" : "bg-primary"
                              )} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-sm text-foreground">
                                    {log.eventType.replace(/_/g, ' ')}
                                  </span>
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {format(new Date(log.createdAt || log.timestamp || new Date()), "HH:mm:ss dd/MM/yyyy", { locale: i18n.language === 'id' ? idLocale : enLocale })}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {log.details}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center border rounded-lg bg-muted/20">
                          <p className="text-muted-foreground">{t('reports.logs.no_activity')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )
      }

      {
        !selectedBatchId && (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t('reports.select_batch')}
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {t('reports.select_batch_desc')}
              </p>
            </CardContent>
          </Card>
        )
      }
    </DashboardLayout >
  );
}
