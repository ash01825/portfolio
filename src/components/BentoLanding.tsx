"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Code2, Cpu, GitBranch, Globe, Terminal } from "lucide-react";
import Image from "next/image";
import MarkdownView from "./MarkdownView";

interface BentoLandingProps {
  onNavigate: (id: string) => void;
  content: string;
}

export default function BentoLanding({ onNavigate, content }: BentoLandingProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 350, damping: 25 },
    },
  };

  return (
    <div className="w-full h-full p-6 md:p-10 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto pb-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[160px]"
        >
          {/* Main Hero Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-2 row-span-2 glass-panel glass-panel-inner rounded-3xl p-8 relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-accent-primary)]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform duration-700 group-hover:scale-150" />
            
            <div>
              <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border-2 border-[var(--color-border-strong)] relative">
                <Image src="/images/profile.jpeg" alt="Arsh" fill className="object-cover" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] mb-2">
                arsh tulshyan
              </h1>
              <p className="text-[var(--color-text-secondary)] text-sm md:text-base max-w-sm leading-relaxed">
                junior cs grad. building distributed systems, inference optimization, and things that scale. delusional until it works.
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-8">
              <button onClick={() => onNavigate("graph")} className="flex items-center space-x-2 text-xs font-semibold bg-[var(--color-text-primary)] text-[var(--color-bg-base)] px-4 py-2 rounded-full haptic-press transition-fluid">
                <span>Explore Vault</span>
                <ArrowRight size={14} />
              </button>
              <a href="https://github.com/ash01825" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-colors">
                <GitBranch size={14} />
              </a>
              <a href="https://twitter.com/JoyBoy_Ash" target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-colors">
                <Globe size={14} />
              </a>
            </div>
          </motion.div>

          {/* Currently Building */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 lg:col-span-2 row-span-1 glass-panel glass-panel-inner rounded-3xl p-6 relative overflow-hidden group cursor-pointer"
            onClick={() => onNavigate("persona")}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-1">
                  Currently Building
                </div>
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition-colors">
                  Persona
                </h3>
              </div>
              <div className="p-2 bg-[var(--color-accent-primary)]/10 rounded-xl text-[var(--color-accent-primary)]">
                <Terminal size={18} />
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
              Autonomous AI pipeline constructing multi-modal knowledge graphs of historical figures.
            </p>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 lg:col-span-1 row-span-1 glass-panel glass-panel-inner rounded-3xl p-6 flex flex-col justify-center items-center text-center"
          >
            <Cpu size={24} className="text-[var(--color-accent-secondary)] mb-3" />
            <div className="text-sm font-semibold text-[var(--color-text-primary)]">AI/ML</div>
            <div className="text-[10px] text-[var(--color-text-tertiary)] mt-1">Python, C++, CUDA</div>
          </motion.div>

          {/* Knowledge Node */}
          <motion.div
            variants={itemVariants}
            onClick={() => onNavigate("LoRA-vs-QLoRA")}
            className="md:col-span-1 lg:col-span-1 row-span-1 glass-panel glass-panel-inner rounded-3xl p-6 cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex justify-between items-center text-[var(--color-accent-gold)]">
              <Code2 size={20} />
              <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-1">
                Knowledge Base
              </div>
              <div className="text-sm font-bold text-[var(--color-text-primary)]">
                Quantization
              </div>
            </div>
          </motion.div>

          {/* Map/Location Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-2 row-span-1 glass-panel glass-panel-inner rounded-3xl p-6 relative overflow-hidden flex items-end"
          >
            <div className="absolute inset-0 bg-noise opacity-[0.08]" />
            <div className="absolute right-0 top-0 w-full h-full opacity-30 mix-blend-overlay">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--color-border-strong)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <div className="relative z-10 w-full flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-[var(--color-text-primary)]">Operating from</div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] flex items-center mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                  Available for new opportunities
                </div>
              </div>
              <div className="text-xs font-mono text-[var(--color-text-secondary)] bg-white/5 px-2 py-1 rounded-md">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })}
              </div>
            </div>
          </motion.div>
          
        </motion.div>

        {/* Full Markdown Content Rendered Below the Grid */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border-subtle)] relative z-10">
          <MarkdownView content={content} onLinkClick={onNavigate} disableScroll />
        </div>
      </div>
    </div>
  );
}
