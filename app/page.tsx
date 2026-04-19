import Link from 'next/link'
import BlogCard from './components/BlogCard'
import NewsletterForm from './components/NewsletterForm'
import { posts } from './data/posts'

/* ─── Stats row ──────────────────────────────────────────── */
const stats = [
  { value: '2.4K+', label: 'Articles Published' },
  { value: '18K+', label: 'Monthly Readers' },
  { value: '340+', label: 'Contributors' },
]

/* ─── Category pills ─────────────────────────────────────── */
const categories = [
  'All', 'Next.js', 'React', 'TypeScript', 'CSS', 'Backend', 'Database',
]

export default function HomePage() {
  const [featuredPost, ...restPosts] = posts

  return (
    <div className="relative overflow-hidden">
      {/* ── Global background glow blobs ──────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute top-2/3 -right-40 h-[400px] w-[500px] rounded-full bg-indigo-600/8 blur-3xl" />
        <div className="absolute top-1/3 -left-40 h-[350px] w-[450px] rounded-full bg-violet-800/8 blur-3xl" />
      </div>

      {/* ══════════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-16 pt-20 text-center md:pt-28 lg:pb-24 lg:pt-36"
      >
        {/* Eyebrow badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
          <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
          Handcrafted stories for developers
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Where great{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              ideas
            </span>
            {/* Underline squiggle */}
            <svg
              aria-hidden
              viewBox="0 0 200 8"
              className="absolute -bottom-2 left-0 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0 6 Q25 0 50 4 Q75 8 100 4 Q125 0 150 4 Q175 8 200 4"
                fill="none"
                stroke="url(#heroGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
          </span>{' '}
          are born
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400 md:text-xl">
          In-depth articles, tutorials, and perspectives on modern web development —
          written by engineers, for engineers. No fluff, just signal.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            id="hero-start-reading"
            href="#latest-posts"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/50 hover:-translate-y-0.5"
          >
            Start Reading
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            id="hero-write-for-us"
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-300 backdrop-blur-sm transition-all duration-200 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-white hover:-translate-y-0.5"
          >
            Write for Us
          </Link>
        </div>

        {/* Stats row */}
        <dl className="mt-14 grid grid-cols-3 gap-6 sm:gap-12">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <dt className="text-2xl font-bold text-white sm:text-3xl">{value}</dt>
              <dd className="text-xs text-gray-500 sm:text-sm">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ══════════════════════════════════════════════════════
          BLOG GRID SECTION
      ══════════════════════════════════════════════════════ */}
      <section
        id="latest-posts"
        className="mx-auto max-w-7xl px-6 pb-24 pt-4"
      >
        {/* Section header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
              Latest Articles
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Fresh from the editors
            </h2>
          </div>

          {/* Category filter pills — purely visual for now */}
          <div
            role="group"
            aria-label="Filter by category"
            className="flex flex-wrap gap-2"
          >
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-150 ${
                  i === 0
                    ? 'bg-violet-600 text-white'
                    : 'border border-white/10 bg-white/5 text-gray-400 hover:border-violet-500/40 hover:text-violet-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Featured card spans 2 cols on md+ */}
          <BlogCard post={featuredPost} featured />
          {restPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Load more */}
        <div className="mt-14 flex justify-center">
          <button
            id="load-more-posts"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-400 backdrop-blur-sm transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
          >
            Load more articles
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          NEWSLETTER BAND
      ══════════════════════════════════════════════════════ */}
      <section
        id="newsletter"
        className="mx-auto mb-24 max-w-7xl px-6"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/60 via-gray-900/80 to-indigo-950/60 p-10 backdrop-blur-sm md:p-14">
          {/* Decorative inner glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-indigo-600/15 blur-2xl"
          />

          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
                Newsletter
              </p>
              <h2 className="text-2xl font-bold text-white md:text-3xl">
                Never miss an article
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">
                Get the best developer content delivered directly to your inbox every week.
                No spam — unsubscribe any time.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
