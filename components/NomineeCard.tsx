'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Award, Music, MapPin, CheckCircle2, Camera, RefreshCw, Undo2 } from 'lucide-react';
import { Nominee } from '@/lib/types';

interface NomineeCardProps {
  nominee: Nominee;
  index: number;
  hasVotedFor: boolean;
  onVote: (nominee: Nominee) => void;
  onPhotoUpdated?: (nomineeId: string, newImageUrl: string) => void;
}

export function NomineeCard({ nominee, index, hasVotedFor, onVote, onPhotoUpdated }: NomineeCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be re-selected if desired
    e.target.value = '';

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('nomineeId', nominee.id);
      formData.append('file', file);

      const res = await fetch('/api/nominees/photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to upload photo');
      }

      showToast('Photo replaced successfully!');
      if (onPhotoUpdated) {
        onPhotoUpdated(nominee.id, data.image);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload error';
      showToast(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetPhoto = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUploading(true);
    try {
      const res = await fetch('/api/nominees/photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomineeId: nominee.id,
          reset: true,
        }),
      });

      const data = await res.json();
      if (data.success && onPhotoUpdated) {
        showToast('Reset to default photo');
        onPhotoUpdated(nominee.id, data.image);
      }
    } catch {
      showToast('Reset failed');
    } finally {
      setIsUploading(false);
    }
  };

  const isCustomPhoto = nominee.image.includes('custom-');

  return (
    <div className="group relative rounded-2xl overflow-hidden gold-card flex flex-col justify-between h-full">
      {/* Hidden File Picker Input (Supports mobile gallery / camera & desktop files) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Visual Portrait Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-neutral-900">
        <Image
          src={nominee.image}
          alt={`Nominee portrait of ${nominee.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Contrast Scrim for Text Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded bg-[#080808]/85 border border-[#D4AF37]/50 text-[10px] font-extrabold uppercase tracking-widest text-[#F5E084] backdrop-blur-md">
            NOMINATED
          </span>
          <div className="flex items-center gap-1.5">
            {isCustomPhoto && (
              <button
                type="button"
                onClick={handleResetPhoto}
                disabled={isUploading}
                title="Reset to official original portrait"
                className="w-7 h-7 rounded-full bg-[#080808]/80 hover:bg-[#1A1A1A] border border-neutral-700 text-neutral-300 flex items-center justify-center transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5 text-neutral-400 hover:text-white" />
              </button>
            )}
            <span className="w-7 h-7 rounded-full bg-[#080808]/80 border border-neutral-700 text-xs font-bold text-neutral-300 flex items-center justify-center tabular-nums">
              0{index + 1}
            </span>
          </div>
        </div>

        {/* Quick Replace Photo Button (Prominent & Easy to Tap) */}
        <div className="absolute top-12 right-3 z-10">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg bg-[#080808]/90 hover:bg-[#141414] border border-[#D4AF37]/70 hover:border-[#D4AF37] text-[#F5E084] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-xl backdrop-blur-md transition-all hover:scale-105"
            title="Replace artist photo from your files or phone gallery"
          >
            {isUploading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            )}
            <span>{isUploading ? 'Uploading...' : 'Replace Photo'}</span>
          </button>
        </div>

        {/* Toast / Status Notification on Card */}
        {toastMessage && (
          <div className="absolute top-1/2 left-3 right-3 -translate-y-1/2 z-20 p-2.5 rounded-xl bg-black/95 border border-[#D4AF37] text-center text-xs font-bold text-[#F5E084] shadow-2xl animate-fade-in">
            {toastMessage}
          </div>
        )}

        {/* Bottom Image Info */}
        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="flex items-center gap-1.5 text-[11px] text-[#F5E084] font-medium mb-0.5">
            <MapPin className="w-3 h-3 text-[#D4AF37]" />
            <span>{nominee.hometown}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide drop-shadow-md">
            {nominee.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-[#121212]">
        <div>
          {/* Category Subtext */}
          <div className="text-[11px] font-bold tracking-wider text-[#D4AF37] uppercase mb-2">
            BEST MALE ARTIST OF THE YEAR 2026
          </div>

          {/* Genre & Bio */}
          <p className="text-xs text-neutral-400 line-clamp-2 mb-3 leading-relaxed">
            {nominee.bio}
          </p>

          {/* Key Hits */}
          <div className="mb-4 pt-3 border-t border-neutral-800">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-2">
              <Music className="w-3 h-3 text-[#D4AF37]" />
              <span>Street Anthems & Hits</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {nominee.keyHits.slice(0, 3).map((hit) => (
                <span
                  key={hit}
                  className="px-2 py-0.5 rounded text-[11px] bg-neutral-900 border border-neutral-800 text-neutral-300"
                >
                  {hit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {hasVotedFor ? (
            <div className="w-full py-3 px-4 rounded-xl bg-neutral-900 border border-[#25D366]/40 text-[#25D366] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Voted on Your Ballot</span>
            </div>
          ) : (
            <button
              onClick={() => onVote(nominee)}
              className="w-full gold-btn py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-black" />
              <span>Vote For This Artist</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
