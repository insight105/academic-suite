import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Edit, Trash2, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableQuestionProps {
  question: Question;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onPreview: () => void;
}



const typeColors: Record<string, string> = {
  mcq: 'bg-primary/10 text-primary',
  true_false: 'bg-chart-2/10 text-chart-2',
  short_answer: 'bg-chart-1/10 text-chart-1',
  essay: 'bg-chart-3/10 text-chart-3'
};

export function SortableQuestion({
  question,
  index,
  onEdit,
  onDelete,
  onPreview
}: SortableQuestionProps) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card border border-border rounded-lg p-4 flex items-start gap-3 group animate-fade-in",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary"
      )}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1 rounded hover:bg-accent cursor-grab active:cursor-grabbing text-muted-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Question Number */}
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-semibold text-primary">{index + 1}</span>
      </div>

      {/* Question Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge className={typeColors[question.type]}>
            {t(`question_type.${question.type}`)}
          </Badge>
          <span className="text-xs text-muted-foreground">{question.points} {t('builder.question_form.points')}</span>
        </div>
        <p className="text-foreground line-clamp-2">{question.text}</p>
        {question.options && question.options.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {question.options.slice(0, 4).map((opt, i) => (
              <span
                key={opt.id}
                className={cn(
                  "text-xs px-2 py-0.5 rounded",
                  opt.isCorrect
                    ? "bg-chart-2/10 text-chart-2"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {String.fromCharCode(65 + i)}. {opt.text.slice(0, 20)}{opt.text.length > 20 ? '...' : ''}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" onClick={onPreview}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
