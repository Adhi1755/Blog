'use client'

import Link from 'next/link'
import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAuth } from './context/AuthContext'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

/* ─── Tokens ───────────────────────────────────────────────── */
const C = {
  bg:        '#F7F7F7',
  bg2:       '#FFFFFF',
  bg3:       '#F0F0EE',
  surface:   '#FFFFFF',
  text:      '#111111',
  muted:     '#6B6B6B',
  accent:    '#FF6A00',
  accentDim: 'rgba(255,106,0,0.10)',
  accentGlow:'rgba(255,106,0,0.06)',
  border:    '#DCDCDC',
  borderDark:'#111111',
  white:     '#FFFFFF',
}

/* ─── Data ────────────────────────────────────────────────── */
const MOCK_HEADLINE = 'The quiet revolution of Swiss grid systems in digital design'

const STORIES = [
  { cat: 'Design',     title: 'The quiet revolution of Swiss grid systems in digital interfaces', excerpt: 'How a 70-year-old typographic tradition quietly became the backbone of every modern UI.' },
  { cat: 'AI',         title: "Prompting as a craft: what good writers know that engineers don't", excerpt: 'Writing effective prompts has more in common with editorial journalism than software engineering.' },
  { cat: 'Technology', title: 'Building for the long term: architecture decisions that age well',  excerpt: 'The engineering choices that compound in value — and the ones that become liabilities.' },
]

const AI_FEATURES = [
  { num: '01', label: 'ML Classification',     title: 'Auto-categorize every post',     body: 'A model trained on thousands of articles automatically classifies each post — no manual tagging needed.' },
  { num: '02', label: 'AI Summarization',       title: 'TL;DR powered by AI',            body: 'Every article gets an AI-generated summary so readers decide in seconds whether to dive in.' },
  { num: '03', label: 'Smart Recommendations', title: 'A feed that learns from you',     body: "The recommendation engine surfaces articles you'll actually want to read — not just the most-viewed." },
  { num: '04', label: 'Rich Markdown Editor',   title: 'Write in Markdown, beautifully', body: 'Distraction-free editor with live preview, syntax highlighting, image embeds, and draft auto-save.' },
]

const PILLARS = [
  { n: '01', title: 'Write anything',   body: "Rich Markdown editor, image uploads, drafts — everything a serious writer needs, nothing they don't." },
  { n: '02', title: 'Read the feed',    body: 'A curated reading experience. Browse posts, expand inline, and discover writing that earns your attention.' },
  { n: '03', title: 'Own your content', body: 'Edit, update, or delete your posts at any time. Your words are yours — always.' },
]

const STATS = [
  { val: '12k+', label: 'Writers' },
  { val: '48k+', label: 'Articles' },
  { val: '200k', label: 'Monthly readers' },
  { val: '4.9★', label: 'Avg rating' },
]

const TICKER = ['Design', 'Engineering', 'Philosophy', 'Culture', 'Science', 'Fiction', 'Technology', 'AI', 'Business', 'Writing', 'Architecture', 'Psychology']

