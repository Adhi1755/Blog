'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { posts as seedPosts, type Post, type ContentBlock } from '../../data/posts'
import { usePosts } from '../../hooks/usePosts'
import { useAuth } from '../../context/AuthContext'
import { renderInline } from '../../utils/markdown'

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

function RenderBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="text-base leading-8 text-neutral-600">{renderInline(block.text)}</p>
    case 'heading':
      return <h2 className="mt-10 text-xl font-black text-black sm:text-2xl">{renderInline(block.text)}</h2>
    case 'code':
      return (
        <div className="overflow-hidden border border-neutral-200">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-100 px-4 py-2">
            <span className="text-xs font-mono font-bold text-neutral-500">{block.language}</span>
            <div className="flex gap-1.5">
              {['bg-neutral-300', 'bg-neutral-300', 'bg-neutral-300'].map((c, i) => (
                <span key={i} className={`h-2.5 w-2.5 ${c}`} />
              ))}
            </div>
          </div>
          <pre className="overflow-x-auto bg-neutral-50 p-5 text-sm leading-relaxed text-neutral-700">
            <code>{block.code}</code>
          </pre>
        </div>
      )
    case 'tip':
      return (
        <div className="border-l-4 border-black bg-neutral-50 p-5 border border-neutral-200">
          <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
            Pro Tip
          </div>
          <p className="text-sm leading-7 text-neutral-600">{renderInline(block.text)}</p>
        </div>
      )
    case 'list':
      return (
        <ul className="flex flex-col gap-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-base text-neutral-600">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-black" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 animate-pulse">
      <div className="mb-6 h-48 bg-neutral-100" />
      <div className="mb-4 h-4 w-20 bg-neutral-100" />
      <div className="h-10 w-3/4 bg-neutral-100 mb-2" />
      <div className="h-6 w-1/2 bg-neutral-100 mb-8" />
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className={`h-4 bg-neutral-100 ${i % 3 === 2 ? 'w-4/5' : 'w-full'}`} />
        ))}
      </div>
    </div>
  )
}

