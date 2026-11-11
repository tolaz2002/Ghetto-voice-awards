'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Award, BarChart3, Clock, Flame, ChevronDown } from 'lucide-react';

interface HeroProps {
  ceremonyDateString: string;
  onOpenVote: () => void;
}

export function Hero({ ceremonyDateString, onOpenVote }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateCountdown() {
      const target = new Date(ceremonyDateString).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [ceremonyDateString]);

  return (
    <section id="top" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#2A2410]">
      {/* Background Hero Image with Next.js Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.jpg"
          alt="The Ghetto Voice Awards 2026 Trophy & Stage"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 filter brightness-75 contrast-110"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark scrim for 4.5:1 legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/85 to-[#080808]/60" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-[#080808]/40 to-[#080808]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Unboxed editorial kicker */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F5E084] mb-4">
          <Flame className="w-4 h-4 text-[#D4AF37]" />
          <span>Zimbabwe 2026</span>
          <span aria-hidden="true" className="text-neutral-500">·</span>
          <span>Official Nominee Voting Platform</span>
          <span aria-hidden="true" className="text-neutral-500">·</span>
          <span>Harare</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white uppercase text-balance leading-none max-w-4xl mb-6">
          THE GHETTO VOICE <br className="hidden sm:inline" />
          <span className="gold-text-gradient">AWARDS 2026</span>
        </h1>

        {/* Subtitle & Tagline */}
        <p className="text-lg sm:text-2xl font-light text-neutral-200 tracking-wide mb-3 max-w-2xl text-balance">
          &ldquo;Celebrating the Voices of the Streets.&rdquo;
        </p>
        <p className="text-sm sm:text-base text-neutral-400 max-w-2xl text-balance mb-8">
          Recognising, celebrating, and rewarding the raw talent, infectious energy, and relentless grit of Zimbabwean musicians who define our culture.
        </p>

        {/* Live Ceremony Countdown */}
        <div className="w-full max-w-xl p-5 mb-10 rounded-2xl bg-[#121212]/90 border border-[#D4AF37]/35 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Countdown to Grand Awards Ceremony</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="p-2 sm:p-3 rounded-xl bg-[#1A1A1A] border border-neutral-800">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#F5E084] tabular-nums">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400">Days</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-[#1A1A1A] border border-neutral-800">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#F5E084] tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400">Hours</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-[#1A1A1A] border border-neutral-800">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#F5E084] tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400">Mins</span>
            </div>
            <div className="p-2 sm:p-3 rounded-xl bg-[#1A1A1A] border border-neutral-800">
              <span className="block text-2xl sm:text-4xl font-extrabold text-[#F5E084] tabular-nums">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-neutral-400">Secs</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenVote}
            className="w-full sm:w-auto gold-btn px-8 py-4 rounded-xl text-sm font-extrabold uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
          >
            <Award className="w-5 h-5 text-black" />
            <span>Vote For Best Male Artist</span>
          </button>
          <a
            href="#nominees"
            className="w-full sm:w-auto px-7 py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-neutral-200 bg-[#171717] hover:bg-[#222222] border border-[#2A2410] hover:border-[#D4AF37]/50 transition-all flex items-center justify-center gap-2.5"
          >
            <Flame className="w-4 h-4 text-[#D4AF37]" />
            <span>Explore Nominees</span>
          </a>
        </div>

        {/* Quick Meta Proof Row */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-bold">6</span>
            <span>Nominated Male Titans</span>
          </div>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-bold">3</span>
            <span>Votes Per Ballot</span>
          </div>
          <span aria-hidden="true" className="text-neutral-700">·</span>
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] font-bold">100%</span>
            <span>WhatsApp Community Powered</span>
          </div>
        </div>

        <a
          href="#nominees"
          className="mt-10 text-neutral-500 hover:text-[#D4AF37] transition-colors p-2 animate-bounce"
          aria-label="Scroll to nominees section"
        >
          <ChevronDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
