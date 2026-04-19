'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import BlogCard from './components/BlogCard'
import NewsletterForm from './components/NewsletterForm'
import { usePosts } from './hooks/usePosts'

const CATEGORIES = ['All', 'Next.js', 'React', 'TypeScript', 'CSS', 'Backend', 'Database']
const PAGE_SIZE = 6

const stats = [
  { value: '2.4K+', label: 'Articles Published' },
  { value: '18K+', label: 'Monthly Readers' },
  { value: '340+', label: 'Contributors' },
]

export default function HomePage() {
  const { posts, hydrated } = usePosts()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let list = posts
    if (activeCategory !== 'All') list = list.filter((p) => p.category === activeCategory)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [posts, search, activeCategory])

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filtered.length

  const [featuredPost, ...restFiltered] = filtered.length > 0 ? filtered : []

  function handleCategory(cat: string) {
    setActiveCategory(cat)
    setPage(1)
  }

  return (
    <div className="relative bg-white">

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section id="hero" className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500">
              <span className="h-1.5 w-1.5 bg-black" />
              Handcrafted stories for developers
            </div>
            <h1 className="text-5xl font-black tracking-tight text-black sm:text-6xl md:text-7xl leading-[0.95]">
              Where great{' '}
              <span className="border-b-4 border-black">ideas</span>{' '}
              are born
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500">
              In-depth articles, tutorials, and perspectives on modern web
              development — written by engineers, for engineers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                id="hero-start-reading"
                href="#feed"
                className="group inline-flex items-center gap-2 border border-black bg-black px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
              >
                Start Reading
                <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition-all hover:border-black hover:bg-neutral-50 hover:text-black"
              >
                Write a Post
              </Link>
            </div>
          </div>

          {/* Stats */}
          <dl className="mt-14 grid grid-cols-3 gap-8 border-t border-neutral-200 pt-10 sm:gap-16">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col items-start gap-1">
                <dt className="text-2xl font-black text-black sm:text-3xl">{value}</dt>
                <dd className="text-xs text-neutral-500 sm:text-sm font-medium">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ FEED ══════════════════════════════════════════════════ */}
      <section id="feed" className="mx-auto max-w-7xl px-6 py-12">

        {/* Search + Filter bar */}
        <div className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative max-w-xs flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
              </svg>
            </span>
            <input
              id="home-search"
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search articles…"
              className="w-full border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-black placeholder-neutral-400 outline-none transition-all focus:border-black"
            />
          </div>

          {/* Category pills */}
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`border px-3 py-1.5 text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'border-black bg-black text-white'
                    : 'border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {(search || activeCategory !== 'All') && (
          <p className="mb-6 text-sm text-neutral-400 font-medium">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
            {activeCategory !== 'All' && <> in <strong className="text-black">{activeCategory}</strong></>}
            {search && <> matching &ldquo;<strong className="text-black">{search}</strong>&rdquo;</>}
          </p>
        )}

        {/* Empty state */}
        {!hydrated ? (
          <div className="grid grid-cols-1 gap-px bg-neutral-200 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-6">
                <div className="mb-4 h-44 bg-neutral-100" />
                <div className="h-4 w-1/4 bg-neutral-100 mb-3" />
                <div className="h-6 w-3/4 bg-neutral-100 mb-2" />
                <div className="h-4 w-full bg-neutral-100 mb-1" />
                <div className="h-4 w-2/3 bg-neutral-100" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex h-14 w-14 items-center justify-center border border-neutral-200 bg-neutral-50">
              <svg className="h-7 w-7 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-black">No articles found</p>
              <p className="mt-1 text-sm text-neutral-400">Try different keywords or categories</p>
            </div>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 hover:border-black hover:text-black"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured post full-width */}
            {featuredPost && !search && activeCategory === 'All' && page === 1 && (
              <div className="mb-px border border-neutral-200">
                <div className="grid grid-cols-1 gap-px bg-neutral-200">
                  <BlogCard post={featuredPost} featured />
                </div>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 gap-px bg-neutral-200 md:grid-cols-2 lg:grid-cols-3 border border-neutral-200">
              {(search || activeCategory !== 'All' ? paginated : restFiltered.slice(0, (page - 1) * PAGE_SIZE + PAGE_SIZE)).map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  id="load-more-posts"
                  onClick={() => setPage((p) => p + 1)}
                  className="group inline-flex items-center gap-2 border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-500 transition-all hover:border-black hover:bg-black hover:text-white"
                >
                  Load more articles
                  <svg className="h-4 w-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ══ NEWSLETTER ════════════════════════════════════════════ */}
      <section id="newsletter" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">Newsletter</p>
              <h2 className="text-2xl font-black text-black md:text-3xl">Never miss an article</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-500">
                Get the best developer content delivered directly to your inbox every week. No spam — unsubscribe any time.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
