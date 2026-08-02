'use client';

import React from 'react';
import Link from 'next/link';

export default function SignupChoicePage() {
  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0ff] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background glow effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#6c63ff]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#00d4aa]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md text-center">
        <Link href="/placebook" className="inline-block mb-8">
          <div className="text-3xl font-black bg-gradient-to-r from-[#6c63ff] to-[#00d4aa] bg-clip-text text-transparent">
            Place<span className="font-light text-white/70">Book</span>
          </div>
        </Link>

        <div className="bg-[#121222]/90 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
          <h1 className="text-2xl font-bold mb-2">Create your PlaceBook Account</h1>
          <p className="text-[#8888aa] text-sm mb-8">Choose your profile type to get started.</p>

          <div className="flex flex-col gap-4">
            
            {/* 👤 Continue as User */}
            <Link
              href="/signup/user"
              className="group flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#6c63ff] hover:bg-[#6c63ff]/10 transition-all text-left shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-[#6c63ff]/20 border border-[#6c63ff]/30 flex items-center justify-center text-2xl shrink-0">
                👤
              </div>
              <div className="flex-1">
                <strong className="block text-base font-bold group-hover:text-[#6c63ff] transition-colors">
                  Continue as User
                </strong>
                <span className="text-xs text-[#8888aa] leading-tight block mt-0.5">
                  Create your personal profile, connect with people &amp; discover places
                </span>
              </div>
              <span className="text-xl text-[#8888aa] group-hover:translate-x-1 group-hover:text-white transition-all">
                →
              </span>
            </Link>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-[#8888aa] uppercase font-bold tracking-wider">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* 🏢 Continue as Establishment */}
            <Link
              href="/signup/establishment"
              className="group flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-[#00d4aa] hover:bg-[#00d4aa]/10 transition-all text-left shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-[#00d4aa]/20 border border-[#00d4aa]/30 flex items-center justify-center text-2xl shrink-0">
                🏢
              </div>
              <div className="flex-1">
                <strong className="block text-base font-bold group-hover:text-[#00d4aa] transition-colors">
                  Continue as Establishment
                </strong>
                <span className="text-xs text-[#8888aa] leading-tight block mt-0.5">
                  Register your place, café, hostel, sports ground or institution
                </span>
              </div>
              <span className="text-xl text-[#8888aa] group-hover:translate-x-1 group-hover:text-white transition-all">
                →
              </span>
            </Link>

          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-[#8888aa]">
            Already have an account?{' '}
            <Link href="/signup/user" className="text-[#6c63ff] font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <Link href="/placebook" className="inline-block mt-6 text-sm text-[#8888aa] hover:text-white transition-colors">
          ← Back to PlaceBook
        </Link>
      </div>
    </div>
  );
}
