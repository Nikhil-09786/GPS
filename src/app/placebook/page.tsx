'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlaceBookFeedPage() {
  const [results, setResults] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/seed').catch(() => {});
    loadFeed();
  }, []);

  const loadFeed = async (query = '') => {
    setLoading(true);
    try {
      const url = query ? `/api/search?q=${encodeURIComponent(query)}` : '/api/search';
      const res = await fetch(url);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    loadFeed(val);
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-[#f0f4ff] font-sans pb-20">
      
      {/* Top Navbar — Facebook Blue Accent */}
      <header className="sticky top-0 z-50 bg-[#0b1326]/95 backdrop-blur-xl border-b border-[#1877f2]/20 px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-black text-[#1877f2] tracking-tight">
          GPS · PlaceBook
        </Link>

        <div className="relative flex-1 max-w-xl">
          <input
            type="search"
            placeholder="Search places, users, @username, campus..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-[#1877f2]/10 border border-[#1877f2]/30 rounded-full px-5 py-2.5 text-sm text-white outline-none focus:border-[#1877f2] transition-all"
          />
        </div>

        {/* Top Right Navbar — Clean Log In & Create Account Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 rounded-full bg-[#1877f2]/15 border border-[#1877f2]/30 text-[#1877f2] font-bold text-xs hover:bg-[#1877f2]/25 transition-all"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 rounded-full bg-[#1877f2] text-white font-bold text-xs hover:bg-[#166fe5] transition-all shadow-md shadow-[#1877f2]/30"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* Hero Section — Facebook Blue Theme */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f1c38] to-[#0a1224] border border-[#1877f2]/30 p-8 md:p-12 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#1877f2]/20 border border-[#1877f2]/40 text-[#4294ff] text-xs font-bold mb-4">
              📍 PlaceBook Module
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-3 bg-gradient-to-r from-white via-[#e0edff] to-[#1877f2] bg-clip-text text-transparent">
              Discover places &amp; people
            </h1>
            <p className="text-[#a0c2f0] text-sm md:text-base leading-relaxed mb-6">
              Identity &amp; reputation for real-world places powered by PlaceScore™ rankings.
            </p>
            <div className="flex gap-3">
              <Link
                href="/signup"
                className="px-6 py-3 rounded-full bg-[#1877f2] text-white font-bold text-sm hover:bg-[#166fe5] transition-all shadow-lg shadow-[#1877f2]/30"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>

        {/* Search Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            {search ? `Search results for "${search}"` : 'Discover Places & Users'}
            <span className="text-xs text-[#8888aa] font-normal bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
              {results.length} results
            </span>
          </h2>
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="text-xs text-[#8888aa] hover:text-white underline"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && results.length === 0 && (
          <div className="text-center py-16 px-4 border border-dashed border-white/10 rounded-2xl">
            <h3 className="text-lg font-bold text-white/80">No places or users found</h3>
            <p className="text-xs text-[#8888aa] mt-1">Try searching for @username, establishment name, or city!</p>
          </div>
        )}

        {/* Clean Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item) => {
              const isUser = item.type === 'user';
              const name = isUser ? item.name : item.establishmentName;
              const username = item.username;
              const profileHref = isUser ? `/profile/${username}` : `/place/${username}`;

              if (isUser) {
                return (
                  <div
                    key={item._id}
                    className="group bg-[#0f172a] border border-[#1877f2]/20 rounded-2xl p-6 hover:-translate-y-1 hover:border-[#1877f2]/50 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-full bg-[#1877f2]/20 border border-[#1877f2]/30 p-0.5 shrink-0 overflow-hidden">
                          <div className="w-full h-full rounded-full bg-[#080d1a] flex items-center justify-center text-xl font-bold text-[#1877f2]">
                            {item.image ? <img src={item.image} alt={name} className="w-full h-full object-cover" /> : (name || 'U')[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-base truncate group-hover:text-[#1877f2] transition-colors">{name}</h3>
                          <span className="text-xs text-[#8888aa]">@{username}</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs text-[#a0c2f0] mb-4">
                        {item.occupation && <p>{item.occupation}</p>}
                        {item.college && <p>{item.college}</p>}
                        {item.location && <p>{item.location}</p>}
                        {item.bio && <p className="text-[#8888aa] line-clamp-2 mt-1">{item.bio}</p>}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <Link
                        href={profileHref}
                        className="block w-full py-2.5 rounded-xl bg-[#1877f2]/15 border border-[#1877f2]/30 text-[#4294ff] text-center text-xs font-bold hover:bg-[#1877f2]/30 transition-all"
                      >
                        View User Profile
                      </Link>
                    </div>
                  </div>
                );
              }

              // Establishment Card
              const score = item.placeScore || 0;

              return (
                <div
                  key={item._id}
                  className="group bg-[#0f172a] border border-[#1877f2]/20 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-[#1877f2]/50 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-44 bg-[#0b1326] overflow-hidden">
                    {item.coverImage || item.image ? (
                      <img
                        src={item.coverImage || item.image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-[#1877f2]/40 font-bold">
                        {(name || 'P')[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#1877f2]/20 border border-[#1877f2]/30 flex items-center justify-center text-lg font-bold text-[#1877f2] shrink-0 overflow-hidden">
                          {item.image ? <img src={item.image} alt={name} className="w-full h-full object-cover" /> : (name || 'P')[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-base truncate leading-tight group-hover:text-[#1877f2] transition-colors">
                            {name}
                          </h3>
                          <span className="text-xs text-[#8888aa]">@{username}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold text-[#a0c2f0] mb-3">
                        <span>{score.toLocaleString()} PlaceScore</span>
                        <span>{item.avgRating ? item.avgRating.toFixed(1) : '0.0'}</span>
                        {item.location?.city && <span className="ml-auto text-[#8888aa]">{item.location.city}</span>}
                      </div>

                      <p className="text-xs text-[#8888aa] line-clamp-2 leading-relaxed mb-4">
                        {item.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex gap-2">
                      <Link
                        href={profileHref}
                        className="flex-1 py-2.5 rounded-xl bg-[#1877f2]/15 border border-[#1877f2]/30 text-[#4294ff] text-center text-xs font-bold hover:bg-[#1877f2]/30 transition-all"
                      >
                        View Place Profile
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
