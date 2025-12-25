import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuizStore } from '@/stores/quizStore';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  BookOpen,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  FileText,
  Archive,
  RotateCcw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { quizApi } from '@/api/apiClient';
import { useToast } from '@/hooks/use-toast';

const examTypeColors: Record<string, string> = {
  daily_quiz: 'bg-chart-1/10 text-chart-1',
  midterm: 'bg-chart-2/10 text-chart-2',
  final: 'bg-primary/10 text-primary',
  practice: 'bg-chart-3/10 text-chart-3'
};

export default function QuizzesPage() {
  const { quizzes, fetchQuizzes, isLoading } = useQuizStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await quizApi.update(id, { status: newStatus });
      await quizApi.update(id, { status: newStatus });
      toast({ title: newStatus === 'active' ? t('quizzes.actions.toast_activate') : t('quizzes.actions.toast_archive') });
      fetchQuizzes();
    } catch (error) {
      console.error("Failed to update status", error);
      toast({ title: t('quizzes.actions.toast_fail'), variant: "destructive" });
    }
  };

  const activeQuizzes = quizzes.filter(q => !q.status || q.status === 'active');
  const inactiveQuizzes = quizzes.filter(q => q.status === 'inactive');
  // 'draft' logic can be added later if needed

  const QuizGrid = ({ items, isArchived }: { items: typeof quizzes, isArchived?: boolean }) => (
    items.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((quiz) => (
          <Card key={quiz.id} className="border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">

                <Badge className={examTypeColors[quiz.examType]}>
                  {t(`exam_type.${quiz.examType}`)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link to={`/quizzes/${quiz.id}/edit`}>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        {t('quizzes.actions.edit')}
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      {t('quizzes.actions.duplicate')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isArchived ? (
                      <DropdownMenuItem onClick={() => handleStatusChange(quiz.id, 'active')}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {t('quizzes.actions.reactivate')}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleStatusChange(quiz.id, 'inactive')}>
                        <Archive className="h-4 w-4 mr-2" />
                        {t('quizzes.actions.archive')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('quizzes.actions.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-lg mt-2">{quiz.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {quiz.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {t('quizzes.card.questions', { count: quiz.questions.length })}
                </span>
                <span>{t('quizzes.card.points', { count: quiz.totalPoints })}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t('quizzes.card.passing_score', { score: quiz.passingScore })}</span>
                <span>
                  {new Date(quiz.updatedAt).toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex gap-2">
                <Link to={`/quizzes/${quiz.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    {t('quizzes.actions.view_detail')}
                  </Button>
                </Link>
                {!isArchived && (
                  <Link to={`/batches/new?quizId=${quiz.id}`}>
                    <Button size="sm">
                      {t('quizzes.actions.schedule')}
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <Card className="border-border">
        <CardContent className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            {isArchived ? t('quizzes.empty.archive_title') : t('quizzes.empty.title')}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {isArchived ? t('quizzes.empty.archive_desc') : t('quizzes.empty.desc')}
          </p>
          {!isArchived && (
            <Link to="/quizzes/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t('quizzes.create_new')}
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    )
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('quizzes.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('quizzes.desc')}
          </p>
        </div>
        <Link to="/quizzes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t('quizzes.create_new')}
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">{t('quizzes.tabs.active')} ({activeQuizzes.length})</TabsTrigger>
          <TabsTrigger value="inactive">{t('quizzes.tabs.archive')} ({inactiveQuizzes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <QuizGrid items={activeQuizzes} />
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <QuizGrid items={inactiveQuizzes} isArchived />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
