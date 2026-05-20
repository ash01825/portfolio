"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useVault } from "../context/VaultContext";

interface GraphViewProps {
  onNodeClick: (id: string) => void;
}

type Node = d3.SimulationNodeDatum & {
  id: string;
  name: string;
  val: number;
  color: string;
};

type Link = d3.SimulationLinkDatum<Node> & {
  source: Node;
  target: Node;
};

export default function GraphView({ onNodeClick }: GraphViewProps) {
  const { vaultData, allFiles } = useVault();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const simulationRef = useRef<d3.Simulation<Node, Link> | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
    
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0 || !svgRef.current) return;

    // Build graph data
    const newNodes: Node[] = allFiles.map((f) => {
      const isMe = f.id === "me";
      return {
        id: f.id,
        name: f.name,
        val: isMe ? 2.5 : f.links ? 1.5 : 1,
        color: isMe ? "var(--color-accent-gold)" : f.id.startsWith("knowledge") ? "var(--color-accent-secondary)" : f.id.startsWith("project") ? "var(--color-accent-primary)" : "var(--color-text-secondary)",
        x: isMe ? dimensions.width / 2 : dimensions.width / 2 + (Math.random() - 0.5) * 200,
        y: isMe ? dimensions.height / 2 : dimensions.height / 2 + (Math.random() - 0.5) * 200,
        fx: isMe ? dimensions.width / 2 : undefined, // Pin me at center!
        fy: isMe ? dimensions.height / 2 : undefined,
      };
    });

    const newLinks: Link[] = [];
    allFiles.forEach((f) => {
      if (f.links) {
        f.links.forEach((targetId) => {
          const found = allFiles.find((t) => t.id.toLowerCase() === targetId);
          if (found) {
            // Provide string IDs initially, D3 will replace with Node objects
            newLinks.push({ source: f.id as any, target: found.id as any });
          }
        });
      }
    });

    const simulation = d3
      .forceSimulation<Node>(newNodes)
      .force("link", d3.forceLink<Node, Link>(newLinks).id((d) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2 + 30))
      .force("collide", d3.forceCollide<Node>().radius((d) => d.val * 6 + 15));

    simulationRef.current = simulation;

    simulation.on("tick", () => {
      setNodes([...simulation.nodes()]);
      setLinks([...newLinks]);
    });

    // Setup Zoom
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        setTransform(event.transform);
      });
    
    svg.call(zoom);
    
    // Setup Drag
    const drag = d3.drag<SVGGElement, Node>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        // Leave fx/fy to pin the node where dropped, or null to unpin
        // d.fx = null;
        // d.fy = null;
      });

    // We apply drag via refs after render, or we can just use React pointer events.
    // Given React re-renders, it's easier to just attach drag to the <g> elements directly in a layout effect.
    // See below in another useEffect.

    return () => {
      simulation.stop();
      svg.on(".zoom", null);
    };
  }, [dimensions.width, dimensions.height]);

  // Apply drag behavior after nodes render
  useEffect(() => {
    if (!svgRef.current || !simulationRef.current) return;
    const svg = d3.select(svgRef.current);
    
    const drag = d3.drag<SVGGElement, Node>()
      .on("start", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulationRef.current?.alphaTarget(0);
      });

    // Select all node groups and bind the data so d3.drag knows the datum
    svg.selectAll<SVGGElement, Node>(".graph-node")
      .data(nodes)
      .call(drag as any);
      
  }, [nodes]);

  // Generate straight path (original obsidian style)
  const generateStraightPath = (source: Node, target: Node) => {
    if (!source || !target) return "";
    const sx = source.x || 0;
    const sy = source.y || 0;
    const tx = target.x || 0;
    const ty = target.y || 0;
    return `M ${sx} ${sy} L ${tx} ${ty}`;
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden flex-1">
      <svg ref={svgRef} width="100%" height="100%" className="cursor-grab active:cursor-grabbing">
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          {links.map((link, i) => {
            const source = link.source;
            const target = link.target;
            const isHovered = hoveredNode === source.id || hoveredNode === target.id;
            
            return (
              <path
                key={`link-${i}`}
                d={generateStraightPath(source, target)}
                fill="none"
                stroke={isHovered ? "var(--color-border-strong)" : "var(--color-border-subtle)"}
                strokeWidth={isHovered ? 2 : 1.5}
                className="transition-colors duration-300"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            const isMe = node.id === "me";
            return (
              <g
                key={node.id}
                className="graph-node cursor-pointer"
                transform={`translate(${node.x || 0},${node.y || 0})`}
                onClick={(e) => {
                  // Prevent click when dragging
                  if (e.defaultPrevented) return; 
                  onNodeClick(node.id);
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Clean flat obsidian look */}
                <circle
                  r={isHovered ? node.val * 5 : node.val * 4}
                  fill={node.color}
                  stroke="var(--color-bg-base)"
                  strokeWidth={2}
                  className="transition-all duration-200"
                />
                
                {/* Node Label (Obsidian Style) */}
                <g transform={`translate(12, 4)`}>
                  <text
                    x={0}
                    y={0}
                    fill="var(--color-text-primary)"
                    fontSize={11}
                    fontWeight={400}
                    className="select-none pointer-events-none transition-opacity duration-200"
                    style={{ textShadow: "0px 2px 4px rgba(0,0,0,0.8)" }}
                    opacity={isHovered || isMe || node.val >= 2 ? 1 : 0.4}
                  >
                    {node.name}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
