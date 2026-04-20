'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'

/* ─────────────────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────────────────── */
function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   LOGO — shared across nav and footer
───────────────────────────────────────────────────────────────────────── */
function BlogramLogo({ size = 20 }: { size?: number }) {
  return (
    <Link
      href="/"
      style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: '0px' }}
    >
      <span style={{
        fontSize: `${size}px`,
        fontWeight: 800,
        letterSpacing: '-0.03em',
        color: 'var(--accent)',       /* BLOG in orange */
        lineHeight: 1,
      }}>
        BLOG
      </span>
      <span style={{
        fontSize: `${size}px`,
        fontWeight: 900,
        letterSpacing: '-0.05em',
        color: 'var(--text-primary)', /* RAM in black */
        lineHeight: 1,
      }}>
        RAM
      </span>
    </Link>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   AI FEATURES DATA
───────────────────────────────────────────────────────────────────────── */
const AI_FEATURES = [
  {
    id: 'classify',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <path d="M17.5 14h.01M14 17.5h.01M21 17.5h.01M17.5 21h.01M14 14l3.5 3.5M21 14l-3.5 3.5M14 21l3.5-3.5M21 21l-3.5-3.5"/>
      </svg>
    ),
    label: 'ML Classification',
    title: 'Auto-categorize every post',
    body: 'A machine learning model trained on thousands of articles automatically classifies each post into the right category — no manual tagging needed.',
  },
  {
    id: 'summarize',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    label: 'AI Summarization',
    title: 'TL;DR powered by AI',
    body: 'Every article gets an AI-generated summary so readers can decide in seconds whether to dive in — and writers reach people who are short on time.',
  },
  {
    id: 'recommend',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      </svg>
    ),
    label: 'Smart Recommendations',
    title: 'A feed that learns from you',
    body: "The recommendation engine analyses your reading behaviour to surface articles you'll actually want to read — not just the most-viewed ones.",
  },
  {
    id: 'editor',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    label: 'Rich Markdown Editor',
    title: 'Write in Markdown, beautifully',
    body: "A distraction-free editor with live preview, syntax highlighting, image embeds, and draft auto-save — everything a serious writer actually needs.",
  },
]

/* ─────────────────────────────────────────────────────────────────────────
   PLATFORM PILLARS DATA
───────────────────────────────────────────────────────────────────────── */
const PILLARS = [
  {
    icon: '✦',
    title: 'Write anything',
    body: "Rich Markdown editor, image uploads, drafts — everything a serious writer needs, nothing they don't.",
  },
  {
    icon: '◈',
    title: 'Read the feed',
    body: 'A curated reading experience. Browse posts, expand inline, and discover writing that earns your attention.',
  },
  {
    icon: '◎',
    title: 'Own your content',
    body: 'Edit, update, or delete your posts at any time. Your words are yours — always.',
  },
]

/* ─────────────────────────────────────────────────────────────────────────
   GATED STORY PREVIEWS
───────────────────────────────────────────────────────────────────────── */
const STORY_PREVIEWS = [
  {
    category: 'Design',
    title: 'The quiet revolution of Swiss grid systems in digital interfaces',
    excerpt: 'How a 70-year-old typographic tradition quietly became the backbone of every modern UI.',
  },
  {
    category: 'AI',
    title: "Prompting as a craft: what good writers know that engineers don't",
    excerpt: 'Writing effective prompts has more in common with editorial journalism than software engineering.',
  },
  {
    category: 'Technology',
    title: 'Building for the long term: architecture decisions that age well',
    excerpt: 'The engineering choices that compound in value — and the ones that become liabilities the moment you ship.',
  },
]

