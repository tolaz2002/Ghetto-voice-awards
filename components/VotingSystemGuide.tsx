'use client';

import React from 'react';
import { Award, Share2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface VotingSystemGuideProps {
  onStartVoting: () => void;
}

export function VotingSystemGuide({ onStartVoting }: VotingSystemGuideProps) {
  return (
    <section id="voting-system" className="py-20 bg-[#0C0C0C] border-b border-[#2A2410]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Sparkles className="w-4 h-4" />
            <span>The 3-Artist Community Mechanism</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            HOW VOTING <span className="gold-text-gradient">WORKS</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-400">
            Unlike ordinary award shows, The Ghetto Voice Awards requires each voter to cast ballots for <strong className="text-white">THREE DIFFERENT ARTISTS</strong> in three progressive stages, powered by WhatsApp community mobilization.
          </p>
        </div>

        {/* 3 Stages Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stage 1 Card */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#2A2410] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5E084] font-black text-sm flex items-center justify-center">
                  01
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-[#1F1F1F] text-neutral-300">
                  Instant
                </span>
              </div>
              <h3 className="text-lg font-black uppercase text-white mb-2">
                Stage 1: Lead Vote
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Browse the 6 official nominees, choose your top favourite artist, complete the anti-bot check, and submit your first certified vote.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] font-semibold text-[#D4AF37] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>1 of 3 Votes Recorded</span>
            </div>
          </div>

          {/* Stage 2 Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#142319] to-[#121814] border border-[#25D366]/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/50 text-[#25D366] font-black text-sm flex items-center justify-center">
                  02
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-[#193222] text-[#25D366]">
                  Community Unlock
                </span>
              </div>
              <h3 className="text-lg font-black uppercase text-white mb-2">
                Stage 2: WhatsApp Sharing
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Unlock your remaining TWO votes by completing 5 sharing tasks: 3 WhatsApp contacts + 2 WhatsApp groups to rally Zimbabwean music fans.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/60 text-[11px] font-semibold text-[#25D366] flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>3 Contacts + 2 Groups Required</span>
            </div>
          </div>

          {/* Stage 3 Card */}
          <div className="p-6 rounded-2xl bg-[#141414] border border-[#2A2410] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F5E084] font-black text-sm flex items-center justify-center">
                  03
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-[#1F1F1F] text-neutral-300">
                  Full Ballot
                </span>
              </div>
              <h3 className="text-lg font-black uppercase text-white mb-2">
                Stage 3: Final Two Votes
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Select TWO MORE DIFFERENT ARTISTS from the remaining nominees. Duplicate votes for the same artist are strictly prevented.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800 text-[11px] font-semibold text-[#F5E084] flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Ballot Certified & Badge Issued</span>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1A180E] via-[#141414] to-[#121212] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-extrabold uppercase text-white">
              Ready To Honour Zimbabwean Street Talent?
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Every vote is saved securely on the server with full audit trail compliance.
            </p>
          </div>
          <button
            onClick={onStartVoting}
            className="w-full sm:w-auto gold-btn px-7 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shrink-0"
          >
            <span>Cast Your 3 Votes</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}
