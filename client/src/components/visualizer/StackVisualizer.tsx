import { motion } from 'framer-motion';
import type { VisualizerState } from './visualizerUtils';
import { asArray, displayValue, isHighlighted } from './visualizerUtils';

export function StackVisualizer({ state }: { state: VisualizerState }) {
  const values = asArray(state.values);

  if (values.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">Stack is empty.</div>;
  }

  return (
    <div className="flex justify-center rounded-lg border border-slate-200 bg-slate-950 p-5">
      <div className="flex w-full max-w-xs flex-col-reverse gap-2">
        {values.map((value, index) => {
          const active = isHighlighted(value, index, state.highlight);
          const isTop = index === values.length - 1;
          return (
            <motion.div
              key={`${index}-${displayValue(value)}`}
              layout
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0, scale: active ? 1.04 : 1 }}
              className={`relative rounded-md border px-4 py-3 text-center font-mono text-sm font-semibold ${
                active ? 'border-brand-100 bg-brand-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-100'
              }`}
            >
              {isTop ? <span className="absolute -right-14 top-3 text-xs font-sans text-brand-100">Top</span> : null}
              {displayValue(value)}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

