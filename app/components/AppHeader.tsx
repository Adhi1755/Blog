'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

const C = {
  bg:     '#F7F7F7',
  dark:   '#111111',
  muted:  '#6B6B6B',
  accent: '#FF6A00',
  border: '#DCDCDC',
  white:  '#FFFFFF',
}

const NAV_LINKS = [
  { label: 'Feed',        href: '/dashboard' },
  { label: 'Create Post', href: '/editor'    },
  { label: 'Profile',     href: '/profile'   },
]

export default function AppHeader({ backHref = '/dashboard' }: { backHref?: string }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, logout } = useAuth()

  function handleLogout() { logout(); router.push('/') }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(247,247,247,0.95)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`,
    }}>
      <nav style={{
        maxWidth: 1280, margin: '0 auto',
        height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px,3vw,48px)',
        fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      }}>

        {/* Logo */}
        <Link href={backHref} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', flexShrink: 0 }}>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.04em', color: C.accent }}>BLOG</span>
          <span style={{ fontSize: 17, fontWeight: 900, letterSpacing: '-0.05em', color: C.dark }}>RAM</span>
        </Link>

        {/* Center nav */}
        <ul style={{ display: 'flex', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0, gap: 2 }} className="appnav-links">
          {NAV_LINKS.map(({ label, href }) => {
            const active = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  id={`appnav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                  href={href}
                  style={{
                    display: 'inline-flex', alignItems: 'center', height: 56,
                    padding: '0 16px',
                    fontSize: 12, fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: active ? C.accent : C.muted,
                    borderBottom: `2px solid ${active ? C.accent : 'transparent'}`,
                    transition: 'color .18s, border-color .18s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = C.dark }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = C.muted }}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {user && (
            <>
              <Link href="/profile" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '5px 12px 5px 6px',
                fontSize: 12, fontWeight: 600, color: C.dark,
                textDecoration: 'none', transition: 'border-color .18s',
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accent)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: C.dark, color: C.white,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, flexShrink: 0,
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                id="appheader-logout"
                onClick={handleLogout}
                style={{
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: C.muted,
                  background: 'transparent', cursor: 'pointer',
                  transition: 'border-color .18s, color .18s, background .18s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.color = C.white; e.currentTarget.style.borderColor = C.dark }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <style jsx global>{`
        @media (max-width: 600px) {
          .appnav-links { gap: 0 !important; }
          .appnav-links li a { padding: 0 10px !important; font-size: 10px !important; }
        }
      `}</style>
    </header>
  )
}
