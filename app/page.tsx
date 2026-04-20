'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './context/AuthContext'

/* ─────────────────────────────────────────────────────────────────────────
   STATIC DATA  (replace with real API calls as needed)
───────────────────────────────────────────────────────────────────────── */
const FEATURED_POSTS = [
  {
    id: 1,
    category: 'Design',
    title: 'The quiet revolution of Swiss grid systems in digital design',
    excerpt:
      'How a 70-year-old typographic tradition quietly became the backbone of every modern interface — and why it still matters more than ever.',
    author: 'Mia Linden',
    date: 'Apr 18, 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&q=80&auto=format&fit=crop',
  },
  {
    id: 2,
    category: 'Technology',
    title: 'Building for the long term: architecture decisions that age well',
    excerpt:
      'A candid look at the engineering choices that compound in value over time — and the ones that become liabilities the moment you ship.',
    author: 'James Park',
    date: 'Apr 15, 2026',
    readTime: '8 min read',
    image:
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&q=80&auto=format&fit=crop',
  },
]

const GRID_POSTS = [
  {
    id: 3,
    category: 'AI',
    title: "Prompting as a craft: what good writers know that engineers don't",
    excerpt:
      'Writing good prompts has more in common with editorial journalism than software engineering.',
    author: 'Sara Okafor',
    date: 'Apr 12, 2026',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 4,
    category: 'Business',
    title: 'The economics of attention in a distracted world',
    excerpt:
      "Why the scariest thing about the attention economy isn't what it takes — it's what it gives back.",
    author: 'Leo Marín',
    date: 'Apr 10, 2026',
    readTime: '7 min read',
    image:
      'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 5,
    category: 'Design',
    title: "White space is not empty space — it's a design decision",
    excerpt:
      "Every pixel left blank is a choice. Here's how intentional whitespace transforms layouts from good to great.",
    author: 'Ami Chen',
    date: 'Apr 8, 2026',
    readTime: '4 min read',
    image:
      'https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 6,
    category: 'Technology',
    title: 'On the hidden cost of moving fast',
    excerpt:
      "Technical debt isn't just code. It's decisions, culture, and the quiet erosion of your team's ability to think clearly.",
    author: 'James Park',
    date: 'Apr 5, 2026',
    readTime: '9 min read',
    image:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 7,
    category: 'AI',
    title: 'The model is not the product — and other hard lessons',
    excerpt:
      "After a year of building AI-native applications, here is what we wish we'd understood from day one.",
    author: 'Sara Okafor',
    date: 'Apr 1, 2026',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 8,
    category: 'Business',
    title: "Founder mode is a myth — but the energy behind it isn't",
    excerpt:
      "The viral essay had the right instinct but the wrong frame. Here's what high-agency leadership actually looks like in practice.",
    author: 'Leo Marín',
    date: 'Mar 28, 2026',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80&auto=format&fit=crop',
  },
]

const CATEGORIES = ['All', 'Tech', 'Business', 'AI', 'Design']

const NAV_LINKS = [
  { label: 'Home',       href: '/'           },
  { label: 'Articles',   href: '/dashboard'  },
  { label: 'Categories', href: '/dashboard'  },
  { label: 'About',      href: '/dashboard'  },
]

