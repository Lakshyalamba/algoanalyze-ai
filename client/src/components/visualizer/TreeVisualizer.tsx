import { motion } from 'framer-motion';
import type { VisualizerState } from './visualizerUtils';
import { displayValue, isRecord } from './visualizerUtils';

type TreeNode = {
  value?: unknown;
  left?: TreeNode | null;
  right?: TreeNode | null;
};

function normalizeNode(value: unknown): TreeNode | null {
  if (!isRecord(value)) {
    return null;
  }

  return {
    value: value.value,
    left: normalizeNode(value.left),
    right: normalizeNode(value.right),
  };
}

export function TreeVisualizer({ state }: { state: VisualizerState }) {
  const root = normalizeNode(state.values);

  if (!root) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">No tree data available.</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-6">
      <TreeNodeView node={root} highlight={state.highlight} />
    </div>
  );
}

function TreeNodeView({ node, highlight }: { node: TreeNode; highlight: unknown }) {
  const active = node.value === highlight;
  const hasChildren = node.left || node.right;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        layout
        animate={{ scale: active ? 1.1 : 1 }}
        className={`flex h-12 min-w-12 items-center justify-center rounded-full border px-3 font-mono text-sm font-semibold ${
          active ? 'border-brand-100 bg-brand-500 text-white' : 'border-slate-700 bg-slate-900 text-slate-100'
        }`}
      >
        {displayValue(node.value)}
      </motion.div>
      {hasChildren ? (
        <>
          <div className="h-6 w-px bg-slate-700" />
          <div className="flex gap-8">
            {node.left ? <TreeNodeView node={node.left} highlight={highlight} /> : <div className="w-12" />}
            {node.right ? <TreeNodeView node={node.right} highlight={highlight} /> : <div className="w-12" />}
          </div>
        </>
      ) : null}
    </div>
  );
}
