'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    setMenuOpen(false)
    router.push('/')
  }

  // Nav links differ by auth state
  const guestLinks = [{ label: 'Home', href: '/' }]
  const authLinks = [
    { label: 'Home', href: '/' },
    { label: 'Feed', href: '/dashboard' },
    { label: 'Profile', href: '/profile' },
  ]
  const visibleLinks = user ? authLinks : guestLinks

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 h-14">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <span className="flex h-7 w-7 items-center justify-center bg-black text-xs font-black text-white transition-colors group-hover:bg-neutral-700">
            B
          </span>
          <span className="text-sm font-black tracking-tight text-black transition-colors group-hover:text-neutral-500">
            BlogSpace
          </span>
        </Link>

        {/* ── Desktop nav links ── */}
        <ul className="hidden md:flex items-center">
          {visibleLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative inline-flex items-center h-14 px-4 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-black after:absolute after:inset-x-4 after:bottom-0 after:h-[2px] after:bg-black'
                      : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* ── Desktop right-side actions ── */}
        {!loading && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {user ? (
              <>
                {/* Write CTA */}
                <Link
                  href="/editor"
                  className="inline-flex items-center gap-1.5 border border-neutral-200 px-3 py-1.5 text-sm font-semibold text-neutral-700 transition-all hover:border-black hover:bg-black hover:text-white"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Write
                </Link>

                {/* User chip */}
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 border border-neutral-200 px-2.5 py-1.5 text-sm transition-all hover:border-neutral-400"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-black text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[96px] truncate font-medium text-neutral-700">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>

                {/* Sign out */}
                <button
                  id="navbar-logout"
                  onClick={handleLogout}
                  className="border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-500 transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm font-medium text-neutral-500 transition-all hover:text-black"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="border border-black bg-black px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}

        {/* ── Mobile hamburger ── */}
        <button
          id="mobile-menu-toggle"
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 text-neutral-500 hover:text-black md:hidden"
        >
          <span className={`block h-px w-5 bg-current transition-all duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-5 bg-current transition-all duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* ── Mobile menu panel ── */}
      <div
        className={`overflow-hidden border-t border-neutral-100 transition-all duration-200 md:hidden ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Nav links */}
        <div className="flex flex-col px-4 pt-2 pb-1">
          {visibleLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex w-full items-center px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-neutral-100 text-black'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                }`}
              >
                {label}
              </Link>
            )
          })}
          {user && (
            <Link
              href="/editor"
              onClick={() => setMenuOpen(false)}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-sm font-semibold text-black hover:bg-neutral-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Write a post
            </Link>
          )}
        </div>

        {/* User section */}
        {!loading && (
          <div className="flex flex-col gap-2 px-4 pb-4 pt-2 border-t border-neutral-100">
            {user ? (
              <>
                <div className="flex items-center gap-3 border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-black text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-black truncate">{user.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  id="mobile-logout"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full border border-neutral-200 py-2.5 text-center text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full border border-black bg-black py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
