'use client'

import { use, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { posts as seedPosts, type Post, type ContentBlock } from '../../data/posts'
import { usePosts } from '../../hooks/usePosts'
import { useAuth } from '../../context/AuthContext'
import AppHeader from '../../components/AppHeader'
import { renderInline } from '../../utils/markdown'

/* ── Design tokens ─────────────────────────────────────────── */
const C = {
  bg:        '#F7F7F7',
  bg2:       '#F0F0EE',
  surface:   '#FFFFFF',
  dark:      '#111111',
  muted:     '#6B6B6B',
  accent:    '#FF6A00',
  accentDim: 'rgba(255,106,0,0.10)',
  border:    '#DCDCDC',
  white:     '#FFFFFF',
}

const STORAGE_KEY = 'blogspace_posts'

function getPostBySlug(slug: string): Post | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: Post[] = raw ? JSON.parse(raw) : seedPosts
    return list.find((p) => p.slug === slug) ?? null
  } catch {
    return seedPosts.find((p) => p.slug === slug) ?? null
  }
}

/* ── Content block renderers ──────────────────────────────── */
function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p style={{ fontSize: 16, lineHeight: 1.9, color: '#3a3a3a', margin: 0 }}>
          {renderInline(block.text)}
        </p>
      )
    case 'heading':
      return (
        <h2 style={{
          fontSize: 'clamp(18px,2.2vw,22px)', fontWeight: 800,
          color: C.dark, letterSpacing: '-0.03em', lineHeight: 1.25,
          paddingLeft: 16, borderLeft: `3px solid ${C.accent}`,
          marginTop: 12,
        }}>
          {renderInline(block.text)}
        </h2>
      )
    case 'code':
      return (
        <div style={{ borderRadius: 12, overflow: 'hidden', border: `1px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Code header bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 16px', background: C.dark,
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
          }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />
              ))}
            </div>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: C.accent,
              background: 'rgba(255,106,0,0.12)', padding: '2px 10px', borderRadius: 100,
            }}>
              {block.language}
            </span>
          </div>
          <pre style={{
            margin: 0, padding: '20px 22px',
            fontSize: 13, lineHeight: 1.75,
            overflowX: 'auto',
            fontFamily: "'Fira Code','Cascadia Code','JetBrains Mono',monospace",
            color: '#e8e8e8',
            background: '#181818',
          }}>
            <code>{block.code}</code>
          </pre>
        </div>
      )
    case 'tip':
      return (
        <div style={{
          background: C.dark, borderRadius: 12, padding: '18px 22px',
          borderLeft: `3px solid ${C.accent}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, background: 'radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <span style={{
              width: 20, height: 20, borderRadius: 6, flexShrink: 0,
              background: C.accentDim, border: `1px solid rgba(255,106,0,0.3)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </span>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, margin: 0 }}>Pro Tip</p>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.78, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            {renderInline(block.text)}
          </p>
        </div>
      )
    case 'list':
      return (
        <ul style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {block.items.map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, fontSize: 15, color: '#3a3a3a', lineHeight: 1.75 }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: C.accent, marginTop: 9, flexShrink: 0,
                boxShadow: `0 0 0 3px ${C.accentDim}`,
              }} />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

/* ── Like button ──────────────────────────────────────────── */
function LikeButton({ slug, initialLikes, onLike }: { slug: string; initialLikes: number; onLike: () => void }) {
  const LIKED_KEY = `liked_${slug}`

  // Read localStorage synchronously in the initializer — no effect, no lint violation
  const [liked, setLiked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(LIKED_KEY) === '1'
  })
  // Local delta so we never mirror props into state
  const [localLikeDelta, setLocalLikeDelta] = useState(0)
  const [burst, setBurst] = useState(false)

  // Derived: always based on the authoritative prop + any optimistic increment we added
  const likesToShow = initialLikes + localLikeDelta

  const handleLike = useCallback(() => {
    if (liked) return
    setLiked(true)
    setLocalLikeDelta(d => d + 1)
    setBurst(true)
    localStorage.setItem(LIKED_KEY, '1')
    onLike()
    setTimeout(() => setBurst(false), 700)
  }, [liked, onLike, LIKED_KEY])

  return (
    <button
      id="like-post-btn"
      onClick={handleLike}
      disabled={liked}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: liked ? '12px 24px' : '12px 22px',
        borderRadius: 12,
        background: liked
          ? 'linear-gradient(135deg, rgba(255,50,50,0.14), rgba(255,80,80,0.07))'
          : C.surface,
        border: `1.5px solid ${liked ? 'rgba(255,60,60,0.5)' : C.border}`,
        cursor: liked ? 'default' : 'pointer',
        fontFamily: 'inherit',
        outline: 'none',
        position: 'relative', overflow: 'hidden',
        transform: burst ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform .22s cubic-bezier(0.22,1,0.36,1), border-color .22s, background .22s, box-shadow .22s',
        boxShadow: liked
          ? '0 0 0 3px rgba(255,60,60,0.10), 0 8px 30px -6px rgba(255,60,60,0.22)'
          : '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        if (!liked) {
          e.currentTarget.style.borderColor = 'rgba(255,60,60,0.5)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,60,60,0.15)'
          e.currentTarget.style.background = 'rgba(255,60,60,0.04)'
        }
      }}
      onMouseLeave={e => {
        if (!liked) {
          e.currentTarget.style.borderColor = C.border
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
          e.currentTarget.style.background = C.surface
        }
      }}
    >
      {/* Burst keyframe ring */}
      {burst && (
        <span style={{
          position: 'absolute', inset: 0, borderRadius: 12,
          border: '2px solid rgba(255,60,60,0.5)',
          animation: 'like-burst .7s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}
      {/* Heart */}
      <svg
        width="18" height="18" viewBox="0 0 24 24"
        fill={liked ? '#FF3040' : 'none'}
        stroke={liked ? '#FF3040' : C.muted}
        strokeWidth={liked ? 0 : 1.8}
        style={{ transition: 'fill .22s, stroke .22s, transform .18s', transform: liked ? 'scale(1.15)' : 'scale(1)', flexShrink: 0 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
      <span style={{
        fontSize: 14, fontWeight: 700,
        color: liked ? '#FF3040' : C.muted,
        transition: 'color .22s',
      }}>
        {liked ? 'Liked!' : 'Like this post'}
      </span>
      {/* Count badge */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 32, height: 24, borderRadius: 8,
        background: liked ? 'rgba(255,48,64,0.12)' : C.bg,
        border: `1px solid ${liked ? 'rgba(255,48,64,0.2)' : C.border}`,
        fontSize: 12, fontWeight: 800,
        color: liked ? '#FF3040' : C.muted,
        padding: '0 8px',
        transition: 'background .22s, border-color .22s, color .22s',
      }}>
        {likesToShow.toLocaleString()}
      </span>
    </button>
  )
}

/* ── Skeleton ─────────────────────────────────────────────── */
function ArticleSkeleton() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <div style={{ height: 56, background: C.surface, borderBottom: `1px solid ${C.border}` }} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px clamp(16px,4vw,40px)' }}>
        <div style={{ height: 320, background: '#e8e8e8', borderRadius: 16, marginBottom: 40, animation: 'pulse 1.5s ease-in-out infinite' }} />
        {[90, 60, 80, 100, 72, 88, 50, 95].map((w, i) => (
          <div key={i} style={{ height: i === 0 ? 18 : 13, width: `${w}%`, background: '#e8e8e8', borderRadius: 6, marginBottom: i < 2 ? 12 : 10, animation: 'pulse 1.5s ease-in-out infinite' }} />
        ))}
      </div>
    </div>
  )
}

/* ── Post not found ───────────────────────────────────────── */
function PostNotFound({ slug }: { slug: string }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans','Helvetica Neue',sans-serif", display: 'flex', flexDirection: 'column' }}>
      <AppHeader backHref="/dashboard" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, padding: 40, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke={C.border} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.dark, letterSpacing: '-0.03em' }}>Post not found</h1>
        <p style={{ fontSize: 13, color: C.muted, maxWidth: 280, lineHeight: 1.7 }}>
          No post with slug <code style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 5, padding: '2px 7px', fontSize: 11, color: C.dark }}>{slug}</code> exists.
        </p>
        <Link href="/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: C.dark, color: C.white,
          padding: '10px 22px', borderRadius: 9,
          fontSize: 13, fontWeight: 700, textDecoration: 'none',
          transition: 'background .18s',
        }}>
          ← Back to Feed
        </Link>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════ */
export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useAuth()
  const { posts, likePost, addComment, incrementViews } = usePosts()
  const router = useRouter()

  // "Fallback" post loaded once from localStorage via lazy initializer — no effect, no lint violation
  const [fallbackPost]                      = useState<Post | null | undefined>(() =>
    getPostBySlug(slug)
  )
  const [commentText, setCommentText]       = useState('')
  // Only used when no logged-in user; never mirrored from props
  const [commentName, setCommentName]       = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError]     = useState('')

  // ── Animation phase: 'entering' → 'visible' → 'exiting' ──
  const [phase, setPhase] = useState<'entering' | 'visible' | 'exiting'>('entering')
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Trigger enter animation on mount
  useEffect(() => {
    const t = setTimeout(() => setPhase('visible'), 20)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => () => { if (exitTimerRef.current) clearTimeout(exitTimerRef.current) }, [])

  // Intercept back-navigation: play exit then route
  const navigateBack = useCallback((href: string) => {
    if (phase === 'exiting') return
    setPhase('exiting')
    exitTimerRef.current = setTimeout(() => router.push(href), 420)
  }, [phase, router])

  // Side-effect only: increment view count (no setState)
  useEffect(() => {
    incrementViews(slug)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // Derive the live post directly from usePosts state — no setState needed
  const livePost = posts.find((p) => p.slug === slug) ?? null
  // Prefer the live (up-to-date) post; fall back to the localStorage snapshot while loading
  const post = livePost ?? fallbackPost

  // Derive the effective commenter name: logged-in user wins, guest fills in manually
  const effectiveCommentName = user?.name ?? commentName

  const handleLike = useCallback(() => likePost(slug), [likePost, slug])

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    setCommentError('')
    if (!commentText.trim()) { setCommentError('Comment cannot be empty.'); return }
    if (!effectiveCommentName.trim()) { setCommentError('Please enter your name.'); return }
    setSubmittingComment(true)
    await new Promise((r) => setTimeout(r, 300))
    addComment(slug, {
      authorName: effectiveCommentName.trim(),
      authorInitials: effectiveCommentName.trim().split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      text: commentText.trim(),
    })
    setCommentText('')
    setSubmittingComment(false)
  }

  if (post === undefined) return <ArticleSkeleton />
  if (post === null)      return <PostNotFound slug={slug} />
  // narrowed: post is Post from here on

  const hasBody    = post.body && post.body.length > 0
  const body       = hasBody ? post.body! : [{ type: 'paragraph' as const, text: post.excerpt }]
  const comments   = post.comments ?? []

  /* ── Per-phase animation styles ── */
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: C.bg,
    fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
    color: C.dark,
    opacity:   phase === 'visible' ? 1 : 0,
    transform: phase === 'exiting'
      ? 'translateY(-18px) scale(0.985)'
      : phase === 'entering'
        ? 'translateY(28px)'
        : 'translateY(0) scale(1)',
    transition: phase === 'exiting'
      ? 'opacity .38s cubic-bezier(0.4,0,1,1), transform .38s cubic-bezier(0.4,0,1,1)'
      : 'opacity .55s cubic-bezier(0.22,1,0.36,1), transform .55s cubic-bezier(0.22,1,0.36,1)',
    willChange: 'opacity, transform',
  }

  return (
    <div style={pageStyle}>
      <AppHeader backHref="/dashboard" />

      {/* ── Hero thumbnail — scale-in reveal ── */}
      {post.thumbnail && (
        <div style={{
          width: '100%', maxHeight: 420, overflow: 'hidden',
          position: 'relative', background: C.dark,
          animation: phase !== 'entering' ? 'hero-reveal .9s cubic-bezier(0.22,1,0.36,1) both' : 'none',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt={post.title}
            style={{
              width: '100%', height: '100%', maxHeight: 420,
              objectFit: 'cover', display: 'block', opacity: 0.82,
              animation: phase !== 'entering' ? 'img-scale-in 1.1s cubic-bezier(0.22,1,0.36,1) both' : 'none',
            }}
          />
          {/* gradient overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(17,17,17,0.55) 100%)' }} />
          {/* grid texture */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        </div>
      )}

      {/* ── Article layout ── */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) 100px' }}>

        {/* ── Article header — staggered slide-in ── */}
        <header style={{
          paddingTop: post.thumbnail ? 40 : 52, paddingBottom: 36,
          animation: phase !== 'entering' ? 'content-rise .65s .15s cubic-bezier(0.22,1,0.36,1) both' : 'none',
        }}>
          {/* Back to feed — triggers exit animation */}
          <button
            onClick={() => navigateBack('/dashboard')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              fontSize: 12, fontWeight: 700, color: C.muted,
              background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              marginBottom: 32, letterSpacing: '0.05em', textTransform: 'uppercase',
              transition: 'color .18s', padding: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All posts
          </button>

          {/* Badges row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 22 }}>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase',
              color: C.accent, background: C.accentDim,
              border: '1px solid rgba(255,106,0,0.22)',
              padding: '4px 12px', borderRadius: 100,
            }}>
              {post.category}
            </span>
            {post.featured && (
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: C.dark, border: `1px solid ${C.border}`,
                padding: '4px 11px', borderRadius: 100,
              }}>
                ✦ Featured
              </span>
            )}
            {(post.tags ?? []).map(tag => (
              <span key={tag} style={{
                fontSize: 10, fontWeight: 500, color: C.muted,
                border: `1px solid ${C.border}`, borderRadius: 100,
                padding: '3px 10px', letterSpacing: '0.02em',
              }}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(26px,4.5vw,46px)', fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-0.04em',
            color: C.dark, marginBottom: 18,
          }}>
            {post.title}
          </h1>

          {/* Excerpt / lead */}
          <p style={{ fontSize: 17, lineHeight: 1.75, color: C.muted, maxWidth: 620, marginBottom: 32 }}>
            {post.excerpt}
          </p>

          {/* Separator with accent bar */}
          <div style={{ position: 'relative', height: 1, background: C.border, marginBottom: 28 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: 2, width: 48, background: C.accent, borderRadius: 2, marginTop: -0.5 }} />
          </div>

          {/* Author row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
                background: C.dark, color: C.white,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 800,
                boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
              }}>
                {post.author.initials}
              </span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{post.author.name}</p>
                <p style={{ fontSize: 11, color: C.muted }}>Author</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              {[
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" /></>,
                  label: post.date,
                },
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></>,
                  label: post.readTime,
                },
                {
                  icon: <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>,
                  label: `${(post.views ?? 0).toLocaleString()} views`,
                },
              ].map((item, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.muted }}>
                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    {item.icon}
                  </svg>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ── Article body ── */}
        <article
          id="article-content"
          style={{
            display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 56,
            animation: phase !== 'entering' ? 'content-rise .72s .32s cubic-bezier(0.22,1,0.36,1) both' : 'none',
          }}
        >
          {body.map((block, i) => (
            <RenderBlock key={i} block={block} />
          ))}

          {/* ── Like + share row ── */}
          <div style={{
            marginTop: 20, paddingTop: 32,
            borderTop: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16,
          }}>
            <LikeButton
              slug={slug}
              initialLikes={post.likes ?? 0}
              onLike={handleLike}
            />
            <button
              onClick={() => navigateBack('/dashboard')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontSize: 12, fontWeight: 700, color: C.muted,
                background: 'none', border: `1.5px solid ${C.border}`, borderRadius: 9,
                padding: '10px 18px', cursor: 'pointer', fontFamily: 'inherit',
                transition: 'border-color .18s, color .18s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.color = C.dark }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              More posts
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* ── Author card ── */}
          <div style={{
            marginTop: 12, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20,
            background: C.dark, borderRadius: 16, padding: 'clamp(20px,3vw,32px)',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 4px 30px rgba(0,0,0,0.12)',
          }}>
            {/* Glow */}
            <div style={{ position: 'absolute', bottom: -40, right: -40, width: 220, height: 220, background: 'radial-gradient(circle, rgba(255,106,0,0.14) 0%, transparent 70%)', pointerEvents: 'none' }} />
            {/* Grid texture */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

            <span style={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              background: C.accent, color: C.white,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 900, position: 'relative',
              boxShadow: '0 0 0 3px rgba(255,106,0,0.25)',
            }}>
              {post.author.initials}
            </span>
            <div style={{ flex: 1, position: 'relative' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: 4 }}>Written by</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: C.white, letterSpacing: '-0.03em', marginBottom: 2 }}>{post.author.name}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Published {post.date} · {post.readTime}</p>
            </div>
            {user && post.author.name === user.name && (
              <Link
                href={`/editor?edit=${post.slug}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  border: '1px solid rgba(255,255,255,0.18)', borderRadius: 9,
                  padding: '8px 16px', fontSize: 12, fontWeight: 700,
                  color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                  background: 'rgba(255,255,255,0.06)',
                  transition: 'border-color .18s, color .18s, background .18s',
                  position: 'relative',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.white; e.currentTarget.style.background = 'rgba(255,106,0,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              >
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit post
              </Link>
            )}
          </div>

          {/* ── Comments section ── */}
          <div id="comments" style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: C.dark, letterSpacing: '-0.03em' }}>Comments</h2>
              <span style={{
                background: C.dark, color: C.white,
                fontSize: 11, fontWeight: 800, borderRadius: 100,
                padding: '3px 10px',
                minWidth: 26, textAlign: 'center',
              }}>
                {comments.length}
              </span>
            </div>

            {/* Comment form */}
            <form
              id="comment-form"
              onSubmit={handleComment}
              style={{
                display: 'flex', flexDirection: 'column', gap: 14,
                background: C.surface, borderRadius: 14,
                border: `1px solid ${C.border}`,
                padding: 'clamp(20px,3vw,28px)',
                marginBottom: 32,
                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.dark, letterSpacing: '-0.02em' }}>Leave a comment</h3>

              {/* Show name field only for guests */}
              {!user && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label htmlFor="comment-name" style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Your name</label>
                  <input
                    id="comment-name"
                    type="text"
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    placeholder="Jane Doe"
                    style={{
                      width: '100%', padding: '10px 14px',
                      fontSize: 13, color: C.dark,
                      background: C.bg, border: `1.5px solid ${C.border}`,
                      borderRadius: 9, outline: 'none',
                      fontFamily: 'inherit', boxSizing: 'border-box',
                      transition: 'border-color .18s',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = C.dark)}
                    onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="comment-text" style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Comment</label>
                <textarea
                  id="comment-text"
                  rows={4}
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Share your thoughts…"
                  style={{
                    width: '100%', padding: '12px 14px',
                    fontSize: 13, color: C.dark,
                    background: C.bg, border: `1.5px solid ${C.border}`,
                    borderRadius: 9, outline: 'none',
                    fontFamily: 'inherit', resize: 'vertical',
                    boxSizing: 'border-box', transition: 'border-color .18s',
                    lineHeight: 1.7,
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = C.dark)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                />
              </div>

              {commentError && (
                <p style={{ fontSize: 12, color: '#d32f2f', fontWeight: 600, margin: 0 }}>{commentError}</p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  id="submit-comment"
                  disabled={submittingComment}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 22px', borderRadius: 9,
                    background: C.dark, color: C.white,
                    border: `1.5px solid ${C.dark}`,
                    fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                    cursor: submittingComment ? 'wait' : 'pointer',
                    opacity: submittingComment ? 0.6 : 1,
                    transition: 'background .18s, transform .15s',
                    letterSpacing: '0.04em',
                  }}
                  onMouseEnter={e => { if (!submittingComment) { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.dark; e.currentTarget.style.transform = 'none' }}
                >
                  {submittingComment ? (
                    <><svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ animation: 'spin 1s linear infinite' }}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Posting…</>
                  ) : 'Post Comment'}
                </button>
                {user && (
                  <span style={{ fontSize: 12, color: C.muted }}>
                    Posting as <strong style={{ color: C.dark, fontWeight: 700 }}>{user.name}</strong>
                  </span>
                )}
              </div>
            </form>

            {/* Comment list */}
            {comments.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '36px 24px',
                background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>💬</div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.dark, marginBottom: 4 }}>No comments yet</p>
                <p style={{ fontSize: 12, color: C.muted }}>Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, borderRadius: 14, overflow: 'hidden', border: `1px solid ${C.border}`, background: C.border }}>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 14,
                      padding: '18px 22px', background: C.surface,
                    }}
                  >
                    <span style={{
                      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                      background: C.dark, color: C.white,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800,
                    }}>
                      {comment.authorInitials}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.dark }}>{comment.authorName}</span>
                        <span style={{ fontSize: 11, color: C.muted }}>{comment.date}</span>
                      </div>
                      <p style={{ fontSize: 13, lineHeight: 1.75, color: '#3a3a3a', margin: 0, wordBreak: 'break-word' }}>{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Bottom nav ── */}
          <div style={{
            marginTop: 32, paddingTop: 24,
            borderTop: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            animation: phase !== 'entering' ? 'content-rise .65s .48s cubic-bezier(0.22,1,0.36,1) both' : 'none',
          }}>
            <button
              onClick={() => navigateBack('/dashboard')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontSize: 12, fontWeight: 700, color: C.muted,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'color .18s', padding: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              All posts
            </button>
            <button
              id="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                fontSize: 12, fontWeight: 700, color: C.muted,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', transition: 'color .18s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
            >
              Back to top
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </article>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }

        /* ── Page enter/exit transitions ── */
        @keyframes content-rise {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-reveal {
          from { opacity: 0; clip-path: inset(100% 0 0 0); }
          to   { opacity: 1; clip-path: inset(0% 0 0 0); }
        }
        @keyframes img-scale-in {
          from { transform: scale(1.08); }
          to   { transform: scale(1); }
        }

        /* ── Utility ── */
        @keyframes like-burst {
          0%   { transform: scale(1);   opacity: 1; border-width: 2px; }
          100% { transform: scale(2.6); opacity: 0; border-width: 1px; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
