import { motion } from 'framer-motion';
import type { VisualizerState } from './visualizerUtils';
import { asArray, displayValue } from './visualizerUtils';

export function DPVisualizer({ state }: { state: VisualizerState }) {
  const rows = asArray(state.values).map(asArray);
  const highlight = Array.isArray(state.highlight) ? state.highlight : [];

  if (rows.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">No DP table available.</div>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-5">
      <div className="inline-grid gap-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((cell, colIndex) => {
              const active = highlight[0] === rowIndex && highlight[1] === colIndex;
              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  layout
                  animate={{ scale: active ? 1.08 : 1 }}
                  className={`flex h-12 min-w-12 items-center justify-center rounded-md border px-2 font-mono text-sm font-semibold ${
                    active ? 'border-brand-100 bg-brand-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-100'
                  }`}
                >
                  {displayValue(cell)}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

