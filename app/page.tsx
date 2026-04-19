'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // If already logged in, go straight to the feed
  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  // While checking auth, show nothing (avoids flash)
  if (loading || user) return null

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">

      {/* ── Minimal top bar ──────────────────────────────── */}
      <header className="shrink-0 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center bg-black text-xs font-black text-white">
              B
            </span>
            <span className="text-sm font-black tracking-tight text-black">BlogSpace</span>
          </div>

          {/* Auth actions */}
          <div className="flex items-center gap-2">
            <Link
              id="landing-signin"
              href="/login"
              className="px-5 py-2 text-sm font-semibold text-neutral-600 border border-neutral-200 transition-all hover:border-black hover:text-black"
            >
              Sign In
            </Link>
            <Link
              id="landing-signup"
              href="/register"
              className="px-5 py-2 text-sm font-semibold text-white bg-black border border-black transition-all hover:bg-neutral-800"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <main className="flex-1">
        <section className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-32">
            <div className="max-w-2xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-widest text-neutral-400">
                A minimalist writing platform
              </p>
              <h1 className="text-5xl font-black tracking-tight text-black leading-[1] sm:text-6xl md:text-7xl">
                Where great{' '}
                <span className="border-b-[3px] border-black">ideas</span>
                {' '}live
              </h1>
              <p className="mt-6 text-base leading-8 text-neutral-500 max-w-lg">
                Publish and discover in-depth articles, tutorials, and perspectives on modern
                web development — written by engineers, for engineers.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  id="landing-get-started"
                  href="/register"
                  className="inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
                >
                  Start Writing Free
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  id="landing-signin-alt"
                  href="/login"
                  className="inline-flex items-center gap-2 border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition-all hover:border-black hover:text-black"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Feature strip ────────────────────────────────── */}
        <section>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 divide-y divide-neutral-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                {
                  title: 'Write anything',
                  body: 'Rich editor, thumbnail uploads, drafts — everything a serious writer needs.',
                },
                {
                  title: 'Read the feed',
                  body: 'Browse all posts in one place. Click to expand and read inline without leaving.',
                },
                {
                  title: 'Own your content',
                  body: 'Edit and delete your posts from your profile at any time, no questions asked.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="px-8 py-10">
                  <p className="text-sm font-black text-black uppercase tracking-wider mb-2">{title}</p>
                  <p className="text-sm leading-6 text-neutral-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────── */}
        <section className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <dl className="grid grid-cols-3 gap-8 sm:gap-16">
              {[
                { value: '2.4K+', label: 'Articles Published' },
                { value: '18K+', label: 'Monthly Readers' },
                { value: '340+', label: 'Contributors' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-start gap-1">
                  <dt className="text-2xl font-black text-black sm:text-3xl">{value}</dt>
                  <dd className="text-xs font-medium text-neutral-500">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CTA footer ───────────────────────────────────── */}
        <section className="border-t border-neutral-200">
          <div className="mx-auto max-w-7xl px-6 py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black text-black">Ready to start writing?</h2>
              <p className="mt-1 text-sm text-neutral-500">Join thousands of developers sharing what they know.</p>
            </div>
            <Link
              href="/register"
              className="shrink-0 border border-black bg-black px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      {/* ── Minimal footer ────────────────────────────────── */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center bg-black text-xs font-black text-white">B</span>
            <span className="text-xs font-bold text-black">BlogSpace</span>
          </div>
          <p className="text-xs text-neutral-400">© {new Date().getFullYear()} BlogSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
