import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, FileQuestion, GraduationCap, AlertCircle, Printer, Download } from "lucide-react";
import { useQuizStore } from '@/stores/quizStore';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";


import { useTranslation } from 'react-i18next';

const QuizDetailsPage = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const { currentQuiz, fetchQuizById, isLoading, error } = useQuizStore();
    const { t } = useTranslation();

    useEffect(() => {
        if (quizId) {
            fetchQuizById(quizId);
        }
    }, [quizId]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportCSV = () => {
        if (!currentQuiz) return;

        // Header
        const headers = [t('common.no'), t('details.question_list'), t('builder.labels.type'), t('details.total_points'), t('common.option'), t('details.correct_answer'), t('details.explanation')];
        const rows = [headers.join(',')];

        // Rows
        currentQuiz.questions.forEach((q, index) => {
            // Helper to escape CSV fields
            const escape = (text: string) => `"${(text || '').replace(/"/g, '""')}"`;

            // Strip HTML from text
            const cleanText = q.text.replace(/<[^>]+>/g, '');

            // Format Options
            const options = q.options?.map(o => `${o.text} (${o.isCorrect ? t('details.correct') : ''})`).join('; ') || '';
            const correctOption = q.options?.find(o => o.isCorrect)?.text || q.correctAnswer || '';

            rows.push([
                index + 1,
                escape(cleanText),
                escape(t(`question_type.${q.type}`)),
                q.points,
                escape(options),
                escape(correctOption),
                escape(q.explanation)
            ].join(','));
        });

        // Download
        const csvContent = "data:text/csv;charset=utf-8," + rows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `quiz_${currentQuiz.title.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="container mx-auto p-6 space-y-6">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-12 w-full max-w-2xl" />
                    <div className="grid gap-4 md:grid-cols-3">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error || !currentQuiz) {
        return (
            <DashboardLayout>
                <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                    <h2 className="text-xl font-bold mb-2">{t('details.not_found')}</h2>
                    <p className="text-muted-foreground mb-4">{error || t('details.data_unavailable')}</p>
                    <Button onClick={() => navigate('/quizzes')}>{t('quizzes.actions.back_to_list')}</Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-content, .print-content * {
                        visibility: visible;
                    }
                    .print-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
            <div className="container mx-auto p-6 space-y-6 print-content">
                <div className="flex items-center justify-between no-print">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/quizzes')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t('quizzes.actions.back_to_list')}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExportCSV}>
                            <Download className="h-4 w-4 mr-2" />
                            {t('quizzes.actions.export_csv')}
                        </Button>
                        <Button onClick={handlePrint}>
                            <Printer className="h-4 w-4 mr-2" />
                            {t('quizzes.actions.print_pdf')}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="border-b pb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">{currentQuiz.title}</h1>
                            <Badge variant="outline" className="text-base px-3 py-1 capitalize">
                                {t(`exam_type.${currentQuiz.examType}`)}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground">{currentQuiz.description || t('details.no_description')}</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <FileQuestion className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('details.total_questions')}</p>
                                    <h3 className="text-2xl font-bold">{currentQuiz.questions?.length || 0}</h3>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <Clock className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('details.total_points')}</p>
                                    <h3 className="text-2xl font-bold">{currentQuiz.totalPoints}</h3>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-full">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">{t('details.kkm')}</p>
                                    <h3 className="text-2xl font-bold">{currentQuiz.passingScore}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <FileQuestion className="h-5 w-5" />
                            {t('details.question_list')}
                        </h2>

                        {currentQuiz.questions && currentQuiz.questions.length > 0 ? (
                            <div className="grid gap-4">
                                {currentQuiz.questions.sort((a, b) => a.orderIndex - b.orderIndex).map((question, index) => (
                                    <Card key={question.id} className="overflow-hidden">
                                        <CardHeader className="bg-muted/30 py-4">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                    <Badge variant="secondary" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                                                        {index + 1}
                                                    </Badge>
                                                    <span className="capitalize">{t(`question_type.${question.type}`)}</span>
                                                </CardTitle>
                                                <Badge variant="outline">{t('quizzes.card.points', { count: question.points })}</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-4">
                                            <div className="text-base font-medium" dangerouslySetInnerHTML={{ __html: question.text }} />

                                            {question.options && question.options.length > 0 && (
                                                <div className="grid gap-2 mt-4 ml-4">
                                                    {question.options.map((option) => (
                                                        <div
                                                            key={option.id}
                                                            className={`p-3 rounded-lg border ${option.isCorrect ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-card border-border'}`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`mt-0.5 h-4 w-4 rounded-full border ${option.isCorrect ? 'border-green-500 bg-green-500' : 'border-muted-foreground'}`} />
                                                                <span className={option.isCorrect ? 'font-medium text-green-700 dark:text-green-300' : ''}>
                                                                    {option.text}
                                                                </span>
                                                                {option.isCorrect && (
                                                                    <Badge className="ml-auto bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                                                                        {t('details.correct_answer')}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {question.explanation && (
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-4 text-sm">
                                                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">{t('details.explanation')}</p>
                                                    <p className="text-blue-600 dark:text-blue-200">{question.explanation}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg">
                                <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium">{t('details.no_questions')}</h3>
                                <p className="text-muted-foreground mb-4">{t('details.no_questions_desc')}</p>
                                <Button onClick={() => navigate(`/quizzes/${quizId}/edit`)}>
                                    {t('quizzes.actions.add_question')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default QuizDetailsPage;
