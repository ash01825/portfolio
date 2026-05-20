"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function ProfileHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="flex flex-col md:flex-row items-start md:items-center p-8 pb-4 max-w-4xl mx-auto w-full z-10"
    >
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 border border-[var(--color-border-strong)] relative shadow-2xl mb-4 md:mb-0 md:mr-6 bg-[var(--color-bg-panel)]"
      >
        <Image src="/images/profile.jpeg" alt="Arsh" fill className="object-cover" />
      </motion.div>

      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between w-full mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">arsh</h1>
        </div>

        <p className="text-xs md:text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-2xl font-medium">
          hi I'm arsh, junior cs grad. I like ai/ml. <br className="hidden md:block" />
          I have fun building models and systems. In between I read and play. <br className="hidden md:block" />
          have fun with codeforces. currently thinking and building distributed systems and inference optimization.
            "Delusional until it works"
        </p>

        <div className="flex items-center space-x-4 mt-5 text-[var(--color-text-tertiary)]">
          <a href="https://github.com/ash01825" target="_blank" rel="noreferrer" className="hover:text-[var(--color-text-primary)] transition-colors p-2 -ml-2 rounded-lg hover:bg-[var(--color-bg-panel)]">
            <FaGithub size={18} />
          </a>
          <a href="https://twitter.com/JoyBoy_Ash" target="_blank" rel="noreferrer" className="hover:text-[var(--color-text-primary)] transition-colors p-2 rounded-lg hover:bg-[var(--color-bg-panel)]">
            <FaTwitter size={18} />
          </a>
          <a href="https://www.linkedin.com/in/arsh-tulshyan" target="_blank" rel="noreferrer" className="hover:text-[var(--color-text-primary)] transition-colors p-2 rounded-lg hover:bg-[var(--color-bg-panel)]">
            <FaLinkedin size={18} />
          </a>
          <div className="w-px h-4 bg-[var(--color-border-subtle)] mx-2" />
          <a href="https://drive.google.com/file/d/1l8i6IiH9f6n2-oQZ2ZcGm0N-ebQKChBW" target="_blank" rel="noreferrer" className="text-xs font-medium flex items-center hover:text-[var(--color-text-primary)] transition-colors">
            Resume <ExternalLink size={12} className="ml-1" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
