import { useTranslation } from 'react-i18next';
import { Question } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface QuestionPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  questionNumber: number;
}



export function QuestionPreview({ open, onOpenChange, question, questionNumber }: QuestionPreviewProps) {
  const { t } = useTranslation();
  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">{questionNumber}</span>
            </div>
            {t('builder.preview.title')}
          </DialogTitle>
          <DialogDescription>
            {t('builder.preview.desc')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Question Info */}
          <div className="flex items-center gap-2">
            <Badge variant="outline">{t(`question_type.${question.type}`)}</Badge>
            <span className="text-sm text-muted-foreground">{question.points} {t('builder.question_form.points')}</span>
          </div>

          {/* Question Text */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <p className="text-lg text-foreground leading-relaxed">{question.text}</p>
          </div>

          {/* Answer Options */}
          {(question.type === 'mcq' || question.type === 'true_false') && question.options && (
            <RadioGroup className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
                    option.isCorrect
                      ? "border-chart-2 bg-chart-2/10"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  )}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    checked={option.isCorrect}
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal">
                    <span className="font-medium text-muted-foreground mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option.text}
                    {option.isCorrect && (
                      <span className="ml-2 text-xs text-chart-2 font-medium">
                        {t('builder.preview.correct_answer')}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Text Answer */}
          {(question.type === 'short_answer' || question.type === 'essay') && (
            <Textarea
              placeholder={
                question.type === 'short_answer'
                  ? t('builder.preview.short_answer_placeholder')
                  : t('builder.preview.essay_placeholder')
              }
              disabled
              className={cn(
                "resize-none",
                question.type === 'essay' && "min-h-32"
              )}
            />
          )}

          {/* Explanation */}
          {question.explanation && (
            <div className="bg-chart-1/10 rounded-lg p-4 border border-chart-1/20">
              <h4 className="font-medium text-chart-1 mb-1">{t('builder.preview.explanation')}</h4>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t('builder.preview.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
