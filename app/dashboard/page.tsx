'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Post, ContentBlock } from '../data/posts'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../context/AuthContext'
import AppHeader from '../components/AppHeader'
import { renderInline } from '../utils/markdown'

/* ── Tokens ── */
const C = {
  bg: '#F7F7F7',
  surface: '#FFFFFF',
  dark: '#111111',
  muted: '#6B6B6B',
  accent: '#FF6A00',
  accentD: 'rgba(255,106,0,0.10)',
  border: '#DCDCDC',
}

/* ── Content renderer (used in reader drawer) ── */
function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={i} style={{ fontSize: 15, lineHeight: 1.9, color: C.dark, margin: 0 }}>{renderInline(block.text)}</p>
          case 'heading':
            return <h3 key={i} style={{ fontSize: 17, fontWeight: 800, color: C.dark, borderLeft: `3px solid ${C.accent}`, paddingLeft: 14, margin: '8px 0 0', letterSpacing: '-0.025em' }}>{renderInline(block.text)}</h3>
          case 'code':
            return (
              <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                <div style={{ padding: '7px 16px', background: C.bg, borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.muted }}>{block.language}</span>
                </div>
                <pre style={{ margin: 0, padding: '16px 18px', fontSize: 12, lineHeight: 1.75, overflowX: 'auto', fontFamily: "'Fira Code',monospace", color: C.dark, background: '#fafafa' }}>
                  <code>{block.code}</code>
                </pre>
              </div>
            )
          case 'tip':
            return (
              <div key={i} style={{ background: C.dark, borderRadius: 10, padding: '16px 20px', borderLeft: `3px solid ${C.accent}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.accent, marginBottom: 8 }}>Tip</p>
                <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.78)', margin: 0 }}>{renderInline(block.text)}</p>
              </div>
            )
          case 'list':
            return (
              <ul key={i} style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 14, color: C.dark, lineHeight: 1.75 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, marginTop: 8, flexShrink: 0, display: 'inline-block' }} />
                    {renderInline(item)}
                  </li>
                ))}
              </ul>
            )
          default: return null
        }
      })}
    </div>
  )
}

/* ── Slide-in reader drawer ── */
function ReaderDrawer({ post, onClose }: { post: Post | null; onClose: () => void }) {
  const open = !!post

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 60,
          background: 'rgba(0,0,0,0.38)',
          backdropFilter: open ? 'blur(4px)' : 'none',
          WebkitBackdropFilter: open ? 'blur(4px)' : 'none',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity .3s ease',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={post?.title ?? 'Article reader'}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(640px, 95vw)',
          background: C.surface,
          zIndex: 70,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-24px 0 80px -12px rgba(0,0,0,0.18)',
          transform: open ? 'translateX(0)' : 'translateX(105%)',
          transition: 'transform .38s cubic-bezier(0.32, 0, 0.67, 0)',
          fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
        }}
      >
        {/* Top bar */}
        <div style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px', borderBottom: `1px solid ${C.border}`,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          position: 'sticky', top: 0, zIndex: 1,
        }}>
          {post && (
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.accent, background: C.accentD, padding: '3px 10px', borderRadius: 100 }}>
              {post.category}
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            {post && (
              <Link href={`/blog/${post.slug}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: C.muted, textDecoration: 'none', border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 12px', transition: 'border-color .18s, color .18s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.color = C.dark }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                Full page
                <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            )}
            <button
              id="reader-close"
              onClick={onClose}
              aria-label="Close reader"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, border: `1px solid ${C.border}`, borderRadius: 8, background: 'transparent', cursor: 'pointer', color: C.muted, transition: 'background .15s, border-color .15s, color .15s', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 60px' }}>
          {post ? (
            <>
              {post.thumbnail && (
                <div style={{ marginBottom: 28, borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={post.thumbnail} alt={post.title} style={{ width: '100%', aspectRatio: '16/7', objectFit: 'cover', display: 'block' }} />
                </div>
              )}

              <h1 style={{ fontSize: 'clamp(20px,2.8vw,28px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.035em', color: C.dark, marginBottom: 20 }}>
                {post.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 20, borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
                <span style={{ width: 36, height: 36, borderRadius: '50%', background: C.dark, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>
                  {post.author.initials}
                </span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{post.author.name}</p>
                  <p style={{ fontSize: 11, color: C.muted }}>{post.date} · {post.readTime}</p>
                </div>
                {post.featured && (
                  <span style={{ marginLeft: 'auto', background: C.accent, color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '4px 11px', borderRadius: 100 }}>
                    Featured
                  </span>
                )}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
                  {post.tags.map(tag => (
                    <span key={tag} style={{ border: `1px solid ${C.border}`, borderRadius: 100, padding: '3px 11px', fontSize: 11, color: C.muted, fontWeight: 500 }}>#{tag}</span>
                  ))}
                </div>
              )}

              {post.body && post.body.length > 0
                ? <ContentRenderer blocks={post.body} />
                : <p style={{ fontSize: 15, lineHeight: 1.9, color: C.dark }}>{post.excerpt}</p>
              }

              <div style={{ marginTop: 36, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 24 }}>
                {[
                  { d: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z', v: `${(post.views ?? 0).toLocaleString()} views` },
                  { d: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z', v: `${(post.likes ?? 0).toLocaleString()} likes` },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={s.d} /></svg>
                    {s.v}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

/* ── Feed card — hero (first post) ── */
function HeroCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button
      id={`feed-card-${post.slug}`}
      onClick={onClick}
      style={{ width: '100%', textAlign: 'left', border: 'none', padding: 0, background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
    >
      <div
        style={{
          background: C.dark, borderRadius: 16, overflow: 'hidden', position: 'relative',
          display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: 280,
          border: `1px solid #1a1a1a`,
          transition: 'transform .22s ease, box-shadow .22s ease',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px -10px rgba(0,0,0,0.2)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
      >
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {/* Orange glow */}
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 240, height: 240, background: `radial-gradient(circle,rgba(255,106,0,0.18) 0%,transparent 70%)`, pointerEvents: 'none' }} />

        {/* Left text */}
        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(24px,3vw,40px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.accent, background: 'rgba(255,106,0,0.15)', padding: '3px 10px', borderRadius: 100 }}>
                {post.category}
              </span>
              {post.featured && (
                <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', padding: '3px 9px', borderRadius: 100 }}>
                  Featured
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 'clamp(18px,2.4vw,28px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.035em', color: '#fff', marginBottom: 14 }}>
              {post.title}
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.78, color: 'rgba(255,255,255,0.5)', maxWidth: 340 }}>
              {post.excerpt}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 28 }}>
            <span style={{ width: 28, height: 28, borderRadius: '50%', background: C.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
              {post.author.initials.charAt(0)}
            </span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{post.author.name}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{post.date} · {post.readTime}</p>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Read
            </div>
          </div>
        </div>

        {/* Right — thumbnail or pattern */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {post.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55, filter: 'grayscale(20%)' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 80, fontWeight: 900, letterSpacing: '-0.06em', color: 'rgba(255,255,255,0.04)', userSelect: 'none', lineHeight: 1 }}>01</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(17,17,17,0.6) 0%, transparent 60%)' }} />
        </div>
      </div>
    </button>
  )
}

/* ── Feed card — regular ── */
function PostCard({ post, index, onClick }: { post: Post; index: number; onClick: () => void }) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <button
      id={`feed-card-${post.slug}`}
      onClick={onClick}
      style={{ width: '100%', textAlign: 'left', border: 'none', padding: 0, background: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
    >
      <div
        style={{
          background: C.surface, borderRadius: 14, overflow: 'hidden',
          border: `1px solid ${C.border}`, height: '100%',
          display: 'flex', flexDirection: 'column',
          transition: 'transform .22s ease, box-shadow .22s ease, border-color .22s',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = '0 16px 48px -8px rgba(0,0,0,0.12)'; el.style.borderColor = C.accent }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = 'none'; el.style.borderColor = C.border }}
      >
        {/* Thumbnail */}
        {post.thumbnail ? (
          <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.thumbnail} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
              onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
              onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'none')} />
            {/* Number overlay */}
            <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: 6 }}>
              {num}
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', aspectRatio: '16/9', background: C.bg, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <span style={{ fontSize: 56, fontWeight: 900, letterSpacing: '-0.05em', color: C.border, lineHeight: 1, userSelect: 'none' }}>{num}</span>
            {/* subtle grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.border} 1px,transparent 1px),linear-gradient(90deg,${C.border} 1px,transparent 1px)`, backgroundSize: '24px 24px', opacity: 0.5 }} />
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '18px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.accent, background: C.accentD, padding: '3px 9px', borderRadius: 100 }}>
              {post.category}
            </span>
            <span style={{ fontSize: 10, color: C.muted }}>{post.readTime}</span>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.025em', color: C.dark, marginBottom: 8, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {post.title}
          </h3>

          <p style={{ fontSize: 12, lineHeight: 1.7, color: C.muted, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: 16 }}>
            {post.excerpt}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: C.dark, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, flexShrink: 0 }}>
              {post.author.initials.charAt(0)}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: C.dark }}>{post.author.name.split(' ')[0]}</span>
            <span style={{ fontSize: 10, color: C.muted, marginLeft: 'auto' }}>{post.date}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

/* ── Dashboard page ── */
export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { posts, hydrated } = usePosts()

  useEffect(() => { if (!authLoading && !user) router.replace('/login') }, [authLoading, user, router])

  const [search, setSearch] = useState('')
  const [activePost, setActivePost] = useState<Post | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map(p => p.category))).sort()
    return ['All', ...cats]
  }, [posts])

  const filtered = useMemo(() => {
    let list = posts
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [posts, search, activeCategory])

  const openPost = useCallback((post: Post) => setActivePost(post), [])
  const closePost = useCallback(() => setActivePost(null), [])

  /* Loading skeleton */
  if (authLoading || !user || !hydrated) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
        <div style={{ height: 56, background: C.surface, borderBottom: `1px solid ${C.border}` }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px clamp(16px,3vw,48px)' }}>
          <div style={{ height: 280, background: '#eee', borderRadius: 16, marginBottom: 32 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.surface }}>
                <div style={{ aspectRatio: '16/9', background: '#eee' }} />
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ height: 8, width: 60, background: '#eee', borderRadius: 4 }} />
                  <div style={{ height: 12, width: '80%', background: '#eee', borderRadius: 4 }} />
                  <div style={{ height: 10, width: '55%', background: '#eee', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const heroPost = filtered[0] ?? null
  const restPosts = filtered.slice(1)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <AppHeader />

      {/* ── Top bar: search + filters ── */}
      <div style={{ position: 'sticky', top: 56, zIndex: 30, background: 'rgba(247,247,247,0.96)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,3vw,48px)', height: 52, display: 'flex', alignItems: 'center', gap: 16 }}>

          {/* Search */}
          <div style={{ position: 'relative', width: 220, flexShrink: 0 }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, display: 'flex', pointerEvents: 'none' }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
            </span>
            <input
              id="feed-search" type="search" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search posts…"
              style={{ width: '100%', paddingTop: 7, paddingBottom: 7, paddingLeft: 32, paddingRight: 12, fontSize: 12, color: C.dark, background: C.surface, border: `1.5px solid ${C.border}`, borderRadius: 8, outline: 'none', fontFamily: 'inherit', transition: 'border-color .18s', boxSizing: 'border-box' }}
              onFocus={e => (e.currentTarget.style.borderColor = C.dark)}
              onBlur={e => (e.currentTarget.style.borderColor = C.border)}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflowX: 'auto', flex: 1 }}>
            {categories.map(cat => {
              const active = cat === activeCategory
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  style={{
                    flexShrink: 0, border: `1.5px solid ${active ? C.dark : C.border}`,
                    borderRadius: 100, padding: '4px 14px',
                    fontSize: 11, fontWeight: 700,
                    color: active ? '#fff' : C.muted,
                    background: active ? C.dark : 'transparent',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all .18s',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.color = C.dark } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted } }}>
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Post count + Write CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap' }}>{filtered.length} post{filtered.length !== 1 ? 's' : ''}</span>
            <Link id="dashboard-create-cta" href="/editor" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: C.accent, color: '#fff', border: 'none', borderRadius: 8,
              padding: '6px 14px', fontSize: 11, fontWeight: 700,
              textDecoration: 'none', transition: 'filter .18s',
            }}
              onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
              onMouseLeave={e => (e.currentTarget.style.filter = 'none')}>
              <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Write
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,48px) 80px' }}>

        {filtered.length === 0 ? (
          /* Empty state */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 80, paddingBottom: 80, textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke={C.border} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>No posts found</p>
            <p style={{ fontSize: 13, color: C.muted }}>Try a different search or category</p>
            {(search || activeCategory !== 'All') && (
              <button onClick={() => { setSearch(''); setActiveCategory('All') }}
                style={{ fontSize: 12, color: C.accent, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Hero card */}
            {heroPost && (
              <div style={{ marginBottom: 28 }}>
                <HeroCard post={heroPost} onClick={() => openPost(heroPost)} />
              </div>
            )}

            {/* 3-column grid for rest */}
            {restPosts.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap: 20 }} className="post-grid">
                {restPosts.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={i + 1} onClick={() => openPost(post)} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Slide-in reader drawer ── */}
      <ReaderDrawer post={activePost} onClose={closePost} />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        @media (max-width: 640px) {
          .post-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
