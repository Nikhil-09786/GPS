'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const rawUsername = resolvedParams.username;
  const username = String(rawUsername || '').trim().toLowerCase().replace(/^@+/, '');

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isConnected, setIsConnected] = useState(false);
  const [circleCount, setCircleCount] = useState(0);
  const [spCount, setSpCount] = useState(0);

  // Logged in user session
  const [session, setSession] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Modals
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [showUrlPrompt, setShowUrlPrompt] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('placebook_user');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSession(parsed);
        if (parsed.username && parsed.username.toLowerCase() === username) {
          setIsOwnProfile(true);
        }
      } catch {}
    }
    loadUser();
  }, [username]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(username)}`);
      const data = await res.json();
      if (res.ok) {
        const fetchedUser = data.user;
        setUser(fetchedUser);
        setCircleCount((fetchedUser.connections || []).length);
        setSpCount((fetchedUser.savedPlaces || []).length);

        // Check connection state for current logged in user
        const raw = localStorage.getItem('placebook_user');
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed.username && (fetchedUser.connections || []).includes(parsed.username.toLowerCase())) {
              setIsConnected(true);
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

  const handleConnectToggle = async () => {
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    const nextAction = isConnected ? 'disconnect' : 'connect';
    const nextConnected = !isConnected;

    // Optimistic UI update
    setIsConnected(nextConnected);
    setCircleCount((prev) => Math.max(0, nextConnected ? prev + 1 : prev - 1));

    try {
      const res = await fetch(`/api/users/${encodeURIComponent(username)}/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername: session.username,
          action: nextAction
        })
      });
      const data = await res.json();
      if (res.ok) {
        setIsConnected(data.connected);
        setCircleCount(data.circleCount);
      }
    } catch (err) {
      console.error('Error toggling connect:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('placebook_user');
    router.push('/placebook');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(username)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        localStorage.removeItem('placebook_user');
        router.push('/placebook');
      } else {
        alert('Failed to delete account.');
        setIsDeleting(false);
      }
    } catch (err) {
      alert('Error deleting account.');
      setIsDeleting(false);
    }
  };

  const handleSavePhoto = async (newUrl: string) => {
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername: username,
          image: newUrl
        })
      });
      const data = await res.json();
      if (res.ok) {
        setUser((prev: any) => ({ ...prev, image: newUrl }));
        if (session) {
          localStorage.setItem('placebook_user', JSON.stringify({ ...session, image: newUrl }));
        }
      }
    } catch {}
    setShowPhotoModal(false);
    setShowUrlPrompt(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center">
        <div className="text-[#8888aa] text-sm animate-pulse">Loading @{username}'s profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">User not found</h2>
        <p className="text-sm text-[#8888aa] mb-6">@{username} does not exist on PlaceBook.</p>
        <Link href="/placebook" className="px-6 py-2.5 rounded-full bg-[#6c63ff] text-white font-bold text-sm">
          Back to PlaceBook
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0ff] font-sans pb-20 relative">
      
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-[#08080f]/90 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 flex items-center gap-4">
        <Link href="/placebook" className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition-all">
          ←
        </Link>
        <div className="font-bold text-base flex-1">@{user.username}</div>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="text-xl text-[#8888aa] hover:text-white px-2 cursor-pointer"
        >
          ⋯
        </button>
      </nav>

      {/* Main Profile Container */}
      <div className="max-w-3xl mx-auto px-6 pt-8">
        
        {/* Top Profile Grid */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          
          {/* Avatar (Clickable if own profile to trigger Change Photo Modal) */}
          <div
            onClick={() => isOwnProfile && setShowPhotoModal(true)}
            className={`relative shrink-0 ${isOwnProfile ? 'cursor-pointer group' : ''}`}
            title={isOwnProfile ? 'Click to change profile photo' : ''}
          >
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white/10 border-2 border-white/20 p-1 shadow-2xl overflow-hidden">
              <div className="w-full h-full rounded-full bg-[#080810] flex items-center justify-center text-4xl overflow-hidden font-extrabold text-white">
                {user.image ? (
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  (user.name || 'U')[0].toUpperCase()
                )}
              </div>
            </div>
            {isOwnProfile && (
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold text-white transition-opacity">
                Change Photo
              </div>
            )}
          </div>

          {/* Right Info Section */}
          <div className="flex-1 text-center md:text-left space-y-4">
            
            {/* Username + Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-xl font-bold">@{user.username}</h1>

              {/* Three dots icon */}
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs hover:bg-white/10 cursor-pointer"
              >
                ⋯
              </button>

              {/* Action Buttons */}
              {isOwnProfile ? (
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <Link
                    href="/profile/edit"
                    className="flex-1 md:flex-none px-6 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-xs hover:bg-white/20 transition-all text-center"
                  >
                    Edit profile
                  </Link>
                  <button
                    onClick={() => alert('Archive is empty.')}
                    className="flex-1 md:flex-none px-6 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-xs hover:bg-white/20 transition-all"
                  >
                    View archive
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleConnectToggle}
                    className={`px-6 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isConnected
                        ? 'bg-white/10 border border-white/20 text-[#00d4aa]'
                        : 'bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white hover:opacity-90'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                  <button className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
                    Message
                  </button>
                </div>
              )}
            </div>

            {/* Stats Row: Posts | Circle (connections count) | SP (saved places count) */}
            <div className="flex justify-center md:justify-start gap-8 py-2">
              <div className="text-center md:text-left">
                <span className="block text-xl font-extrabold">{user.postCount || 0}</span>
                <span className="text-xs text-[#8888aa] font-medium">Posts</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl font-extrabold">{circleCount}</span>
                <span className="text-xs text-[#8888aa] font-medium">Circle</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-xl font-extrabold">{spCount}</span>
                <span className="text-xs text-[#8888aa] font-medium">SP</span>
              </div>
            </div>

            {/* Bio Block */}
            <div className="space-y-1 text-sm leading-relaxed">
              <div className="font-bold text-base">{user.name}</div>
              {user.bio && <p className="text-[#a0a0c0]">{user.bio}</p>}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs text-[#8888aa] pt-1">
                {user.occupation && <span>{user.occupation}</span>}
                {user.college && <span>{user.college}</span>}
                {user.location && <span>{user.location}</span>}
                {user.website && (
                  <span>
                    <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" className="text-[#6c63ff] underline">
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Tabs: Posts | Reviews | Saved | Tagged | Contributions */}
        <div className="sticky top-[57px] z-40 bg-[#080810] border-b border-white/10 flex">
          {[
            { id: 'posts', label: 'Posts' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'saved', label: 'Saved' },
            { id: 'tagged', label: 'Tagged' },
            { id: 'contributions', label: 'Contributions' }
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
            <p className="text-xs mt-1">Posts and activity will appear here.</p>
          </div>
        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* Change Profile Photo Modal */}
      {/* ---------------------------------------------------- */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-center">
            <div className="p-6 border-b border-white/10 font-bold text-base text-white">
              Change Profile Photo
            </div>

            {!showUrlPrompt ? (
              <div className="divide-y divide-white/10">
                <button
                  onClick={() => setShowUrlPrompt(true)}
                  className="w-full py-4 text-xs font-bold text-[#6c63ff] hover:bg-white/5 transition-colors"
                >
                  Upload Photo
                </button>
                <button
                  onClick={() => handleSavePhoto('')}
                  className="w-full py-4 text-xs font-bold text-[#ff6b6b] hover:bg-white/5 transition-colors"
                >
                  Remove Current Photo
                </button>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="w-full py-4 text-xs font-bold text-white/70 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#6c63ff]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSavePhoto(photoUrlInput)}
                    className="flex-1 py-2.5 rounded-xl bg-[#6c63ff] text-white text-xs font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowUrlPrompt(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Account Options Modal */}
      {/* ---------------------------------------------------- */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-center">
            <div className="p-6 border-b border-white/10 font-bold text-base text-white">
              Account Options
            </div>

            <div className="divide-y divide-white/10">
              <button
                onClick={handleLogout}
                className="w-full py-4 text-xs font-bold text-[#ff6b6b] hover:bg-white/5 transition-colors"
              >
                Log Out
              </button>

              {isOwnProfile && (
                <button
                  onClick={() => {
                    setShowSettingsModal(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="w-full py-4 text-xs font-bold text-red-500 hover:bg-white/5 transition-colors"
                >
                  Delete my account
                </button>
              )}

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-4 text-xs font-bold text-white/70 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Account Deletion Confirmation Modal */}
      {/* ---------------------------------------------------- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1a1a2e] border border-red-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="text-xl font-extrabold text-red-500">Delete Account?</div>
            <p className="text-xs text-[#a0a0c0] leading-relaxed">
              Are you sure you want to permanently delete your account (@{username})? All your profile information and activity will be permanently erased.
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="w-full py-3 rounded-xl bg-[#121222] border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* Auth Prompt Modal (For Visitor Connect Click) */}
      {/* ---------------------------------------------------- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="text-xl font-bold text-white">Log in to connect</div>
            <p className="text-xs text-[#8888aa]">
              Join PlaceBook to connect with members and build your network.
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
                className="w-full py-3 rounded-xl bg-[#121222] border border-white/10 text-white font-bold text-xs hover:bg-white/10"
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
