import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Question, QuestionOption } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface ImportQuestionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (questions: Omit<Question, 'id' | 'quizId' | 'orderIndex'>[]) => void;
}

interface ParsedRow {
  question: string;
  type: string;
  points: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
  explanation?: string;
}

export function ImportQuestions({ open, onOpenChange, onImport }: ImportQuestionsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setErrors([]);
    setParsedData([]);

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'csv') {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            processData(results.data as ParsedRow[]);
          },
          error: (error) => {
            setErrors([t('builder.import.errors.parse_csv', { error: error.message })]);
          }
        });
      } else if (extension === 'xlsx' || extension === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet) as ParsedRow[];
            processData(jsonData);
          } catch (error) {
            setErrors([t('builder.import.errors.parse_excel', { error: String(error) })]);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrors([t('builder.import.errors.file_format')]);
      }
    } catch (error) {
      setErrors([t('builder.import.errors.read_error', { error: String(error) })]);
    } finally {
      setIsProcessing(false);
    }
  };

  const processData = (data: ParsedRow[]) => {
    const validationErrors: string[] = [];
    const validRows: ParsedRow[] = [];

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 because of header and 0-index

      if (!row.question?.trim()) {
        validationErrors.push(t('builder.import.errors.empty_question', { row: rowNum }));
        return;
      }

      if (!row.type || !['mcq', 'true_false', 'short_answer', 'essay'].includes(row.type.toLowerCase())) {
        validationErrors.push(t('builder.import.errors.invalid_type', { row: rowNum, type: row.type }));
        return;
      }

      if (row.type.toLowerCase() === 'mcq' || row.type.toLowerCase() === 'true_false') {
        if (!row.optionA?.trim() || !row.optionB?.trim()) {
          validationErrors.push(t('builder.import.errors.min_options', { row: rowNum }));
          return;
        }
        if (!row.correctAnswer?.trim()) {
          validationErrors.push(t('builder.import.errors.no_correct', { row: rowNum }));
          return;
        }
      }

      validRows.push(row);
    });

    setErrors(validationErrors);
    setParsedData(validRows);
    setIsProcessing(false);
  };

  const handleImport = () => {
    const questions: Omit<Question, 'id' | 'quizId' | 'orderIndex'>[] = parsedData.map((row) => {
      const type = row.type.toLowerCase() as Question['type'];
      const correctAnswer = row.correctAnswer?.toUpperCase();

      let options: QuestionOption[] | undefined;

      if (type === 'mcq' || type === 'true_false') {
        const optionTexts = [row.optionA, row.optionB, row.optionC, row.optionD].filter(Boolean);
        options = optionTexts.map((text, index) => ({
          id: `opt-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
          text: text || '',
          isCorrect: String.fromCharCode(65 + index) === correctAnswer
        }));
      }

      return {
        type,
        text: row.question,
        points: parseInt(row.points) || 10,
        options,
        explanation: row.explanation
      };
    });

    onImport(questions);
    toast({
      title: t('builder.import.success_title'),
      description: t('builder.import.success_desc', { count: questions.length })
    });
    onOpenChange(false);
    setParsedData([]);
    setErrors([]);
  };

  const handleDownloadTemplate = () => {
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

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions');
    XLSX.writeFile(wb, 'template_soal.xlsx');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {t('builder.import.title')}
          </DialogTitle>
          <DialogDescription>
            {t('builder.import.desc')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Download Template */}
          <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">{t('builder.import.download_template')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('builder.import.download_desc')}
              </p>
            </div>
            <Button variant="outline" onClick={handleDownloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              {t('builder.import.download_template')}
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label>{t('builder.import.upload_label')}</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-foreground font-medium">
                {t('builder.import.drag_drop')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {t('builder.import.format_info')}
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.slice(0, 5).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {errors.length > 5 && (
                    <li>{t('builder.import.more_count', { count: errors.length - 5 })}</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview */}
          {parsedData.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-chart-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">{t('builder.import.valid_count', { count: parsedData.length })}</span>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>{t('builder.question_form.question')}</TableHead>
                      <TableHead className="w-24">{t('builder.labels.type')}</TableHead>
                      <TableHead className="w-16">{t('builder.question_form.points')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.slice(0, 10).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="max-w-md truncate">{row.question}</TableCell>
                        <TableCell className="uppercase text-xs">{row.type}</TableCell>
                        <TableCell>{row.points || 10}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {parsedData.length > 10 && (
                  <div className="p-3 text-center text-sm text-muted-foreground bg-accent/50">
                    {t('builder.import.more_count', { count: parsedData.length - 10 })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Format Guide */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2">{t('builder.import.columns.title')}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>question</strong> - {t('builder.import.columns.headers.question')}</li>
              <li><strong>type</strong> - {t('builder.import.columns.headers.type')}</li>
              <li><strong>points</strong> - {t('builder.import.columns.headers.points')}</li>
              <li><strong>optionA, optionB, optionC, optionD</strong> - {t('builder.import.columns.headers.options')}</li>
              <li><strong>correctAnswer</strong> - {t('builder.import.columns.headers.correct')}</li>
              <li><strong>explanation</strong> - {t('builder.import.columns.headers.explanation')}</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('builder.import.cancel')}
          </Button>
          <Button
            onClick={handleImport}
            disabled={parsedData.length === 0 || isProcessing}
          >
            {t('builder.import.import_btn', { count: parsedData.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
