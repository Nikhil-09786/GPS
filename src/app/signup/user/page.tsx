'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserSignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    image: '',
    bio: '',
    occupation: '',
    college: '',
    location: '',
    website: '',
    interests: ''
  });

  const [usernameMsg, setUsernameMsg] = useState<{ text: string; success?: boolean } | null>(null);
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUsernameChange = async (val: string) => {
    const clean = val.trim().toLowerCase().replace(/^@+/, '');
    setForm((prev) => ({ ...prev, username: clean }));
    setUsernameMsg(null);

    if (clean.length < 3) {
      setUsernameMsg({ text: 'Username must be at least 3 characters', success: false });
      return;
    }

    try {
      const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (res.ok && data.available === true) {
        setUsernameMsg({ text: `✓ @${clean} is available`, success: true });
      } else if (data.available === false && data.taken === true) {
        setUsernameMsg({ text: `✗ @${clean} is already taken`, success: false });
      } else {
        setUsernameMsg(null);
      }
    } catch {
      setUsernameMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (usernameMsg && !usernameMsg.success) {
      setError(usernameMsg.text);
      setLoading(false);
      return;
    }

    try {
      const interestsArr = form.interests.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          interests: interestsArr
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccess('🎉 Account created successfully! Redirecting to your profile...');
      setTimeout(() => {
        router.push(`/profile/${data.user.username}`);
      }, 1200);
    } catch (err: any) {
      setError('Network error. Make sure server is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0ff] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link href="/placebook" className="inline-block">
            <div className="text-2xl font-black bg-gradient-to-r from-[#6c63ff] to-[#00d4aa] bg-clip-text text-transparent">
              PlaceBook
            </div>
          </Link>
        </div>

        <div className="bg-[#121222]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">👤 Create User Account</h1>
            <p className="text-[#8888aa] text-sm mt-1">Your personal PlaceBook profile identity.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Nikhil Yadav"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Username *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#8888aa] text-sm">@</span>
                  <input
                    type="text"
                    required
                    placeholder="nikhil_y"
                    value={form.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all"
                  />
                </div>
                {usernameMsg && (
                  <p className={`text-xs mt-1 font-semibold ${usernameMsg.success ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
                    {usernameMsg.text}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all"
              />
              <p className="text-[11px] text-[#8888aa] mt-1">Minimum 6 characters.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1">Bio</label>
              <textarea
                placeholder="Short bio about yourself..."
                maxLength={300}
                rows={2}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="text-xs text-[#8888aa] hover:text-white flex items-center gap-1.5 transition-colors py-1 cursor-pointer"
            >
              <span>{showOptional ? '▼' : '▶'}</span> Add optional profile details (Occupation, College, Website...)
            </button>

            {showOptional && (
              <div className="space-y-4 pt-2 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#8888aa] mb-1">Occupation</label>
                    <input
                      type="text"
                      placeholder="Student, Engineer..."
                      value={form.occupation}
                      onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#8888aa] mb-1">College / Org</label>
                    <input
                      type="text"
                      placeholder="NIT Silchar"
                      value={form.college}
                      onChange={(e) => setForm({ ...form, college: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8888aa] mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Silchar, Assam"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#6c63ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8888aa] mb-1">Website</label>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#6c63ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8888aa] mb-1">Interests</label>
                  <input
                    type="text"
                    placeholder="Cricket, Coding, Music, Travel"
                    value={form.interests}
                    onChange={(e) => setForm({ ...form, interests: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#6c63ff]"
                  />
                  <p className="text-[11px] text-[#8888aa] mt-1">Separate with commas.</p>
                </div>
              </div>
            )}

            {error && <div className="p-3 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b] text-sm">{error}</div>}
            {success && <div className="p-3 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] text-sm">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white font-bold text-base hover:shadow-lg hover:shadow-[#6c63ff]/30 transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account 👤'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-[#8888aa]">
          <Link href="/signup" className="hover:text-white transition-colors">← Change account type</Link>
        </div>
      </div>
    </div>
  );
}
