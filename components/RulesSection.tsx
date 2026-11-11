'use client';

import React from 'react';
import { ShieldCheck, Users, Lock, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export function RulesSection() {
  const rules = [
    {
      num: '01',
      title: 'The 3-Artist Non-Duplicate Ballot',
      desc: 'Each qualified voter must vote for three distinct artists in total. The system enforces strict uniqueness: no voter can assign more than one vote to the same nominee within a single voting session.',
    },
    {
      num: '02',
      title: 'Progressive Staged Voting Architecture',
      desc: 'Stage 1 permits an immediate lead vote. To unlock Stage 3 (final two votes), the voter must complete 5 community sharing tasks (3 WhatsApp contacts + 2 WhatsApp groups) to mobilize Zimbabwean music culture.',
    },
    {
      num: '03',
      title: 'WhatsApp Privacy & Verification Transparency',
      desc: 'WhatsApp messages are end-to-end encrypted; external websites cannot read or confirm recipient delivery. We maintain transparent voter-confirmation logging and anti-spam rate limiting while trusting our community to share honestly.',
    },
    {
      num: '04',
      title: 'Anti-Bot & Rate Limiting Guardrails',
      desc: 'Automated voting bots, click farms, and script injections are blocked via server-side session hashing, mathematical captcha, velocity constraints, and automated fraud flags.',
    },
    {
      num: '05',
      title: 'Independent Committee Audit',
      desc: 'All database transactions are logged with an immutable audit trail. Prior to the live awards ceremony, the independent auditing committee verifies the final tally before the winner is declared.',
    },
    {
      num: '06',
      title: '100% Free & Open Access',
      desc: 'Voting in The Ghetto Voice Awards is completely free of charge. No fee or paid premium vote is ever solicited from voters or artists.',
    },
  ];

  return (
    <section id="rules" className="py-20 bg-[#0C0C0C] border-b border-[#2A2410]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D4AF37] mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Ballot Integrity</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            VOTING RULES & <span className="gold-text-gradient">CONSTITUTION</span>
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Engineered to safeguard genuine fan will, prevent bot manipulation, and ensure complete transparency across Zimbabwe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule) => (
            <div
              key={rule.num}
              className="p-6 rounded-2xl bg-[#141414] border border-[#2A2410] hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-sm font-black text-[#D4AF37] font-mono tracking-wider block mb-2">
                  RULE {rule.num}
                </span>
                <h3 className="text-base font-bold uppercase text-white mb-2 leading-snug">
                  {rule.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {rule.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center gap-1.5 text-[11px] text-[#25D366] font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Enforced on Server</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