function PostNotFound({ slug }: { slug: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center bg-white">
      <div className="flex h-16 w-16 items-center justify-center border border-neutral-200 bg-neutral-50">
        <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-black text-black">Post not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          No post with slug <code className="border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-neutral-600">{slug}</code> exists.
        </p>
      </div>
      <Link href="/" className="border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800">
        ← Back to Home
      </Link>
    </div>
  )
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useAuth()
  const { posts, likePost, addComment, incrementViews } = usePosts()

  const [post, setPost] = useState<Post | null | undefined>(undefined)
  const [liked, setLiked] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentName, setCommentName] = useState(user?.name ?? '')
  const [submittingComment, setSubmittingComment] = useState(false)

  // Load post from localStorage
  useEffect(() => {
    setPost(getPostBySlug(slug))
    incrementViews(slug)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  // Sync live post data (likes, comments)
  useEffect(() => {
    const live = posts.find((p) => p.slug === slug)
    if (live) setPost(live)
  }, [posts, slug])

  useEffect(() => {
    if (user) setCommentName(user.name)
  }, [user])

  function handleLike() {
    if (liked) return
    setLiked(true)
    likePost(slug)
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentText.trim() || !commentName.trim()) return
    setSubmittingComment(true)
    await new Promise((r) => setTimeout(r, 300))
    addComment(slug, {
      authorName: commentName,
      authorInitials: commentName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
      text: commentText,
    })
    setCommentText('')
    setSubmittingComment(false)
  }

  if (post === undefined) return <ArticleSkeleton />
  if (post === null) return <PostNotFound slug={slug} />

  const hasBody = post.body && post.body.length > 0
  const fallbackBody: ContentBlock[] = [{ type: 'paragraph', text: post.excerpt }]
  const body = hasBody ? post.body! : fallbackBody
  const comments = post.comments ?? []

  return (
    <div className="relative bg-white">
      {/* Thumbnail hero */}
      {post.thumbnail && (
        <div className="relative h-64 w-full overflow-hidden border-b border-neutral-200 sm:h-80 md:h-96">
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/10" />
        </div>
      )}

      {/* Article header */}
      <header className="mx-auto max-w-3xl px-4 pb-8 pt-10 sm:px-6">
        {/* Back + breadcrumb */}
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-neutral-400 transition-colors hover:text-black">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All posts
        </Link>

        {/* Tags / badges */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-bold text-neutral-600">
            {post.category}
          </span>
          {post.featured && (
            <span className="border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-500">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 bg-black" />
              Featured
            </span>
          )}
          {(post.tags ?? []).map((tag) => (
            <span key={tag} className="border border-neutral-100 bg-neutral-50 px-2.5 py-0.5 text-xs text-neutral-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-black leading-tight tracking-tight text-black sm:text-4xl md:text-5xl">
          {post.title}
        </h1>

        {/* Excerpt/lead */}
        <p className="mt-4 text-lg leading-8 text-neutral-500">{post.excerpt}</p>

        {/* Divider */}
        <div className="mt-8 h-px w-full bg-neutral-200" />

        {/* Author row + stats */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-black text-sm font-bold text-white">
              {post.author.initials}
            </span>
            <div>
              <p className="text-sm font-semibold text-black">{post.author.name}</p>
              <p className="text-xs text-neutral-500">Author</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              {post.date}
            </span>
            <span className="h-0.5 w-0.5 bg-neutral-300" />
            <span className="flex items-center gap-1.5">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {post.readTime}
            </span>
            <span className="h-0.5 w-0.5 bg-neutral-300" />
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {post.views ?? 0} views
            </span>
          </div>
        </div>
      </header>

      {/* Article body */}
      <article id="article-content" className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <div className="flex flex-col gap-7">
          {body.map((block, i) => (
            <RenderBlock key={i} block={block} />
          ))}
        </div>

        {/* Like button */}
        <div className="mt-14 flex items-center gap-4 border-t border-neutral-200 pt-8">
          <button
            id="like-post"
            onClick={handleLike}
            disabled={liked}
            className={`flex items-center gap-2 border px-5 py-2.5 text-sm font-semibold transition-all ${
              liked
                ? 'border-black bg-black text-white cursor-default'
                : 'border-neutral-200 text-neutral-600 hover:border-black hover:bg-black hover:text-white'
            }`}
          >
            <svg className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {liked ? 'Liked!' : 'Like this post'}
            <span className="border-l border-current pl-2">{post.likes ?? 0}</span>
          </button>
          <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-black transition-colors">
            More posts →
          </Link>
        </div>

        {/* Author card */}
        <div className="mt-10 flex flex-col items-start gap-4 border border-neutral-200 bg-neutral-50 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center bg-black text-lg font-bold text-white">
            {post.author.initials}
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Written by</p>
            <p className="mt-0.5 text-base font-black text-black">{post.author.name}</p>
            <p className="mt-1 text-sm text-neutral-500">Published on {post.date} · {post.readTime}</p>
          </div>
          {user && post.author.name === user.name && (
            <Link
              href={`/editor?edit=${post.slug}`}
              className="shrink-0 border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 transition-all hover:border-black hover:text-black"
            >
              Edit post
            </Link>
          )}
        </div>

        {/* Comments section */}
        <div className="mt-14" id="comments">
          <h2 className="mb-8 text-xl font-black text-black border-b border-neutral-200 pb-4">
            Comments
            <span className="ml-2 text-base font-bold text-neutral-400">({comments.length})</span>
          </h2>

          {/* Comment form */}
          <form onSubmit={handleComment} id="comment-form" className="mb-10 flex flex-col gap-4 border border-neutral-200 p-6">
            <h3 className="text-sm font-bold text-black">Leave a comment</h3>
            {!user && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="comment-name" className="text-xs font-semibold text-neutral-500">Your name</label>
                <input
                  id="comment-name"
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="border border-neutral-200 px-4 py-2.5 text-sm text-black placeholder-neutral-400 outline-none focus:border-black"
                />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="comment-text" className="text-xs font-semibold text-neutral-500">Comment</label>
              <textarea
                id="comment-text"
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts…"
                required
                className="resize-y border border-neutral-200 px-4 py-3 text-sm text-black placeholder-neutral-400 outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                id="submit-comment"
                disabled={submittingComment || !commentText.trim() || !commentName.trim()}
                className="border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
              >
                {submittingComment ? 'Posting…' : 'Post Comment'}
              </button>
              {user && (
                <span className="text-xs text-neutral-400">Posting as <strong className="text-black">{user.name}</strong></span>
              )}
            </div>
          </form>

          {/* Comment list */}
          {comments.length === 0 ? (
            <p className="text-sm text-neutral-400 py-8 text-center border border-neutral-100 bg-neutral-50">
              No comments yet. Be the first to leave one!
            </p>
          ) : (
            <div className="flex flex-col gap-0 border border-neutral-200">
              {comments.map((comment, i) => (
                <div key={comment.id} className={`flex items-start gap-4 p-5 ${i < comments.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-black text-xs font-bold text-white">
                    {comment.authorInitials}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-black">{comment.authorName}</span>
                      <span className="text-xs text-neutral-400">{comment.date}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-600">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-black">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            All posts
          </Link>
          <button
            id="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-black"
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
