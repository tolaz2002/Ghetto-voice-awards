import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Ghetto Voice Awards 2026 | Zimbabwe',
  description: 'Celebrating the Voices of the Streets. Official voting platform for Best Male Artist of the Year 2026.',
  openGraph: {
    title: 'The Ghetto Voice Awards 2026 | Zimbabwe',
    description: 'Celebrating the Voices of the Streets. Vote for Best Male Artist of the Year 2026.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Ghetto Voice Awards 2026 | Zimbabwe',
    description: 'Celebrating the Voices of the Streets. Cast your 3 votes now!',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#080808] text-[#F3F4F6] min-h-screen antialiased selection:bg-[#D4AF37] selection:text-black" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
