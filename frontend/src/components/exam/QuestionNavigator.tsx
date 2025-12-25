import { cn } from '@/lib/utils';
import { Question, Answer } from '@/types';
import { Check, Circle } from 'lucide-react';
import { memo } from 'react';

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, Answer>;
  onNavigate: (index: number) => void;
}

export const QuestionNavigator = memo(function QuestionNavigator({
  questions,
  currentIndex,
  answers,
  onNavigate
}: QuestionNavigatorProps) {
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="bg-card rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Navigasi Soal</h3>
        <span className="text-sm text-muted-foreground">
          {answeredCount}/{questions.length} dijawab
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => {
          const isAnswered = !!answers[question.id];
          const isCurrent = index === currentIndex;

          return (
            <button
              key={question.id}
              onClick={() => onNavigate(index)}
              className={cn(
                "w-full aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all",
                isCurrent 
                  ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : isAnswered
                    ? "bg-chart-2/20 text-chart-2 hover:bg-chart-2/30"
                    : "bg-accent text-muted-foreground hover:bg-accent/80"
              )}
            >
              {isAnswered ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Sekarang</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-chart-2/20" />
          <span>Dijawab</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-accent" />
          <span>Belum</span>
        </div>
      </div>
    </div>
  );
});
