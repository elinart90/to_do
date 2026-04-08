'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Target, Flame, Clock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-3xl mx-auto animate-fade-in">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
          <Zap size={14} className="text-amber-400" />
          Built for Millionaire Minds Only
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          Your Personal{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-glow">
            Power OS
          </span>
        </h1>

        <p className="text-lg text-gray-400 mb-12 max-w-xl mx-auto leading-relaxed">
          Not a to-do app. A command center for people who refuse to be average.
          Track goals, build habits, dominate routines, and close the gap to $1M.
        </p>

        {/* Features row */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {[
            { icon: Target, label: 'Millionaire Goals' },
            { icon: Flame, label: 'Habit Streaks' },
            { icon: Clock, label: 'Smart Routines' },
            { icon: Zap, label: 'Focus Mode' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass text-sm text-gray-300"
            >
              <Icon size={14} className="text-indigo-400" />
              {label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg transition-all duration-200 glow-accent"
          >
            Start Dominating
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 hover:border-indigo-500/50 text-gray-300 hover:text-white font-semibold text-lg transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-600">
          4 hours of sleep. 24 hours of ambition. Let&apos;s go.
        </p>
      </div>
    </div>
  )
}
