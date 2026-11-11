'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  X,
  Shield,
  Lock,
  Download,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Edit2,
  Save,
  Trash2,
  Users,
  Award,
  Share2,
  Camera,
} from 'lucide-react';
import { Nominee, Settings, AuditLogEntry, VoteRecord } from '@/lib/types';

interface AdminStats {
  totalVotes: number;
  totalSessions: number;
  completedSessions: number;
  stage2Sessions: number;
  stage3Sessions: number;
  totalShares: number;
  rankings: (Nominee & { rank: number; percentage: number })[];
  settings: Settings;
  recentVotes: VoteRecord[];
  auditLogs: AuditLogEntry[];
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

export function AdminDashboard({ isOpen, onClose, onDataChanged }: AdminDashboardProps) {
  const [passcode, setPasscode] = useState('ghetto2026');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'nominees' | 'audit'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Nominee modal state
  const [editingNominee, setEditingNominee] = useState<Nominee | null>(null);

  // Settings form
  const [formSettings, setFormSettings] = useState<Partial<Settings>>({
    votingOpen: true,
    showLiveResults: true,
    ceremonyDate: '2026-12-19T19:00:00+02:00',
    announcement: '',
  });

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', passcode }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Check your passcode.');
      }
      setIsAuthenticated(true);
      setStats(data.stats);
      if (data.stats.settings) {
        setFormSettings(data.stats.settings);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error logging in';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', passcode }),
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        if (onDataChanged) onDataChanged();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateSettings',
          passcode,
          settings: formSettings,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save settings');
      }
      setStats(data.stats);
      setSuccessMsg('Awards settings successfully updated and deployed.');
      if (onDataChanged) onDataChanged();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update settings';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNominee = async () => {
    if (!editingNominee) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateNominee',
          passcode,
          nomineeId: editingNominee.id,
          nomineeUpdates: editingNominee,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update nominee');
      }
      setStats(data.stats);
      setEditingNominee(null);
      setSuccessMsg(`Nominee ${editingNominee.name} updated.`);
      if (onDataChanged) onDataChanged();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save nominee';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    window.location.href = `/api/admin?passcode=${encodeURIComponent(passcode)}&export=csv`;
  };

  const handleResetDemo = async () => {
    if (!confirm('Are you sure you want to reset all votes and voter sessions back to official initial state?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resetDemo', passcode }),
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setSuccessMsg('System reset to official baseline configuration.');
        if (onDataChanged) onDataChanged();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111111] border border-[#D4AF37]/40 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2A2410] bg-[#161616] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#F5E084]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold uppercase text-white tracking-wider">
                GVA Committee Administration Portal
              </h3>
              <p className="text-[11px] text-[#D4AF37] font-semibold">
                Audit Trail, Ballots & Ceremony Control · Harare 2026
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

        {/* Not Authenticated Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold uppercase text-white">Administrator Passcode</h4>
            <p className="text-xs text-neutral-400">
              Enter the authorized Ghetto Voice Awards committee security code to access voting telemetry and ballot controls.
            </p>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Passcode (Default: ghetto2026)"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080808] border border-neutral-700 text-center text-sm text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full gold-btn py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : null}
                <span>Authenticate & Unlock</span>
              </button>
            </form>
            <div className="text-[11px] text-neutral-500">
              Default demo key: <code className="text-[#D4AF37]">ghetto2026</code>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="bg-[#0A0A0A] px-4 sm:px-6 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex space-x-1 sm:space-x-4">
                {(['overview', 'settings', 'nominees', 'audit'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-[#D4AF37] text-[#F5E084]'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={refreshStats}
                  className="p-1.5 text-neutral-400 hover:text-white"
                  title="Refresh stats"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
                </button>
                <button
                  onClick={handleDownloadCsv}
                  className="px-3 py-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#2A2A2A] border border-neutral-700 text-white text-[11px] font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            {successMsg && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-green-950/80 border border-green-800 text-green-200 text-xs flex items-center justify-between">
                <span>{successMsg}</span>
                <button onClick={() => setSuccessMsg(null)}>×</button>
              </div>
            )}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center justify-between">
                <span>{errorMsg}</span>
                <button onClick={() => setErrorMsg(null)}>×</button>
              </div>
            )}

            {/* Tab Panels */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
              {/* === OVERVIEW TAB === */}
              {activeTab === 'overview' && stats && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-xl bg-[#161616] border border-[#2A2410]">
                      <div className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Total Votes</div>
                      <div className="text-2xl font-black text-white tabular-nums">{stats.totalVotes.toLocaleString()}</div>
                      <div className="text-[10px] text-[#D4AF37] mt-0.5">Across all 6 artists</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#161616] border border-[#2A2410]">
                      <div className="text-[10px] text-neutral-400 uppercase font-bold mb-1">Voters Registered</div>
                      <div className="text-2xl font-black text-white tabular-nums">{stats.totalSessions.toLocaleString()}</div>
                      <div className="text-[10px] text-[#25D366] mt-0.5">Unique sessions</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#161616] border border-[#2A2410]">
                      <div className="text-[10px] text-neutral-400 uppercase font-bold mb-1">3/3 Completed</div>
                      <div className="text-2xl font-black text-white tabular-nums">{stats.completedSessions.toLocaleString()}</div>
                      <div className="text-[10px] text-[#F5E084] mt-0.5">Full ballots verified</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#161616] border border-[#2A2410]">
                      <div className="text-[10px] text-neutral-400 uppercase font-bold mb-1">WhatsApp Shares</div>
                      <div className="text-2xl font-black text-white tabular-nums">{stats.totalShares.toLocaleString()}</div>
                      <div className="text-[10px] text-[#25D366] mt-0.5">Completed tasks</div>
                    </div>
                  </div>

                  {/* Leaderboard Summary */}
                  <div className="p-5 rounded-xl bg-[#161616] border border-neutral-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                        Verified Vote Standings
                      </h4>
                      <span className="text-xs text-neutral-400">
                        Status: {stats.settings.votingOpen ? 'Voting OPEN' : 'Voting CLOSED'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {stats.rankings.map((nominee) => (
                        <div key={nominee.id} className="p-3 rounded-lg bg-[#0E0E0E] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="w-6 text-xs font-black text-[#D4AF37] tabular-nums">#{nominee.rank}</span>
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-neutral-900">
                              <Image src={nominee.image} alt={nominee.name} fill sizes="32px" className="object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <span className="text-xs font-bold uppercase text-white truncate max-w-[140px] sm:max-w-xs">{nominee.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <span className="text-xs font-bold text-white tabular-nums">{nominee.votes.toLocaleString()} votes</span>
                            <span className="text-xs text-[#F5E084] font-mono tabular-nums">{nominee.percentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* === SETTINGS TAB === */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-xl">
                  <div className="p-5 rounded-xl bg-[#161616] border border-neutral-800 space-y-5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                      Voting System Configuration
                    </h4>

                    {/* Voting Open/Closed Toggle */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-sm font-bold text-white uppercase">Accept Public Votes</div>
                        <div className="text-xs text-neutral-400">When toggled off, voting submissions will be rejected.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormSettings({ ...formSettings, votingOpen: !formSettings.votingOpen })}
                        className="text-2xl text-[#D4AF37]"
                      >
                        {formSettings.votingOpen ? (
                          <ToggleRight className="w-10 h-10 text-[#25D366]" />
                        ) : (
                          <ToggleLeft className="w-10 h-10 text-neutral-600" />
                        )}
                      </button>
                    </div>

                    {/* Show/Hide Live Results Toggle */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                      <div>
                        <div className="text-sm font-bold text-white uppercase">Publish Live Results</div>
                        <div className="text-xs text-neutral-400">Seal results if the committee wishes to build suspense for the live ceremony.</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormSettings({ ...formSettings, showLiveResults: !formSettings.showLiveResults })}
                        className="text-2xl text-[#D4AF37]"
                      >
                        {formSettings.showLiveResults ? (
                          <ToggleRight className="w-10 h-10 text-[#25D366]" />
                        ) : (
                          <ToggleLeft className="w-10 h-10 text-neutral-600" />
                        )}
                      </button>
                    </div>

                    {/* Ceremony Date */}
                    <div className="pt-4 border-t border-neutral-800">
                      <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                        Awards Ceremony Date & Time (ISO String)
                      </label>
                      <input
                        type="text"
                        value={formSettings.ceremonyDate || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, ceremonyDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                      <span className="text-[10px] text-neutral-500">Example: 2026-12-19T19:00:00+02:00</span>
                    </div>

                    {/* Announcement Banner */}
                    <div className="pt-4 border-t border-neutral-800">
                      <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                        Live Announcement Ticker
                      </label>
                      <input
                        type="text"
                        value={formSettings.announcement || ''}
                        onChange={(e) => setFormSettings({ ...formSettings, announcement: e.target.value })}
                        placeholder="Public advisory or committee message"
                        className="w-full px-3 py-2 rounded-lg bg-[#080808] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={loading}
                      className="w-full gold-btn py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4 text-black" />
                      <span>Save and Apply Settings</span>
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-red-300 uppercase">Emergency Reset</div>
                      <div className="text-[11px] text-neutral-400">Reverts all voting numbers and sessions to clean demo state.</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleResetDemo}
                      className="px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Reset Demo
                    </button>
                  </div>
                </div>
              )}

              {/* === NOMINEES TAB === */}
              {activeTab === 'nominees' && stats && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                      Nominees Management (Best Male Artist 2026)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.rankings.map((nominee) => (
                      <div key={nominee.id} className="p-4 rounded-xl bg-[#161616] border border-neutral-800 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 shrink-0">
                            <Image src={nominee.image} alt={nominee.name} fill sizes="48px" className="object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h5 className="text-sm font-bold uppercase text-white">{nominee.name}</h5>
                            <p className="text-[11px] text-[#D4AF37]">{nominee.genre}</p>
                            <p className="text-[11px] text-neutral-400">{nominee.hometown}</p>
                            <span className="text-xs font-bold text-white mt-1 inline-block tabular-nums">
                              {nominee.votes.toLocaleString()} votes
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => setEditingNominee({ ...nominee })}
                          className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                          title="Edit Nominee"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Edit Modal Overlay */}
                  {editingNominee && (
                    <div className="p-5 rounded-xl bg-[#1A1A1A] border border-[#D4AF37] space-y-3 mt-6">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold uppercase text-white">Edit Nominee: {editingNominee.name}</h5>
                        <button onClick={() => setEditingNominee(null)}>×</button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-neutral-400 block mb-1">Artist Name</label>
                          <input
                            type="text"
                            value={editingNominee.name}
                            onChange={(e) => setEditingNominee({ ...editingNominee, name: e.target.value })}
                            className="w-full px-3 py-1.5 rounded bg-black border border-neutral-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-neutral-400 block mb-1">Genre</label>
                          <input
                            type="text"
                            value={editingNominee.genre}
                            onChange={(e) => setEditingNominee({ ...editingNominee, genre: e.target.value })}
                            className="w-full px-3 py-1.5 rounded bg-black border border-neutral-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-neutral-400 block mb-1">Hometown</label>
                          <input
                            type="text"
                            value={editingNominee.hometown}
                            onChange={(e) => setEditingNominee({ ...editingNominee, hometown: e.target.value })}
                            className="w-full px-3 py-1.5 rounded bg-black border border-neutral-700 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-neutral-400 block mb-1">Image / Photo</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editingNominee.image}
                              onChange={(e) => setEditingNominee({ ...editingNominee, image: e.target.value })}
                              className="w-full px-3 py-1.5 rounded bg-black border border-neutral-700 text-white text-xs"
                            />
                            <label className="px-3 py-1.5 rounded bg-[#D4AF37] hover:bg-[#F5E084] text-black font-bold text-xs cursor-pointer flex items-center gap-1 shrink-0">
                              <Camera className="w-3.5 h-3.5" />
                              <span>Pick File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const fd = new FormData();
                                  fd.append('nomineeId', editingNominee.id);
                                  fd.append('file', file);
                                  const res = await fetch('/api/nominees/photo', { method: 'POST', body: fd });
                                  const data = await res.json();
                                  if (data.success) {
                                    setEditingNominee({ ...editingNominee, image: data.image });
                                    refreshStats();
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-neutral-400 block mb-1 text-xs">Bio</label>
                        <textarea
                          rows={2}
                          value={editingNominee.bio}
                          onChange={(e) => setEditingNominee({ ...editingNominee, bio: e.target.value })}
                          className="w-full px-3 py-1.5 rounded bg-black border border-neutral-700 text-white text-xs"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button onClick={handleSaveNominee} className="gold-btn px-4 py-2 rounded text-xs font-bold uppercase">
                          Save Nominee
                        </button>
                        <button onClick={() => setEditingNominee(null)} className="px-4 py-2 rounded bg-neutral-800 text-xs">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* === AUDIT LOG TAB === */}
              {activeTab === 'audit' && stats && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                      Security & Transaction Audit Trail
                    </h4>
                    <span className="text-[11px] text-neutral-400">Showing last 40 system events</span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {stats.auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          log.severity === 'warning'
                            ? 'bg-yellow-950/20 border-yellow-800/40 text-yellow-200'
                            : log.severity === 'alert'
                            ? 'bg-red-950/20 border-red-800/40 text-red-200'
                            : 'bg-[#141414] border-neutral-800 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black font-bold uppercase">
                            {log.event}
                          </span>
                          <span className="font-normal">{log.detail}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
