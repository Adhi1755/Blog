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

  const publicLinks = [{ label: 'Home', href: '/' }]
  const authLinks = [{ label: 'Dashboard', href: '/dashboard' }]
  const visibleLinks = user ? [...publicLinks, ...authLinks] : publicLinks

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:py-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-8 w-8 items-center justify-center border border-black bg-black text-xs font-black text-white transition-colors duration-200 group-hover:bg-neutral-800">
            B
          </span>
          <span className="text-base font-bold tracking-tight text-black transition-colors group-hover:text-neutral-600">
            BlogSpace
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-0.5 md:flex">
          {visibleLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-neutral-100 text-black'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-px h-px bg-black" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Desktop right-side CTA */}
        {!loading && (
          <div className="hidden items-center gap-2.5 md:flex">
            {user ? (
              <>
                {/* User chip */}
                <div className="flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center bg-black text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[100px] truncate font-medium text-neutral-700">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                {/* Logout */}
                <button
                  id="navbar-logout"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-500 transition-all duration-150 hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-500 transition-all duration-150 hover:bg-neutral-50 hover:text-black"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-neutral-800"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-black md:hidden"
        >
          <span className={`block h-px w-5 bg-current transition-all duration-200 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-px w-5 bg-current transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-px w-5 bg-current transition-all duration-200 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`overflow-hidden border-t border-neutral-100 transition-all duration-200 ease-in-out md:hidden ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-1 px-4 py-3">
          {visibleLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex w-full items-center px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive ? 'bg-neutral-100 text-black' : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {!loading && (
          <div className="flex flex-col gap-2 px-4 pb-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <span className="flex h-8 w-8 items-center justify-center bg-black text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-black">{user.name}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
                <button
                  id="mobile-logout"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 border border-neutral-200 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full border border-neutral-200 py-2.5 text-center text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
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
