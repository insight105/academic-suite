import { useQuizStore } from '@/stores/quizStore';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AutosaveIndicator() {
  const { isSaving, localAnswers } = useQuizStore();
  const savedCount = Object.keys(localAnswers).length;

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm transition-all",
      isSaving ? "text-chart-1" : "text-muted-foreground"
    )}>
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Menyimpan...</span>
        </>
      ) : savedCount > 0 ? (
        <>
          <Cloud className="h-4 w-4" />
          <span>{savedCount} jawaban tersimpan</span>
        </>
      ) : (
        <>
          <CloudOff className="h-4 w-4" />
          <span>Belum ada jawaban</span>
        </>
      )}
    </div>
  );
}
