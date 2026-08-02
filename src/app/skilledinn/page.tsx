'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SkilledInnFeedPage() {
  const [search, setSearch] = useState('');

  const talents = [
    {
      id: 't1',
      name: 'Nikhil Yadav',
      username: 'nikhil_y',
      role: 'Full Stack Engineer & AI Specialist',
      college: 'NIT Silchar',
      skills: ['React', 'Next.js', 'Node.js', 'Python', 'System Architecture'],
      bio: 'Building scalable web applications, agentic AI frameworks & real-time platforms.'
    },
    {
      id: 't2',
      name: 'Aarav Sharma',
      username: 'aarav_dev',
      role: 'UI/UX Designer & Product Lead',
      college: 'NIT Silchar',
      skills: ['Figma', 'Design Systems', 'TailwindCSS', 'User Research'],
      bio: 'Crafting user-centered interfaces with dynamic animations and rich dark aesthetics.'
    },
    {
      id: 't3',
      name: 'Rohan Gupta',
      username: 'rohan_cp',
      role: 'Competitive Programmer & Backend Dev',
      college: 'NIT Silchar',
      skills: ['C++', 'Data Structures', 'Algorithms', 'MongoDB', 'Redis'],
      bio: 'Candidate Master on Codeforces. Passionate about high-throughput backend systems.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] font-sans pb-20">
      
      {/* Top Navbar — Twitter / X Monochromatic Black & White */}
      <header className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black text-white tracking-tight">
          GPS · SkilledInn
        </Link>

        <div className="relative flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Search skills, developers, designers, projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-sm text-white outline-none focus:border-white transition-all"
          />
        </div>

        {/* Top Right Navbar — Clean Log In & Create Account Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white font-bold text-xs hover:bg-white/20 transition-all"
          >
            Log In
          </Link>
          <Link
            href="/signup/user"
            className="px-5 py-2 rounded-full bg-white text-black font-extrabold text-xs hover:bg-white/90 transition-all shadow-md shadow-white/10"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Hero Section — Twitter / X Black & White Theme */}
        <div className="relative overflow-hidden rounded-3xl bg-[#16181c] border border-white/20 p-8 md:p-12 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold mb-4">
              👤 SkilledInn Platform
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3 text-white">
              Talent &amp; Skill Directory
            </h1>
            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
              Showcase individual portfolios, skill achievements, career milestones &amp; find project teammates.
            </p>
            <div className="flex gap-3">
              <Link
                href="/signup/user"
                className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-sm hover:bg-white/90 transition-all shadow-lg shadow-white/10"
              >
                Create Skill Profile →
              </Link>
            </div>
          </div>
        </div>

        {/* Talent Directory Title */}
        <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2 text-white">
          Featured Campus Talent
        </h2>

        {/* Talent Directory Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map((t) => (
            <div key={t.id} className="bg-[#16181c] border border-white/20 rounded-2xl p-6 hover:border-white/50 transition-all flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl font-bold text-white shrink-0">
                    {t.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-base text-white truncate">{t.name}</h3>
                    <span className="text-xs text-white/70">@{t.username}</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-white/80 mb-2">{t.role}</div>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">{t.bio}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] text-white font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/20">
                <Link
                  href={`/profile/${t.username}`}
                  className="block w-full py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-center text-xs font-bold hover:bg-white/20 transition-all"
                >
                  View Skill Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
