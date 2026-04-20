'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../hooks/usePosts'
import AppHeader from '../components/AppHeader'

const C = {
  bg:      '#F7F7F7',
  surface: '#FFFFFF',
  dark:    '#111111',
  muted:   '#6B6B6B',
  accent:  '#FF6A00',
  accentD: 'rgba(255,106,0,0.10)',
  border:  '#DCDCDC',
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { posts, hydrated, deletePost } = usePosts()

  useEffect(() => { if (!authLoading && !user) router.replace('/login') }, [authLoading, user, router])
  if (authLoading || !user) return null

  const myPosts   = hydrated ? posts.filter(p => p.author.name === user.name) : []
  const totalLikes = myPosts.reduce((s, p) => s + (p.likes ?? 0), 0)
  const totalViews = myPosts.reduce((s, p) => s + (p.views ?? 0), 0)

  const STATS = [
    { label: 'Total Posts',  value: myPosts.length },
    { label: 'Total Likes',  value: totalLikes },
    { label: 'Total Views',  value: totalViews },
    { label: 'Featured',     value: myPosts.filter(p => p.featured).length },
  ]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <AppHeader />

      {/* ── Profile hero ── */}
      <div style={{ background: C.dark, borderBottom: `1px solid #222` }}>
        {/* subtle grid */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px', pointerEvents: 'none',
          }} />
          <div style={{ position: 'absolute', bottom: -80, right: 100, width: 300, height: 300, background: `radial-gradient(circle, rgba(255,106,0,0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />

          <div style={{ maxWidth: 1024, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(20px,4vw,48px)', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
              {/* Avatar + info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                  background: C.accent, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em',
                  boxShadow: '0 0 0 3px rgba(255,106,0,0.25)',
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 4 }}>
                    {user.name}
                  </h1>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 10 }}>{user.email}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    <span><strong style={{ color: '#fff', fontWeight: 800 }}>{myPosts.length}</strong> post{myPosts.length !== 1 ? 's' : ''}</span>
                    <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                    <span><strong style={{ color: '#fff', fontWeight: 800 }}>{totalLikes}</strong> likes</span>
                    <span style={{ width: 1, height: 10, background: 'rgba(255,255,255,0.15)', display: 'inline-block' }} />
                    <span><strong style={{ color: '#fff', fontWeight: 800 }}>{totalViews}</strong> views</span>
                  </div>
                </div>
              </div>

              {/* New Post CTA */}
              <Link href="/editor" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: C.accent, color: '#fff',
                border: '1.5px solid transparent', borderRadius: 9,
                padding: '10px 20px', fontSize: 13, fontWeight: 700,
                textDecoration: 'none', flexShrink: 0,
                transition: 'filter .18s, transform .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none' }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                New Post
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats band ── */}
      {myPosts.length > 0 && (
        <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }} className="profile-stats">
            {STATS.map((s, i) => (
              <div key={s.label} style={{
                paddingTop: 20, paddingBottom: 20,
                paddingLeft: i === 0 ? 0 : 24, paddingRight: i === 3 ? 0 : 24,
                borderRight: i < 3 ? `1px solid ${C.border}` : 'none',
              }}>
                <p style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', color: C.dark, marginBottom: 3 }}>{s.value}</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Posts list ── */}
      <div style={{ flex: 1, maxWidth: 1024, margin: '0 auto', width: '100%', padding: 'clamp(24px,4vw,48px) clamp(20px,4vw,48px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
          <h2 style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.dark, margin: 0 }}>Your Posts</h2>
          <span style={{ fontSize: 11, color: C.muted }}>{myPosts.length} total</span>
        </div>

        {/* Skeleton */}
        {!hydrated ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: 20, background: C.surface, borderRadius: i === 0 ? '10px 10px 0 0' : i === 2 ? '0 0 10px 10px' : 0, border: `1px solid ${C.border}` }}>
                <div style={{ width: 80, height: 56, background: '#eee', borderRadius: 6, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ height: 10, width: '70%', background: '#eee', borderRadius: 4 }} />
                  <div style={{ height: 8, width: '45%', background: '#eee', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : myPosts.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '72px 40px', background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={C.border} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.dark, marginBottom: 4 }}>No posts yet</p>
              <p style={{ fontSize: 12, color: C.muted }}>Start writing your first article</p>
            </div>
            <Link href="/editor" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: C.dark, color: '#fff', borderRadius: 8,
              padding: '10px 20px', fontSize: 13, fontWeight: 700,
              textDecoration: 'none', transition: 'background .18s',
            }}>
              Write First Post
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: C.border, borderRadius: 12, overflow: 'hidden' }}>
            {myPosts.map((post, idx) => (
              <div key={post.slug} className="profile-post-row" style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                padding: '16px 20px', background: C.surface,
                borderRadius: idx === 0 ? '11px 11px 0 0' : idx === myPosts.length - 1 ? '0 0 11px 11px' : 0,
                transition: 'background .15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={e => (e.currentTarget.style.background = C.surface)}>

                {/* Thumbnail */}
                {post.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.thumbnail} alt={post.title}
                    style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: `1px solid ${C.border}` }} />
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.accent, background: C.accentD, padding: '2px 8px', borderRadius: 100 }}>
                      {post.category}
                    </span>
                    {post.featured && (
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', background: C.dark, color: '#fff', padding: '2px 8px', borderRadius: 100 }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</p>
                  <p style={{ fontSize: 11, color: C.muted, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.excerpt}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#bbb' }}>
                    <span>{post.date}</span>
                    <span>·</span><span>{post.readTime}</span>
                    <span>·</span><span>{post.likes ?? 0} likes</span>
                    <span>·</span><span>{post.views ?? 0} views</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }} className="profile-actions">
                  <Link href={`/editor?edit=${post.slug}`} id={`profile-edit-${post.slug}`} title="Edit post"
                    style={{
                      width: 32, height: 32, border: `1px solid ${C.border}`, borderRadius: 7,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: C.muted, textDecoration: 'none',
                      transition: 'border-color .18s, background .18s, color .18s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = C.dark }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                    </svg>
                  </Link>
                  <button id={`profile-delete-${post.slug}`} onClick={() => deletePost(post.slug)} title="Delete post"
                    style={{
                      width: 32, height: 32, border: `1px solid ${C.border}`, borderRadius: 7,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: C.muted, background: 'none', cursor: 'pointer',
                      transition: 'border-color .18s, background .18s, color .18s',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff0ee'; e.currentTarget.style.borderColor = '#fcc'; e.currentTarget.style.color = '#C0392B' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @media (max-width: 600px) {
          .profile-stats { grid-template-columns: repeat(2,1fr) !important; }
          .profile-actions { opacity: 1 !important; }
        }
      `}</style>
    </div>
  )
}
