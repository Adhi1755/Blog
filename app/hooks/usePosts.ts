'use client'

import { useState, useEffect, useCallback } from 'react'
import { posts as seedPosts, type Post } from '../data/posts'

// ── Helpers ──────────────────────────────────────────────────
const STORAGE_KEY = 'blogspace_posts'

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 64)
}

function estimateReadTime(excerpt: string): string {
  const words = excerpt.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ── Seed localStorage once on first load ─────────────────────
function loadPosts(): Post[] {
  if (typeof window === 'undefined') return seedPosts
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Post[]
    // First visit: seed from static data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedPosts))
    return seedPosts
  } catch {
    return seedPosts
  }
}

function savePosts(posts: Post[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  } catch {
    // storage quota exceeded or SSR — silently ignore
  }
}

// ── Hook ──────────────────────────────────────────────────────
export type DraftPost = {
  title: string
  excerpt: string
  category: string
  categoryColor: string
  authorName: string
  featured: boolean
}

export const CATEGORY_OPTIONS: { label: string; color: string }[] = [
  { label: 'Next.js', color: 'violet' },
  { label: 'React', color: 'cyan' },
  { label: 'TypeScript', color: 'blue' },
  { label: 'CSS', color: 'sky' },
  { label: 'Backend', color: 'emerald' },
  { label: 'Database', color: 'orange' },
  { label: 'Other', color: 'violet' },
]

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage after mount
  useEffect(() => {
    setPosts(loadPosts())
    setHydrated(true)
  }, [])

  // Persist on every change (skip the pre-hydration empty state)
  useEffect(() => {
    if (hydrated) savePosts(posts)
  }, [posts, hydrated])

  const addPost = useCallback((draft: DraftPost) => {
    const initials = draft.authorName
      .trim()
      .split(' ')
      .map((w) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('')

    const colorMap: Record<string, string> = {
      violet: 'from-violet-500 to-indigo-600',
      cyan: 'from-cyan-500 to-teal-600',
      blue: 'from-blue-500 to-blue-700',
      sky: 'from-sky-500 to-cyan-600',
      emerald: 'from-emerald-500 to-green-600',
      orange: 'from-orange-500 to-amber-600',
    }

    const newPost: Post = {
      slug: `${slugify(draft.title)}-${Date.now()}`,
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      date: todayLabel(),
      readTime: estimateReadTime(draft.excerpt),
      category: draft.category,
      categoryColor: draft.categoryColor,
      featured: draft.featured,
      author: {
        name: draft.authorName.trim() || 'Anonymous',
        initials: initials || 'AN',
        avatarColor: colorMap[draft.categoryColor] ?? colorMap.violet,
      },
    }
    setPosts((prev) => [newPost, ...prev])
    return newPost
  }, [])

  const updatePost = useCallback((slug: string, draft: DraftPost) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.slug !== slug) return p
        const initials = draft.authorName
          .trim()
          .split(' ')
          .map((w) => w[0]?.toUpperCase() ?? '')
          .slice(0, 2)
          .join('')
        const colorMap: Record<string, string> = {
          violet: 'from-violet-500 to-indigo-600',
          cyan: 'from-cyan-500 to-teal-600',
          blue: 'from-blue-500 to-blue-700',
          sky: 'from-sky-500 to-cyan-600',
          emerald: 'from-emerald-500 to-green-600',
          orange: 'from-orange-500 to-amber-600',
        }
        return {
          ...p,
          title: draft.title.trim(),
          excerpt: draft.excerpt.trim(),
          category: draft.category,
          categoryColor: draft.categoryColor,
          featured: draft.featured,
          readTime: estimateReadTime(draft.excerpt),
          author: {
            name: draft.authorName.trim() || p.author.name,
            initials: initials || p.author.initials,
            avatarColor: colorMap[draft.categoryColor] ?? p.author.avatarColor,
          },
        }
      })
    )
  }, [])

  const deletePost = useCallback((slug: string) => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug))
  }, [])

  const resetToSeed = useCallback(() => {
    setPosts(seedPosts)
  }, [])

  return { posts, hydrated, addPost, updatePost, deletePost, resetToSeed }
}