/* ─────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  if (loading || user) return null

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)' }}>

      {/* ─────────────────────── NAV ─────────────────────── */}
      {/* No bottom border, minimal, right-aligned nav */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(247,247,247,0.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        /* No border-bottom — clean look */
      }}>
        <div className="container-max" style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '32px',
        }}>
          {/* Logo */}
          <BlogramLogo size={19} />

          {/* Right side: Home + Sign In only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link
              href="/"
              className="nav-link"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              Home
            </Link>

            <Link
              id="landing-signin"
              href="/login"
              className="btn btn-solid"
              style={{ padding: '9px 22px', fontSize: '13px', borderRadius: '8px' }}
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Thin separator line — very subtle, not heavy */}
        <div style={{ height: '1px', background: 'var(--border)', opacity: 0.6 }} />
      </header>

      <main>

        {/* ─────────────────────── HERO ─────────────────────── */}
        <section style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container-max" style={{
            paddingTop: 'clamp(88px, 12vw, 144px)',
            paddingBottom: 'clamp(88px, 12vw, 144px)',
          }}>
            <div style={{ maxWidth: '840px' }}>

              {/* Kicker */}
              <p className="label-xs animate-fade-up" style={{ marginBottom: '28px' }}>
                A Platform for Serious Writing
              </p>

              {/* Hero headline */}
              <h1
                className="animate-fade-up delay-1"
                style={{
                  fontSize: 'clamp(48px, 7.5vw, 90px)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.04em',
                  color: 'var(--text-primary)',
                  marginBottom: '28px',
                }}
              >
                Thoughts, stories,
                <br />
                <span style={{ color: 'var(--text-secondary)' }}>and ideas for</span>
                <br />curious minds.
              </h1>

              {/* Sub-copy */}
              <p
                className="animate-fade-up delay-2"
                style={{
                  fontSize: '18px',
                  lineHeight: 1.78,
                  color: 'var(--text-secondary)',
                  maxWidth: '520px',
                  marginBottom: '48px',
                }}
              >
                Blogram is a writing platform powered by AI. Publish in-depth articles,
                discover curated reads, and let intelligent tools work quietly in the background.
              </p>

              {/* CTAs */}
              <div
                className="animate-fade-up delay-3"
                style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}
              >
                <Link id="landing-get-started" href="/register" className="btn btn-solid">
                  Start Writing Free <ArrowRight />
                </Link>
                <Link id="landing-signin-hero" href="/login" className="btn btn-outline">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────── STORIES (GATED) ─────────────────────── */}
        {/*
            Section shows a preview of story cards.
            The entire clickable overlay redirects unauthenticated users to /login.
            Cards are intentionally blurred/locked — nothing real is revealed.
        */}
        <section style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container-max section-pad">

            {/* Section header */}
            <div style={{ marginBottom: '48px' }}>
              <p className="label-xs" style={{ marginBottom: '12px' }}>Reading</p>
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
              }}>
                <h2 style={{
                  fontSize: 'clamp(26px, 3.5vw, 38px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}>
                  Stories worth your time
                </h2>
                <Link
                  href="/login"
                  className="btn btn-outline"
                  style={{ padding: '9px 20px', flexShrink: 0 }}
                >
                  Sign in to read <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Gated preview cards */}
            <div style={{ position: 'relative' }}>
              {/* Cards — intentionally desaturated/blurred to signal gating */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                gap: '28px',
              }}>
                {STORY_PREVIEWS.map((story, i) => (
                  <div
                    key={story.title}
                    style={{
                      background: 'var(--bg-white)',
                      borderRadius: '14px',
                      padding: '28px',
                      border: '1px solid var(--border)',
                      opacity: i === 0 ? 0.92 : i === 1 ? 0.6 : 0.33,
                      filter: i === 0 ? 'none' : i === 1 ? 'blur(1.5px)' : 'blur(3px)',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      display: 'block',
                      marginBottom: '14px',
                    }}>
                      {story.category}
                    </span>
                    <h3 style={{
                      fontSize: '17px',
                      fontWeight: 700,
                      lineHeight: 1.3,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      marginBottom: '12px',
                    }}>
                      {story.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      lineHeight: 1.7,
                      color: 'var(--text-secondary)',
                    }}>
                      {story.excerpt}
                    </p>
                    {/* Fake metadata */}
                    <div style={{
                      marginTop: '24px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border)',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: 'var(--bg-muted)', flexShrink: 0,
                      }} />
                      <div style={{
                        height: '10px', borderRadius: '4px',
                        background: 'var(--bg-muted)', width: '100px',
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Full-overlay CTA — transparent clickable layer on top */}
              <Link
                href="/login"
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  textDecoration: 'none',
                  borderRadius: '14px',
                  /* subtle frosted-glass center badge only */
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(247,247,247,0.9)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '28px 40px',
                  textAlign: 'center',
                  boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12)',
                }}>
                  <span style={{ color: 'var(--text-secondary)', display: 'flex' }}>
                    <LockIcon />
                  </span>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}>
                    Sign in to read
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    maxWidth: '220px',
                  }}>
                    Create a free account or sign in to unlock every article on Blogram.
                  </p>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '4px',
                    padding: '10px 22px',
                    background: 'var(--text-primary)',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}>
                    Sign In <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ─────────────────────── AI FEATURES ─────────────────────── */}
        <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-white)' }}>
          <div className="container-max section-pad">

            {/* Section header */}
            <div style={{ maxWidth: '600px', marginBottom: 'clamp(48px, 6vw, 80px)' }}>
              <p className="label-xs" style={{ marginBottom: '12px' }}>Intelligence</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.08,
                marginBottom: '16px',
              }}>
                AI working quietly in the background
              </h2>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.75,
                color: 'var(--text-secondary)',
              }}>
                Blogram integrates machine learning at every layer — from the moment you publish
                to the moment a reader discovers your work.
              </p>
            </div>

            {/* Feature rows — alternating text + visual panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {AI_FEATURES.map((feat, idx) => (
                <div
                  key={feat.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0',
                    background: 'var(--bg-page)',
                    borderRadius: idx === 0 ? '14px 14px 0 0' : idx === AI_FEATURES.length - 1 ? '0 0 14px 14px' : '0',
                    overflow: 'hidden',
                  }}
                  className="ai-feat-row"
                >
                  {/* Text side */}
                  <div style={{
                    padding: 'clamp(32px, 4vw, 52px)',
                    borderRight: '1px solid var(--border)',
                    order: idx % 2 === 0 ? 1 : 2,
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'rgba(255,106,0,0.08)',
                      color: 'var(--accent)',
                      marginBottom: '20px',
                    }}>
                      {feat.icon}
                    </div>
                    <p style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      marginBottom: '10px',
                    }}>
                      {feat.label}
                    </p>
                    <h3 style={{
                      fontSize: 'clamp(18px, 2vw, 22px)',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.2,
                      color: 'var(--text-primary)',
                      marginBottom: '12px',
                    }}>
                      {feat.title}
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      lineHeight: 1.75,
                      color: 'var(--text-secondary)',
                    }}>
                      {feat.body}
                    </p>
                  </div>

                  {/* Decorative accent panel */}
                  <div style={{
                    padding: 'clamp(32px, 4vw, 52px)',
                    background: 'var(--bg-white)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    order: idx % 2 === 0 ? 2 : 1,
                    minHeight: '180px',
                  }}>
                    {/* Abstract visual — index-number watermark */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '1.5px solid var(--border)',
                      position: 'relative',
                    }}>
                      <span style={{
                        fontSize: '28px',
                        fontWeight: 900,
                        letterSpacing: '-0.05em',
                        color: 'var(--text-faint)',
                        lineHeight: 1,
                      }}>
                        0{idx + 1}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────── BUILT FOR SERIOUS WRITING ─────────────────────── */}
        <section style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container-max section-pad">

            {/* Section header */}
            <div style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
              <p className="label-xs" style={{ marginBottom: '12px' }}>The Platform</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 38px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}>
                Built for serious writing
              </h2>
            </div>

            {/* Pillars — separated by 1px borders */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '1px',
              background: 'var(--border)',
              borderRadius: '14px',
              overflow: 'hidden',
            }}>
              {PILLARS.map(({ icon, title, body }) => (
                <div
                  key={title}
                  style={{
                    background: 'var(--bg-white)',
                    padding: 'clamp(28px, 4vw, 52px)',
                  }}
                >
                  <span style={{
                    fontSize: '22px',
                    color: 'var(--accent)',
                    display: 'block',
                    marginBottom: '18px',
                  }}>
                    {icon}
                  </span>
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    marginBottom: '10px',
                  }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.78, color: 'var(--text-secondary)' }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────── FINAL CTA ─────────────────────── */}
        <section style={{ background: 'var(--text-primary)' }}>
          <div className="container-max section-pad" style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '24px',
            }}>
              Ready to write?
            </p>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#fff',
              marginBottom: '16px',
            }}>
              Start writing today.
            </h2>
            <p style={{
              fontSize: '17px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              maxWidth: '420px',
              margin: '0 auto 40px',
            }}>
              Create a free account and publish your first article in minutes.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 28px',
                  background: '#fff',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease, transform 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#f0f0f0'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Create Free Account <ArrowRight />
              </Link>

              <Link
                id="landing-signin-alt"
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '13px 28px',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease, color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─────────────────────── FOOTER ─────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-page)' }}>
        <div className="container-max" style={{ padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 60px)' }}>

          {/* Top row */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '40px',
            flexWrap: 'wrap',
            marginBottom: '48px',
          }}>
            {/* Brand */}
            <div style={{ maxWidth: '280px' }}>
              <div style={{ marginBottom: '12px' }}>
                <BlogramLogo size={18} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                A modern, AI-powered publishing platform for curious thinkers and serious writers.
              </p>
            </div>

            {/* Link columns */}
            <div style={{ display: 'flex', gap: 'clamp(32px, 6vw, 80px)', flexWrap: 'wrap' }}>
              {[
                {
                  heading: 'Platform',
                  links: [
                    { label: 'Articles', href: '/dashboard' },
                    { label: 'Create Post', href: '/editor' },
                    { label: 'Profile', href: '/profile' },
                  ],
                },
                {
                  heading: 'Company',
                  links: [
                    { label: 'About', href: '/dashboard' },
                    { label: 'Contact', href: '/dashboard' },
                    { label: 'Privacy', href: '/dashboard' },
                  ],
                },
              ].map(col => (
                <div key={col.heading}>
                  <p style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '16px',
                  }}>
                    {col.heading}
                  </p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {col.links.map(link => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                {
                  label: 'Twitter',
                  href: '#',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  ),
                },
                {
                  label: 'GitHub',
                  href: '#',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  ),
                },
                {
                  label: 'RSS',
                  href: '#',
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 11a9 9 0 0 1 9 9" />
                      <path d="M4 4a16 16 0 0 1 16 16" />
                      <circle cx="5" cy="19" r="1" fill="currentColor" />
                    </svg>
                  ),
                },
              ].map(({ label, href, svg }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                    transition: 'color 0.2s ease, border-color 0.2s ease, background 0.2s ease',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                    e.currentTarget.style.borderColor = 'var(--text-primary)'
                    e.currentTarget.style.background = 'var(--bg-white)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} Blogram. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Terms', 'Privacy', 'Cookies'].map(item => (
                <Link
                  key={item}
                  href="/dashboard"
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────── RESPONSIVE HELPERS ─────────────────────── */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
        }
        @media (max-width: 720px) {
          .ai-feat-row {
            grid-template-columns: 1fr !important;
          }
          .ai-feat-row > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
