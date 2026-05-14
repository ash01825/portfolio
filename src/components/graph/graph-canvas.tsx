"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "@xyflow/react";
import { useRouter } from "next/navigation";
import CustomNode from "./custom-node";
import "@xyflow/react/dist/style.css";
import type { GraphData } from "@/lib/types";

const nodeTypes = { custom: CustomNode };

export default function GraphCanvas({ data }: { data: GraphData }) {
  const router = useRouter();

  const initialNodes: Node[] = useMemo(() => {
    const total = data.nodes.length;
    const centerX = 400;
    const centerY = 250;
    const spacing = 280;

    return data.nodes.map((n, i) => {
      const offset = i - (total - 1) / 2;
      return {
        id: n.id,
        type: "custom",
        position: { x: centerX + offset * spacing, y: centerY },
        data: {
          label: n.label,
          type: n.type,
          summary: n.summary,
          slug: n.slug,
        },
      };
    });
  }, [data.nodes]);

  const initialEdges: Edge[] = useMemo(
    () =>
      data.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: false,
        style: { stroke: "var(--border-color)", strokeWidth: 1.5 },
      })),
    [data.edges]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      router.push(`/${node.data.slug}`);
    },
    [router]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      minZoom={0.3}
      maxZoom={1.5}
      proOptions={{ hideAttribution: true }}
      fitView
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="var(--border-color)"
      />
      <Controls
        className="!rounded-lg !border !border-border !bg-surface/80 !backdrop-blur-md !shadow-none"
        position="bottom-right"
      />
    </ReactFlow>
  );
}
