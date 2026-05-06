import { motion } from 'framer-motion';
import type { VisualizerState } from './visualizerUtils';
import { asArray, displayValue, isHighlighted } from './visualizerUtils';

export function SortingVisualizer({ state }: { state: VisualizerState }) {
  const values = asArray(state.values).map((value) => Number(value));
  const validValues = values.every((value) => Number.isFinite(value)) ? values : [];

  if (validValues.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">No sorting values available.</div>;
  }

  const max = Math.max(...validValues, 1);

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-5">
      <div className="flex min-h-64 min-w-max items-end gap-3">
        {validValues.map((value, index) => {
          const active = isHighlighted(value, index, state.highlight);
          return (
            <div key={`${index}-${value}`} className="flex flex-col items-center gap-2">
              <motion.div
                layout
                animate={{ height: Math.max(24, (value / max) * 190), scale: active ? 1.04 : 1 }}
                className={`w-12 rounded-t-md border ${
                  active ? 'border-brand-100 bg-brand-500' : 'border-slate-700 bg-slate-700'
                }`}
              />
              <span className="font-mono text-xs text-slate-300">{displayValue(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

