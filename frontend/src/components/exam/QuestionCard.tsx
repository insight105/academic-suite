import { Question, Answer } from '@/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  answer?: Answer;
  onAnswerChange: (answer: Partial<Answer>) => void;
  disabled?: boolean;
}

export const QuestionCard = memo(function QuestionCard({
  question,
  questionNumber,
  answer,
  onAnswerChange,
  disabled = false
}: QuestionCardProps) {
  const handleOptionSelect = (optionId: string) => {
    if (disabled) return;
    onAnswerChange({ selectedOptionId: optionId });
  };

  const handleTextChange = (text: string) => {
    if (disabled) return;
    onAnswerChange({ textAnswer: text });
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      {/* Question Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-semibold">{questionNumber}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase">
              {question.type === 'mcq' ? 'Pilihan Ganda' : 
               question.type === 'true_false' ? 'Benar/Salah' :
               question.type === 'short_answer' ? 'Jawaban Singkat' : 'Essay'}
            </span>
            <span className="text-xs text-muted-foreground">• {question.points} poin</span>
          </div>
          <p className="text-foreground text-lg leading-relaxed">{question.text}</p>
        </div>
      </div>

      {/* Answer Options */}
      {(question.type === 'mcq' || question.type === 'true_false') && question.options && (
        <RadioGroup
          value={answer?.selectedOptionId || ''}
          onValueChange={handleOptionSelect}
          disabled={disabled}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={option.id}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer",
                answer?.selectedOptionId === option.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent/50",
                disabled && "cursor-not-allowed opacity-60"
              )}
              onClick={() => !disabled && handleOptionSelect(option.id)}
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <Label 
                htmlFor={option.id} 
                className="flex-1 cursor-pointer font-normal"
              >
                <span className="font-medium text-muted-foreground mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {/* Text Answer */}
      {(question.type === 'short_answer' || question.type === 'essay') && (
        <Textarea
          placeholder={question.type === 'short_answer' 
            ? "Tulis jawaban singkat Anda..." 
            : "Tulis essay Anda..."}
          value={answer?.textAnswer || ''}
          onChange={(e) => handleTextChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "min-h-32 resize-none",
            question.type === 'essay' && "min-h-48"
          )}
        />
      )}
    </div>
  );
});
