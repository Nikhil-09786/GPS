'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      const sessionData = {
        accountType: data.accountType,
        username: data.username,
        name: data.user?.name || data.establishment?.establishmentName || data.username,
        image: data.user?.image || data.establishment?.image || '',
        bio: data.user?.bio || data.establishment?.description || ''
      };
      localStorage.setItem('placebook_user', JSON.stringify(sessionData));

      router.push('/placebook');
    } catch (err: any) {
      setError('Network error. Make sure server is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0ff] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-6">
          <Link href="/placebook" className="inline-block">
            <div className="text-2xl font-black bg-gradient-to-r from-[#6c63ff] to-[#00d4aa] bg-clip-text text-transparent">
              PlaceBook
            </div>
          </Link>
        </div>

        <div className="bg-[#121222]/90 border border-white/10 rounded-3xl p-8 backdrop-blur-2xl shadow-2xl">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-[#8888aa] text-xs text-center mb-6">
            Log in to your account using your username or email
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1">Username or Email</label>
              <input
                type="text"
                required
                placeholder="Username or email address"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#8888aa] mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b] text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6c63ff] to-[#5a52e0] text-white font-extrabold text-sm hover:shadow-lg hover:shadow-[#6c63ff]/30 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="text-center mt-6 pt-6 border-t border-white/10 text-xs text-[#8888aa]">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[#6c63ff] font-bold hover:underline">
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
