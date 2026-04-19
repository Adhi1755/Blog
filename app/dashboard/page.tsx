'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, ContentBlock } from '../data/posts'
import { usePosts } from '../hooks/usePosts'
import { useAuth } from '../context/AuthContext'
import AppHeader from '../components/AppHeader'

// ─────────────────────────────────────────────────────────────
// Content block renderer (full-read view)
// ─────────────────────────────────────────────────────────────
function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={i} className="text-sm leading-7 text-black">
                {block.text}
              </p>
            )
          case 'heading':
            return (
              <h3 key={i} className="mt-6 mb-2 text-base font-black text-black tracking-tight border-l-2 border-black pl-3">
                {block.text}
              </h3>
            )
          case 'code':
            return (
              <div key={i} className="border border-neutral-300 bg-neutral-50">
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                    {block.language}
                  </span>
                </div>
                <pre className="overflow-x-auto px-4 py-4 text-xs leading-relaxed text-black font-mono">
                  <code>{block.code}</code>
                </pre>
              </div>
            )
          case 'tip':
            return (
              <div key={i} className="border border-black bg-black px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-1">
                  Tip
                </p>
                <p className="text-sm leading-6 text-white">{block.text}</p>
              </div>
            )
          case 'list':
            return (
              <ul key={i} className="space-y-2 pl-0">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-black leading-6">
                    <span className="mt-2 h-1 w-1 shrink-0 bg-black" />
                    {item}
                  </li>
                ))}
              </ul>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Feed card
