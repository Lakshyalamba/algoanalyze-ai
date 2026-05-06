import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

type StepControlsProps = {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPrevious: () => void;
  onNext: () => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
};

const buttonClass =
  'inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800';

export function StepControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onPrevious,
  onNext,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
}: StepControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onPrevious} disabled={currentStepIndex === 0} className={buttonClass} aria-label="Previous step">
          <SkipBack className="h-4 w-4" aria-hidden="true" />
          Previous
        </button>
        {isPlaying ? (
          <button type="button" onClick={onPause} className={buttonClass} aria-label="Pause visualizer">
            <Pause className="h-4 w-4" aria-hidden="true" />
            Pause
          </button>
        ) : (
          <button type="button" onClick={onPlay} disabled={totalSteps <= 1} className={buttonClass} aria-label="Play visualizer">
            <Play className="h-4 w-4" aria-hidden="true" />
            Play
          </button>
        )}
        <button type="button" onClick={onNext} disabled={currentStepIndex >= totalSteps - 1} className={buttonClass} aria-label="Next step">
          <SkipForward className="h-4 w-4" aria-hidden="true" />
          Next
        </button>
        <button type="button" onClick={onReset} className={buttonClass} aria-label="Reset visualizer">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        Speed
        <select
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </label>
    </div>
  );
}
