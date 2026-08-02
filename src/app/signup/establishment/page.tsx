'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EstablishmentSignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    establishmentName: '',
    username: '',
    category: '',
    subcategory: '',
    email: '',
    password: '',
    description: '',
    city: 'Silchar',
    state: 'Assam',
    address: 'NIT Silchar Campus',
    country: 'India',
    phone: '',
    website: '',
    tags: ''
  });

  const [usernameMsg, setUsernameMsg] = useState<{ text: string; success?: boolean } | null>(null);
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

    if (!form.establishmentName.trim()) {
      setError('Please enter establishment name');
      setLoading(false);
      return;
    }
    if (!form.category) {
      setError('Please select a category');
      setLoading(false);
      return;
    }
    if (usernameMsg && !usernameMsg.success) {
      setError(usernameMsg.text);
      setLoading(false);
      return;
    }

    try {
      const tagsArr = form.tags.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await fetch('/api/establishments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: tagsArr
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccess('🎉 Place profile created successfully! Redirecting...');
      setTimeout(() => {
        router.push(`/place/${data.establishment.username}`);
      }, 1200);
    } catch (err: any) {
      setError('Network error. Make sure server is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0ff] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-xl">
        <div className="text-center mb-6">
          <Link href="/placebook" className="inline-block">
            <div className="text-2xl font-black bg-gradient-to-r from-[#00d4aa] to-[#6c63ff] bg-clip-text text-transparent">
              PlaceBook
            </div>
          </Link>
        </div>

        <div className="bg-[#121222]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">🏢 Register Your Place</h1>
            <p className="text-[#8888aa] text-sm mt-1">Create your establishment's official PlaceBook identity.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1">Establishment Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Doordash Canteen / Mess BH6"
                value={form.establishmentName}
                onChange={(e) => setForm({ ...form, establishmentName: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00d4aa] focus:ring-2 focus:ring-[#00d4aa]/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Username *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-[#8888aa] text-sm">@</span>
                  <input
                    type="text"
                    required
                    placeholder="doordash"
                    value={form.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white outline-none focus:border-[#00d4aa] focus:ring-2 focus:ring-[#00d4aa]/20 transition-all"
                  />
                </div>
                {usernameMsg && (
                  <p className={`text-xs mt-1 font-semibold ${usernameMsg.success ? 'text-[#00d4aa]' : 'text-[#ff6b6b]'}`}>
                    {usernameMsg.text}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#121222] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00d4aa] transition-all"
                >
                  <option value="">Select category</option>
                  <option value="restaurant">restaurant</option>
                  <option value="cafe">cafe</option>
                  <option value="food stall">food stall</option>
                  <option value="shop">shop</option>
                  <option value="hotel">hotel</option>
                  <option value="hostel">hostel</option>
                  <option value="hospital">hospital</option>
                  <option value="pharmacy">pharmacy</option>
                  <option value="sports">sports</option>
                  <option value="college">college</option>
                  <option value="school">school</option>
                  <option value="public place">public place</option>
                  <option value="other">other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@place.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00d4aa]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00d4aa]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1">Description</label>
              <textarea
                placeholder="Tell visitors about your place, speciality dishes, timings..."
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#00d4aa] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">City</label>
                <input
                  type="text"
                  placeholder="Silchar"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#00d4aa]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Full Address</label>
                <input
                  type="text"
                  placeholder="NIT Silchar Campus"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#00d4aa]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#00d4aa]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#8888aa] mb-1">Search Tags</label>
                <input
                  type="text"
                  placeholder="veg, budget, fast food, tea"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#00d4aa]"
                />
              </div>
            </div>

            {error && <div className="p-3 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b] text-sm">{error}</div>}
            {success && <div className="p-3 rounded-xl bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] text-sm">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00d4aa] to-[#00b896] text-black font-extrabold text-base hover:shadow-lg hover:shadow-[#00d4aa]/30 transition-all disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? 'Creating Profile...' : 'Create Place Profile 🏢'}
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
