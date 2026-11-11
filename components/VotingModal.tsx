'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  X,
  Award,
  Share2,
  CheckCircle2,
  Users,
  UserCheck,
  AlertCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Nominee, VoterSession, ShareTasks } from '@/lib/types';

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominees: Nominee[];
  initialSelectedArtist?: Nominee | null;
  session: VoterSession | null;
  onSessionUpdated: (session: VoterSession) => void;
}

export function VotingModal({
  isOpen,
  onClose,
  nominees,
  initialSelectedArtist,
  session,
  onSessionUpdated,
}: VotingModalProps) {
  // Stage state
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | 'completed'>(1);
  const [stage1SelectedId, setStage1SelectedId] = useState<string>('');
  const [stage3SelectedIds, setStage3SelectedIds] = useState<string[]>([]);
  const [phone, setPhone] = useState<string>('');
  const [captchaNum1, setCaptchaNum1] = useState(4);
  const [captchaNum2, setCaptchaNum2] = useState(7);
  const [captchaInput, setCaptchaInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stage1SuccessNotice, setStage1SuccessNotice] = useState(false);

  // Sync state with session
  useEffect(() => {
    if (session) {
      setCurrentStage(session.stage);
      if (session.votedArtistIds && session.votedArtistIds.length > 0) {
        setStage1SelectedId(session.votedArtistIds[0]);
      }
      if (session.voterPhone) {
        setPhone(session.voterPhone);
      }
    }
  }, [session]);

  // Handle initialSelectedArtist when opened
  useEffect(() => {
    if (initialSelectedArtist && currentStage === 1 && !stage1SelectedId) {
      setStage1SelectedId(initialSelectedArtist.id);
    }
  }, [initialSelectedArtist, currentStage, stage1SelectedId]);

  // Generate random captcha challenge on mount
  useEffect(() => {
    setCaptchaNum1(Math.floor(Math.random() * 8) + 2);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 2);
  }, [isOpen]);

  if (!isOpen) return null;

  // Share Tasks
  const shareTasks = session?.sharesCompleted || {
    contact1: false,
    contact2: false,
    contact3: false,
    group1: false,
    group2: false,
  };

  const completedCount = Object.values(shareTasks).filter(Boolean).length;
  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ghettovoiceawards.co.zw';
  const whatsappShareText = `I have just voted in The Ghetto Voice Awards 2026! Support your favourite Zimbabwean artist. Cast your votes here: ${websiteUrl}`;
  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappShareText)}`;

  // Handle First Vote submission
  const handleStage1Submit = async () => {
    setErrorMsg(null);
    if (!stage1SelectedId) {
      setErrorMsg('Please select an artist to cast your first vote.');
      return;
    }

    const expectedAnswer = captchaNum1 + captchaNum2;
    if (parseInt(captchaInput, 10) !== expectedAnswer) {
      setErrorMsg(`Bot verification failed: what is ${captchaNum1} + ${captchaNum2}?`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/vote/first', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistId: stage1SelectedId,
          phone: phone.trim() || undefined,
          captchaAnswer: captchaInput,
          captchaExpected: expectedAnswer,
          sessionId: session?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit first vote');
      }

      onSessionUpdated(data.session);
      setStage1SuccessNotice(true);
      setCurrentStage(2);

      // Trigger celebratory micro-confetti
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F5E084', '#FFFFFF'],
        });
      } catch {}
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error submitting vote';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Share Task Confirmation
  const handleConfirmShare = async (taskKey: keyof ShareTasks) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/vote/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskKey,
          sessionId: session?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update share task');
      }

      onSessionUpdated(data.session);
      if (data.allCompleted) {
        setCurrentStage(3);
        try {
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.5 },
            colors: ['#25D366', '#D4AF37', '#FFFFFF'],
          });
        } catch {}
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error updating task';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Stage 3 Toggle Selection
  const toggleStage3Artist = (artistId: string) => {
    // If already in stage 1, cannot select
    if (session?.votedArtistIds.includes(artistId)) return;

    if (stage3SelectedIds.includes(artistId)) {
      setStage3SelectedIds(stage3SelectedIds.filter((id) => id !== artistId));
    } else {
      if (stage3SelectedIds.length >= 2) {
        // Replace second or warn
        setStage3SelectedIds([stage3SelectedIds[1], artistId]);
      } else {
        setStage3SelectedIds([...stage3SelectedIds, artistId]);
      }
    }
  };

  // Handle Final Votes Submission
  const handleStage3Submit = async () => {
    setErrorMsg(null);
    if (stage3SelectedIds.length !== 2) {
      setErrorMsg('Please select exactly TWO different artists for your remaining votes.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/vote/final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistIds: stage3SelectedIds,
          sessionId: session?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit final votes');
      }

      onSessionUpdated(data.session);
      setCurrentStage('completed');

      // Grand celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#D4AF37', '#F5E084', '#25D366', '#FFFFFF'],
        });
      } catch {}
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error submitting final votes';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  // Determine stage artists for completion
  const stage1Artist = nominees.find((n) => n.id === session?.votedArtistIds[0]);
  const stage2Artist = nominees.find((n) => n.id === session?.votedArtistIds[1]);
  const stage3Artist = nominees.find((n) => n.id === session?.votedArtistIds[2]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111111] border border-[#D4AF37]/40 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#2A2410] bg-[#161616] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F5E084]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold uppercase text-white tracking-wider">
                Official Voting Ballot
              </h3>
              <p className="text-[11px] text-[#D4AF37] font-semibold">
                Best Male Artist of the Year 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Stage Visual Stepper */}
        <div className="bg-[#0A0A0A] px-4 py-3 border-b border-neutral-800 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${currentStage === 1 ? 'text-[#F5E084]' : 'text-neutral-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStage === 1 ? 'bg-[#D4AF37] text-black' : 'bg-[#25D366] text-white'}`}>
              {currentStage !== 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">First Vote</span>
          </div>

          <ChevronRight className="w-4 h-4 text-neutral-700" />

          <div className={`flex items-center gap-1.5 font-bold ${currentStage === 2 ? 'text-[#25D366]' : currentStage === 3 || currentStage === 'completed' ? 'text-[#25D366]' : 'text-neutral-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStage !== 1 ? 'bg-[#25D366] text-white' : 'bg-neutral-800'}`}>
              {currentStage === 3 || currentStage === 'completed' ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">WhatsApp Unlock ({completedCount}/5)</span>
          </div>

          <ChevronRight className="w-4 h-4 text-neutral-700" />

          <div className={`flex items-center gap-1.5 font-bold ${currentStage === 3 ? 'text-[#F5E084]' : currentStage === 'completed' ? 'text-[#25D366]' : 'text-neutral-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStage === 3 ? 'bg-[#D4AF37] text-black' : currentStage === 'completed' ? 'bg-[#25D366] text-white' : 'bg-neutral-800'}`}>
              {currentStage === 'completed' ? '✓' : '3'}
            </span>
            <span className="hidden sm:inline">Final 2 Votes</span>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-4 mt-4 p-3 rounded-lg bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body content based on stage */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* ================= STAGE 1: FIRST VOTE ================= */}
          {currentStage === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                  Stage 1 of 3 · Cast Your Lead Vote
                </span>
                <h4 className="text-xl font-black uppercase text-white mt-0.5">
                  Select Your Favourite Artist
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  Choose the nominee you believe deserves the ultimate honour for 2026.
                </p>
              </div>

              {/* Nominee Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {nominees.map((nominee) => {
                  const isSelected = stage1SelectedId === nominee.id;
                  return (
                    <button
                      key={nominee.id}
                      type="button"
                      onClick={() => setStage1SelectedId(nominee.id)}
                      className={`relative rounded-xl overflow-hidden text-left border transition-all p-2 flex flex-col items-center ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#221C0A] shadow-lg shadow-[#D4AF37]/20 ring-2 ring-[#D4AF37]'
                          : 'border-neutral-800 bg-[#161616] hover:border-neutral-700'
                      }`}
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-neutral-900">
                        <Image
                          src={nominee.image}
                          alt={nominee.name}
                          fill
                          sizes="(max-width: 640px) 45vw, 20vw"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#D4AF37]/20 flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold">
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-black uppercase text-center text-white line-clamp-1 pb-1">
                        {nominee.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Anti-Bot & Optional Phone Verification */}
              <div className="p-4 rounded-xl bg-[#161616] border border-neutral-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Voter Integrity & Verification</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Anti-Bot Challenge: What is {captchaNum1} + {captchaNum2}? *
                    </label>
                    <input
                      type="number"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="Answer"
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0C0C] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                      Phone Number (Optional for SMS Badge)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+263 77..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0C0C] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleStage1Submit}
                disabled={loading || !stage1SelectedId}
                className="w-full gold-btn py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Award className="w-4 h-4 text-black" />
                )}
                <span>Submit First Vote</span>
              </button>
            </div>
          )}

          {/* ================= STAGE 2: WHATSAPP SHARING ================= */}
          {currentStage === 2 && (
            <div className="space-y-6">
              {/* Success Banner from Stage 1 */}
              <div className="p-4 rounded-xl bg-[#142319] border border-[#25D366]/40 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-bold text-white uppercase tracking-wide">
                    YOUR FIRST VOTE HAS BEEN SUCCESSFULLY SUBMITTED!
                  </h5>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Want to support two more artists? Unlock your remaining votes by sharing The Ghetto Voice Awards with your friends and WhatsApp communities.
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-4 rounded-xl bg-[#161616] border border-neutral-800">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                  <span>SHARING PROGRESS: {completedCount}/5 COMPLETED</span>
                  <span className="text-[#25D366] font-mono">{Math.round((completedCount / 5) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="h-full bg-gradient-to-r from-[#25D366] to-[#40EC80] transition-all duration-300"
                    style={{ width: `${(completedCount / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* 5 Sharing Tasks */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                  5 WhatsApp Community Sharing Tasks:
                </span>

                {/* Task 1 */}
                <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${shareTasks.contact1 ? 'bg-[#25D366] text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {shareTasks.contact1 ? '✓' : '1'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">Share with WhatsApp Contact 1</div>
                      <div className="text-[10px] text-neutral-400">Send vote link to a music friend</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-btn px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      disabled={shareTasks.contact1 || loading}
                      onClick={() => handleConfirmShare('contact1')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${shareTasks.contact1 ? 'bg-neutral-800 text-[#25D366]' : 'bg-[#222] hover:bg-[#333] text-white border border-neutral-700'}`}
                    >
                      {shareTasks.contact1 ? 'Confirmed' : 'Confirm'}
                    </button>
                  </div>
                </div>

                {/* Task 2 */}
                <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${shareTasks.contact2 ? 'bg-[#25D366] text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {shareTasks.contact2 ? '✓' : '2'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">Share with WhatsApp Contact 2</div>
                      <div className="text-[10px] text-neutral-400">Share with family or colleague</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-btn px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      disabled={shareTasks.contact2 || loading}
                      onClick={() => handleConfirmShare('contact2')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${shareTasks.contact2 ? 'bg-neutral-800 text-[#25D366]' : 'bg-[#222] hover:bg-[#333] text-white border border-neutral-700'}`}
                    >
                      {shareTasks.contact2 ? 'Confirmed' : 'Confirm'}
                    </button>
                  </div>
                </div>

                {/* Task 3 */}
                <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${shareTasks.contact3 ? 'bg-[#25D366] text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {shareTasks.contact3 ? '✓' : '3'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">Share with WhatsApp Contact 3</div>
                      <div className="text-[10px] text-neutral-400">Share with another supporter</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-btn px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      disabled={shareTasks.contact3 || loading}
                      onClick={() => handleConfirmShare('contact3')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${shareTasks.contact3 ? 'bg-neutral-800 text-[#25D366]' : 'bg-[#222] hover:bg-[#333] text-white border border-neutral-700'}`}
                    >
                      {shareTasks.contact3 ? 'Confirmed' : 'Confirm'}
                    </button>
                  </div>
                </div>

                {/* Task 4 (Group 1) */}
                <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${shareTasks.group1 ? 'bg-[#25D366] text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {shareTasks.group1 ? '✓' : '4'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">Share in WhatsApp Group 1</div>
                      <div className="text-[10px] text-neutral-400">Music, hood, or community chat group</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-btn px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      disabled={shareTasks.group1 || loading}
                      onClick={() => handleConfirmShare('group1')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${shareTasks.group1 ? 'bg-neutral-800 text-[#25D366]' : 'bg-[#222] hover:bg-[#333] text-white border border-neutral-700'}`}
                    >
                      {shareTasks.group1 ? 'Confirmed' : 'Confirm'}
                    </button>
                  </div>
                </div>

                {/* Task 5 (Group 2) */}
                <div className="p-3.5 rounded-xl bg-[#161616] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${shareTasks.group2 ? 'bg-[#25D366] text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                      {shareTasks.group2 ? '✓' : '5'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase">Share in WhatsApp Group 2</div>
                      <div className="text-[10px] text-neutral-400">Social, alumni, or family group</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="whatsapp-btn px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      disabled={shareTasks.group2 || loading}
                      onClick={() => handleConfirmShare('group2')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${shareTasks.group2 ? 'bg-neutral-800 text-[#25D366]' : 'bg-[#222] hover:bg-[#333] text-white border border-neutral-700'}`}
                    >
                      {shareTasks.group2 ? 'Confirmed' : 'Confirm'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Transparent Disclaimer */}
              <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  <strong>Transparency Note:</strong> WhatsApp does not provide websites with confirmation of message delivery due to end-to-end privacy. Please honour the integrity of Zimbabwean music by genuinely spreading the word.
                </span>
              </div>
            </div>
          )}

          {/* ================= STAGE 3: FINAL TWO VOTES ================= */}
          {currentStage === 3 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#221C0A] border border-[#D4AF37]/50 text-center">
                <span className="text-xs font-black uppercase tracking-widest text-[#F5E084] block mb-1">
                  CONGRATULATIONS!
                </span>
                <h4 className="text-lg sm:text-xl font-black uppercase text-white">
                  YOU HAVE UNLOCKED YOUR FINAL TWO VOTES!
                </h4>
                <p className="text-xs text-neutral-300 mt-1 max-w-lg mx-auto">
                  Select <strong className="text-[#F5E084]">TWO MORE DIFFERENT ARTISTS</strong> from the nominees below to complete your 3-artist ballot.
                </p>
              </div>

              {/* Nominee Grid for Stage 3 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {nominees.map((nominee) => {
                  const isStage1Chosen = session?.votedArtistIds.includes(nominee.id);
                  const isStage3Chosen = stage3SelectedIds.includes(nominee.id);

                  return (
                    <button
                      key={nominee.id}
                      type="button"
                      disabled={isStage1Chosen}
                      onClick={() => toggleStage3Artist(nominee.id)}
                      className={`relative rounded-xl overflow-hidden text-left border transition-all p-2 flex flex-col items-center ${
                        isStage1Chosen
                          ? 'opacity-40 border-neutral-800 bg-neutral-950 cursor-not-allowed'
                          : isStage3Chosen
                          ? 'border-[#25D366] bg-[#0A2212] ring-2 ring-[#25D366]'
                          : 'border-neutral-800 bg-[#161616] hover:border-neutral-700'
                      }`}
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-neutral-900">
                        <Image
                          src={nominee.image}
                          alt={nominee.name}
                          fill
                          sizes="(max-width: 640px) 45vw, 20vw"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isStage1Chosen && (
                          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-1 text-center">
                            <span className="text-[10px] font-bold text-[#F5E084] uppercase">
                              Already Voted (Stage 1)
                            </span>
                          </div>
                        )}
                        {isStage3Chosen && (
                          <div className="absolute inset-0 bg-[#25D366]/20 flex items-center justify-center">
                            <div className="w-7 h-7 rounded-full bg-[#25D366] text-white flex items-center justify-center font-bold">
                              ✓
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-black uppercase text-center text-white line-clamp-1 pb-1">
                        {nominee.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between text-xs text-neutral-400 font-semibold px-2">
                <span>Selected: {stage3SelectedIds.length} / 2 required</span>
                <span className="text-[#D4AF37]">
                  {stage3SelectedIds.length === 2 ? 'Ready to finalize ballot' : 'Choose 2 different artists'}
                </span>
              </div>

              {/* Submit Final Votes Button */}
              <button
                type="button"
                onClick={handleStage3Submit}
                disabled={loading || stage3SelectedIds.length !== 2}
                className="w-full gold-btn py-3.5 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Sparkles className="w-4 h-4 text-black" />
                )}
                <span>Submit Final Two Votes</span>
              </button>
            </div>
          )}

          {/* ================= COMPLETED BALLOT SCREEN ================= */}
          {currentStage === 'completed' && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F5E084] mx-auto flex items-center justify-center shadow-lg shadow-[#D4AF37]/30 text-black">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black uppercase text-white tracking-wide">
                  THANK YOU FOR SUPPORTING ZIMBABWEAN MUSIC!
                </h4>
                <p className="text-sm text-[#F5E084] font-medium mt-1">
                  Your three votes have been recorded. Together, we celebrate the voices of the streets!
                </p>
              </div>

              {/* Display the 3 selected artists */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-[#2A2410]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
                  Your Official 3-Artist Certified Ballot:
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[stage1Artist, stage2Artist, stage3Artist].filter(Boolean).map((artist, idx) => (
                    <div key={artist?.id || idx} className="rounded-xl overflow-hidden bg-[#0C0C0C] border border-neutral-800 p-2">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-1.5 bg-neutral-900">
                        {artist && (
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            sizes="20vw"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <span className="block text-[10px] text-[#D4AF37] font-bold uppercase">Vote #{idx + 1}</span>
                      <span className="block text-xs font-black uppercase text-white truncate">
                        {artist?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#nominees"
                  onClick={onClose}
                  className="w-full gold-btn py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-black" />
                  <span>View Nominees Roster</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-300 bg-neutral-800 hover:bg-neutral-700"
                >
                  Close Ballot
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
