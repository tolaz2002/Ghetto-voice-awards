'use client';

import React from 'react';
import { Trophy, CheckCircle2, Sparkles } from 'lucide-react';

export function CategoryHeader() {
  return (
    <div className="w-full bg-[#0D0D0D] border-y border-[#2A2410] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <Trophy className="w-4 h-4" />
            <span>Official Launch Category · Zimbabwe 2026</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            BEST MALE ARTIST <span className="gold-text-gradient">OF THE YEAR 2026</span>
          </h2>
          <p className="mt-2 text-sm text-neutral-400 max-w-2xl">
            Honouring the male recording artists whose street anthems, stage power, and cultural leadership dominated radio, street commuter omnibuses (kombis), and international streaming throughout 2026.
          </p>
        </div>

        <div className="shrink-0 p-4 rounded-xl bg-[#141414] border border-[#2A2410] flex flex-col gap-2 min-w-[240px]">
          <div className="flex items-center gap-2 text-xs text-neutral-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Verified Nominee Roster</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-300 font-semibold">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>3-Stage Community Ballot</span>
          </div>
          <div className="text-[11px] text-[#D4AF37] font-medium pt-1 border-t border-neutral-800">
            6 Contenders in Competition Order
          </div>
        </div>
      </div>
    </div>
  );
}
