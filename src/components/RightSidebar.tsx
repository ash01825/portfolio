"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useVault } from "../context/VaultContext";

export default function RightSidebar({ activeFileId }: { activeFileId?: string }) {
  const { allFiles } = useVault();
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Real calendar generation
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  let startingDay = firstDayOfMonth.getDay();
  // Adjust so Monday is 0
  startingDay = startingDay === 0 ? 6 : startingDay - 1;
  
  const handlePrevMonth = () => {
    // Only allow going back if the previous month contains today or is in the future
    const prevMonth = new Date(year, month - 1, 1);
    const todayMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (prevMonth >= todayMonth) {
      setCurrentDate(prevMonth);
    }
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  const handleDateClick = (dayNum: number) => {
    const clickedDate = new Date(year, month, dayNum);
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Disable if past
    if (clickedDate < todayOnly) return; 
    
    // Disable if > 30 days in future
    const thirtyDaysFromNow = new Date(todayOnly);
    thirtyDaysFromNow.setDate(todayOnly.getDate() + 30);
    if (clickedDate > thirtyDaysFromNow) return;

    // Basic formatting for a meeting request
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dateStr = `${monthNames[month]} ${dayNum}, ${year}`;
    const subject = encodeURIComponent(`Meeting Request for ${dateStr}`);
    const body = encodeURIComponent(`Hi Arsh,\n\nI'd like to schedule a chat with you on ${dateStr}.\n\nBest,\n`);
    window.open(`mailto:arsh.tulshyan@gmail.com?subject=${subject}&body=${body}`);
  };

  const calendarGrid = [];
  for (let i = 0; i < startingDay; i++) {
    calendarGrid.push(<div key={`empty-${i}`} className="h-6 w-6"></div>);
  }
  
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const iterDate = new Date(year, month, i);
    const iterDateOnly = new Date(iterDate.getFullYear(), iterDate.getMonth(), iterDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const thirtyDaysFromNow = new Date(todayOnly);
    thirtyDaysFromNow.setDate(todayOnly.getDate() + 30);

    const isToday = iterDateOnly.getTime() === todayOnly.getTime();
    const isPast = iterDateOnly < todayOnly;
    const isTooFar = iterDateOnly > thirtyDaysFromNow;
    
    let dayClass = 'text-[var(--color-text-secondary)] border border-transparent transition-fluid ';
    if (isToday) {
      dayClass += 'bg-white/10 text-white shadow-sm ring-1 ring-white/10 cursor-pointer haptic-press';
    } else if (isPast || isTooFar) {
      dayClass += 'text-[var(--color-text-tertiary)] opacity-30 cursor-not-allowed';
    } else {
      dayClass += 'text-[var(--color-text-secondary)] hover:bg-white/5 hover:text-[var(--color-text-primary)] cursor-pointer haptic-press';
    }

    calendarGrid.push(
      <div 
        key={`day-${i}`} 
        onClick={() => handleDateClick(i)}
        className={`h-7 w-7 mx-auto flex items-center justify-center text-[10px] font-medium rounded-full ${dayClass}`}
        title={isPast ? 'Past date' : isTooFar ? 'Too far in advance' : `Schedule a meeting for ${month + 1}/${i}`}
      >
        {i}
      </div>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[month];

  // Parse Headings for Outline
  let headings: { level: number, text: string }[] = [];
  if (activeFileId && activeFileId !== "graph") {
    const activeFile = allFiles.find(f => f.id === activeFileId);
    if (activeFile && activeFile.content) {
      const lines = activeFile.content.split('\n');
      lines.forEach(line => {
        const match = line.match(/^(#{1,6})\s+(.+)/);
        if (match) {
          headings.push({ level: match[1].length, text: match[2] });
        }
      });
    }
  }

  let totalLinks = 0;
  let allTags = new Set<string>();
  
  allFiles.forEach(f => {
    if (f.links) totalLinks += f.links.length;
    if (f.content) {
      // Find hashtags like #system-design, #ml, but ignore hex codes and headings
      const tags = f.content.match(/(?<=\s|^)#[a-zA-Z0-9_-]+/g);
      if (tags) {
        tags.forEach(t => allTags.add(t.toLowerCase()));
      }
    }
  });
  
  const totalFiles = allFiles.length;
  const totalTags = allTags.size;

  return (
    <div className="w-64 h-full glass-panel glass-panel-inner rounded-[2rem] flex flex-col flex-shrink-0 hidden lg:flex z-20 overflow-hidden shadow-2xl">      
      <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">

        {/* Calendar Section */}
        <div className="mb-6">
          <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3">
            Book a Meet
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--color-text-primary)] tracking-wide">
                {currentMonthName} <span className="text-[var(--color-text-tertiary)] font-normal">{year}</span>
              </span>
              <div className="flex space-x-1">
                <ChevronLeft size={14} onClick={handlePrevMonth} className="text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text-primary)] haptic-press transition-fluid" />
                <ChevronRight size={14} onClick={handleNextMonth} className="text-[var(--color-text-secondary)] cursor-pointer hover:text-[var(--color-text-primary)] haptic-press transition-fluid" />
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-1">
              {days.map(day => (
                <div key={day} className="text-center text-[8px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {calendarGrid}
            </div>
          </div>
        </div>

        {/* Outline Section */}
        {activeFileId && activeFileId !== "graph" ? (
          <div>
            <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3">
              Outline
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/5 p-3 space-y-2 shadow-inner">
              {headings.length > 0 ? (
                headings.map((h, i) => (
                  <div 
                    key={i} 
                    className={`text-[13px] cursor-pointer hover:text-[var(--color-text-primary)] transition-fluid haptic-press truncate ${
                      h.level === 1 ? 'text-[var(--color-text-primary)]' : 
                      h.level === 2 ? 'text-[var(--color-text-secondary)] pl-2' : 
                      'text-[var(--color-text-tertiary)] pl-4'
                    }`}
                  >
                    {h.text}
                  </div>
                ))
              ) : (
                <div className="text-xs text-[var(--color-text-tertiary)] italic">No headings found</div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-[10px] font-bold text-[var(--color-text-tertiary)] uppercase tracking-widest mb-3">
              Vault Stats
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/5 p-4 shadow-inner space-y-3">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--color-text-tertiary)]">Files</span>
                <span className="text-[var(--color-text-primary)] font-mono">{totalFiles}</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[var(--color-text-tertiary)]">Links</span>
                <span className="text-[var(--color-text-primary)] font-mono">{totalLinks}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--color-text-tertiary)]">Tags</span>
                <span className="text-[var(--color-text-primary)] font-mono">{totalTags}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
