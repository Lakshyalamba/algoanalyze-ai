import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { AnalysisStep } from '../../types/analysis';
import { ArrayVisualizer } from './ArrayVisualizer';
import { AnnotationCard } from './AnnotationCard';
import { DPVisualizer } from './DPVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { NoneVisualizer } from './NoneVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { RecursionVisualizer } from './RecursionVisualizer';
import { SortingVisualizer } from './SortingVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { StepControls } from './StepControls';
import { TreeVisualizer } from './TreeVisualizer';
import { VariableTracker } from './VariableTracker';
import { getState } from './visualizerUtils';

type DSAVisualizerProps = {
  steps: AnalysisStep[];
  activeStepIndex: number;
  codeChangedAfterAnalysis: boolean;
  onStepChange: (stepIndex: number) => void;
};

function clampStepIndex(index: number, totalSteps: number) {
  if (totalSteps <= 0) return 0;
  return Math.min(Math.max(index, 0), totalSteps - 1);
}

export function DSAVisualizer({
  steps,
  activeStepIndex,
  codeChangedAfterAnalysis,
  onStepChange,
}: DSAVisualizerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const safeSteps = useMemo(() => (Array.isArray(steps) ? steps : []), [steps]);
  const currentStepIndex = clampStepIndex(activeStepIndex, safeSteps.length);
  const currentStep = safeSteps[currentStepIndex];
  const currentState = currentStep ? getState(currentStep) : null;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsPlaying(false);
  }, [safeSteps]);

  useEffect(() => {
    const clampedIndex = clampStepIndex(activeStepIndex, safeSteps.length);
    if (activeStepIndex !== clampedIndex) {
      onStepChange(clampedIndex);
    }
  }, [activeStepIndex, onStepChange, safeSteps.length]);

  useEffect(() => {
    if (!isPlaying || safeSteps.length <= 1) {
      return;
    }

    const delay = 1200 / speed;
    const timer = window.setTimeout(() => {
      if (currentStepIndex >= safeSteps.length - 1) {
        setIsPlaying(false);
        return;
      }

      onStepChange(currentStepIndex + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [currentStepIndex, isPlaying, onStepChange, safeSteps.length, speed]);

  if (safeSteps.length === 0 || !currentStep || !currentState) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
        No visualization steps generated.
      </div>
    );
  }

  const totalSteps = safeSteps.length;
  const changeStep = (stepIndex: number) => {
    onStepChange(clampStepIndex(stepIndex, totalSteps));
  };

  return (
    <div className="space-y-5">
      {codeChangedAfterAnalysis ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Code changed after analysis. Re-run analysis to update visualization.
        </div>
      ) : null}

      <StepControls
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        speed={speed}
        onPrevious={() => changeStep(currentStepIndex - 1)}
        onNext={() => changeStep(currentStepIndex + 1)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={() => {
          changeStep(0);
          setIsPlaying(false);
        }}
        onSpeedChange={setSpeed}
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <InfoLabel label="Current Step" value={`${currentStepIndex + 1} / ${totalSteps}`} />
              <InfoLabel label="Current Line" value={String(currentStep.line)} />
              <InfoLabel label="Data Structure" value={currentState.type} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentStepIndex}-${currentState.type}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderVisualizer(currentState)}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <AnnotationCard annotation={currentStep.annotation} />
          <VariableTracker variables={currentStep.variables ?? {}} />
        </div>
      </div>
    </div>
  );
}

function InfoLabel({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-semibold capitalize text-slate-950 dark:text-slate-100">{value}</p>
    </div>
  );
}

function renderVisualizer(state: NonNullable<ReturnType<typeof getState>>) {
  if (state.type === 'array') return <ArrayVisualizer state={state} />;
  if (state.type === 'stack') return <StackVisualizer state={state} />;
  if (state.type === 'queue') return <QueueVisualizer state={state} />;
  if (state.type === 'linked-list') return <LinkedListVisualizer state={state} />;
  if (state.type === 'tree') return <TreeVisualizer state={state} />;
  if (state.type === 'graph') return <GraphVisualizer state={state} />;
  if (state.type === 'recursion') return <RecursionVisualizer state={state} />;
  if (state.type === 'dp') return <DPVisualizer state={state} />;
  if (state.type === 'sorting') return <SortingVisualizer state={state} />;
  if (state.type === 'heap') return <HeapVisualizer state={state} />;
  return <NoneVisualizer />;
}
