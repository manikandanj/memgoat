import ReactFlow, { Background, Controls, Edge, MarkerType, Node } from "reactflow";
import { useMemo } from "react";
import { useGameStore } from "../state/gameStore";

const statusColor: Record<string, string> = {
  correct: "#75c58e",
  incomplete: "#d8b957",
  misleading: "#d9865f",
  false: "#d86666",
  refined: "#7cb8d6",
  dismissed: "#858585"
};

export function MemoryGraph() {
  const { graph, highlightedPath, selectMemory } = useGameStore();

  const nodes: Node[] = useMemo(
    () =>
      graph.nodes.map((node, index) => ({
        id: node.id,
        position: { x: (index % 3) * 150, y: Math.floor(index / 3) * 92 },
        data: { label: node.label },
        className: `graph-node ${node.status} ${highlightedPath.nodes.includes(node.id) ? "highlighted" : ""}`,
        style: {
          borderColor: statusColor[node.status] ?? "#9aa4a0",
          background: highlightedPath.nodes.includes(node.id) ? "#26382f" : "#151a18",
          color: "#f0f1e8",
          width: 128,
          minHeight: 42,
          fontSize: 12
        }
      })),
    [graph.nodes, highlightedPath.nodes]
  );

  const edges: Edge[] = useMemo(
    () =>
      graph.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        animated: highlightedPath.edges.includes(edge.id),
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: highlightedPath.edges.includes(edge.id) ? "#f0d574" : statusColor[edge.status] ?? "#68736c" }
      })),
    [graph.edges, highlightedPath.edges]
  );

  return (
    <section className="graph-section" aria-label="Cave Echo memory graph">
      <div className="section-title">
        <h2>Cave Echo</h2>
        <span>{graph.memories.length} memories</span>
      </div>
      <div className="graph-frame">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          proOptions={{ hideAttribution: true }}
          onNodeClick={(_, node) => selectMemory(node.id)}
        >
          <Background color="#26302c" gap={18} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </section>
  );
}
