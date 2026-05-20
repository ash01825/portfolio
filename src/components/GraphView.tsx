"use client";

import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";
import { useVault } from "../context/VaultContext";

interface GraphViewProps {
  onNodeClick: (id: string) => void;
}

type Node = d3.SimulationNodeDatum & {
  id: string;
  name: string;
  radius: number;
  fillColor: string;
  glowColor: string;
  glowOpacity: number;
};

type Link = d3.SimulationLinkDatum<Node> & {
  source: Node;
  target: Node;
};

export default function GraphView({ onNodeClick }: GraphViewProps) {
  const { allFiles } = useVault();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const getNodeStyle = useCallback((id: string, hasLinks: boolean) => {
    if (id === "me") {
      // Root node: bright warm brass, very visible
      return { fillColor: "#e8c99a", glowColor: "#e8c99a", glowOpacity: 0.5 };
    }
    if (id.startsWith("knowledge")) {
      // Knowledge: bright sage
      return { fillColor: "#90c9ab", glowColor: "#90c9ab", glowOpacity: 0.4 };
    }
    if (id.startsWith("project") || id.startsWith("experience")) {
      // Projects/experience: warm terracotta
      return { fillColor: "#e0a882", glowColor: "#e0a882", glowOpacity: 0.4 };
    }
    // Generic files: muted warm white so they're still visible
    return { fillColor: "#b0a898", glowColor: "#b0a898", glowOpacity: 0.25 };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    if (width === 0) return;

    // ── DATA ─────────────────────────────────────────────────────────────────
    const nodeData: Node[] = allFiles.map((f) => {
      const isMe = f.id === "me";
      const hasLinks = !!(f.links && f.links.length > 0);
      const style = getNodeStyle(f.id, hasLinks);
      return {
        id: f.id,
        name: f.name,
        radius: isMe ? 12 : hasLinks ? 7 : 5,
        ...style,
        x: isMe ? width / 2 : width / 2 + (Math.random() - 0.5) * 280,
        y: isMe ? height / 2 : height / 2 + (Math.random() - 0.5) * 280,
        fx: isMe ? width / 2 : undefined,
        fy: isMe ? height / 2 : undefined,
      };
    });

    const nodeById = new Map(nodeData.map((n) => [n.id, n]));

    const linkData: Link[] = [];
    allFiles.forEach((f) => {
      if (f.links) {
        f.links.forEach((targetId) => {
          const src = nodeById.get(f.id);
          const tgt = nodeData.find((n) => n.id.toLowerCase() === targetId.toLowerCase());
          if (src && tgt) {
            linkData.push({ source: src as any, target: tgt as any });
          }
        });
      }
    });

    // ── SVG ───────────────────────────────────────────────────────────────────
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = svg.append("g").attr("class", "graph-root");

    // ── LINKS ─────────────────────────────────────────────────────────────────
    const linkEls = root.append("g")
      .selectAll<SVGLineElement, Link>("line")
      .data(linkData)
      .join("line")
      .attr("stroke", "rgba(240,237,232,0.18)")
      .attr("stroke-width", 1.2)
      .attr("stroke-linecap", "round");

    // ── NODES ─────────────────────────────────────────────────────────────────
    const nodeEls = root.append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(nodeData)
      .join("g")
      .style("cursor", "pointer");

    // Outer halo (very soft, wide)
    nodeEls.append("circle")
      .attr("class", "halo")
      .attr("r", (d) => d.radius + 9)
      .attr("fill", (d) => d.glowColor)
      .attr("opacity", (d) => d.glowOpacity * 0.4);

    // Inner glow ring
    nodeEls.append("circle")
      .attr("class", "ring")
      .attr("r", (d) => d.radius + 3)
      .attr("fill", (d) => d.glowColor)
      .attr("opacity", (d) => d.glowOpacity * 0.65);

    // Core — solid, bright, always visible
    nodeEls.append("circle")
      .attr("class", "core")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => d.fillColor)
      .attr("stroke", "rgba(255,252,245,0.25)")
      .attr("stroke-width", 1.2);

    // Label
    nodeEls.append("text")
      .attr("class", "label")
      .text((d) => d.name)
      .attr("x", (d) => d.radius + 7)
      .attr("y", 4)
      .attr("font-size", (d) => (d.id === "me" ? 13 : 11))
      .attr("font-weight", (d) => (d.id === "me" ? "600" : "400"))
      .attr("font-family", "SF Pro Display, Geist Sans, Inter, sans-serif")
      .attr("fill", (d) => (d.id === "me" ? "rgba(240,237,232,0.95)" : "rgba(240,237,232,0.55)"))
      .attr("pointer-events", "none")
      .attr("user-select", "none");

    // ── INTERACTIONS ──────────────────────────────────────────────────────────
    nodeEls
      .on("mouseenter", function (_event, d) {
        // Brighten connected links
        linkEls
          .attr("stroke", (l) => {
            const s = (l.source as Node).id;
            const t = (l.target as Node).id;
            return s === d.id || t === d.id
              ? "rgba(240,237,232,0.7)"
              : "rgba(240,237,232,0.06)";
          })
          .attr("stroke-width", (l) => {
            const s = (l.source as Node).id;
            const t = (l.target as Node).id;
            return s === d.id || t === d.id ? 2 : 0.8;
          });

        // Expand halo and ring
        d3.select(this).select(".halo")
          .transition().duration(160)
          .attr("opacity", (d as Node).glowOpacity * 0.8);
        d3.select(this).select(".ring")
          .transition().duration(160)
          .attr("opacity", (d as Node).glowOpacity);
        d3.select(this).select(".core")
          .transition().duration(160)
          .attr("r", (d as Node).radius + 2);

        // Brighten label
        d3.select(this).select(".label")
          .attr("fill", "rgba(240,237,232,0.97)")
          .attr("font-weight", "600");
      })
      .on("mouseleave", function (_event, d) {
        linkEls
          .attr("stroke", "rgba(240,237,232,0.18)")
          .attr("stroke-width", 1.2);

        d3.select(this).select(".halo")
          .transition().duration(250)
          .attr("opacity", (d as Node).glowOpacity * 0.4);
        d3.select(this).select(".ring")
          .transition().duration(250)
          .attr("opacity", (d as Node).glowOpacity * 0.65);
        d3.select(this).select(".core")
          .transition().duration(250)
          .attr("r", (d as Node).radius);

        d3.select(this).select(".label")
          .attr("fill", (d as Node).id === "me" ? "rgba(240,237,232,0.95)" : "rgba(240,237,232,0.55)")
          .attr("font-weight", (d as Node).id === "me" ? "600" : "400");
      })
      .on("click", (_event, d) => {
        onNodeClick(d.id);
      });

    // ── SIMULATION ────────────────────────────────────────────────────────────
    const simulation = d3
      .forceSimulation<Node>(nodeData)
      .force(
        "link",
        d3.forceLink<Node, Link>(linkData)
          .id((d) => d.id)
          .distance(110)
          .strength(0.35)
      )
      .force("charge", d3.forceManyBody<Node>().strength(-260).distanceMax(420))
      .force("center", d3.forceCenter(width / 2, height / 2 + 20).strength(0.04))
      .force("collide", d3.forceCollide<Node>().radius((d) => d.radius + 22).strength(0.85))
      .alphaDecay(0.022);

    // ── TICK — direct DOM, zero React state, zero CSS transitions on positions ─
    simulation.on("tick", () => {
      linkEls
        .attr("x1", (d) => (d.source as Node).x ?? 0)
        .attr("y1", (d) => (d.source as Node).y ?? 0)
        .attr("x2", (d) => (d.target as Node).x ?? 0)
        .attr("y2", (d) => (d.target as Node).y ?? 0);

      nodeEls.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // ── DRAG ──────────────────────────────────────────────────────────────────
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
        // Unpin after drag (except "me" node)
        if (d.id !== "me") {
          d.fx = null;
          d.fy = null;
        }
      });

    nodeEls.call(drag as any);

    // ── ZOOM ──────────────────────────────────────────────────────────────────
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        root.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    // ── RESIZE ────────────────────────────────────────────────────────────────
    const observer = new ResizeObserver(([entry]) => {
      const { width: w, height: h } = entry.contentRect;
      simulation
        .force("center", d3.forceCenter(w / 2, h / 2 + 20).strength(0.04))
        .alpha(0.3)
        .restart();
    });
    observer.observe(container);

    return () => {
      simulation.stop();
      observer.disconnect();
      svg.on(".zoom", null);
    };
  }, [allFiles, getNodeStyle]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="cursor-grab active:cursor-grabbing"
        style={{ display: "block" }}
      />
    </div>
  );
}
