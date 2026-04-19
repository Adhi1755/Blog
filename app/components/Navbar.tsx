'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-black text-white shadow-lg shadow-violet-500/30">
            B
          </span>
          <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
            BlogSpace
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-violet-500/0 via-violet-400 to-violet-500/0" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop CTA buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white md:hidden"
        >
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t border-white/5 transition-all duration-300 ease-in-out md:hidden ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-4 py-3">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex w-full items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-500/20 text-violet-300'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="flex flex-col gap-2 px-4 pb-4 pt-1">
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="w-full rounded-lg border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-gray-300 transition-all duration-200 hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
