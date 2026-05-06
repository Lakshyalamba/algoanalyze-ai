import type { VisualizerState } from './visualizerUtils';
import { asArray, displayValue, isRecord } from './visualizerUtils';

export function GraphVisualizer({ state }: { state: VisualizerState }) {
  const graph = isRecord(state.values) ? state.values : {};
  const nodes = asArray(graph.nodes).map(String);
  const edges = asArray(graph.edges).filter(Array.isArray) as unknown[][];

  if (nodes.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">No graph nodes available.</div>;
  }

  const radius = 95;
  const center = 130;
  const positions = new Map(
    nodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
      return [node, { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) }];
    }),
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-5">
      <svg width="260" height="260" viewBox="0 0 260 260" className="mx-auto">
        {edges.map((edge, index) => {
          const from = positions.get(String(edge[0]));
          const to = positions.get(String(edge[1]));
          if (!from || !to) return null;
          return <line key={index} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#475569" strokeWidth="2" />;
        })}
        {nodes.map((node) => {
          const position = positions.get(node)!;
          const active = state.highlight === node;
          return (
            <g key={node}>
              <circle cx={position.x} cy={position.y} r="23" fill={active ? '#2563eb' : '#0f172a'} stroke={active ? '#dbeafe' : '#334155'} strokeWidth="2" />
              <text x={position.x} y={position.y + 5} textAnchor="middle" className="fill-white text-sm font-semibold">
                {displayValue(node)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

