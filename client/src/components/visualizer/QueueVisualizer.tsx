import { motion } from 'framer-motion';
import type { VisualizerState } from './visualizerUtils';
import { asArray, displayValue, isHighlighted } from './visualizerUtils';

export function QueueVisualizer({ state }: { state: VisualizerState }) {
  const values = asArray(state.values);

  if (values.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">Queue is empty.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-5">
      <div className="flex min-w-max items-center gap-3">
        {values.map((value, index) => {
          const active = isHighlighted(value, index, state.highlight);
          return (
            <motion.div key={`${index}-${displayValue(value)}`} layout className="text-center">
              <div className="mb-2 h-4 text-xs text-brand-100">{index === 0 ? 'Front' : index === values.length - 1 ? 'Rear' : ''}</div>
              <motion.div
                animate={{ scale: active ? 1.05 : 1 }}
                className={`flex h-14 min-w-16 items-center justify-center rounded-md border px-3 font-mono text-sm font-semibold ${
                  active ? 'border-brand-100 bg-brand-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-100'
                }`}
              >
                {displayValue(value)}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

