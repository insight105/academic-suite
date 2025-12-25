import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Users, Calendar, Clock, Save, Lock, Play, Pause, Ban, Check, ChevronsUpDown, Search, ArrowUpDown, FileText, AlertTriangle, Activity } from "lucide-react";
import { format } from 'date-fns';
import { id as idLocale, enUS as enLocale } from 'date-fns/locale';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useQuizStore } from '@/stores/quizStore';
import { batchApi, quizApi, reportApi, classApi, attemptApi } from '@/api/apiClient';
import { ExamBatch, Quiz, BatchStatus, Class, EventLog } from '@/types';

export default function BatchDetailsPage() {
  const { batchId } = useParams<{ batchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { quizzes, fetchQuizzes } = useQuizStore();
  const { t, i18n } = useTranslation();

  const isNew = batchId === 'new';
  const preselectedQuizId = searchParams.get('quizId');

  // Form State
  const [name, setName] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState(preselectedQuizId || '');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [token, setToken] = useState('');
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [allowLate, setAllowLate] = useState(false);
  const [openQuiz, setOpenQuiz] = useState(false);

  // View State
  const [batch, setBatch] = useState<ExamBatch | null>(null);
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Report Enhancement State
  const [activeTab, setActiveTab] = useState('participants');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Class State
  const [classes, setClasses] = useState<Class[]>([]);
  const [openClass, setOpenClass] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');

  const fetchClasses = async () => {
    try {
      const data = await classApi.getAll();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    if (isNew) {
      fetchQuizzes();
      // Auto-generate token
      setToken(Math.random().toString(36).substring(2, 8).toUpperCase());
    } else if (batchId) {
      loadBatch(batchId);
    }
  }, [batchId, isNew]);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);

  // ... (inside loadBatch)
  const loadBatch = async (id: string) => {
    setLoading(true);
    try {
      const [batchData, reportData] = await Promise.all([
        batchApi.getById(id),
        // Ideally we fetch report only if not new, but getById handles errors gracefully usually or we try/catch
        id !== 'new' ? batchApi.getBatchReportsSafe(id) : Promise.resolve(null)
      ]);

      if (batchData) {
        setBatch(batchData);
        // Pre-populate form data for editing
        setName(batchData.name);
        setSelectedQuizId(batchData.quizId);
        setSelectedClassId(batchData.classId || '');
        setStartTime(batchData.startTime.slice(0, 16)); // Format for datetime-local
        setEndTime(batchData.endTime.slice(0, 16));
        setToken(batchData.token);
        setTimeLimit(batchData.duration || 0);
      } else {
        toast({ title: t('batches.not_found'), variant: "destructive" });
        navigate('/batches');
      }

      if (reportData) {
        setReport(reportData);
      }
    } catch (error) {
      toast({ title: t('batches.load_error'), description: String(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (studentId: string) => {
    setLoadingLogs(true);
    try {
      // Ideally we filter by batchId AND studentId at backend, but for now we might fetch all batch logs and filter client side
      // OR assume our apiClient.getEventLogs supports filtering.
      // Based on current backend implementation: api.Get("/reports/logs", handlers.GetEventLogs)
      // We need to check if backend supports studentId filter.
      // If not, we fetch all for batch and filter here.
      // Let's assume we can pass batchId. 
      const allLogs = await reportApi.getEventLogs(batchId);
      // Filter by studentId
      const studentLogs = allLogs.filter(l => l.studentId === studentId);
      setLogs(studentLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast({ title: t('batches.log_load_error'), variant: "destructive" });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !selectedQuizId || !startTime || !endTime) {
      toast({ title: t('batches.form_incomplete'), variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name,
        quizId: selectedQuizId,
        classId: selectedClassId,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        token,
        timeLimit,
        settings: {
          showResult: true,
          shuffleQuestions: true,
          allowLate: allowLate
        }
      };

      if (isEditing && batchId) {
        await batchApi.update(batchId, payload);
        toast({ title: t('batches.update_success') });
        setIsEditing(false);
        loadBatch(batchId); // Reload to show updated view
      } else {
        await batchApi.create(payload);
        toast({ title: t('batches.create_success') });
        navigate('/batches');
      }
    } catch (error) {
      toast({ title: t('batches.save_error'), description: String(error), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (isNew || isEditing) {
    return (
      <DashboardLayout>
        <div className="container mx-auto p-6 max-w-2xl">
          <Button variant="ghost" onClick={() => isEditing ? setIsEditing(false) : navigate(-1)} className="mb-6 pl-0 hover:pl-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isEditing ? t('common.cancel_edit') : t('common.back')}
          </Button>

          <Card>
            <CardHeader>
              <CardTitle>{isEditing ? t('batches.form.edit_title') : t('batches.form.create_title')}</CardTitle>
              <CardDescription>
                {isEditing ? t('batches.form.edit_desc') : t('batches.form.create_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... existing form fields ... */}
                <div className="space-y-2">
                  <Label>{t('batches.form.name_label')}</Label>
                  <Input
                    placeholder={t('batches.form.name_placeholder')}
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>


                <div className="space-y-2">
                  <Label>{t('batches.form.class_label')}</Label>
                  <Popover open={openClass} onOpenChange={setOpenClass}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openClass}
                        className="w-full justify-between"
                      >
                        {selectedClassId
                          ? classes.find((c) => c.id === selectedClassId)?.name
                          : t('batches.form.class_placeholder')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder={t('batches.form.search_class')} />
                        <CommandList>
                          <CommandEmpty>{t('batches.form.class_not_found')}</CommandEmpty>
                          <CommandGroup>
                            {classes.map((c) => (
                              <CommandItem
                                key={c.id}
                                value={c.name}
                                onSelect={() => {
                                  setSelectedClassId(c.id);
                                  setOpenClass(false);
                                  // Auto-fill name if empty
                                  if (!name) {
                                    setName(`Ujian - ${c.name}`);
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedClassId === c.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <p className="text-xs text-muted-foreground">{t('batches.form.class_help')}</p>
                </div>

                <div className="space-y-2">
                  <Label>{t('batches.form.quiz_label')}</Label>
                  <Popover open={openQuiz} onOpenChange={setOpenQuiz}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openQuiz}
                        className="w-full justify-between"
                      >
                        {selectedQuizId
                          ? quizzes.find((q) => q.id === selectedQuizId)?.title
                          : t('batches.form.quiz_placeholder')}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder={t('batches.form.search_quiz')} />
                        <CommandList>
                          <CommandEmpty>{t('batches.form.quiz_not_found')}</CommandEmpty>
                          <CommandGroup>
                            {quizzes.filter(q => q.status === 'active' || !q.status).map((q) => (
                              <CommandItem
                                key={q.id}
                                value={q.title}
                                onSelect={() => {
                                  setSelectedQuizId(q.id);
                                  setOpenQuiz(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedQuizId === q.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {q.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('batches.form.start_time')}</Label>
                    <Input
                      type="datetime-local"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('batches.form.end_time')}</Label>
                    <Input
                      type="datetime-local"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('batches.form.token')}</Label>
                    <div className="flex gap-2">
                      <Input value={token} onChange={e => setToken(e.target.value.toUpperCase())} />
                      <Button type="button" variant="outline" onClick={() => setToken(Math.random().toString(36).substring(2, 8).toUpperCase())}>
                        {t('batches.form.randomize')}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('batches.form.duration')}</Label>
                    <Input
                      type="number"
                      placeholder="0 = Ikuti Quiz"
                      value={timeLimit}
                      onChange={e => setTimeLimit(parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-muted-foreground">{t('batches.form.duration_help')}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="ghost" onClick={() => isEditing ? setIsEditing(false) : navigate('/batches')}>{t('common.cancel')}</Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? t('common.saving') : (isEditing ? t('common.save_changes') : t('batches.form.submit'))}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!batch) return null;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/batches')}
          className="flex items-center gap-2 pl-0"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('batches.back_to_list')}
        </Button>

        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{batch.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                <Badge variant="outline">{batch.status}</Badge>
                <span>{t('batches.token_label')} <span className="font-mono font-bold text-primary">{batch.token}</span></span>
              </div>
            </div>
            {/* Actions */}
            <div className="flex gap-2">
              {batch.status === 'scheduled' && (
                <Button variant="outline" onClick={() => {
                  setIsEditing(true);
                  fetchQuizzes(); // Ensure quiz list is loaded
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  {t('batches.edit_schedule')}
                </Button>
              )}
              <Button variant="outline" onClick={async () => {
                try {
                  const blob = await reportApi.exportBatchReport(batch.id);
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Laporan-${batch.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                } catch (error) {
                  toast({ title: t('batches.export_error'), description: t('batches.export_error_desc'), variant: "destructive" });
                }
              }}>
                <Save className="h-4 w-4 mr-2" />
                {t('batches.export_excel')}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('batches.stats.participants')}</p>
                  <h3 className="text-2xl font-bold">{report?.totalParticipants || 0}</h3>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('batches.stats.schedule')}</p>
                  <p className="font-semibold text-sm">
                    {format(new Date(batch.startTime), "d MMM yyyy, HH:mm", { locale: i18n.language === 'id' ? idLocale : enLocale })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('batches.stats.until')} {format(new Date(batch.endTime), "HH:mm", { locale: i18n.language === 'id' ? idLocale : enLocale })}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('batches.stats.duration')}</p>
                  <h3 className="text-2xl font-bold">
                    {batch.duration} {t('common.minutes')}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="participants">{t('batches.tabs.participants')}</TabsTrigger>
                <TabsTrigger value="logs">{t('batches.tabs.logs')}</TabsTrigger>
              </TabsList>

              <TabsContent value="participants" className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('batches.search_participants')}
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {filteredParticipants.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left cursor-pointer hover:bg-muted-foreground/10" onClick={() => handleSort('studentName')}>
                            <div className="flex items-center gap-1">{t('batches.table.student_name')} <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th className="p-3 text-left cursor-pointer hover:bg-muted-foreground/10" onClick={() => handleSort('status')}>
                            <div className="flex items-center gap-1">{t('batches.table.status')} <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th className="p-3 text-right cursor-pointer hover:bg-muted-foreground/10" onClick={() => handleSort('score')}>
                            <div className="flex items-center justify-end gap-1">{t('batches.table.score')} <ArrowUpDown className="h-3 w-3" /></div>
                          </th>
                          <th className="p-3 text-right">{t('batches.table.submitted_at')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredParticipants.map((attempt: any) => (
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
                              toast({ description: `${t('batches.logs.toast_viewing')} ${attempt.studentName}` });
                            }}
                          >
                            <td className="p-3">{attempt.studentName}</td>
                            <td className="p-3">
                              <Badge variant="outline">{attempt.status}</Badge>
                            </td>
                            <td className="p-3 text-right">{Math.round(attempt.score)}</td>
                            <td className="p-3 text-right">
                              {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString(i18n.language === 'id' ? 'id-ID' : 'en-US') : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed rounded-lg flex items-center justify-center min-h-[200px] text-muted-foreground bg-muted/50">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">{t('common.no_data')}</p>
                      <p>{t('batches.no_participants_found')}</p>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="logs" className="space-y-4 pt-4">
                {!selectedStudent ? (
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-orange-50 border-orange-200">
                    <AlertTriangle className="h-12 w-12 text-orange-500 mb-4" />
                    <h3 className="text-lg font-bold text-orange-700">{t('batches.logs.select_student_title')}</h3>
                    <p className="text-muted-foreground text-center max-w-md mt-2">
                      {t('batches.logs.select_student_desc').split('**')[0]}<strong>{t('batches.tabs.participants')}</strong>{t('batches.logs.select_student_desc').split('**')[2]}
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab('participants')}>
                      {t('batches.logs.back_to_participants')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {t('batches.logs.title')} <span className="text-primary">{selectedStudent.name}</span>
                      </h3>
                      <Button size="sm" variant="ghost" onClick={() => fetchLogs(selectedStudent.id)}>
                        {t('batches.logs.refresh')}
                      </Button>
                    </div>

                    {loadingLogs ? (
                      <div className="p-8 text-center text-muted-foreground">{t('batches.logs.loading')}</div>
                    ) : logs.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="p-3 text-left">{t('batches.logs.table.time')}</th>
                              <th className="p-3 text-left">{t('batches.logs.table.event')}</th>
                              <th className="p-3 text-left">{t('batches.logs.table.detail')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {logs.map((log) => (
                              <tr key={log.id} className="border-t">
                                <td className="p-3 font-mono text-xs">
                                  {format(new Date(log.createdAt), "HH:mm:ss dd/MM/yyyy", { locale: i18n.language === 'id' ? idLocale : enLocale })}
                                </td>
                                <td className="p-3">
                                  <Badge variant={
                                    log.eventType === 'FOCUS_LOST' || log.eventType.includes('ATTEMPT') ? 'destructive' : 'default'
                                  }>
                                    {log.eventType}
                                  </Badge>
                                </td>
                                <td className="p-3 text-muted-foreground">
                                  {log.details}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-8 text-center border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">{t('batches.logs.empty')}</p>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            <Button
              className="ml-2 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => navigate(`/batches/${batchId}/live`)}
            >
              <Activity className="h-4 w-4 mr-2" />
              {t('batches.live_monitor')}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
