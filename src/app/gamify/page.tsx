'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function GamifyFeedPage() {
  const [search, setSearch] = useState('');

  const matches = [
    {
      id: 'm1',
      title: 'Inter-Hostel Cricket Championship 2026',
      place: 'Basketball Court & Ground',
      teams: 'BH6 Strikers vs BH3 Warriors',
      score: 'BH6 142/4 (15.0 ov) · BH3 98/7 (12.2 ov)',
      status: 'Live · 2nd Innings',
      sport: 'Cricket'
    },
    {
      id: 'm2',
      title: 'NIT Silchar Open Football Cup',
      place: 'Main Sports Complex',
      teams: 'CSE United vs ECE Tigers',
      score: 'CSE 2 - 1 ECE',
      status: 'Full Time',
      sport: 'Football'
    },
    {
      id: 'm3',
      title: 'Annual Campus Badminton Tournament',
      place: 'Indoor Badminton Court',
      teams: 'Rahul V. vs Ankit S.',
      score: '21-18, 19-21, 21-15',
      status: 'Finished',
      sport: 'Badminton'
    }
  ];

  return (
    <div className="min-h-screen bg-[#121212] text-[#f0f0f0] font-sans pb-20">
      
      {/* Top Navbar — Spotify Green Accent */}
      <header className="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-xl border-b border-[#1db954]/20 px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black text-[#1db954] tracking-tight">
          GPS · Gamify
        </Link>

        <div className="relative flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Search matches, sports tournaments, ground slots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1db954]/10 border border-[#1db954]/30 rounded-full px-5 py-2.5 text-sm text-white outline-none focus:border-[#1db954] transition-all"
          />
        </div>

        {/* Top Right Navbar — Clean Log In & Create Account Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full bg-[#1db954]/15 border border-[#1db954]/30 text-[#1db954] font-bold text-xs hover:bg-[#1db954]/25 transition-all"
          >
            Log In
          </Link>
          <Link
            href="/signup/user"
            className="px-5 py-2 rounded-full bg-[#1db954] text-black font-extrabold text-xs hover:bg-[#1ed760] transition-all shadow-md shadow-[#1db954]/30"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Hero Section — Spotify Green Theme */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#181818] to-[#000000] border border-[#1db954]/30 p-8 md:p-12 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#1db954]/20 border border-[#1db954]/40 text-[#1db954] text-xs font-bold mb-4">
              🎮 Gamify Platform
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3 bg-gradient-to-r from-white via-[#e0ffe8] to-[#1db954] bg-clip-text text-transparent">
              Activities &amp; Live Scorecards
            </h1>
            <p className="text-[#a0e8b8] text-sm md:text-base leading-relaxed mb-6">
              Track live match scores, sports tournaments, ground slot availability, and campus leaderboards.
            </p>
            <div className="flex gap-3">
              <Link
                href="/signup/user"
                className="px-6 py-3 rounded-full bg-[#1db954] text-black font-extrabold text-sm hover:bg-[#1ed760] transition-all shadow-lg shadow-[#1db954]/30"
              >
                Join Gamify →
              </Link>
            </div>
          </div>
        </div>

        {/* Live Matches Title */}
        <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
          Live Matches &amp; Tournaments
        </h2>

        {/* Matches Feed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((m) => (
            <div key={m.id} className="bg-[#181818] border border-[#1db954]/20 rounded-2xl p-6 hover:border-[#1db954]/50 transition-all space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#1db954]/15 border border-[#1db954]/30 text-[#1db954] text-xs font-bold">
                  {m.sport}
                </span>
                <span className="text-xs text-[#1db954] font-bold">{m.status}</span>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-white">{m.title}</h3>
                <p className="text-xs text-[#8888aa] mt-0.5">{m.place}</p>
              </div>

              <div className="bg-black/60 border border-[#1db954]/20 rounded-xl p-4 space-y-1">
                <div className="font-bold text-sm text-white">{m.teams}</div>
                <div className="text-xs font-extrabold text-[#1db954]">{m.score}</div>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