/* ─────────────────────────────────────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg
      width="17" height="17" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

interface PostCardProps {
  post: (typeof GRID_POSTS)[number]
  priority?: boolean
}

function PostCard({ post, priority = false }: PostCardProps) {
  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-img" style={{ height: '220px', flexShrink: 0 }}>
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={500}
          priority={priority}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ padding: '28px 28px 32px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span className="category-chip" style={{ marginBottom: '14px' }}>
          {post.category}
        </span>

        <h3 style={{
          fontSize: '18px',
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'var(--text-primary)',
          marginBottom: '12px',
          letterSpacing: '-0.02em',
        }}>
          {post.title}
        </h3>

        <p style={{
          fontSize: '14px',
          lineHeight: 1.7,
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          flex: 1,
        }}>
          {post.excerpt}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border)',
          paddingTop: '18px',
        }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
              {post.author}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {post.date} · {post.readTime}
            </p>
          </div>
          <Link
            href="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Read <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('All')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/dashboard')
  }, [loading, user, router])

  if (loading || user) return null

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  const filteredPosts =
    activeCategory === 'All'
      ? GRID_POSTS
      : GRID_POSTS.filter(p =>
          p.category.toLowerCase() === activeCategory.toLowerCase()
        )

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', color: 'var(--text-primary)' }}>

      {/* ─────────────────────── NAV ─────────────────────── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(247,247,247,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div className="container-max" style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}>
          {/* Logo */}
          <Link
            href="/"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '3px', flexShrink: 0 }}
          >
            <span style={{
              fontSize: '20px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
            }}>
              Blog
            </span>
            <span style={{
              fontSize: '20px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'var(--accent)',
            }}>
              Space
            </span>
          </Link>

          {/* Center nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden-mobile">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="nav-link"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            {/* Search */}
            <button
              aria-label="Search"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <SearchIcon />
            </button>

            <Link id="landing-signin" href="/login" className="nav-link" style={{ fontFamily: 'var(--font-sans)' }}>
              Sign In
            </Link>

            <Link
              id="landing-signup"
              href="/register"
              className="btn btn-solid"
              style={{ padding: '9px 20px', fontSize: '13px', borderRadius: '8px' }}
            >
              Subscribe
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ─────────────────────── HERO ─────────────────────── */}
        <section style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container-max" style={{
            paddingTop: 'clamp(80px, 10vw, 130px)',
            paddingBottom: 'clamp(80px, 10vw, 130px)',
          }}>
            <div style={{ maxWidth: '820px' }}>
              {/* Kicker */}
              <p className="label-xs animate-fade-up" style={{ marginBottom: '28px' }}>
                Latest Insights
              </p>

              {/* Hero title */}
              <h1
                className="animate-fade-up delay-1"
                style={{
                  fontSize: 'clamp(52px, 7.5vw, 88px)',
                  fontWeight: 900,
                  lineHeight: 1.0,
                  letterSpacing: '-0.04em',
                  color: 'var(--text-primary)',
                  marginBottom: '28px',
                }}
              >
                Thoughts, stories,<br />
                <span style={{ color: 'var(--text-secondary)' }}>and ideas for</span>
                <br />curious minds.
              </h1>

              {/* Description */}
              <p
                className="animate-fade-up delay-2"
                style={{
                  fontSize: '18px',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  maxWidth: '540px',
                  marginBottom: '44px',
                }}
              >
                Publish and discover in-depth articles, tutorials, and perspectives on
                modern web development — written by engineers, for curious minds.
              </p>

              {/* CTAs */}
              <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link id="landing-explore" href="/dashboard" className="btn btn-outline">
                  Explore Articles <ArrowRight />
                </Link>
                <Link id="landing-get-started" href="/register" className="btn btn-solid">
                  Start Writing Free
                </Link>
              </div>
            </div>

            {/* Stats strip */}
            <div
              className="animate-fade-up delay-4"
              style={{
                display: 'flex',
                gap: 'clamp(32px, 6vw, 72px)',
                marginTop: 'clamp(56px, 8vw, 100px)',
                paddingTop: '40px',
                borderTop: '1px solid var(--border)',
                flexWrap: 'wrap',
              }}
            >
              {[
                { value: '2.4K+', label: 'Articles Published' },
                { value: '18K+', label: 'Monthly Readers' },
                { value: '340+', label: 'Contributors' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>
                    {value}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px', letterSpacing: '0.02em' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────── FEATURED ─────────────────────── */}
        <section className="section-pad" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            {/* Section header */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '48px',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              <div>
                <p className="label-xs" style={{ marginBottom: '12px' }}>Featured Reading</p>
                <h2 style={{
                  fontSize: 'clamp(28px, 3.5vw, 38px)',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}>
                  Stories worth your time
                </h2>
              </div>
              <Link href="/dashboard" className="btn btn-outline" style={{ padding: '9px 20px' }}>
                View All <ArrowRight />
              </Link>
            </div>

            {/* Featured 2-up grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
              gap: 'var(--card-gap)',
            }}>
              {FEATURED_POSTS.map((post, i) => (
                <article key={post.id} className="card" style={{ background: 'var(--bg-white)' }}>
                  {/* Image */}
                  <div className="card-img" style={{ height: 'clamp(220px, 30vw, 340px)' }}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={1200}
                      height={800}
                      priority={i === 0}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Body */}
                  <div style={{ padding: 'clamp(24px, 3vw, 40px)' }}>
                    <span className="category-chip" style={{ marginBottom: '16px', display: 'block' }}>
                      {post.category}
                    </span>

                    <h3 style={{
                      fontSize: 'clamp(20px, 2.5vw, 26px)',
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.2,
                      color: 'var(--text-primary)',
                      marginBottom: '14px',
                    }}>
                      {post.title}
                    </h3>

                    <p style={{
                      fontSize: '15px',
                      lineHeight: 1.75,
                      color: 'var(--text-secondary)',
                      marginBottom: '28px',
                    }}>
                      {post.excerpt}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '20px',
                    }}>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>{post.author}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {post.date} · {post.readTime}
                        </p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="btn btn-outline"
                        style={{ padding: '8px 18px', fontSize: '12px' }}
                      >
                        Read <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────── CATEGORY FILTER + GRID ─────────────────────── */}
        <section className="section-pad" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            {/* Section header */}
            <div style={{ marginBottom: '40px' }}>
              <p className="label-xs" style={{ marginBottom: '12px' }}>Browse by Topic</p>
              <h2 style={{
                fontSize: 'clamp(28px, 3.5vw, 38px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}>
                Latest articles
              </h2>
            </div>

            {/* Filter tabs */}
            <div
              role="tablist"
              aria-label="Article categories"
              style={{
                display: 'flex',
                gap: '32px',
                marginBottom: '48px',
                borderBottom: '1px solid var(--border)',
                overflowX: 'auto',
                paddingBottom: '0',
              }}
            >
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  role="tab"
                  id={`tab-${cat.toLowerCase()}`}
                  aria-selected={activeCategory === cat}
                  className={`filter-tab${activeCategory === cat ? ' active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            {filteredPosts.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
                gap: 'var(--card-gap)',
              }}>
                {filteredPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} priority={i === 0} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '16px' }}>No articles in this category yet.</p>
              </div>
            )}

            {/* Load more */}
            <div style={{ textAlign: 'center', marginTop: '56px' }}>
              <Link href="/dashboard" className="btn btn-outline">
                Load More Articles <ArrowRight />
              </Link>
            </div>
          </div>
        </section>

        {/* ─────────────────────── WHAT WE OFFER ─────────────────────── */}
        <section style={{
          background: 'var(--bg-white)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div className="container-max section-pad">
            <div style={{ marginBottom: '56px' }}>
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
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap: '1px',
              background: 'var(--border)',
              borderRadius: '14px',
              overflow: 'hidden',
            }}>
              {[
                {
                  title: 'Write anything',
                  body: 'Rich editor, thumbnail uploads, drafts — everything a serious writer needs.',
                  icon: '✦',
                },
                {
                  title: 'Read the feed',
                  body: 'Browse all posts in one place. Click to expand and read inline without leaving.',
                  icon: '◈',
                },
                {
                  title: 'Own your content',
                  body: 'Edit and delete your posts from your profile at any time, no questions asked.',
                  icon: '◎',
                },
              ].map(({ title, body, icon }) => (
                <div
                  key={title}
                  style={{
                    background: 'var(--bg-white)',
                    padding: 'clamp(32px, 4vw, 56px)',
                  }}
                >
                  <span style={{
                    fontSize: '24px',
                    color: 'var(--accent)',
                    display: 'block',
                    marginBottom: '20px',
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
                  <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────── NEWSLETTER ─────────────────────── */}
        <section className="section-pad" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="container-max">
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              textAlign: 'center',
            }}>
              <p className="label-xs" style={{ marginBottom: '20px' }}>Newsletter</p>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                marginBottom: '16px',
              }}>
                Stay updated
              </h2>
              <p style={{
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: '40px',
              }}>
                One email, once a week — the best articles, hand-picked by our editors. No noise, unsubscribe anytime.
              </p>

              {subscribed ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}>
                  <span style={{ color: 'var(--accent)', fontSize: '18px' }}>✓</span>
                  You're on the list — welcome aboard!
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    maxWidth: '440px',
                    margin: '0 auto',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="input-field"
                    style={{ flex: '1 1 220px', minWidth: '0' }}
                  />
                  <button
                    id="newsletter-submit"
                    type="submit"
                    className="btn btn-solid"
                    style={{ flexShrink: 0 }}
                  >
                    Subscribe
                  </button>
                </form>
              )}

              <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                Join 18,000+ curious minds. No spam, ever.
              </p>
            </div>
          </div>
        </section>

        {/* ─────────────────────── FINAL CTA ─────────────────────── */}
        <section style={{ background: 'var(--text-primary)' }}>
          <div className="container-max section-pad" style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '24px',
            }}>
              Ready to contribute?
            </p>
            <h2 style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              color: '#fff',
              marginBottom: '20px',
            }}>
              Start writing today.
            </h2>
            <p style={{
              fontSize: '17px',
              color: 'rgba(255,255,255,0.6)',
              marginBottom: '40px',
              maxWidth: '440px',
              margin: '0 auto 40px',
              lineHeight: 1.65,
            }}>
              Join thousands of developers sharing what they know, for free.
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
                  border: '1px solid rgba(255,255,255,0.25)',
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
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
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
      <footer style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-page)',
      }}>
        <div className="container-max" style={{ padding: '56px clamp(20px, 5vw, 60px)' }}>
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
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', marginBottom: '12px' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.04em' }}>Blog</span>
                <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--accent)' }}>Space</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                A modern publishing platform for curious thinkers and serious writers.
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
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                {
                  label: 'Twitter',
                  href: '#',
                  svg: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  ),
                },
                {
                  label: 'GitHub',
                  href: '#',
                  svg: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  ),
                },
                {
                  label: 'RSS',
                  href: '#',
                  svg: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    width: '38px',
                    height: '38px',
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
              © {new Date().getFullYear()} BlogSpace. All rights reserved.
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

      {/* ─────────────────────── MOBILE NAV HIDE STYLE ─────────────────────── */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}
