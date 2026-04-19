'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import type { Post } from '../data/posts'
import { type DraftPost, CATEGORY_OPTIONS } from '../hooks/usePosts'

type Mode = 'add' | 'edit'

type PostEditorModalProps = {
  mode: Mode
  post?: Post | null
  onSave: (draft: DraftPost) => void
  onClose: () => void
}

const EMPTY_DRAFT: DraftPost = {
  title: '',
  excerpt: '',
  category: 'Next.js',
  categoryColor: 'violet',
  authorName: '',
  featured: false,
}

function postToDraft(post: Post): DraftPost {
  return {
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    categoryColor: post.categoryColor,
    authorName: post.author.name,
    featured: post.featured ?? false,
  }
}

export default function PostEditorModal({ mode, post, onSave, onClose }: PostEditorModalProps) {
  const [draft, setDraft] = useState<DraftPost>(
    mode === 'edit' && post ? postToDraft(post) : EMPTY_DRAFT
  )
  const [errors, setErrors] = useState<Partial<Record<keyof DraftPost, string>>>({})
  const [saving, setSaving] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  // Auto-focus title on open
  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 50)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function set<K extends keyof DraftPost>(key: K, value: DraftPost[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const errs: typeof errors = {}
    if (!draft.title.trim()) errs.title = 'Title is required'
    else if (draft.title.trim().length < 5) errs.title = 'Title must be at least 5 characters'
    if (!draft.excerpt.trim()) errs.excerpt = 'Excerpt / content is required'
    else if (draft.excerpt.trim().length < 20) errs.excerpt = 'Excerpt must be at least 20 characters'
    if (!draft.authorName.trim()) errs.authorName = 'Author name is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    onSave(draft)
    setSaving(false)
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose()
  }

  const inputBase = "w-full border bg-white px-4 py-3 text-sm text-black placeholder-neutral-400 outline-none transition-all"
  const inputNormal = "border-neutral-200 focus:border-black"
  const inputError = "border-neutral-400 focus:border-black"

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'add' ? 'New post' : 'Edit post'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-neutral-200 bg-white shadow-2xl shadow-black/10">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-8 py-5">
          <div>
            <h2 className="text-lg font-black text-black">
              {mode === 'add' ? 'New Post' : 'Edit Post'}
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              {mode === 'add' ? 'Fill in the details to create a new post' : 'Update the post details below'}
            </p>
          </div>
          <button
            id="editor-close"
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="flex h-8 w-8 items-center justify-center border border-neutral-200 text-neutral-400 transition-colors hover:border-black hover:bg-black hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form id="post-editor-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 p-8">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="editor-title" className="text-sm font-semibold text-black">
              Title <span className="text-neutral-400 font-normal">*</span>
            </label>
            <input
              id="editor-title"
              ref={titleRef}
              type="text"
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Enter a compelling post title…"
              aria-invalid={!!errors.title}
              className={`${inputBase} ${errors.title ? inputError : inputNormal}`}
            />
            {errors.title && (
              <p role="alert" className="flex items-center gap-1 text-xs text-black font-medium">
                <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="editor-excerpt" className="text-sm font-semibold text-black">
                Excerpt / Content <span className="text-neutral-400 font-normal">*</span>
              </label>
              <span className="text-xs text-neutral-400">{draft.excerpt.length} chars</span>
            </div>
            <textarea
              id="editor-excerpt"
              rows={5}
              value={draft.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              placeholder="Write a short description or the body of your post…"
              aria-invalid={!!errors.excerpt}
              className={`w-full resize-y border bg-white px-4 py-3 text-sm text-black placeholder-neutral-400 outline-none transition-all ${errors.excerpt ? inputError : inputNormal}`}
            />
            {errors.excerpt && (
              <p role="alert" className="flex items-center gap-1 text-xs text-black font-medium">
                <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.excerpt}
              </p>
            )}
          </div>

          {/* Category + Author row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="editor-category" className="text-sm font-semibold text-black">
                Category
              </label>
              <select
                id="editor-category"
                value={draft.category}
                onChange={(e) => {
                  const found = CATEGORY_OPTIONS.find((c) => c.label === e.target.value)
                  set('category', e.target.value)
                  set('categoryColor', found?.color ?? 'violet')
                }}
                className="w-full border border-neutral-200 bg-white px-4 py-3 text-sm text-black outline-none transition-all focus:border-black"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.label} value={c.label}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="editor-author" className="text-sm font-semibold text-black">
                Author name <span className="text-neutral-400 font-normal">*</span>
              </label>
              <input
                id="editor-author"
                type="text"
                value={draft.authorName}
                onChange={(e) => set('authorName', e.target.value)}
                placeholder="Your name"
                aria-invalid={!!errors.authorName}
                className={`${inputBase} ${errors.authorName ? inputError : inputNormal}`}
              />
              {errors.authorName && (
                <p role="alert" className="flex items-center gap-1 text-xs text-black font-medium">
                  <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.authorName}
                </p>
              )}
            </div>
          </div>

          {/* Featured toggle */}
          <label className="flex cursor-pointer items-center justify-between border border-neutral-200 bg-neutral-50 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-black">Mark as Featured</p>
              <p className="text-xs text-neutral-500 mt-0.5">Featured posts appear prominently at the top of the grid</p>
            </div>
            <div
              role="switch"
              id="editor-featured"
              aria-checked={draft.featured}
              onClick={() => set('featured', !draft.featured)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                draft.featured ? 'bg-black' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform bg-white shadow-sm transition-transform duration-200 ${
                  draft.featured ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </label>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-neutral-200 pt-4">
            <button
              id="editor-cancel"
              type="button"
              onClick={onClose}
              className="border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-600 transition-all hover:border-neutral-400 hover:bg-neutral-50 hover:text-black"
            >
              Cancel
            </button>
            <button
              id="editor-save"
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-70"
            >
              {saving ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : mode === 'add' ? (
                'Publish Post'
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
