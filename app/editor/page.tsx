'use client'

import { useState, FormEvent, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../context/AuthContext'
import { usePosts, CATEGORY_OPTIONS, type DraftPost } from '../hooks/usePosts'
import AppHeader from '../components/AppHeader'

const C = {
  bg:      '#F7F7F7',
  surface: '#FFFFFF',
  dark:    '#111111',
  muted:   '#6B6B6B',
  accent:  '#FF6A00',
  accentD: 'rgba(255,106,0,0.09)',
  border:  '#DCDCDC',
  error:   '#D93025',
}

const inputStyle = (hasError?: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '10px 14px',
  fontSize: 13,
  color: C.dark,
  background: hasError ? '#fff5f5' : C.surface,
  border: `1.5px solid ${hasError ? C.error : C.border}`,
  borderRadius: 8,
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color .18s, background .18s',
  boxSizing: 'border-box' as const,
})

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: C.muted,
  display: 'block', marginBottom: 8,
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
      <p style={{ ...labelStyle, marginBottom: 14, color: C.muted }}>{title}</p>
      {children}
    </div>
  )
}

function EditorContent() {
  const router      = useRouter()
  const searchParams = useSearchParams()
  const editSlug    = searchParams.get('edit')
  const { user, loading: authLoading } = useAuth()
  const { posts, addPost, updatePost, hydrated } = usePosts()

  const [title, setTitle]           = useState('')
  const [excerpt, setExcerpt]       = useState('')
  const [content, setContent]       = useState('')
  const [category, setCategory]     = useState('')
  const [categoryColor, setCategoryColor] = useState('violet')
  const [thumbnail, setThumbnail]   = useState('')
  const [tagsInput, setTagsInput]   = useState('')
  const [featured, setFeatured]     = useState(false)
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)
  const [errors, setErrors]         = useState<Record<string, string>>({})
  const [predicting, setPredicting] = useState(false)
  const [predictError, setPredictError] = useState('')
  const titleRef   = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  function insertFormatting(type: string) {
    if (!contentRef.current) return
    const ta = contentRef.current
    const start = ta.selectionStart, end = ta.selectionEnd
    const sel = content.slice(start, end)
    let before = '', after = ''
    switch (type) {
      case 'Heading': before = '### '; break
      case 'Bold':    before = '**'; after = '**'; break
      case 'Italic':  before = '_';  after = '_';  break
      case 'List':    before = '- '; break
      case 'Code':    before = '`';  after = '`';  break
      case 'Link':    before = '[';  after = '](https://)'; break
    }
    const newText = content.slice(0, start) + before + sel + after + content.slice(end)
    setContent(newText)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + before.length, start + before.length + sel.length) }, 0)
  }

  useEffect(() => { if (!authLoading && !user) router.replace('/login') }, [authLoading, user, router])
  useEffect(() => {
    if (!editSlug || !hydrated) return
    const post = posts.find(p => p.slug === editSlug)
    if (!post) return
    /* eslint-disable react-hooks/set-state-in-effect */
    setTitle(post.title); setExcerpt(post.excerpt)
    setContent(post.body?.map(b => ('text' in b ? b.text : '')).join('\n\n') ?? '')
    setCategory(post.category); setCategoryColor(post.categoryColor)
    setThumbnail(post.thumbnail ?? ''); setTagsInput((post.tags ?? []).join(', '))
    setFeatured(post.featured ?? false)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [editSlug, hydrated, posts])
  useEffect(() => { titleRef.current?.focus() }, [])

  async function predictCategory() {
  if (!title.trim() && !excerpt.trim()) {
    setPredictError('Add a title or summary first.')
    return
  }

  setPredicting(true)
  setPredictError('')

  try {
    const res = await fetch('https://blogengine-zovn.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title.trim(),
        description: excerpt.trim()
      }),
    })

    if (!res.ok) throw new Error(`API error ${res.status}`)

    const data = await res.json()

    console.log("API Response:", data) // 🔥 DEBUG

    const predicted: string = data.prediction ?? ''

    if (!predicted) throw new Error('No category returned')

    const match = CATEGORY_OPTIONS.find(
      c => c.label.toLowerCase() === predicted.toLowerCase()
    )

    setCategory(predicted)
    setCategoryColor(match?.color ?? 'violet')

  } catch (err) {
    setPredictError(err instanceof Error ? err.message : 'Prediction failed')
  } finally {
    setPredicting(false)
  }
}

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!title.trim()) e.title = 'Title is required'
    else if (title.trim().length < 5) e.title = 'At least 5 characters'
    if (!excerpt.trim()) e.excerpt = 'Summary is required'
    else if (excerpt.trim().length < 20) e.excerpt = 'At least 20 characters'
    if (!content.trim()) e.content = 'Content is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handlePublish(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const draft: DraftPost = { title, excerpt, content, category, categoryColor, authorName: user?.name ?? 'Anonymous', featured, thumbnail: thumbnail || undefined, tags }
    if (editSlug) { updatePost(editSlug, draft); setSaving(false); setSaved(true); setTimeout(() => router.push(`/blog/${editSlug}`), 800) }
    else { const post = addPost(draft); setSaving(false); setSaved(true); setTimeout(() => router.push(`/blog/${post.slug}`), 800) }
  }

  async function handleSaveDraft(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setErrors({ title: 'Title is required to save a draft' }); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const draft: DraftPost = { title, excerpt: excerpt || 'Draft — no summary yet.', content, category, categoryColor, authorName: user?.name ?? 'Anonymous', featured, thumbnail: thumbnail || undefined, tags }
    if (!editSlug) addPost(draft)
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  if (authLoading || !user) return null

  const isEdit = !!editSlug

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <AppHeader />

      {/* Sub-bar */}
      <div style={{ position: 'sticky', top: 56, zIndex: 40, background: 'rgba(247,247,247,0.95)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,3vw,40px)', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: C.muted, textDecoration: 'none', transition: 'color .18s' }}
              onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Feed
            </Link>
            <span style={{ width: 1, height: 14, background: C.border }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: C.dark, letterSpacing: '0.06em' }}>
              {isEdit ? 'Edit Post' : 'New Post'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {saved && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#2E8B57', fontWeight: 600 }}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </span>
            )}
            <button type="button" onClick={handleSaveDraft} disabled={saving}
              style={{ border: `1.5px solid ${C.border}`, borderRadius: 7, padding: '6px 14px', fontSize: 11, fontWeight: 700, color: C.muted, background: 'transparent', cursor: saving ? 'not-allowed' : 'pointer', transition: 'border-color .18s, color .18s', fontFamily: 'inherit', opacity: saving ? 0.5 : 1 }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.color = C.dark } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
              Save Draft
            </button>
            <button type="submit" form="editor-form" disabled={saving}
              style={{ border: 'none', borderRadius: 7, padding: '6px 18px', fontSize: 11, fontWeight: 700, color: '#fff', background: saving ? '#555' : C.dark, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background .18s, transform .15s', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}
              onMouseEnter={e => { if (!saving) { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (!saving) { e.currentTarget.style.background = C.dark; e.currentTarget.style.transform = 'none' } }}>
              {saving ? 'Publishing…' : isEdit ? 'Update Post' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <form id="editor-form" onSubmit={handlePublish} noValidate>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(16px,3vw,40px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }} className="editor-layout">

            {/* ── Main editor column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Title */}
              <div style={{ background: C.surface, border: `1px solid ${errors.title ? C.error : C.border}`, borderRadius: 10, padding: '4px 20px 20px', transition: 'border-color .18s' }}>
                <input
                  id="editor-title"
                  ref={titleRef}
                  type="text"
                  value={title}
                  onChange={e => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: '' })) }}
                  placeholder="Post title…"
                  style={{
                    width: '100%', border: 'none', background: 'transparent', outline: 'none',
                    fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: 800, letterSpacing: '-0.03em',
                    color: C.dark, paddingTop: 20, paddingBottom: 4,
                    fontFamily: 'inherit', caretColor: C.accent,
                    boxSizing: 'border-box',
                  }}
                />
                {errors.title && <p style={{ fontSize: 11, color: C.error, fontWeight: 500, marginTop: 4 }}>{errors.title}</p>}
              </div>

              {/* Summary */}
              <div>
                <label htmlFor="editor-excerpt" style={labelStyle}>Summary</label>
                <textarea
                  id="editor-excerpt" rows={3} value={excerpt}
                  onChange={e => { setExcerpt(e.target.value); setErrors(prev => ({ ...prev, excerpt: '' })) }}
                  placeholder="A brief summary that appears on blog cards and search results…"
                  style={{ ...inputStyle(!!errors.excerpt), resize: 'vertical', lineHeight: 1.7 }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.dark }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.excerpt ? C.error : C.border }}
                />
                {errors.excerpt && <p style={{ fontSize: 11, color: C.error, fontWeight: 500, marginTop: 5 }}>{errors.excerpt}</p>}
              </div>

              {/* Content */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label htmlFor="editor-content" style={{ ...labelStyle, marginBottom: 0 }}>Content</label>
                  <span style={{ fontSize: 11, color: C.muted }}>{content.length} chars</span>
                </div>
                {/* Toolbar */}
                <div style={{ display: 'flex', gap: 6, background: C.bg, border: `1.5px solid ${C.border}`, borderBottom: 'none', borderRadius: '8px 8px 0 0', padding: '8px 12px', flexWrap: 'wrap' }}>
                  {['Heading', 'Bold', 'Italic', 'List', 'Code', 'Link'].map(t => (
                    <button key={t} type="button"
                      onMouseDown={e => { e.preventDefault(); insertFormatting(t) }}
                      style={{
                        fontSize: 11, fontWeight: 600, color: C.muted,
                        border: `1px solid ${C.border}`, borderRadius: 5,
                        padding: '3px 10px', background: C.surface,
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'border-color .15s, color .15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.color = C.dark }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                      {t}
                    </button>
                  ))}
                </div>
                <textarea
                  id="editor-content" ref={contentRef} rows={20} value={content}
                  onChange={e => { setContent(e.target.value); setErrors(prev => ({ ...prev, content: '' })) }}
                  placeholder="Write your full post here. Use Markdown-style formatting — ### for headings, **bold**, `code`, - for lists…"
                  style={{
                    ...inputStyle(!!errors.content),
                    borderRadius: '0 0 8px 8px',
                    resize: 'vertical', lineHeight: 1.8,
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    fontSize: 13,
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.dark }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.content ? C.error : C.border }}
                />
                {errors.content && <p style={{ fontSize: 11, color: C.error, fontWeight: 500, marginTop: 5 }}>{errors.content}</p>}
              </div>
            </div>

            {/* ── Sidebar ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Publish settings */}
              <SideCard title="Publish Settings">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>Author</span>
                    <span style={{ fontSize: 12, color: C.muted }}>{user.name}</span>
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: C.dark, marginBottom: 2 }}>Featured</p>
                      <p style={{ fontSize: 11, color: C.muted }}>Highlight on homepage</p>
                    </div>
                    <button type="button" role="switch" aria-checked={featured} onClick={() => setFeatured(f => !f)}
                      style={{
                        position: 'relative', width: 42, height: 24, borderRadius: 100,
                        background: featured ? C.dark : C.border, border: 'none',
                        cursor: 'pointer', transition: 'background .2s', flexShrink: 0,
                      }}>
                      <span style={{
                        position: 'absolute', top: 3, left: featured ? 21 : 3,
                        width: 18, height: 18, borderRadius: '50%', background: '#fff',
                        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        display: 'block',
                      }} />
                    </button>
                  </div>
                </div>
              </SideCard>

              {/* Category — AI predicted */}
              <SideCard title="Category">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <p style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>
                    Click below to auto-detect the category from your title &amp; summary using AI.
                  </p>

                  {/* Predicted badge */}
                  {category ? (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      background: C.accentD, border: `1.5px solid ${C.accent}33`,
                      borderRadius: 8, padding: '10px 14px',
                    }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={C.accent} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, letterSpacing: '0.01em' }}>
                        {category}
                      </span>
                    </div>
                  ) : (
                    <div style={{
                      background: C.bg, border: `1.5px dashed ${C.border}`,
                      borderRadius: 8, padding: '10px 14px',
                      fontSize: 12, color: C.muted, textAlign: 'center',
                    }}>
                      Not predicted yet
                    </div>
                  )}

                  {/* Predict button */}
                  <button
                    id="predict-category-btn"
                    type="button"
                    onClick={predictCategory}
                    disabled={predicting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      width: '100%', border: 'none', borderRadius: 8,
                      padding: '9px 14px', fontSize: 11, fontWeight: 700,
                      color: '#fff', background: predicting ? '#888' : C.dark,
                      cursor: predicting ? 'not-allowed' : 'pointer',
                      transition: 'background .18s, transform .15s',
                      fontFamily: 'inherit', opacity: predicting ? 0.7 : 1,
                    }}
                    onMouseEnter={e => { if (!predicting) { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                    onMouseLeave={e => { if (!predicting) { e.currentTarget.style.background = C.dark; e.currentTarget.style.transform = 'none' } }}
                  >
                    {predicting ? (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
                          style={{ animation: 'spin 1s linear infinite' }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Predicting…
                      </>
                    ) : (
                      <>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {category ? 'Re-predict Category' : 'Predict Category'}
                      </>
                    )}
                  </button>

                  {predictError && (
                    <p style={{ fontSize: 11, color: C.error, fontWeight: 500 }}>{predictError}</p>
                  )}
                </div>
              </SideCard>

              {/* Thumbnail */}
              <SideCard title="Thumbnail URL">
                <input
                  id="editor-thumbnail" type="url" value={thumbnail}
                  onChange={e => setThumbnail(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={inputStyle()}
                  onFocus={e => (e.currentTarget.style.borderColor = C.dark)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                />
                {thumbnail && (
                  <div style={{ marginTop: 10, borderRadius: 7, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnail} alt="Preview" style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  </div>
                )}
              </SideCard>

              {/* Tags */}
              <SideCard title="Tags">
                <input
                  id="editor-tags" type="text" value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="React, TypeScript, UX"
                  style={inputStyle()}
                  onFocus={e => (e.currentTarget.style.borderColor = C.dark)}
                  onBlur={e => (e.currentTarget.style.borderColor = C.border)}
                />
                <p style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>Comma-separated</p>
                {tagsInput && (
                  <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {tagsInput.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} style={{ fontSize: 11, fontWeight: 500, color: C.accent, background: C.accentD, padding: '3px 9px', borderRadius: 100 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </SideCard>

              {/* Cancel (edit mode) */}
              {isEdit && (
                <SideCard title="Danger Zone">
                  <Link href="/dashboard" style={{
                    display: 'block', textAlign: 'center', border: `1.5px solid ${C.border}`,
                    borderRadius: 8, padding: '10px', fontSize: 12, fontWeight: 600,
                    color: C.muted, textDecoration: 'none',
                    transition: 'border-color .18s, color .18s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.color = C.dark }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                    Cancel &amp; Go Back
                  </Link>
                </SideCard>
              )}
            </div>
          </div>
        </div>
      </form>

      <style jsx global>{`
        @media (max-width: 768px) {
          .editor-layout { grid-template-columns: 1fr !important; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F7F7F7' }} />}>
      <EditorContent />
    </Suspense>
  )
}
