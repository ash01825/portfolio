"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { ContentType } from "@/lib/types";

const typeConfig: Record<
  ContentType,
  { dot: string; label: string }
> = {
  project: { dot: "bg-accent-amber-text", label: "Project" },
  blog: { dot: "bg-accent-rose-text", label: "Blog" },
  writeup: { dot: "bg-accent-blue-text", label: "Writeup" },
  idea: { dot: "bg-accent-sage-text", label: "Idea" },
  experiment: { dot: "bg-accent-amber-text", label: "Experiment" },
  curiosity: { dot: "bg-accent-rose-text", label: "Curiosity" },
};

function CustomNode({ data }: NodeProps) {
  const config = typeConfig[data.type as ContentType] ?? typeConfig.idea;
  const label = data.label as string;
  const summary = data.summary as string | undefined;

  return (
    <div className="group relative px-5 py-3.5 rounded-xl border border-border bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow duration-300 cursor-pointer min-w-[160px]">
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-border !w-2 !h-2 !border-2 !border-surface"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-border !w-2 !h-2 !border-2 !border-surface"
      />

      <div className="flex items-center gap-2 mb-1">
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className="text-[10px] tracking-[0.2em] uppercase text-text-subtle">
          {config.label}
        </span>
      </div>

      <p className="text-sm font-medium text-text-primary leading-snug">
        {label}
      </p>

      {summary && (
        <p className="mt-1 text-xs text-text-subtle leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {summary}
        </p>
      )}
    </div>
  );
}

export default memo(CustomNode);
