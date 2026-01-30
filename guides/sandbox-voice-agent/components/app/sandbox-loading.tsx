import { STATUS_MESSAGES, type SandboxCreationStatus } from '@/hooks/useSandboxCreation';

interface SandboxLoadingProps {
  status: SandboxCreationStatus;
  progress: number;
  error?: string | null;
  progressMessage?: string;
  quote?: string;
  onRetry?: () => void;
}

export function SandboxLoading({
  status,
  progress,
  error,
  progressMessage,
  quote,
  onRetry,
}: SandboxLoadingProps) {
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-destructive text-center">
          <svg
            className="mx-auto mb-4 size-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-semibold">Failed to prepare agent</p>
          {error && <p className="text-muted-foreground mt-2 text-sm">{error}</p>}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-md px-6 py-2 text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Animated spinner */}
      <div className="relative size-20">
        <svg className="size-20 animate-spin" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold">{progress}%</span>
        </div>
      </div>

      {/* Status message */}
      <div className="text-center">
        <p className="text-foreground text-lg font-medium">{STATUS_MESSAGES[status]}</p>
        {progressMessage && (
          <p className="text-muted-foreground mt-2 text-sm font-medium">{progressMessage}</p>
        )}
        <p className="text-muted-foreground mt-1 text-xs">This usually takes 30-60 seconds...</p>
      </div>

      {/* Progress bar */}
      <div className="bg-secondary h-2 w-64 overflow-hidden rounded-full">
        <div
          className="bg-primary h-full transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Inspirational quote */}
      {quote && (
        <div className="text-muted-foreground animate-fade-in mt-6 max-w-md text-center">
          <p className="text-sm leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
