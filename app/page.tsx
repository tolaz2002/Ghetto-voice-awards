'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CategoryHeader } from '@/components/CategoryHeader';
import { NomineeCard } from '@/components/NomineeCard';
import { VotingSystemGuide } from '@/components/VotingSystemGuide';
import { AboutSection } from '@/components/AboutSection';
import { RulesSection } from '@/components/RulesSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { VotingModal } from '@/components/VotingModal';
import { AdminDashboard } from '@/components/AdminDashboard';
import { Nominee, VoterSession } from '@/lib/types';
import { OFFICIAL_NOMINEES } from '@/lib/constants';
import { Trophy, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [nominees, setNominees] = useState<Nominee[]>(OFFICIAL_NOMINEES);
  const [session, setSession] = useState<VoterSession | null>(null);
  const [ceremonyDate, setCeremonyDate] = useState<string>('2026-12-19T19:00:00+02:00');
  const [announcement, setAnnouncement] = useState<string>('');
  const [votingOpen, setVotingOpen] = useState<boolean>(true);

  // Modals
  const [isVoteModalOpen, setIsVoteModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [selectedNomineeForVote, setSelectedNomineeForVote] = useState<Nominee | null>(null);

  // Fetch nominees & settings
  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/nominees');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.nominees) && data.nominees.length > 0) {
        setNominees(data.nominees);
      }
      if (data.settings) {
        if (data.settings.ceremonyDate) setCeremonyDate(data.settings.ceremonyDate);
        setAnnouncement(data.settings.announcement || '');
        if (typeof data.settings.votingOpen === 'boolean') setVotingOpen(data.settings.votingOpen);
      }
    } catch {
      // Fallback to initial official nominees
    }
  }, []);

  // Fetch or initialize session
  const loadSession = useCallback(async () => {
    try {
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
      }
    } catch {
      // Quiet fallback
    }
  }, []);

  useEffect(() => {
    loadData();
    loadSession();
  }, [loadData, loadSession]);

  const handleOpenVoteForArtist = (nominee: Nominee) => {
    setSelectedNomineeForVote(nominee);
    setIsVoteModalOpen(true);
  };

  const handleOpenGeneralVote = () => {
    setSelectedNomineeForVote(null);
    setIsVoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Top Navbar */}
      <Navbar
        onOpenVote={handleOpenGeneralVote}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Global Announcement Banner if active */}
      {announcement && (
        <div className="bg-gradient-to-r from-[#1E1705] via-[#2A2410] to-[#1E1705] border-b border-[#D4AF37]/40 py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs font-bold text-[#F5E084] uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>{announcement}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <Hero
        ceremonyDateString={ceremonyDate}
        onOpenVote={handleOpenGeneralVote}
      />

      {/* Category Launch Header */}
      <CategoryHeader />

      {/* Nominees Gallery */}
      <section id="nominees" className="py-20 bg-[#080808]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
                <Trophy className="w-4 h-4" />
                <span>2026 Nominees Roster</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                BEST MALE ARTIST <span className="gold-text-gradient">NOMINEES</span>
              </h2>
              <p className="mt-2 text-sm text-neutral-400 max-w-xl">
                Presented in official ballot sequence. Cast your vote for your top 3 contenders using our staged WhatsApp unlock flow.
              </p>
            </div>

            {/* Voter Ballot Status Chip */}
            {session && (
              <div className="p-3.5 rounded-xl bg-[#141414] border border-[#2A2410] flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${session.stage === 'completed' ? 'bg-[#25D366]' : 'bg-[#D4AF37]'}`} />
                <div className="text-xs">
                  <div className="font-bold text-white uppercase">Your Ballot Status</div>
                  <div className="text-neutral-400">
                    {session.stage === 1
                      ? 'Stage 1: Awaiting 1st Vote'
                      : session.stage === 2
                      ? `Stage 2: WhatsApp Unlock (${Object.values(session.sharesCompleted || {}).filter(Boolean).length}/5)`
                      : session.stage === 3
                      ? 'Stage 3: Unlocked (2 Remaining)'
                      : 'Ballot Complete (3/3 Votes)'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nominees 6-Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {nominees.map((nominee, index) => {
              const hasVotedFor = session?.votedArtistIds?.includes(nominee.id) || false;
              return (
                <NomineeCard
                  key={nominee.id}
                  nominee={nominee}
                  index={index}
                  hasVotedFor={hasVotedFor}
                  onVote={handleOpenVoteForArtist}
                  onPhotoUpdated={(nomineeId, newImageUrl) => {
                    setNominees((prev) =>
                      prev.map((n) => (n.id === nomineeId ? { ...n, image: newImageUrl } : n))
                    );
                  }}
                />
              );
            })}
          </div>

          {/* Bottom Prompt */}
          <div className="mt-12 text-center">
            <button
              onClick={handleOpenGeneralVote}
              className="gold-btn px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest inline-flex items-center gap-3 shadow-xl"
            >
              <Trophy className="w-4 h-4 text-black" />
              <span>Open 3-Artist Voting Ballot</span>
            </button>
          </div>
        </div>
      </section>

      {/* Special Voting System Guide */}
      <VotingSystemGuide onStartVoting={handleOpenGeneralVote} />

      {/* About The Awards */}
      <AboutSection />

      {/* Voting Rules & Integrity */}
      <RulesSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer
        onOpenVote={handleOpenGeneralVote}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* 3-Stage Voting Modal */}
      <VotingModal
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        nominees={nominees}
        initialSelectedArtist={selectedNomineeForVote}
        session={session}
        onSessionUpdated={(updatedSession) => {
          setSession(updatedSession);
          loadData();
        }}
      />

      {/* Administration Modal */}
      <AdminDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onDataChanged={loadData}
      />
    </div>
  );
}
