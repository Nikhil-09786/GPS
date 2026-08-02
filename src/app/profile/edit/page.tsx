'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('placebook_user');
    if (!raw) {
      router.push('/login');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setSession(parsed);
      setUsername(parsed.username || '');
      setBio(parsed.bio || '');
      setImage(parsed.image || '');
    } catch {
      router.push('/login');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!session?.username) {
      setError('Session expired. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUsername: session.username,
          username,
          bio,
          image
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
        setLoading(false);
        return;
      }

      // Update session in localStorage
      const updatedSession = { ...session, ...data.user };
      localStorage.setItem('placebook_user', JSON.stringify(updatedSession));

      setSuccess('✓ Profile updated successfully!');
      setTimeout(() => {
        router.push(`/profile/${data.user.username}`);
      }, 1000);
    } catch (err) {
      setError('Network error updating profile');
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center">
        <div className="text-sm text-[#8888aa]">Loading profile editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0ff] font-sans p-6 flex justify-center items-center">
      <div className="w-full max-w-lg bg-[#111120] border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <h1 className="text-xl font-bold">Edit Profile</h1>
          <Link
            href={`/profile/${session.username}`}
            className="text-xs text-[#8888aa] hover:text-white transition-colors"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Profile Picture Preview & Input */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {image ? (
                <img src={image} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold">{(session.name || 'U')[0].toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-[#8888aa] mb-1">Profile Picture URL</label>
              <input
                type="text"
                placeholder="https://example.com/photo.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-[#6c63ff]"
              />
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-xs font-semibold text-[#8888aa] mb-1">Username</label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-[#8888aa] text-sm">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/^@+/, ''))}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff]"
              />
            </div>
          </div>

          {/* Bio Input */}
          <div>
            <label className="block text-xs font-semibold text-[#8888aa] mb-1">Bio</label>
            <textarea
              rows={3}
              placeholder="Write a brief bio about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff] resize-none"
            />
          </div>

          {error && <div className="p-3 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b] text-xs">{error}</div>}
          {success && <div className="p-3 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] text-xs">{success}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white font-extrabold text-sm hover:shadow-lg hover:shadow-[#6c63ff]/30 transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit / Save Changes'}
          </button>
        </form>

      </div>
    </div>
  );
}
