'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { posts as seedPosts, type Post, type ContentBlock } from '../../data/posts'

// ── Read from localStorage (same key as usePosts hook) ────────
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

// ── Category accent colours ────────────────────────────────────
const catStyles: Record<string, string> = {
  violet: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
  sky: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  blue: 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  orange: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
}

const accentGradient: Record<string, string> = {
  violet: 'from-violet-500 to-indigo-500',
  sky: 'from-sky-500 to-cyan-500',
  blue: 'from-blue-500 to-blue-700',
  cyan: 'from-cyan-500 to-teal-500',
  emerald: 'from-emerald-500 to-green-600',
  orange: 'from-orange-500 to-amber-500',
}

// ── Content block renderers ────────────────────────────────────
function RenderBlock({ block, accent }: { block: ContentBlock; accent: string }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-base leading-8 text-gray-300">
          {block.text}
        </p>
      )

    case 'heading':
      return (
        <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
          {block.text}
        </h2>
      )

    case 'code':
      return (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-950/80">
          {/* Language tab */}
          <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.03] px-4 py-2">
            <span className="text-xs font-mono text-gray-500">{block.language}</span>
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
            </div>
          </div>
          <pre className="overflow-x-auto p-5 text-sm leading-relaxed text-gray-300">
            <code>{block.code}</code>
          </pre>
        </div>
      )

    case 'tip':
      return (
        <div className={`flex gap-4 rounded-2xl border border-white/10 bg-gradient-to-r ${accent} p-0.5`}>
          <div className="flex-1 rounded-[calc(1rem-2px)] bg-gray-950/90 p-5">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-violet-400">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              Pro Tip
            </div>
            <p className="text-sm leading-7 text-gray-300">{block.text}</p>
          </div>
        </div>
      )

    case 'list':
      return (
        <ul className="flex flex-col gap-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base text-gray-300">
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r ${accent}`} />
              {item}
            </li>
          ))}
        </ul>
      )

    default:
      return null
  }
}

// ── Skeleton ──────────────────────────────────────────────────
function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 animate-pulse">
      <div className="mb-6 h-4 w-20 rounded-full bg-white/10" />
      <div className="space-y-3">
        <div className="h-8 w-3/4 rounded-xl bg-white/10" />
        <div className="h-8 w-1/2 rounded-xl bg-white/10" />
      </div>
      <div className="mt-8 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-white/10" />
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="h-3 w-32 rounded bg-white/10" />
        </div>
      </div>
      <div className="mt-12 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-4 rounded bg-white/10 ${i % 3 === 2 ? 'w-4/5' : 'w-full'}`} />
        ))}
      </div>
    </div>
  )
}

// ── 404 state ─────────────────────────────────────────────────
function PostNotFound({ slug }: { slug: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
        <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white">Post not found</h1>
        <p className="mt-2 text-sm text-gray-500">
          No post with slug <code className="rounded bg-white/5 px-1.5 py-0.5 text-gray-400">{slug}</code> exists.
        </p>
      </div>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>
    </div>
  )
}

// ── Main page component ───────────────────────────────────────
export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Per Next.js 16 docs: unwrap params with React.use() in Client Components
  const { slug } = use(params)

  const [post, setPost] = useState<Post | null | undefined>(undefined)

  useEffect(() => {
    setPost(getPostBySlug(slug))
  }, [slug])

  if (post === undefined) return <ArticleSkeleton />
  if (post === null) return <PostNotFound slug={slug} />

  const accent = accentGradient[post.categoryColor] ?? accentGradient.violet
  const catPill = catStyles[post.categoryColor] ?? catStyles.violet

  // For posts without a body (user-created), fall back to the excerpt
  const hasBody = post.body && post.body.length > 0
  const fallbackBody: ContentBlock[] = [
    { type: 'paragraph', text: post.excerpt },
  ]
  const body = hasBody ? post.body! : fallbackBody

  return (
    <div className="relative">
      {/* Background glow */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      {/* ── Hero / Header ───────────────────────────────── */}
      <header className="relative mx-auto max-w-3xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-violet-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All posts
        </Link>

        {/* Category + Featured badges */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${catPill}`}>
            {post.category}
          </span>
          {post.featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-400 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        {/* Excerpt / lead */}
        <p className="mt-5 text-lg leading-8 text-gray-400">
          {post.excerpt}
        </p>

        {/* Gradient divider */}
        <div className={`mt-8 h-px w-full bg-gradient-to-r ${accent} opacity-40`} />

        {/* Author + meta row */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg ${post.author.avatarColor}`}
            >
              {post.author.initials}
            </span>
            <div>
              <p className="text-sm font-semibold text-white">{post.author.name}</p>
              <p className="text-xs text-gray-500">Author</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            {/* Calendar icon + date */}
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              {post.date}
            </span>

            <span className="h-0.5 w-0.5 rounded-full bg-gray-700" />

            {/* Clock icon + read time */}
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* ── Article body ─────────────────────────────────── */}
      <article
        id="article-content"
        aria-label="Article content"
        className="mx-auto max-w-3xl px-4 pb-24 sm:px-6"
      >
        <div className="flex flex-col gap-8">
          {body.map((block, i) => (
            <RenderBlock key={i} block={block} accent={accent} />
          ))}
        </div>

        {/* ── Bottom divider + author card ─────────────── */}
        <div className={`mt-16 h-px w-full bg-gradient-to-r ${accent} opacity-20`} />

        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gray-900/60 p-6 backdrop-blur-sm sm:flex-row sm:gap-6 sm:p-8">
          <span
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white shadow-xl ${post.author.avatarColor}`}
          >
            {post.author.initials}
          </span>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">Written by</p>
            <p className="mt-0.5 text-base font-bold text-white">{post.author.name}</p>
            <p className="mt-1 text-sm text-gray-500">
              Published on {post.date} · {post.readTime}
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-all hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300"
          >
            More posts →
          </Link>
        </div>

        {/* ── Back to top / navigation ─────────────────── */}
        <div className="mt-10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-violet-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all posts
          </Link>
          <button
            id="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-violet-300"
          >
            Back to top
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>
        </div>
      </article>
    </div>
  )
}
