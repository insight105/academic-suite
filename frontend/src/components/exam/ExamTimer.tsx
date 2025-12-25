import { useEffect, useRef } from 'react';
import { useQuizStore } from '@/stores/quizStore';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExamTimerProps {
  onTimeUp: () => void;
}

export function ExamTimer({ onTimeUp }: ExamTimerProps) {
  const { remainingTime, decrementTimer, syncServerTime, currentAttempt } = useQuizStore();
  const syncIntervalRef = useRef<NodeJS.Timeout>();
  const timerIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Decrement local timer every second
    timerIntervalRef.current = setInterval(() => {
      decrementTimer();
    }, 1000);

    // Sync with server every 30 seconds
    syncIntervalRef.current = setInterval(() => {
      syncServerTime();
    }, 30000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (remainingTime <= 0 && currentAttempt?.status === 'ACTIVE') {
      onTimeUp();
    }
  }, [remainingTime, currentAttempt?.status, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isWarning = remainingTime <= 300 && remainingTime > 60; // 5 minutes
  const isCritical = remainingTime <= 60; // 1 minute

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg transition-colors",
        isCritical
          ? "bg-destructive text-destructive-foreground animate-pulse"
          : isWarning
            ? "bg-chart-1/20 text-chart-1"
            : "bg-card text-foreground"
      )}
    >
      {isCritical ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <Clock className="h-5 w-5" />
      )}
      <span className="font-semibold">{formatTime(remainingTime)}</span>
    </div>
  );
}
