import Link from 'next/link'
import BlogCard from './components/BlogCard'
import NewsletterForm from './components/NewsletterForm'
import { posts } from './data/posts'

const stats = [
  { value: '2.4K+', label: 'Articles Published' },
  { value: '18K+', label: 'Monthly Readers' },
  { value: '340+', label: 'Contributors' },
]

const categories = ['All', 'Next.js', 'React', 'TypeScript', 'CSS', 'Backend', 'Database']

export default function HomePage() {
  const [featuredPost, ...restPosts] = posts

  return (
    <div className="relative">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative mx-auto flex max-w-7xl flex-col items-start px-6 pb-20 pt-20 md:pt-28 lg:pb-28 lg:pt-36"
      >
        {/* Eyebrow label */}
        <div className="mb-8 inline-flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs font-semibold tracking-widest text-neutral-500 uppercase">
          <span className="h-1.5 w-1.5 bg-black" />
          Handcrafted stories for developers
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-5xl font-black tracking-tight text-black sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95]">
          Where great{' '}
          <span className="border-b-4 border-black">
            ideas
          </span>{' '}
          are born
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-neutral-500 md:text-lg ml-0">
          In-depth articles, tutorials, and perspectives on modern web development —
          written by engineers, for engineers. No fluff, just signal.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-start justify-start gap-3 sm:flex-row">
          <Link
            id="hero-start-reading"
            href="#latest-posts"
            className="group inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-neutral-800"
          >
            Start Reading
            <svg className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            id="hero-write-for-us"
            href="/register"
            className="inline-flex items-center gap-2 border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition-all duration-150 hover:border-black hover:bg-neutral-50 hover:text-black"
          >
            Write for Us
          </Link>
        </div>

        {/* Stats */}
        <dl className="mt-16 grid grid-cols-3 gap-8 border-t border-neutral-200 pt-12 sm:gap-16 w-full">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-start gap-1">
              <dt className="text-2xl font-black text-black sm:text-3xl">{value}</dt>
              <dd className="text-xs text-neutral-500 sm:text-sm font-medium">{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ══════════════════════════════════════════
          BLOG GRID
      ══════════════════════════════════════════ */}
      <section id="latest-posts" className="mx-auto max-w-7xl px-6 pb-24 pt-4">

        {/* Section header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-neutral-200 pb-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
              Latest Articles
            </p>
            <h2 className="text-2xl font-black text-black sm:text-3xl">
              Fresh from the editors
            </h2>
          </div>

          {/* Category pills */}
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`px-3 py-1.5 text-xs font-semibold transition-all duration-150 border ${
                  i === 0
                    ? 'bg-black text-white border-black'
                    : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-black hover:bg-neutral-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-px bg-neutral-200 md:grid-cols-2 lg:grid-cols-3">
          <BlogCard post={featuredPost} featured />
          {restPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Load more */}
        <div className="mt-14 flex justify-center">
          <button
            id="load-more-posts"
            className="group inline-flex items-center gap-2 border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-500 transition-all duration-150 hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
          >
            Load more articles
            <svg className="h-4 w-4 transition-transform duration-150 group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════════ */}
      <section id="newsletter" className="mx-auto mb-24 max-w-7xl px-6">
        <div className="border border-neutral-200 bg-neutral-50 p-10 md:p-14">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
                Newsletter
              </p>
              <h2 className="text-2xl font-black text-black md:text-3xl">
                Never miss an article
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
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
