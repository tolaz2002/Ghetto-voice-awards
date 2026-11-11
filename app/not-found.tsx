import Link from 'next/link';
import { Trophy } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#F5E084] mb-6">
        <Trophy className="w-8 h-8" />
      </div>
      <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-sm text-neutral-400 max-w-md mb-8">
        The requested awards page could not be located. Return to the official nominees voting roster.
      </p>
      <Link
        href="/"
        className="gold-btn px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-black"
      >
        Return to Awards Home
      </Link>
    </div>
  );
}