/* ─── Sub-components ──────────────────────────────────────── */
function Arrow({ sz = 13 }: { sz?: number }) {
  return (
    <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function Logo() {
  return (
    <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline' }}>
      <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: C.accent }}>BLOG</span>
      <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.05em', color: C.text }}>RAM</span>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const pageRef    = useRef<HTMLDivElement>(null)
  const navRef     = useRef<HTMLElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)
  const typedRef   = useRef<HTMLSpanElement>(null)
  const storiesRef = useRef<HTMLDivElement>(null)
  const featRef    = useRef<HTMLDivElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const ctaRef     = useRef<HTMLElement>(null)
  const ctaHeadRef = useRef<HTMLHeadingElement>(null)
  const tickerRef  = useRef<HTMLDivElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)

  const noMotion = useCallback(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  /* Typewriter */
  useEffect(() => {
    if (noMotion() || !typedRef.current) return
    let i = 0; const el = typedRef.current; el.textContent = ''
    const id = setInterval(() => { el.textContent = MOCK_HEADLINE.slice(0, i); i++; if (i > MOCK_HEADLINE.length) clearInterval(id) }, 36)
    return () => clearInterval(id)
  }, [noMotion])

  useGSAP(() => {
    if (noMotion()) return
    const ctx = gsap.context(() => {

      /* NAV */
      ScrollTrigger.create({
        start: 60,
        onEnter:     () => gsap.to(navRef.current, { backgroundColor: 'rgba(247,247,247,0.97)', boxShadow: `0 1px 0 ${C.border}`, duration: 0.3 }),
        onLeaveBack: () => gsap.to(navRef.current, { backgroundColor: 'transparent', boxShadow: 'none', duration: 0.3 }),
      })

      /* HERO */
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('.gsap-h'), { y: 28, opacity: 0, duration: 0.75, ease: 'power3.out', stagger: 0.08 })
        const card = heroRef.current.querySelector('.gsap-hcard')
        if (card) gsap.from(card, { scale: 0.94, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 })
        gsap.from(heroRef.current.querySelectorAll('.gsap-chip'), { y: -12, opacity: 0, duration: 0.6, stagger: 0.14, delay: 0.65, ease: 'back.out(1.5)' })
      }

      /* STATS */
      if (statsRef.current) {
        gsap.from(statsRef.current.querySelectorAll('.gsap-stat'), {
          y: 22, opacity: 0, duration: 0.5, stagger: 0.08,
          scrollTrigger: { trigger: statsRef.current, start: 'top 88%' },
        })
      }

      /* STORIES */
      if (storiesRef.current) {
        gsap.from(storiesRef.current.querySelectorAll('.gsap-sc'), {
          y: 32, opacity: 0, duration: 0.55, stagger: 0.11, ease: 'power2.out',
          scrollTrigger: { trigger: storiesRef.current, start: 'top 84%' },
        })
      }

      /* FEATURES */
      if (featRef.current) {
        gsap.from(featRef.current.querySelectorAll('.gsap-fc'), {
          y: 28, opacity: 0, duration: 0.5, stagger: 0.09, ease: 'power2.out',
          scrollTrigger: { trigger: featRef.current, start: 'top 84%' },
        })
      }

      /* PILLARS */
      if (pillarsRef.current) {
        gsap.from(pillarsRef.current.querySelectorAll('.gsap-pc'), {
          y: 26, opacity: 0, duration: 0.48, stagger: 0.09,
          scrollTrigger: { trigger: pillarsRef.current, start: 'top 86%' },
        })
      }

      /* CTA headline split */
      if (ctaHeadRef.current) {
        const words = (ctaHeadRef.current.textContent || '').split(' ')
        ctaHeadRef.current.innerHTML = words
          .map(w => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="gsap-w" style="display:inline-block">${w}</span></span>`)
          .join(' ')
        gsap.from(ctaHeadRef.current.querySelectorAll('.gsap-w'), {
          y: '105%', duration: 0.7, stagger: 0.07, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 82%' },
        })
      }

      /* TICKER */
      if (tickerRef.current) {
        gsap.to(tickerRef.current, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 })
      }

    }, pageRef)
    return () => ctx.revert()
  }, { scope: pageRef })

  const onPillarEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (noMotion()) return
    gsap.to((e.currentTarget as HTMLElement).querySelector('.gsap-pb'), { scaleX: 1, duration: 0.32, ease: 'power2.out' })
    gsap.to(e.currentTarget, { y: -4, duration: 0.22, ease: 'power2.out' })
  }, [noMotion])
  const onPillarLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (noMotion()) return
    gsap.to((e.currentTarget as HTMLElement).querySelector('.gsap-pb'), { scaleX: 0, duration: 0.26, ease: 'power2.in' })
    gsap.to(e.currentTarget, { y: 0, duration: 0.22 })
  }, [noMotion])

  const onCardEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (noMotion()) return
    gsap.to(e.currentTarget, { y: -4, duration: 0.22, ease: 'power2.out' })
  }, [noMotion])
  const onCardLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (noMotion()) return
    gsap.to(e.currentTarget, { y: 0, duration: 0.22 })
  }, [noMotion])

  if (loading || user) return null

  const tickerStr = [...TICKER, ...TICKER].join('  ·  ')

  const btnPrimary: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 22px', borderRadius: 7,
    background: C.text, color: C.white,
    border: `1.5px solid ${C.text}`,
    fontSize: 13, fontWeight: 700, textDecoration: 'none',
    transition: 'background .18s, transform .15s',
    cursor: 'pointer',
  }
  const btnOutline: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 22px', borderRadius: 7,
    background: 'transparent', color: C.text,
    border: `1.5px solid ${C.borderDark}`,
    fontSize: 13, fontWeight: 600, textDecoration: 'none',
    transition: 'background .18s, color .18s, transform .15s',
    cursor: 'pointer',
  }

  return (
    <div ref={pageRef} style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <header ref={navRef} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        borderBottom: `1px solid ${C.border}`,
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        willChange: 'background-color',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,60px)', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Link href="/"
              style={{ fontSize: 13, fontWeight: 500, color: C.muted, textDecoration: 'none', padding: '6px 12px', borderRadius: 6, transition: 'color .2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              Home
            </Link>
            <Link href="/login"
              style={btnPrimary}
              onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.text; e.currentTarget.style.transform = 'none' }}>
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* ══ § 1 — HERO ══ */}
        <section style={{ paddingTop: 'clamp(108px,13vw,156px)', paddingBottom: 'clamp(64px,8vw,110px)', borderBottom: `1px solid ${C.border}`, position: 'relative' }}>
          {/* Grid lines */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: '72px 72px', opacity: 0.5, pointerEvents: 'none' }} />

          <div ref={heroRef} className="hero-two-col" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,60px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(40px,5vw,88px)', alignItems: 'center', position: 'relative' }}>

            {/* Left */}
            <div>
              <div className="gsap-h" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px 4px 5px', borderRadius: 100, border: `1px solid ${C.border}`, background: C.bg2, marginBottom: 28 }}>
                <span style={{ background: C.accent, borderRadius: 100, padding: '2px 9px', fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.white }}>New</span>
                <span style={{ fontSize: 12, color: C.accent, fontWeight: 600 }}>AI-powered writing platform</span>
              </div>

              <h1 className="gsap-h" style={{ fontSize: 'clamp(36px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.035em', color: C.text, marginBottom: 20 }}>
                Thoughts,{' '}
                <span style={{ color: C.muted }}>stories &amp; ideas</span>{' '}
                for curious minds.
              </h1>

              <p className="gsap-h" style={{ fontSize: 15, lineHeight: 1.78, color: C.muted, maxWidth: 440, marginBottom: 34 }}>
                Blogram is a writing platform powered by AI. Publish in-depth articles, discover curated reads, and let intelligent tools work quietly in the background.
              </p>

              <div className="gsap-h" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/register"
                  style={btnPrimary}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.text; e.currentTarget.style.transform = 'none' }}>
                  Start Writing Free <Arrow />
                </Link>
                <Link href="/login"
                  style={btnOutline}
                  onMouseEnter={e => { e.currentTarget.style.background = C.text; (e.currentTarget as HTMLAnchorElement).style.color = C.white; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = C.text; e.currentTarget.style.transform = 'none' }}>
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right — Hero card */}
            <div style={{ position: 'relative' }}>
              <div className="gsap-hcard" style={{
                background: C.white, border: `1px solid ${C.border}`, borderRadius: 16,
                padding: 'clamp(22px,3vw,36px)',
                boxShadow: '0 6px 40px -6px rgba(0,0,0,0.10)',
                willChange: 'transform, opacity', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.accent}, transparent)` }} />
                <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.accent, marginBottom: 12 }}>Design</p>
                <h2 style={{ fontSize: 'clamp(13px,1.4vw,16px)', fontWeight: 700, lineHeight: 1.5, color: C.text, marginBottom: 18, minHeight: '3.6em' }}>
                  <span ref={typedRef} />
                  <span style={{ display: 'inline-block', width: 2, height: '1em', background: C.accent, marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink .85s step-end infinite' }} />
                </h2>
                {[100, 86, 74, 92, 58].map((w, i) => (
                  <div key={i} style={{ height: 6, borderRadius: 3, marginBottom: 7, background: i === 4 ? '#f2f2f2' : '#e8e8e8', width: `${w}%` }} />
                ))}
                <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.accentDim, border: `1px solid rgba(255,106,0,0.18)`, flexShrink: 0 }} />
                  <div>
                    <div style={{ height: 7, width: 76, borderRadius: 3, background: '#e8e8e8', marginBottom: 5 }} />
                    <div style={{ height: 5, width: 50, borderRadius: 3, background: '#f0f0f0' }} />
                  </div>
                  <div style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 100, background: C.accentDim, border: `1px solid rgba(255,106,0,0.16)` }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.accent }}>4 min</span>
                  </div>
                </div>
              </div>

              {/* Chips */}
              <div className="gsap-chip" style={{ position: 'absolute', top: -14, right: -14, background: C.white, borderRadius: 10, padding: '8px 14px', border: `1px solid ${C.border}`, boxShadow: '0 4px 18px rgba(0,0,0,0.08)', fontSize: 12, fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: 7, willChange: 'transform, opacity' }}>
                <span style={{ color: C.accent }}>👁</span> 1.2k readers
              </div>
              <div className="gsap-chip" style={{ position: 'absolute', bottom: -14, left: -14, background: C.white, borderRadius: 10, padding: '8px 14px', border: `1px solid ${C.border}`, boxShadow: '0 4px 18px rgba(0,0,0,0.08)', fontSize: 12, fontWeight: 600, color: C.text, display: 'flex', alignItems: 'center', gap: 7, willChange: 'transform, opacity' }}>
                <span style={{ color: C.accent }}>✦</span> Live now
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS BAND ══ */}
        <div ref={statsRef} style={{ borderBottom: `1px solid ${C.border}`, background: C.white }}>
          <div className="stats-grid" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,4vw,60px)', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="gsap-stat" style={{ paddingTop: 'clamp(22px,3vw,36px)', paddingBottom: 'clamp(22px,3vw,36px)', borderRight: i < 3 ? `1px solid ${C.border}` : 'none', paddingLeft: i === 0 ? 0 : 'clamp(16px,2.5vw,36px)', paddingRight: i === 3 ? 0 : 'clamp(16px,2.5vw,36px)' }}>
                <p style={{ fontSize: 'clamp(20px,2.6vw,30px)', fontWeight: 800, letterSpacing: '-0.04em', color: C.text, marginBottom: 4 }}>{s.val}</p>
                <p style={{ fontSize: 11, fontWeight: 500, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ § 2 — STORIES ══ */}
        <section style={{ borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(52px,7vw,88px) clamp(20px,4vw,60px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>Reading</p>
                <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: C.text }}>Stories worth your time</h2>
              </div>
              <Link href="/login"
                style={btnOutline}
                onMouseEnter={e => { e.currentTarget.style.background = C.text; (e.currentTarget as HTMLAnchorElement).style.color = C.white }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = C.text }}>
                Sign in to read <Arrow />
              </Link>
            </div>

            <div ref={storiesRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap: 1, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', background: C.border }}>
              {STORIES.map((s, i) => (
                <div key={s.title} className="gsap-sc" onMouseEnter={onCardEnter} onMouseLeave={onCardLeave}
                  style={{ background: C.white, padding: 'clamp(20px,2.5vw,30px)', position: 'relative', overflow: 'hidden', opacity: i === 0 ? 1 : i === 1 ? 0.5 : 0.25, filter: i > 0 ? `blur(${i * 1.5}px)` : 'none', willChange: 'transform', cursor: i === 0 ? 'default' : 'not-allowed' }}>
                  {i === 0 && <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: C.accent }} />}
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, display: 'block', marginBottom: 11 }}>{s.cat}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.38, letterSpacing: '-0.02em', color: C.text, marginBottom: 9 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.72, color: C.muted }}>{s.excerpt}</p>
                  <div style={{ marginTop: 20, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#eee', flexShrink: 0 }} />
                    <div style={{ height: 7, width: 72, borderRadius: 3, background: '#eee' }} />
                    <div style={{ marginLeft: 'auto', height: 6, width: 32, borderRadius: 3, background: '#f0f0f0' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Lock overlay */}
            <div style={{ marginTop: -180, display: 'flex', justifyContent: 'center', paddingBottom: 32, position: 'relative', zIndex: 2, pointerEvents: 'none' }}>
              <Link href="/login" style={{ pointerEvents: 'all', textDecoration: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: 'rgba(247,247,247,0.92)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid ${C.border}`, borderRadius: 14, padding: '26px 40px', boxShadow: '0 6px 32px rgba(0,0,0,0.08)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: C.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: '-0.02em' }}>Sign in to read all stories</p>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, maxWidth: 200, textAlign: 'center' }}>Create a free account to unlock every article.</p>
                  <span style={{ ...btnPrimary, marginTop: 4 }}>Sign In <Arrow /></span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ══ § 3 — AI FEATURES ══ */}
        <section style={{ borderBottom: `1px solid ${C.border}`, background: C.white }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(52px,7vw,88px) clamp(20px,4vw,60px)' }}>
            <div style={{ maxWidth: 500, marginBottom: 'clamp(36px,5vw,56px)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: 11 }}>Intelligence</p>
              <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.12, color: C.text, marginBottom: 13 }}>
                AI working quietly<br />in the background
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.78, color: C.muted }}>
                Blogram integrates machine learning at every layer — from the moment you publish to the moment a reader discovers your work.
              </p>
            </div>

            <div ref={featRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))', gap: 1, background: C.border, borderRadius: 14, overflow: 'hidden' }}>
              {AI_FEATURES.map(f => (
                <div key={f.num} className="gsap-fc"
                  onMouseEnter={e => { gsap.to(e.currentTarget, { background: C.bg3, duration: 0.22 }); gsap.to(e.currentTarget, { y: -3, duration: 0.2 }) }}
                  onMouseLeave={e => { gsap.to(e.currentTarget, { background: C.white, duration: 0.22 }); gsap.to(e.currentTarget, { y: 0, duration: 0.2 }) }}
                  style={{ background: C.white, padding: 'clamp(20px,2.5vw,30px)', position: 'relative', willChange: 'transform', cursor: 'default' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: C.accentDim, border: `1px solid rgba(255,106,0,0.14)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 15, color: C.accent }}>✦</span>
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#e8e8e8', letterSpacing: '-0.04em', lineHeight: 1 }}>{f.num}</span>
                  </div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.accent, marginBottom: 6 }}>{f.label}</p>
                  <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.3, color: C.text, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.75, color: C.muted }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ § 4 — PILLARS ══ */}
        <section style={{ borderBottom: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(52px,7vw,88px) clamp(20px,4vw,60px)' }}>
            <div style={{ marginBottom: 'clamp(32px,4vw,52px)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: 11 }}>The Platform</p>
              <h2 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: C.text }}>Built for serious writing</h2>
            </div>

            <div ref={pillarsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,250px),1fr))', gap: 1, background: C.border, borderRadius: 14, overflow: 'hidden' }}>
              {PILLARS.map(({ n, title, body }) => (
                <div key={n} className="gsap-pc" onMouseEnter={onPillarEnter} onMouseLeave={onPillarLeave}
                  style={{ background: C.white, padding: 'clamp(24px,3.5vw,44px)', position: 'relative', willChange: 'transform', cursor: 'default', overflow: 'hidden' }}>
                  <div className="gsap-pb" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: C.accent, transform: 'scaleX(0)', transformOrigin: 'left' }} />
                  <span style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#eaeaea', display: 'block', marginBottom: 16, lineHeight: 1 }}>{n}</span>
                  <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 9, color: C.text }}>{title}</h3>
                  <p style={{ fontSize: 13, lineHeight: 1.78, color: C.muted }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ § 5 — CTA BAND ══ */}
        <section ref={ctaRef} style={{ background: C.text, overflow: 'hidden', position: 'relative' }}>
          {/* Ticker */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 0', overflow: 'hidden' }}>
            <div ref={tickerRef} style={{ display: 'inline-flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', paddingRight: 48 }}>
                {tickerStr} &nbsp;&nbsp; {tickerStr}
              </span>
            </div>
          </div>

          <div style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(64px,8vw,110px) clamp(20px,4vw,60px)', textAlign: 'center' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: C.accent, marginBottom: 22 }}>Ready to write?</p>
            <h2 ref={ctaHeadRef} style={{ fontSize: 'clamp(32px,5.5vw,64px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.04, color: C.white, marginBottom: 18 }}>
              Start writing today.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 360, margin: '0 auto 40px' }}>
              Create a free account and publish your first article in minutes.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 26px', borderRadius: 7,
                background: C.white, color: C.text,
                border: `1.5px solid ${C.white}`,
                fontWeight: 700, fontSize: 13, textDecoration: 'none',
                transition: 'filter .18s, transform .15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.93)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none' }}>
                Create Free Account <Arrow />
              </Link>
              <Link href="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 26px', borderRadius: 7,
                background: 'transparent', color: 'rgba(255,255,255,0.65)',
                border: '1.5px solid rgba(255,255,255,0.22)',
                fontWeight: 600, fontSize: 13, textDecoration: 'none',
                transition: 'border-color .2s, color .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)'; e.currentTarget.style.color = C.white }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}>
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(40px,5vw,60px) clamp(20px,4vw,60px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', marginBottom: 44 }}>
            <div style={{ maxWidth: 230 }}>
              <div style={{ marginBottom: 11 }}><Logo /></div>
              <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.75 }}>An AI-powered publishing platform for curious thinkers and serious writers.</p>
            </div>
            <div style={{ display: 'flex', gap: 'clamp(24px,5vw,64px)', flexWrap: 'wrap' }}>
              {[
                { heading: 'Platform', links: [{ label: 'Articles', href: '/dashboard' }, { label: 'Create Post', href: '/editor' }, { label: 'Profile', href: '/profile' }] },
                { heading: 'Company',  links: [{ label: 'About', href: '/dashboard' }, { label: 'Contact', href: '/dashboard' }, { label: 'Privacy', href: '/dashboard' }] },
              ].map(col => (
                <div key={col.heading}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.muted, marginBottom: 14 }}>{col.heading}</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.links.map(l => (
                      <li key={l.label}>
                        <Link href={l.href} style={{ fontSize: 13, color: C.muted, textDecoration: 'none', transition: 'color .2s' }}
                          onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                          onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              {[
                { label: 'Twitter', path: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
                { label: 'GitHub',  path: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' },
                { label: 'RSS',     path: 'M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M5 19a1 1 0 1 1-2 0 1 1 0 0 1 2 0z' },
              ].map(s => (
                <a key={s.label} href="#" aria-label={s.label}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 7, border: `1px solid ${C.border}`, color: C.muted, textDecoration: 'none', transition: 'color .2s, border-color .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.accent; e.currentTarget.style.borderColor = 'rgba(255,106,0,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: 12, color: C.muted }}>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Blogram. All rights reserved.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Terms', 'Privacy', 'Cookies'].map(t => (
                <Link key={t} href="/dashboard" style={{ fontSize: 12, color: C.muted, textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                  {t}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }
        @media (max-width: 760px) {
          .hero-two-col { grid-template-columns: 1fr !important; }
          .hero-two-col > div:last-child { display: none !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  )
}