'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GPSPage() {
  const router = useRouter();
  const [activeSector, setActiveSector] = useState<'p' | 'g' | 's'>('p');

  const sectorInfo = {
    p: {
      title: 'P — PlaceBook',
      desc: 'Digital identity & PlaceScore™ reputation for real-world places geographically.',
      link: '/placebook',
      btnText: 'Explore PlaceBook 📍',
      btnClass: 'bg-[#1877f2] text-white hover:bg-[#166fe5] shadow-lg shadow-[#1877f2]/30 font-extrabold'
    },
    g: {
      title: 'G — Gamify',
      desc: 'Activities, live match scorecards, tournaments & ground slots happening at places.',
      link: '/gamify',
      btnText: 'Explore Gamify 🎮',
      btnClass: 'bg-[#1db954] text-black hover:bg-[#1ed760] shadow-lg shadow-[#1db954]/30 font-extrabold'
    },
    s: {
      title: 'S — SkilledInn',
      desc: 'Individual skill identity, career portfolios, endorsements & teammate finder network.',
      link: '/skilledinn',
      btnText: 'Explore SkilledInn 👤',
      btnClass: 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10 font-extrabold'
    }
  };

  const current = sectorInfo[activeSector];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000000] text-[#ffffff] p-6 font-sans relative overflow-hidden">
      
      {/* Background glow effects matching the 3 module theme colors */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#1877f2]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#1db954]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-[#16181c]/90 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-2xl text-center relative z-10">
        
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-white/80 mb-4">
          GPS Platform Ecosystem
        </div>

        <h1 className="text-3xl md:text-5xl font-black mb-2 text-white">
          Gamify · PlaceBook · SkilledInn
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto mb-8">
          Click any sector or letter (G, P, S) to enter directly into its module.
        </p>

        {/* Perfect Circle SVG Container with Tailored Theme Colors */}
        <div className="w-full max-w-[340px] aspect-square mx-auto my-4 relative">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Outer border circle for symmetry */}
            <circle cx="200" cy="200" r="180" className="fill-none stroke-white/20 stroke-2" />

            {/* G Sector — Spotify Green (#1DB954) */}
            <path
              id="g"
              onClick={() => {
                setActiveSector('g');
                router.push('/gamify');
              }}
              className={`cursor-pointer transition-colors ${
                activeSector === 'g'
                  ? 'fill-[#1db954]/80 stroke-[#1db954] stroke-2'
                  : 'fill-[#1db954]/30 hover:fill-[#1db954]/50 stroke-white/20 stroke-2'
              }`}
              d="M200 200 L200 20 A180 180 0 0 1 355.88 290 Z"
            />

            {/* P Sector — Facebook Blue (#1877F2) */}
            <path
              id="p"
              onClick={() => {
                setActiveSector('p');
                router.push('/placebook');
              }}
              className={`cursor-pointer transition-colors ${
                activeSector === 'p'
                  ? 'fill-[#1877f2]/80 stroke-[#1877f2] stroke-2'
                  : 'fill-[#1877f2]/35 hover:fill-[#1877f2]/60 stroke-white/20 stroke-2'
              }`}
              d="M200 200 L355.88 290 A180 180 0 0 1 44.12 290 Z"
            />

            {/* S Sector — Twitter / X White (#FFFFFF) */}
            <path
              id="s"
              onClick={() => {
                setActiveSector('s');
                router.push('/skilledinn');
              }}
              className={`cursor-pointer transition-colors ${
                activeSector === 's'
                  ? 'fill-white/80 stroke-white stroke-2'
                  : 'fill-white/25 hover:fill-white/45 stroke-white/20 stroke-2'
              }`}
              d="M200 200 L44.12 290 A180 180 0 0 1 200 20 Z"
            />

            {/* Fixed SVG Letters */}
            <text
              x="255"
              y="125"
              onClick={() => {
                setActiveSector('g');
                router.push('/gamify');
              }}
              className="fill-white text-3xl font-extrabold select-none cursor-pointer"
            >
              G
            </text>

            <text
              x="200"
              y="300"
              onClick={() => {
                setActiveSector('p');
                router.push('/placebook');
              }}
              className="fill-white text-3xl font-extrabold select-none cursor-pointer"
              textAnchor="middle"
            >
              P
            </text>

            <text
              x="145"
              y="125"
              onClick={() => {
                setActiveSector('s');
                router.push('/skilledinn');
              }}
              className="fill-black text-3xl font-extrabold select-none cursor-pointer"
            >
              S
            </text>
          </svg>
        </div>

        {/* Selected Sector Info */}
        <div className="space-y-3 max-w-md mx-auto mt-6 p-6 rounded-2xl bg-white/5 border border-white/20">
          <h2 className="text-xl font-bold">{current.title}</h2>
          <p className="text-xs text-white/70 leading-relaxed">{current.desc}</p>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => router.push(current.link)}
              className={`px-8 py-3 rounded-full text-sm font-extrabold transition-all ${current.btnClass}`}
            >
              {current.btnText}
            </button>
            <Link
              href="/signup"
              className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white text-sm font-bold hover:bg-white/20 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}