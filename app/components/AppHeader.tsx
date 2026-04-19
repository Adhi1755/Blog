'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

type Props = {
  /** Override the logo link destination (defaults to /dashboard) */
  backHref?: string
}

const NAV_LINKS = [
  { label: 'Feed',         href: '/dashboard' },
  { label: 'Create Post',  href: '/editor'    },
  { label: 'Profile',      href: '/profile'   },
]

export default function AppHeader({ backHref = '/dashboard' }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <nav className="flex items-center justify-between px-6 h-13" style={{ height: '52px' }}>

        {/* Logo */}
        <Link href={backHref} className="flex items-center gap-2 group shrink-0">
          <span className="flex h-6 w-6 items-center justify-center bg-black text-xs font-black text-white transition-colors group-hover:bg-neutral-700">
            B
          </span>
          <span className="text-sm font-black tracking-tight text-black transition-colors group-hover:text-neutral-500">
            BlogSpace
          </span>
        </Link>

        {/* Center nav: Feed / Create Post / Profile */}
        <ul className="hidden sm:flex items-center">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  id={`appnav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  href={href}
                  className={`relative inline-flex items-center h-[52px] px-5 text-xs font-bold uppercase tracking-widest transition-colors ${
                    isActive
                      ? 'text-black border-b-2 border-black'
                      : 'text-neutral-400 hover:text-black border-b-2 border-transparent hover:border-neutral-300'
                  }`}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right side: avatar chip + logout */}
        <div className="flex items-center gap-2 shrink-0">
          {user && (
            <>
              <Link
                href="/profile"
                className="hidden sm:inline-flex items-center gap-2 border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-all hover:border-neutral-400"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-black text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                id="appheader-logout"
                onClick={handleLogout}
                className="border border-neutral-200 px-3 h-8 text-xs font-bold uppercase tracking-widest text-neutral-500 transition-all hover:border-black hover:bg-black hover:text-white"
              >
                Logout
              </button>
            </>
          )}

          {/* Mobile menu — simple links row */}
          <div className="flex sm:hidden items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-2 py-1 text-xs font-bold transition-colors ${
                    isActive ? 'text-black' : 'text-neutral-400 hover:text-black'
                  }`}
                >
                  {label.split(' ')[0]}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </header>
  )
}
