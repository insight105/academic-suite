import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { useQuizStore } from '@/stores/quizStore';
import { Question, ExamType } from '@/types';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SortableQuestion } from '@/components/quiz-builder/SortableQuestion';
import { QuestionForm } from '@/components/quiz-builder/QuestionForm';
import { QuestionPreview } from '@/components/quiz-builder/QuestionPreview';
import { ImportQuestions } from '@/components/quiz-builder/ImportQuestions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Plus,
  FileUp,
  Save,
  ArrowLeft,
  BookOpen,
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Status = 'active' | 'inactive';

export default function QuizBuilderPage() {
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { currentQuiz, fetchQuizById, createQuiz, updateQuiz, isLoading } = useQuizStore();
  const { toast } = useToast();
  const { t } = useTranslation();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>('active');
  const [examType, setExamType] = useState<ExamType>('daily_quiz');
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Modal state
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load existing quiz if editing
  useEffect(() => {
    if (quizId && quizId !== 'new') {
      fetchQuizById(quizId).then((quiz) => {
        if (quiz) {
          setTitle(quiz.title);
          setDescription(quiz.description);
          setExamType(quiz.examType);
          setPassingScore(quiz.passingScore);
          setQuestions(quiz.questions);
        }
      });
    }
  }, [quizId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id);
      const newIndex = questions.findIndex(q => q.id === over.id);

      const newQuestions = arrayMove(questions, oldIndex, newIndex).map((q, idx) => ({
        ...q,
        orderIndex: idx
      }));

      setQuestions(newQuestions);
    }
  };

  const handleAddQuestion = (data: Omit<Question, 'id' | 'quizId' | 'orderIndex'>) => {
    const newQuestion: Question = {
      ...data,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      quizId: quizId || 'new',
      orderIndex: questions.length
    };
    setQuestions([...questions, newQuestion]);
    toast({ title: t('builder.toast.question_added') });
  };

  const handleEditQuestion = (data: Omit<Question, 'id' | 'quizId' | 'orderIndex'>) => {
    if (!editingQuestion) return;

    const updatedQuestions = questions.map(q =>
      q.id === editingQuestion.id
        ? { ...q, ...data }
        : q
    );
    setQuestions(updatedQuestions);
    setEditingQuestion(null);
    toast({ title: t('builder.toast.question_updated') });
  };

  const handleDeleteQuestion = () => {
    if (!deletingQuestionId) return;

    const updatedQuestions = questions
      .filter(q => q.id !== deletingQuestionId)
      .map((q, idx) => ({ ...q, orderIndex: idx }));

    setQuestions(updatedQuestions);
    setDeletingQuestionId(null);
    setShowDeleteConfirm(false);
    toast({ title: t('builder.toast.question_deleted') });
  };

  const handleImport = (importedQuestions: Omit<Question, 'id' | 'quizId' | 'orderIndex'>[]) => {
    const newQuestions = importedQuestions.map((q, idx) => ({
      ...q,
      id: `q-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 9)}`,
      quizId: quizId || 'new',
      orderIndex: questions.length + idx
    }));
    setQuestions([...questions, ...newQuestions]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast({ title: t('builder.validation.title_required'), variant: "destructive" });
      return;
    }
    if (questions.length === 0) {
      toast({ title: t('builder.validation.min_question'), variant: "destructive" });
      return;
    }

    setIsSaving(true);

    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

    const quizData = {
      title: title.trim(),
      description: description.trim(),
      examType,
      totalPoints,
      passingScore,
      questions,
      createdBy: user?.id || '',
      status: status
    };

    try {
      if (quizId && quizId !== 'new') {
        await updateQuiz(quizId, quizData);
        toast({ title: t('builder.toast.success_update') });
      } else {
        await createQuiz(quizData);
        toast({ title: t('builder.toast.success_create') });
      }
      navigate('/quizzes');
    } catch (error) {
      toast({
        title: t('builder.toast.save_fail'),
        description: error instanceof Error ? error.message : t('common.error_default'),
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/quizzes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {quizId && quizId !== 'new' ? t('builder.edit_title') : t('builder.create_title')}
            </h1>
            <p className="text-muted-foreground text-sm">
              {t('builder.subtitle')}
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {t('quizzes.actions.save_quiz')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quiz Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">{t('builder.info_title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('builder.labels.title')} *</Label>
                <Input
                  id="title"
                  placeholder={t('builder.placeholders.title')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t('builder.labels.desc')}</Label>
                <Textarea
                  id="description"
                  placeholder={t('builder.placeholders.desc')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('builder.labels.type')}</Label>
                <Select value={examType} onValueChange={(v) => setExamType(v as ExamType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily_quiz">{t('quizzes.exam_type.daily_quiz')}</SelectItem>
                    <SelectItem value="midterm">{t('quizzes.exam_type.midterm')}</SelectItem>
                    <SelectItem value="final">{t('quizzes.exam_type.final')}</SelectItem>
                    <SelectItem value="practice">{t('quizzes.exam_type.practice')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passingScore">{t('builder.labels.kkm')}</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min={0}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('builder.labels.status')}</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('batches.status.active')}</SelectItem>
                    <SelectItem value="inactive">{t('batches.status.inactive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">{t('builder.stats_title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-accent/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-foreground">{questions.length}</p>
                  <p className="text-xs text-muted-foreground">{t('details.total_questions')}</p>
                </div>
                <div className="p-3 bg-accent/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-foreground">{totalPoints}</p>
                  <p className="text-xs text-muted-foreground">{t('details.total_points')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Questions */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{t('details.question_list')}</CardTitle>
                    <CardDescription>
                      {t('builder.drag_drop')}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => {
                    const template = [
                      {
                        question: 'Berapakah hasil dari 2 + 2?',
                        type: 'mcq',
                        points: '10',
                        optionA: '3',
                        optionB: '4',
                        optionC: '5',
                        optionD: '6',
                        correctAnswer: 'B',
                        explanation: '2 + 2 = 4'
                      },
                      {
                        question: 'Matahari terbit dari arah Timur',
                        type: 'true_false',
                        points: '5',
                        optionA: 'Benar',
                        optionB: 'Salah',
                        optionC: '',
                        optionD: '',
                        correctAnswer: 'A',
                        explanation: 'Matahari selalu terbit dari arah Timur'
                      },
                      {
                        question: 'Jelaskan proses fotosintesis secara singkat.',
                        type: 'essay',
                        points: '20',
                        optionA: '',
                        optionB: '',
                        optionC: '',
                        optionD: '',
                        correctAnswer: '',
                        explanation: 'Fotosintesis adalah proses...'
                      }
                    ];
                    import('xlsx').then(XLSX => {
                      const ws = XLSX.utils.json_to_sheet(template);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, 'Questions');
                      XLSX.writeFile(wb, 'template_soal.xlsx');
                    });
                  }}>

                    <Download className="h-4 w-4 mr-2" />
                    {t('quizzes.actions.download_template')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowImportModal(true)}>
                    <FileUp className="h-4 w-4 mr-2" />
                    {t('quizzes.actions.import')}
                  </Button>
                  <Button onClick={() => {
                    setEditingQuestion(null);
                    setShowQuestionForm(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('quizzes.actions.add_question')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={questions.map(q => q.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {questions.map((question, index) => (
                        <SortableQuestion
                          key={question.id}
                          question={question}
                          index={index}
                          onEdit={() => {
                            setEditingQuestion(question);
                            setShowQuestionForm(true);
                          }}
                          onDelete={() => {
                            setDeletingQuestionId(question.id);
                            setShowDeleteConfirm(true);
                          }}
                          onPreview={() => {
                            setPreviewQuestion(question);
                            setShowPreview(true);
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{t('builder.empty_title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('builder.empty_desc')}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => {
                      // Reuse template logic or just open modal and auto trigger? 
                      // Better: Just add the function here to generate file directly
                      const template = [
                        {
                          question: 'Berapakah hasil dari 2 + 2?',
                          type: 'mcq',
                          points: '10',
                          optionA: '3',
                          optionB: '4',
                          optionC: '5',
                          optionD: '6',
                          correctAnswer: 'B',
                          explanation: '2 + 2 = 4'
                        },
                        {
                          question: 'Matahari terbit dari arah Timur',
                          type: 'true_false',
                          points: '5',
                          optionA: 'Benar',
                          optionB: 'Salah',
                          optionC: '',
                          optionD: '',
                          correctAnswer: 'A',
                          explanation: 'Matahari selalu terbit dari arah Timur'
                        },
                        {
                          question: 'Jelaskan proses fotosintesis secara singkat.',
                          type: 'essay',
                          points: '20',
                          optionA: '',
                          optionB: '',
                          optionC: '',
                          optionD: '',
                          correctAnswer: '',
                          explanation: 'Fotosintesis adalah proses...'
                        }
                      ];
                      import('xlsx').then(XLSX => {
                        const ws = XLSX.utils.json_to_sheet(template);
                        const wb = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(wb, ws, 'Questions');
                        XLSX.writeFile(wb, 'template_soal.xlsx');
                      });
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      {t('quizzes.actions.download_template')}
                    </Button>
                    <Button variant="outline" onClick={() => setShowImportModal(true)}>
                      <FileUp className="h-4 w-4 mr-2" />
                      {t('quizzes.actions.import_file')}
                    </Button>
                    <Button onClick={() => {
                      setEditingQuestion(null);
                      setShowQuestionForm(true);
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      {t('quizzes.actions.add_question')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Question Form Modal */}
      <QuestionForm
        open={showQuestionForm}
        onOpenChange={(open) => {
          setShowQuestionForm(open);
          if (!open) setEditingQuestion(null);
        }}
        question={editingQuestion}
        onSave={editingQuestion ? handleEditQuestion : handleAddQuestion}
      />

      {/* Question Preview Modal */}
      <QuestionPreview
        open={showPreview}
        onOpenChange={setShowPreview}
        question={previewQuestion}
        questionNumber={previewQuestion ? questions.findIndex(q => q.id === previewQuestion.id) + 1 : 0}
      />

      {/* Import Modal */}
      <ImportQuestions
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImport={handleImport}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              {t('builder.delete_dialog.title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('builder.delete_dialog.desc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('builder.delete_dialog.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuestion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('builder.delete_dialog.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout >
  );
}
