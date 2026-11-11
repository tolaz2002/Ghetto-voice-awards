'use client';

import React, { useState } from 'react';
import { Award, Shield, Menu, X, Trophy } from 'lucide-react';

interface NavbarProps {
  onOpenVote: () => void;
  onOpenAdmin: () => void;
}

export function Navbar({ onOpenVote, onOpenAdmin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2A2410] bg-[#080808]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark single element */}
        <a href="#top" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F5E084] via-[#D4AF37] to-[#996515] p-0.5 shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#080808] rounded-[7px] flex items-center justify-center group-hover:bg-[#121212] transition-colors">
              <Trophy className="w-5 h-5 text-[#F5E084]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base sm:text-lg tracking-wider text-white whitespace-nowrap">
              GHETTO VOICE <span className="gold-text-gradient">AWARDS</span>
            </span>
            <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-semibold">
              ZIMBABWE 2026
            </span>
          </div>
        </a>

        {/* Zone 2: 5 single-line clean nav links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-neutral-300">
          <a href="#nominees" className="hover:text-[#F5E084] transition-colors whitespace-nowrap shrink-0">
            Nominees
          </a>
          <a href="#voting-system" className="hover:text-[#F5E084] transition-colors whitespace-nowrap shrink-0">
            Voting System
          </a>
          <a href="#about" className="hover:text-[#F5E084] transition-colors whitespace-nowrap shrink-0">
            About
          </a>
          <a href="#rules" className="hover:text-[#F5E084] transition-colors whitespace-nowrap shrink-0">
            Voting Rules
          </a>
          <a href="#contact" className="hover:text-[#F5E084] transition-colors whitespace-nowrap shrink-0">
            Contact
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action + Admin Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            title="Administrator Portal"
            className="p-2 text-neutral-400 hover:text-[#D4AF37] hover:bg-[#1A1A1A] rounded-lg transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenVote}
            className="gold-btn px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Vote Now</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#2A2410] bg-[#0E0E0E] px-4 py-5 space-y-3">
          <nav className="flex flex-col space-y-3 text-sm font-semibold uppercase tracking-wider text-neutral-300">
            <a
              href="#nominees"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1A1A1A] hover:text-[#D4AF37]"
            >
              Nominees (Best Male Artist)
            </a>
            <a
              href="#voting-system"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1A1A1A] hover:text-[#D4AF37]"
            >
              Special 3-Artist Voting
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1A1A1A] hover:text-[#D4AF37]"
            >
              About The Awards
            </a>
            <a
              href="#rules"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1A1A1A] hover:text-[#D4AF37]"
            >
              Official Voting Rules
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded hover:bg-[#1A1A1A] hover:text-[#D4AF37]"
            >
              Contact & Press
            </a>
          </nav>
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-xs text-neutral-400 hover:text-[#D4AF37] flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVote();
              }}
              className="gold-btn px-4 py-2 rounded text-xs font-bold uppercase tracking-wider"
            >
              Cast Your Votes
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
