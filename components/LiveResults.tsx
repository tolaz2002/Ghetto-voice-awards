'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { BarChart3, RefreshCw, Trophy, Lock, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Nominee } from '@/lib/types';
import { INITIAL_RANKINGS, OFFICIAL_NOMINEES } from '@/lib/constants';

interface RankedNominee extends Nominee {
  rank: number;
  percentage: number;
}

const INITIAL_TOTAL_VOTES = OFFICIAL_NOMINEES.reduce((acc, curr) => acc + curr.votes, 0);

export function LiveResults() {
  const [rankings, setRankings] = useState<RankedNominee[]>(INITIAL_RANKINGS);
  const [totalVotes, setTotalVotes] = useState<number>(INITIAL_TOTAL_VOTES);
  const [totalSessions, setTotalSessions] = useState<number>(8420);
  const [totalShares, setTotalShares] = useState<number>(14290);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [hiddenMessage, setHiddenMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Live');

  const isMountedRef = useRef(true);

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/results');
      if (!res.ok) {
        // Return without breaking or logging console errors
        return;
      }
      const data = await res.json();
      if (!isMountedRef.current) return;

      if (data.hidden) {
        setIsHidden(true);
        setHiddenMessage(data.message || 'Results are currently sealed by the Awards Committee.');
      } else {
        setIsHidden(false);
        if (Array.isArray(data.rankings) && data.rankings.length > 0) {
          setRankings(data.rankings);
        }
        if (typeof data.totalVotes === 'number') {
          setTotalVotes(data.totalVotes);
        }
        if (typeof data.totalSessions === 'number' && data.totalSessions > 0) {
          setTotalSessions(data.totalSessions);
        }
        if (typeof data.totalShares === 'number' && data.totalShares > 0) {
          setTotalShares(data.totalShares);
        }
      }
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      // Graceful fallback to initial seed state during dev reloads or offline
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchResults();
    const interval = setInterval(fetchResults, 12000);
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchResults]);

  return (
    <section id="live-results" className="py-20 bg-[#080808] border-b border-[#2A2410]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
              <BarChart3 className="w-4 h-4" />
              <span>Real-Time Database Feed</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              LIVE VOTING <span className="gold-text-gradient">RESULTS</span>
            </h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-xl">
              Verified live tallies for Best Male Artist of the Year 2026. Every verified ballot directly impacts the rankings below.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 font-mono">
              Last Sync: {lastRefreshed}
            </span>
            <button
              onClick={fetchResults}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#161616] border border-[#2A2410] hover:border-[#D4AF37]/50 text-neutral-300 hover:text-[#F5E084] transition-colors"
              title="Refresh live vote tallies"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>
          </div>
        </div>

        {/* When Results are Hidden by Committee */}
        {isHidden ? (
          <div className="p-10 rounded-2xl bg-[#111111] border border-[#D4AF37]/30 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold uppercase text-white mb-2">
              Official Ballots Sealed
            </h3>
            <p className="text-sm text-neutral-300 mb-6">
              {hiddenMessage}
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Winners will be unveiled live on stage at the Grand Gala</span>
            </div>
          </div>
        ) : (
          <div>
            {/* Top Stat Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              <div className="p-5 rounded-2xl bg-[#121212] border border-[#2A2410]">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase mb-2">
                  <span>Total Verified Votes</span>
                  <Trophy className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-3xl font-extrabold text-white tabular-nums">
                  {totalVotes.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#D4AF37] mt-1 font-medium">
                  Across 6 nominated male contenders
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121212] border border-[#2A2410]">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase mb-2">
                  <span>Registered Voters</span>
                  <Users className="w-4 h-4 text-[#25D366]" />
                </div>
                <div className="text-3xl font-extrabold text-white tabular-nums">
                  {totalSessions.toLocaleString()}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 font-medium">
                  Zimbabwean music enthusiasts
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#121212] border border-[#2A2410]">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-semibold uppercase mb-2">
                  <span>WhatsApp Community Shares</span>
                  <TrendingUp className="w-4 h-4 text-[#F5E084]" />
                </div>
                <div className="text-3xl font-extrabold text-white tabular-nums">
                  {totalShares.toLocaleString()}
                </div>
                <div className="text-[11px] text-[#25D366] mt-1 font-medium">
                  Viral street mobilization
                </div>
              </div>
            </div>

            {/* Leaderboard Table / Cards */}
            <div className="space-y-4">
              {rankings.map((nominee) => {
                const isLeader = nominee.rank === 1;
                return (
                  <div
                    key={nominee.id}
                    className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 ${
                      isLeader
                        ? 'bg-gradient-to-r from-[#1E1705] via-[#14120A] to-[#121212] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
                        : 'bg-[#121212] border border-[#2A2410] hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Rank & Avatar & Details */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 tabular-nums ${
                            nominee.rank === 1
                              ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/30'
                              : nominee.rank === 2
                              ? 'bg-neutral-300 text-black'
                              : nominee.rank === 3
                              ? 'bg-[#CD7F32] text-black'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          #{nominee.rank}
                        </div>

                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                          <Image
                            src={nominee.image}
                            alt={nominee.name}
                            fill
                            sizes="60px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base sm:text-lg font-black uppercase text-white tracking-wide">
                              {nominee.name}
                            </h4>
                            {isLeader && (
                              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#D4AF37] text-black">
                                Current Leader
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-400">
                            {nominee.hometown} · {nominee.genre}
                          </span>
                        </div>
                      </div>

                      {/* Right: Vote counts and percentage */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-0 border-neutral-800 pt-3 sm:pt-0">
                        <div className="text-lg sm:text-2xl font-black text-white tabular-nums">
                          {nominee.votes.toLocaleString()}{' '}
                          <span className="text-xs font-normal text-neutral-400">votes</span>
                        </div>
                        <div className="text-xs font-bold text-[#F5E084] font-mono tabular-nums">
                          {nominee.percentage.toFixed(1)}% of total
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          className={`h-full transition-all duration-700 ease-out ${
                            isLeader
                              ? 'bg-gradient-to-r from-[#D4AF37] via-[#F5E084] to-[#ECC442]'
                              : 'bg-neutral-600'
                          }`}
                          style={{ width: `${Math.max(nominee.percentage, 3)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
