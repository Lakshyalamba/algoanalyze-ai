import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { VisualizerState } from './visualizerUtils';
import { asArray, displayValue, isHighlighted } from './visualizerUtils';

export function LinkedListVisualizer({ state }: { state: VisualizerState }) {
  const values = asArray(state.values);

  if (values.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">No linked list nodes available.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-5">
      <div className="flex min-w-max items-center gap-3">
        {values.map((value, index) => {
          const active = isHighlighted(value, index, state.highlight);
          return (
            <div key={`${index}-${displayValue(value)}`} className="flex items-center gap-3">
              <motion.div
                layout
                animate={{ scale: active ? 1.08 : 1 }}
                className={`flex h-14 min-w-16 items-center justify-center rounded-full border px-4 font-mono text-sm font-semibold ${
                  active ? 'border-brand-100 bg-brand-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-100'
                }`}
              >
                {displayValue(value)}
              </motion.div>
              {index < values.length - 1 ? <ArrowRight className="h-5 w-5 text-slate-500" aria-hidden="true" /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

