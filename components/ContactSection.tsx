'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 bg-[#080808] border-b border-[#2A2410]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Contact Info & Press */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
              <Mail className="w-4 h-4" />
              <span>Liaison & Media Desk</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight mb-4">
              CONTACT THE <span className="gold-text-gradient">COMMITTEE</span>
            </h2>
            <p className="text-sm text-neutral-400 mb-8 max-w-md">
              For artist representations, press credentials, corporate sponsorship, or ceremony inquiries, reach out to our Harare team.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800 flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">Harare Secretariat</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Ghetto Voice Awards Arts Foundation, 44 Samora Machel Avenue, Harare, Zimbabwe
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800 flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">WhatsApp & Hotline</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    +263 77 123 4567 / +263 71 987 6543
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800 flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-[#F5E084] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">Official Correspondence</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    committee@ghettovoiceawards.co.zw
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#121212] border border-[#2A2410]">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/20 border border-[#25D366] text-[#25D366] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold uppercase text-white">Message Dispatched</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Thank you for contacting the Awards Committee. Our media liaison officer will get in touch within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-neutral-800 text-xs font-bold text-neutral-200"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold uppercase text-white mb-2">
                  Send a Direct Message
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tinashe Moyo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.co.zw"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Artist Management">Artist Management & Verification</option>
                    <option value="Press & Media Accreditation">Press & Media Accreditation</option>
                    <option value="Corporate Sponsorship">Corporate Sponsorship</option>
                    <option value="Voting Integrity Question">Voting Integrity Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can the awards committee assist you?"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080808] border border-neutral-700 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full gold-btn py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
