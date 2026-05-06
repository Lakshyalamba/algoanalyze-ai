import { motion } from 'framer-motion';
import type { VisualizerState } from './visualizerUtils';
import { asArray, displayValue, isHighlighted } from './visualizerUtils';

export function ArrayVisualizer({ state }: { state: VisualizerState }) {
  const values = asArray(state.values);

  if (values.length === 0) {
    return <Empty message="No array values available." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-5">
      <div className="flex min-w-max items-end gap-3">
        {values.map((value, index) => {
          const active = isHighlighted(value, index, state.highlight);
          return (
            <motion.div
              key={`${index}-${displayValue(value)}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, scale: active ? 1.05 : 1 }}
              className="text-center"
            >
              <div
                className={`flex h-14 min-w-14 items-center justify-center rounded-md border px-3 font-mono text-sm font-semibold ${
                  active
                    ? 'border-brand-100 bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'border-slate-700 bg-slate-900 text-slate-100'
                }`}
              >
                {displayValue(value)}
              </div>
              <div className="mt-2 text-xs text-slate-400">{index}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">{message}</div>;
}

