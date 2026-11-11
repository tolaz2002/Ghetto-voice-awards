'use client';

import React from 'react';
import { Trophy, MessageCircle } from 'lucide-react';

interface FooterProps {
  onOpenVote: () => void;
  onOpenAdmin: () => void;
}

export function Footer({ onOpenVote, onOpenAdmin }: FooterProps) {
  return (
    <footer className="w-full bg-[#050505] border-t border-[#2A2410] text-neutral-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-neutral-900">
          {/* Brand & Tagline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F5E084]">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-wider">
                THE GHETTO VOICE AWARDS 2026
              </h3>
            </div>
            <p className="text-sm font-medium text-[#F5E084] italic">
              &ldquo;Celebrating the Voices of the Streets.&rdquo;
            </p>
            <p className="text-xs text-neutral-400">
              Zimbabwe | 2026 · Official Music & Entertainment Honors
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col sm:items-end space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-300">
              Follow GVA Across Africa & Diaspora
            </span>
            <div className="flex items-center gap-3">
              {/* WhatsApp */}
              <a
                href="https://whatsapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121212] hover:bg-[#25D366] hover:text-white border border-neutral-800 text-neutral-300 flex items-center justify-center transition-colors shadow-sm"
                title="WhatsApp Channel"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121212] hover:bg-[#E1306C] hover:text-white border border-neutral-800 text-neutral-300 flex items-center justify-center transition-colors shadow-sm text-xs font-bold"
                title="Instagram"
              >
                IG
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121212] hover:bg-neutral-800 hover:text-white border border-neutral-800 text-neutral-300 flex items-center justify-center transition-colors shadow-sm text-xs font-bold"
                title="TikTok"
              >
                TT
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-[#121212] hover:bg-[#1877F2] hover:text-white border border-neutral-800 text-neutral-300 flex items-center justify-center transition-colors shadow-sm text-xs font-bold"
                title="Facebook"
              >
                FB
              </a>
            </div>
          </div>
        </div>

        {/* Footer Navigation & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-neutral-400">
            <a href="#nominees" className="hover:text-[#F5E084] transition-colors">Nominees</a>
            <span>·</span>
            <a href="#voting-system" className="hover:text-[#F5E084] transition-colors">Voting System</a>
            <span>·</span>
            <a href="#about" className="hover:text-[#F5E084] transition-colors">About</a>
            <span>·</span>
            <a href="#rules" className="hover:text-[#F5E084] transition-colors">Official Rules</a>
            <span>·</span>
            <a href="#contact" className="hover:text-[#F5E084] transition-colors">Contact</a>
            <span>·</span>
            <button onClick={onOpenAdmin} className="hover:text-[#D4AF37] transition-colors">
              Committee Login
            </button>
          </div>

          <p className="text-neutral-400">
            © 2026 The Ghetto Voice Awards. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
