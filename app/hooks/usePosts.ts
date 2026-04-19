'use client'

import { useState, useEffect, useCallback } from 'react'
import { posts as seedPosts, type Post, type Comment } from '../data/posts'
import { parseMarkdownToBlocks } from '../utils/markdown'

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
  thumbnail?: string
  tags?: string[]
  content?: string
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

  useEffect(() => {
    setPosts(loadPosts())
    setHydrated(true)
  }, [])

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

    const newPost: Post = {
      slug: `${slugify(draft.title)}-${Date.now()}`,
      title: draft.title.trim(),
      excerpt: draft.excerpt.trim(),
      date: todayLabel(),
      readTime: estimateReadTime(draft.excerpt),
      category: draft.category,
      categoryColor: draft.categoryColor,
      featured: draft.featured,
      thumbnail: draft.thumbnail || undefined,
      tags: draft.tags || [],
      likes: 0,
      views: 0,
      comments: [],
      author: {
        name: draft.authorName.trim() || 'Anonymous',
        initials: initials || 'AN',
        avatarColor: 'from-neutral-600 to-neutral-800',
      },
      body: draft.content ? parseMarkdownToBlocks(draft.content) : undefined,
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
        return {
          ...p,
          title: draft.title.trim(),
          excerpt: draft.excerpt.trim(),
          category: draft.category,
          categoryColor: draft.categoryColor,
          featured: draft.featured,
          readTime: estimateReadTime(draft.excerpt),
          thumbnail: draft.thumbnail ?? p.thumbnail,
          tags: draft.tags ?? p.tags,
          body: draft.content ? parseMarkdownToBlocks(draft.content) : p.body,
          author: {
            name: draft.authorName.trim() || p.author.name,
            initials: initials || p.author.initials,
            avatarColor: p.author.avatarColor,
          },
        }
      })
    )
  }, [])

  const deletePost = useCallback((slug: string) => {
    setPosts((prev) => prev.filter((p) => p.slug !== slug))
  }, [])

  const likePost = useCallback((slug: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.slug === slug ? { ...p, likes: (p.likes ?? 0) + 1 } : p
      )
    )
  }, [])

  const addComment = useCallback((slug: string, comment: Omit<Comment, 'id' | 'date'>) => {
    const newComment: Comment = {
      id: `${Date.now()}`,
      date: todayLabel(),
      ...comment,
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.slug === slug
          ? { ...p, comments: [...(p.comments ?? []), newComment] }
          : p
      )
    )
  }, [])

  const incrementViews = useCallback((slug: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.slug === slug ? { ...p, views: (p.views ?? 0) + 1 } : p
      )
    )
  }, [])

  const resetToSeed = useCallback(() => {
    setPosts(seedPosts)
  }, [])

  return {
    posts,
    hydrated,
    addPost,
    updatePost,
    deletePost,
    likePost,
    addComment,
    incrementViews,
    resetToSeed,
  }
}
