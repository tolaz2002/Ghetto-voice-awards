'use client';

import React from 'react';
import Image from 'next/image';
import { Award, Flame, Heart, Music2, Radio, Globe } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#080808] border-b border-[#2A2410]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Editorial & Heritage */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
              <Award className="w-4 h-4" />
              <span>The Movement & Cultural Manifesto</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mb-6">
              CELEBRATING THE <br />
              <span className="gold-text-gradient">VOICES OF THE STREETS</span>
            </h2>

            <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
              <p>
                In Zimbabwe, the true heartbeat of modern music does not begin in corporate boardrooms—it is born in the vibrant home studios of Mbare, Highfield, Chitungwiza, Dzivarasekwa, Bulawayo, and beyond.
              </p>
              <p>
                <strong>The Ghetto Voice Awards (GVA)</strong> was founded to provide Zimbabwean urban entertainers with an unapologetically world-class platform. Combining the cinematic prestige of the BET Awards and MTV MAMAs with the raw truth of Zimbabwean street culture, GVA honours the lyricists, chanters, and vocalists who turn hardship into triumph.
              </p>
              <p>
                Our 2026 edition elevates <strong>Best Male Artist of the Year</strong> as its flagship opening category, pitting six extraordinary icons against each other in a transparent, fan-powered contest.
              </p>
            </div>

            {/* Cultural Pillars */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-neutral-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 text-[#F5E084]">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">Grassroots Pride</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Honouring authentic Zimdancehall & Hip Hop originators.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center shrink-0 text-[#F5E084]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">Global Diaspora</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Connecting Zimbabwean fans in the UK, SA, and worldwide.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Stage Collage & Card */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden gold-card border-2 border-[#D4AF37]/30 shadow-2xl">
              <Image
                src="/images/hero.jpg"
                alt="Ghetto Voice Awards Trophy Presentation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
                  Harare Grand Auditorium
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase text-white">
                  The Golden Gramophone of the Streets
                </h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Forged in metallic gold and polished obsidian to commemorate the unstoppable spirit of Zimbabwean talent.
                </p>
              </div>
            </div>

            {/* Floating Metric Badge */}
            <div className="mt-4 p-4 rounded-xl bg-[#121212] border border-[#2A2410] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-[#25D366]" />
                <span className="text-xs font-semibold text-neutral-300">Broadcast live across radio & digital stream</span>
              </div>
              <span className="text-xs font-bold text-[#F5E084] uppercase tracking-wider">December 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
