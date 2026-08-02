'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function EstablishmentProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const rawUsername = resolvedParams.username;
  const username = String(rawUsername || '').trim().toLowerCase().replace(/^@+/, '');

  const [est, setEst] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gallery');
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [placeScore, setPlaceScore] = useState(100);

  // Session & Modal
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('placebook_user');
    if (raw) {
      try {
        setSession(JSON.parse(raw));
      } catch {}
    }
    loadEstablishment();
  }, [username]);

  const loadEstablishment = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/establishments/${encodeURIComponent(username)}`);
      const data = await res.json();
      if (res.ok) {
        const place = data.establishment;
        setEst(place);
        setSaveCount(place.saves || 0);
        setPlaceScore(place.placeScore || 100);

        // Check if saved by current logged in user
        const raw = localStorage.getItem('placebook_user');
        if (raw) {
          try {
            const userSession = JSON.parse(raw);
            if (userSession?.username) {
              const cleanUser = userSession.username.toLowerCase();
              if ((place.savedBy || []).includes(cleanUser)) {
                setIsSaved(true);
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    // If not logged in, prompt modal
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    const nextAction = isSaved ? 'unsave' : 'save';
    const nextSavedState = !isSaved;

    // Optimistic UI update
    setIsSaved(nextSavedState);
    setSaveCount((prev) => Math.max(0, nextSavedState ? prev + 1 : prev - 1));

    try {
      const res = await fetch(`/api/establishments/${encodeURIComponent(username)}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUsername: session.username,
          action: nextAction
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
        setSaveCount(data.savesCount);
        if (data.placeScore) setPlaceScore(data.placeScore);
      }
    } catch (err) {
      console.error('Error toggling save:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center">
        <div className="text-[#8888aa] text-sm animate-pulse">Loading @{username}'s profile...</div>
      </div>
    );
  }

  if (!est) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Establishment not found</h2>
        <p className="text-sm text-[#8888aa] mb-6">@{username} does not exist on PlaceBook.</p>
        <Link href="/placebook" className="px-6 py-2.5 rounded-full bg-[#6c63ff] text-white font-bold text-sm">
          Back to PlaceBook
        </Link>
      </div>
    );
  }

  const score = placeScore || 100;
  const tier = est.scoreTier?.tier || 'Local Spot';
  const rating = est.avgRating ? Math.max(4.0, est.avgRating).toFixed(1) : '4.0';

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0ff] font-sans pb-20 relative">
      
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-[#08080f]/90 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 flex items-center gap-4">
        <Link href="/placebook" className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all">
          ←
        </Link>
        <div className="font-bold text-base flex-1 truncate">@{est.username}</div>
        <button className="text-xl text-[#8888aa] hover:text-white px-2">⋯</button>
      </nav>

      {/* Cover Banner */}
      <div className="relative h-44 md:h-64 bg-[#121222] border-b border-white/10 overflow-hidden">
        {est.coverImage ? (
          <img src={est.coverImage} alt={est.establishmentName} className="w-full h-full object-cover" />
        ) : null}
      </div>

      {/* Main Profile Container */}
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Profile Header Grid */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-6 -mt-12 relative z-10">
          
          {/* Place Square Logo */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-[#121222] border-2 border-white/20 p-1 shadow-2xl">
              <div className="w-full h-full rounded-xl bg-[#080810] flex items-center justify-center text-4xl overflow-hidden font-extrabold text-white">
                {est.image ? <img src={est.image} alt={est.establishmentName} className="w-full h-full object-cover" /> : (est.establishmentName || 'P')[0].toUpperCase()}
              </div>
            </div>
          </div>

          {/* Right Info Section */}
          <div className="flex-1 text-center md:text-left space-y-4 pt-4 md:pt-14">
            
            {/* Username & Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-xl font-bold">@{est.username}</h1>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleSaveToggle}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-white/10 border border-[#00d4aa] text-[#00d4aa]'
                      : 'bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white hover:opacity-90'
                  }`}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(est.location?.address || est.establishmentName)}`}
                  target="_blank"
                  className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
                >
                  Directions
                </a>

                <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs hover:bg-white/10">
                  ⋯
                </button>
              </div>
            </div>

            {/* Stats Row: PlaceScore | Saves | Rating (Pure text, no icons/symbols before words) */}
            <div className="flex justify-center md:justify-start gap-8 py-1">
              <div className="text-center md:text-left">
                <span className="block text-xl font-extrabold">{score.toLocaleString()}</span>
                <span className="text-xs text-[#8888aa] font-medium">PlaceScore</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl font-extrabold">{saveCount.toLocaleString()}</span>
                <span className="text-xs text-[#8888aa] font-medium">Saves</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl font-extrabold">{rating}</span>
                <span className="text-xs text-[#8888aa] font-medium">Rating</span>
              </div>
            </div>

            {/* Bio Block */}
            <div className="space-y-1 text-sm leading-relaxed">
              <div className="font-bold text-base">{est.establishmentName}</div>
              {est.description && <p className="text-[#a0a0c0]">{est.description}</p>}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-[#8888aa] pt-1">
                {est.phone && <span>{est.phone}</span>}
                {est.website && (
                  <span>
                    <a href={est.website.startsWith('http') ? est.website : `https://${est.website}`} target="_blank" className="text-[#6c63ff] underline">
                      {est.website.replace(/^https?:\/\//, '')}
                    </a>
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Place Information Card (Includes Tier Badge here) */}
        <div className="bg-[#111120] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#8888aa] uppercase tracking-wider">Place Information</h3>
            <span className="px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#a0a0c0]">
              {tier}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {est.location?.address && (
              <div>
                <div className="text-xs text-[#8888aa] font-medium">Address</div>
                <div className="font-semibold text-white">{est.location.address}, {est.location.city}</div>
              </div>
            )}

            {est.phone && (
              <div>
                <div className="text-xs text-[#8888aa] font-medium">Phone</div>
                <div className="font-semibold text-white">{est.phone}</div>
              </div>
            )}

            {est.category && (
              <div>
                <div className="text-xs text-[#8888aa] font-medium">Category</div>
                <div className="font-semibold text-white capitalize">{est.category}</div>
              </div>
            )}

            {est.priceRange && (
              <div>
                <div className="text-xs text-[#8888aa] font-medium">Price Range</div>
                <div className="font-semibold text-white">{est.priceRange}</div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs: Gallery | Reviews | Menu | About */}
        <div className="sticky top-[57px] z-40 bg-[#080810] border-b border-white/10 flex">
          {[
            { id: 'gallery', label: 'Gallery' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'menu', label: 'Menu' },
            { id: 'about', label: 'About' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3.5 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#6c63ff] text-white'
                  : 'border-transparent text-[#8888aa] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          <div className="text-center py-16 text-[#8888aa]">
            <h3 className="text-base font-bold text-white/80 capitalize">No {activeTab} yet</h3>
            <p className="text-xs mt-1">Information added by the establishment will appear here.</p>
          </div>
        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* Auth Prompt Modal (For Unauthenticated Visitors) */}
      {/* ---------------------------------------------------- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            
            <div className="text-xl font-bold text-white">Log in to save places</div>
            <p className="text-xs text-[#8888aa]">
              Join PlaceBook to save your favorite establishments and track campus spots.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white font-extrabold text-xs hover:shadow-lg"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10"
              >
                Create Account
              </Link>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-xs text-[#8888aa] hover:text-white pt-1"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
