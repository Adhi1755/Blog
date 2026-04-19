'use client'

import { useState, FormEvent, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { usePosts, CATEGORY_OPTIONS, type DraftPost } from '../hooks/usePosts'

export default function EditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editSlug = searchParams.get('edit')
  const { user, loading: authLoading } = useAuth()
  const { posts, addPost, updatePost, hydrated } = usePosts()

  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Next.js')
  const [categoryColor, setCategoryColor] = useState('violet')
  const [thumbnail, setThumbnail] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [featured, setFeatured] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const titleRef = useRef<HTMLInputElement>(null)

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, user, router])

  // Populate form for edit mode
  useEffect(() => {
    if (!editSlug || !hydrated) return
    const post = posts.find((p) => p.slug === editSlug)
    if (!post) return
    setTitle(post.title)
    setExcerpt(post.excerpt)
    setContent(post.body?.map((b) => ('text' in b ? b.text : '')).join('\n\n') ?? '')
    setCategory(post.category)
    setCategoryColor(post.categoryColor)
    setThumbnail(post.thumbnail ?? '')
    setTagsInput((post.tags ?? []).join(', '))
    setFeatured(post.featured ?? false)
  }, [editSlug, hydrated, posts])

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    else if (title.trim().length < 5) e.title = 'Title must be at least 5 characters'
    if (!excerpt.trim()) e.excerpt = 'Summary is required'
    else if (excerpt.trim().length < 20) e.excerpt = 'Summary must be at least 20 characters'
    if (!content.trim()) e.content = 'Content is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handlePublish(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))

    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    const draft: DraftPost = {
      title,
      excerpt,
      content,
      category,
      categoryColor,
      authorName: user?.name ?? 'Anonymous',
      featured,
      thumbnail: thumbnail || undefined,
      tags,
    }

    if (editSlug) {
      updatePost(editSlug, draft)
      setSaving(false)
      setSaved(true)
      setTimeout(() => router.push(`/blog/${editSlug}`), 800)
    } else {
      const post = addPost(draft)
      setSaving(false)
      setSaved(true)
      setTimeout(() => router.push(`/blog/${post.slug}`), 800)
    }
  }

  async function handleSaveDraft(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setErrors({ title: 'Title is required to save a draft' }); return }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
    const draft: DraftPost = {
      title,
      excerpt: excerpt || 'Draft — no summary yet.',
      content,
      category,
      categoryColor,
      authorName: user?.name ?? 'Anonymous',
      featured,
      thumbnail: thumbnail || undefined,
      tags,
    }
    if (!editSlug) addPost(draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (authLoading || !user) return null

  const isEdit = !!editSlug

  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-black transition-colors">
              ← Back
            </Link>
            <span className="text-neutral-200">|</span>
            <span className="text-sm font-semibold text-black">
              {isEdit ? 'Edit Post' : 'New Post'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-600 transition-all hover:border-neutral-400 hover:bg-neutral-50 disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              type="submit"
              form="editor-form"
              disabled={saving}
              className="border border-black bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
            >
              {saving ? 'Publishing…' : isEdit ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </div>
      </div>

      <form id="editor-form" onSubmit={handlePublish} noValidate>
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* Main editor */}
            <div className="flex flex-col gap-6 lg:col-span-2">

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <input
                  id="editor-title"
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrors((prev) => ({ ...prev, title: '' })) }}
                  placeholder="Post title…"
                  className="w-full border-0 border-b border-neutral-200 bg-transparent py-3 text-3xl font-black text-black placeholder-neutral-300 outline-none transition-colors focus:border-black"
                />
                {errors.title && <p className="text-xs font-medium text-black">{errors.title}</p>}
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="editor-excerpt" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Summary</label>
                <textarea
                  id="editor-excerpt"
                  rows={3}
                  value={excerpt}
                  onChange={(e) => { setExcerpt(e.target.value); setErrors((prev) => ({ ...prev, excerpt: '' })) }}
                  placeholder="A concise summary that appears on blog cards and search results…"
                  className="w-full resize-y border border-neutral-200 bg-white px-4 py-3 text-sm text-black placeholder-neutral-400 outline-none transition-colors focus:border-black"
                />
                {errors.excerpt && <p className="text-xs font-medium text-black">{errors.excerpt}</p>}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="editor-content" className="text-xs font-bold uppercase tracking-widest text-neutral-400">Content</label>
                  <span className="text-xs text-neutral-400">{content.length} chars</span>
                </div>
                {/* Toolbar hint */}
                <div className="flex gap-2 border border-b-0 border-neutral-200 bg-neutral-50 px-3 py-2">
                  {['Heading', 'Bold', 'Italic', 'List', 'Code', 'Link'].map((t) => (
                    <span key={t} className="text-xs text-neutral-400 font-medium border border-neutral-200 px-2 py-0.5 bg-white">
                      {t}
                    </span>
                  ))}
                </div>
                <textarea
                  id="editor-content"
                  rows={18}
                  value={content}
                  onChange={(e) => { setContent(e.target.value); setErrors((prev) => ({ ...prev, content: '' })) }}
                  placeholder="Write your full post content here. Use Markdown-style formatting — # for headings, **bold**, `code`, - for lists…"
                  className="w-full resize-y border border-neutral-200 bg-white px-4 py-4 text-sm leading-7 text-black placeholder-neutral-400 outline-none transition-colors focus:border-black font-mono"
                />
                {errors.content && <p className="text-xs font-medium text-black">{errors.content}</p>}
              </div>
            </div>

            {/* Sidebar settings */}
            <div className="flex flex-col gap-5">

              {/* Publish box */}
              <div className="border border-neutral-200 p-5">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">Publish Settings</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-black">Author</span>
                    <span className="text-sm text-neutral-500">{user.name}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                    <div>
                      <p className="text-sm font-semibold text-black">Featured</p>
                      <p className="text-xs text-neutral-400">Show on homepage hero</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={featured}
                      onClick={() => setFeatured((f) => !f)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 ${featured ? 'bg-black' : 'bg-neutral-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 bg-white shadow-sm transition-transform duration-200 ${featured ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="border border-neutral-200 p-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">Category</h3>
                <select
                  id="editor-category"
                  value={category}
                  onChange={(e) => {
                    const found = CATEGORY_OPTIONS.find((c) => c.label === e.target.value)
                    setCategory(e.target.value)
                    setCategoryColor(found?.color ?? 'violet')
                  }}
                  className="w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.label} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Thumbnail */}
              <div className="border border-neutral-200 p-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">Thumbnail URL</h3>
                <input
                  id="editor-thumbnail"
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm text-black placeholder-neutral-400 outline-none focus:border-black"
                />
                {thumbnail && (
                  <div className="mt-3 overflow-hidden border border-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnail} alt="Thumbnail preview" className="h-28 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="border border-neutral-200 p-5">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">Tags</h3>
                <input
                  id="editor-tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, TypeScript, Performance"
                  className="w-full border border-neutral-200 bg-white px-3 py-2.5 text-sm text-black placeholder-neutral-400 outline-none focus:border-black"
                />
                <p className="mt-1.5 text-xs text-neutral-400">Comma-separated</p>
                {/* Tag preview */}
                {tagsInput && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tagsInput.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Danger zone (edit mode) */}
              {isEdit && (
                <div className="border border-neutral-200 p-5">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-400">Danger Zone</h3>
                  <Link
                    href="/dashboard"
                    className="block w-full border border-neutral-200 py-2.5 text-center text-sm font-semibold text-neutral-500 transition-all hover:border-neutral-400 hover:text-black"
                  >
                    Cancel & Go Back
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
