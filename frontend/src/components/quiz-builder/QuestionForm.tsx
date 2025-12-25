import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Question, QuestionType, QuestionOption } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: Question | null;
  onSave: (question: Omit<Question, 'id' | 'quizId' | 'orderIndex'>) => void;
}

const defaultOption = (): QuestionOption => ({
  id: `opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  text: '',
  isCorrect: false
});

export function QuestionForm({ open, onOpenChange, question, onSave }: QuestionFormProps) {
  const { t } = useTranslation();
  const [type, setType] = useState<QuestionType>('mcq');
  const [text, setText] = useState('');
  const [points, setPoints] = useState(10);
  const [options, setOptions] = useState<QuestionOption[]>([
    { ...defaultOption(), isCorrect: true },
    defaultOption(),
    defaultOption(),
    defaultOption()
  ]);
  const [explanation, setExplanation] = useState('');

  // Reset form when question changes
  useEffect(() => {
    if (question) {
      setType(question.type);
      setText(question.text);
      setPoints(question.points);
      setOptions(question.options || [
        { ...defaultOption(), isCorrect: true },
        defaultOption(),
        defaultOption(),
        defaultOption()
      ]);
      setExplanation(question.explanation || '');
    } else {
      setType('mcq');
      setText('');
      setPoints(10);
      setOptions([
        { ...defaultOption(), isCorrect: true },
        defaultOption(),
        defaultOption(),
        defaultOption()
      ]);
      setExplanation('');
    }
  }, [question, open]);

  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);
    if (newType === 'true_false') {
      setOptions([
        { id: 'tf-true', text: t('builder.question_form.true'), isCorrect: true },
        { id: 'tf-false', text: t('builder.question_form.false'), isCorrect: false }
      ]);
    } else if (newType === 'mcq' && options.length < 2) {
      setOptions([
        { ...defaultOption(), isCorrect: true },
        defaultOption(),
        defaultOption(),
        defaultOption()
      ]);
    }
  };

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, defaultOption()]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      // Ensure at least one is correct
      if (!newOptions.some(o => o.isCorrect)) {
        newOptions[0].isCorrect = true;
      }
      setOptions(newOptions);
    }
  };

  const handleOptionTextChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text: value };
    setOptions(newOptions);
  };

  const handleCorrectChange = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setOptions(newOptions);
  };

  const handleSave = () => {
    if (!text.trim()) return;

    onSave({
      type,
      text: text.trim(),
      points,
      options: (type === 'mcq' || type === 'true_false') ? options : undefined,
      explanation: explanation.trim() || undefined
    });
    onOpenChange(false);
  };

  const isValid = text.trim() &&
    (type === 'mcq' || type === 'true_false'
      ? options.every(o => o.text.trim()) && options.some(o => o.isCorrect)
      : true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question ? t('builder.question_form.edit_title') : t('builder.question_form.add_title')}
          </DialogTitle>
          <DialogDescription>
            {t('builder.question_form.desc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question Type & Points */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('builder.question_form.type')}</Label>
              <Select value={type} onValueChange={(v) => handleTypeChange(v as QuestionType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mcq">{t('question_type.mcq')}</SelectItem>
                  <SelectItem value="true_false">{t('question_type.true_false')}</SelectItem>
                  <SelectItem value="short_answer">{t('question_type.short_answer')}</SelectItem>
                  <SelectItem value="essay">{t('question_type.essay')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('builder.question_form.points')}</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={points}
                onChange={(e) => setPoints(parseInt(e.target.value) || 10)}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label>{t('builder.question_form.question')}</Label>
            <Textarea
              placeholder={t('builder.question_form.question_placeholder')}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-24"
            />
          </div>

          {/* Options for MCQ */}
          {(type === 'mcq' || type === 'true_false') && (
            <div className="space-y-3">
              <Label>{t('builder.question_form.options')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('builder.question_form.options_help')}
              </p>
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <span className="w-6 text-sm font-medium text-muted-foreground">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <Input
                    placeholder={`${t('builder.question_form.option_placeholder')} ${String.fromCharCode(65 + index)}`}
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                    className={cn(
                      "flex-1",
                      option.isCorrect && "border-chart-2 bg-chart-2/5"
                    )}
                    disabled={type === 'true_false'}
                  />
                  <Button
                    type="button"
                    variant={option.isCorrect ? "default" : "ghost"}
                    size="icon"
                    onClick={() => handleCorrectChange(index)}
                    className={cn(
                      option.isCorrect && "bg-chart-2 hover:bg-chart-2/90"
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                  {type === 'mcq' && options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              {type === 'mcq' && options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddOption}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('builder.question_form.add_option')}
                </Button>
              )}
            </div>
          )}

          {/* Explanation */}
          <div className="space-y-2">
            <Label>{t('builder.question_form.explanation')}</Label>
            <Textarea
              placeholder={t('builder.question_form.explanation_placeholder')}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="min-h-20"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('builder.question_form.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {question ? t('builder.question_form.save') : t('builder.question_form.add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