// ─────────────────────────────────────────────────────────────
function FeedCard({
  post,
  isActive,
  onClick,
}: {
  post: Post
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      id={`feed-card-${post.slug}`}
      onClick={onClick}
      className={`w-full text-left border-b border-neutral-200 transition-colors duration-100 ${
        isActive ? 'bg-black' : 'bg-white hover:bg-neutral-50'
      }`}
    >
      <div className="flex gap-0">
        {/* Thumbnail */}
        {post.thumbnail ? (
          <div className="shrink-0 w-28 h-24 overflow-hidden border-r border-neutral-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnail}
              alt={post.title}
              className="h-full w-full object-cover grayscale"
            />
          </div>
        ) : (
          <div
            className={`shrink-0 w-28 h-24 border-r border-neutral-200 flex items-center justify-center ${
              isActive ? 'border-neutral-700 bg-neutral-900' : 'bg-neutral-50'
            }`}
          >
            <svg
              className={`h-6 w-6 ${isActive ? 'text-neutral-600' : 'text-neutral-300'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
              />
            </svg>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 min-w-0 px-4 py-3">
          {/* Category pill */}
          <span
            className={`inline-block mb-1.5 text-xs font-bold uppercase tracking-widest px-1.5 py-0.5 border ${
              isActive
                ? 'border-neutral-600 text-neutral-400 bg-transparent'
                : 'border-neutral-300 text-neutral-500 bg-transparent'
            }`}
          >
            {post.category}
          </span>

          {/* Title */}
          <p
            className={`text-sm font-black leading-snug line-clamp-1 ${
              isActive ? 'text-white' : 'text-black'
            }`}
          >
            {post.title}
          </p>

          {/* Excerpt */}
          <p
            className={`mt-1 text-xs leading-relaxed line-clamp-2 ${
              isActive ? 'text-neutral-400' : 'text-neutral-500'
            }`}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div className={`mt-2 flex items-center gap-2 text-xs ${isActive ? 'text-neutral-500' : 'text-neutral-400'}`}>
            <span
              className={`inline-flex items-center justify-center h-4 w-4 text-xs font-bold shrink-0 ${
                isActive ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              {post.author.initials.charAt(0)}
            </span>
            <span className="font-medium">{post.author.name.split(' ')[0]}</span>
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Active indicator */}
        <div
          className={`w-0.5 self-stretch transition-colors ${
            isActive ? 'bg-white' : 'bg-transparent'
          }`}
        />
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────────
// Blog reader panel
// ─────────────────────────────────────────────────────────────
function ReaderPanel({
  post,
  onClose,
}: {
  post: Post | null
  onClose: () => void
}) {
  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
        <div className="border border-neutral-200 p-6 mb-5">
          <svg
            className="h-10 w-10 text-neutral-200 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-neutral-300 tracking-wide">Select a blog to read</p>
        <p className="mt-1 text-xs text-neutral-300">Click any post from the feed on the left</p>
      </div>
    )
  }

  return (
    <article className="h-full flex flex-col">
      {/* Reader top bar */}
      <div className="shrink-0 flex items-center justify-between border-b border-neutral-200 px-6 py-3">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {post.category}
        </span>
        <button
          id="reader-close"
          onClick={onClose}
          aria-label="Close reader"
          className="flex items-center gap-1.5 border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-500 transition-colors hover:border-black hover:bg-black hover:text-white"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-7">
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="mb-6 overflow-hidden border border-neutral-200 aspect-video w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnail}
              alt={post.title}
              className="h-full w-full object-cover grayscale"
            />
          </div>
        )}

        {/* Title */}
        <h2 className="text-xl font-black text-black leading-tight tracking-tight">
          {post.title}
        </h2>

        {/* Author + date */}
        <div className="mt-4 flex items-center gap-3 pb-5 border-b border-neutral-200">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-black text-xs font-bold text-white">
            {post.author.initials}
          </span>
          <div>
            <p className="text-xs font-bold text-black">{post.author.name}</p>
            <p className="text-xs text-neutral-400">
              {post.date} · {post.readTime}
            </p>
          </div>
          {post.featured && (
            <span className="ml-auto border border-black bg-black px-2.5 py-1 text-xs font-bold text-white uppercase tracking-widest">
              Featured
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Body */}
        <div className="mt-6">
          {post.body && post.body.length > 0 ? (
            <ContentRenderer blocks={post.body} />
          ) : (
            <p className="text-sm leading-7 text-black">{post.excerpt}</p>
          )}
        </div>

        {/* Stats row */}
        <div className="mt-8 pt-5 border-t border-neutral-200 flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{(post.views ?? 0).toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span>{(post.likes ?? 0).toLocaleString()} likes</span>
          </div>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { posts, hydrated } = usePosts()

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [authLoading, user, router])

  const [search, setSearch] = useState('')
  const [activePost, setActivePost] = useState<Post | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return posts
    const q = search.toLowerCase()
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    )
  }, [posts, search])

  // Loading skeleton
  if (authLoading || !user || !hydrated) {
    return (
      <div className="flex h-screen flex-col bg-white">
        <div className="shrink-0 h-12 border-b border-neutral-200 animate-pulse bg-neutral-50" />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 border-r border-neutral-200 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-0 border-b border-neutral-100">
                <div className="w-28 h-24 bg-neutral-100 shrink-0" />
                <div className="flex-1 px-4 py-3 space-y-2">
                  <div className="h-2.5 bg-neutral-100 w-16" />
                  <div className="h-3 bg-neutral-100 w-full" />
                  <div className="h-2.5 bg-neutral-100 w-4/5" />
                  <div className="h-2.5 bg-neutral-100 w-3/5" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex-1 bg-neutral-50 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
      <AppHeader />

      {/* Body: feed + reader */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Feed column ─────────────────────────── */}
        <aside className="flex flex-col w-80 xl:w-96 shrink-0 border-r border-neutral-200 overflow-hidden">

          {/* Feed header + search */}
          <div className="shrink-0 border-b border-neutral-200">
            <div className="px-4 pt-4 pb-3">
              <div className="flex items-baseline justify-between mb-3">
                <h1 className="text-sm font-black uppercase tracking-widest text-black">All Posts</h1>
                <span className="text-xs text-neutral-400 font-medium">{filtered.length} posts</span>
              </div>
              {/* Search */}
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                </span>
                <input
                  id="feed-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search posts…"
                  className="w-full border border-neutral-200 bg-white py-2 pl-9 pr-3 text-xs text-black placeholder-neutral-400 outline-none focus:border-black transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Feed list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <div className="h-10 w-10 border border-neutral-200 flex items-center justify-center mb-3">
                  <svg className="h-5 w-5 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-neutral-400">No posts found</p>
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="mt-2 text-xs text-black underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              filtered.map((post) => (
                <FeedCard
                  key={post.slug}
                  post={post}
                  isActive={activePost?.slug === post.slug}
                  onClick={() =>
                    setActivePost((prev) =>
                      prev?.slug === post.slug ? null : post
                    )
                  }
                />
              ))
            )}
          </div>

          {/* Feed footer */}
          <div className="shrink-0 border-t border-neutral-200 px-4 py-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              {posts.length} total post{posts.length !== 1 ? 's' : ''}
            </span>
            <a
              id="dashboard-create-cta"
              href="/editor"
              className="flex items-center gap-1 text-xs font-bold text-black border border-black px-2.5 py-1 hover:bg-black hover:text-white transition-colors"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Write
            </a>
          </div>
        </aside>

        {/* ── RIGHT: Reader panel ───────────────────────── */}
        <main className="flex-1 overflow-hidden border-l-0">
          <ReaderPanel post={activePost} onClose={() => setActivePost(null)} />
        </main>
      </div>
    </div>
  )
}
