import type { VisualizerState } from './visualizerUtils';
import { ArrayVisualizer } from './ArrayVisualizer';
import { TreeVisualizer } from './TreeVisualizer';
import { asArray } from './visualizerUtils';

function arrayToTree(values: unknown[], index = 0): unknown {
  if (index >= values.length) return null;
  return {
    value: values[index],
    left: arrayToTree(values, index * 2 + 1),
    right: arrayToTree(values, index * 2 + 2),
  };
}

export function HeapVisualizer({ state }: { state: VisualizerState }) {
  const values = asArray(state.values);

  if (values.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">No heap values available.</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-950">Heap tree</h4>
        <TreeVisualizer state={{ ...state, type: 'tree', values: arrayToTree(values) }} />
      </div>
      <div>
        <h4 className="mb-2 text-sm font-semibold text-slate-950">Heap array</h4>
        <ArrayVisualizer state={{ ...state, type: 'array', values }} />
      </div>
    </div>
  );
}

