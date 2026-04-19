'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from '../data/posts'
import { usePosts, type DraftPost, CATEGORY_OPTIONS } from '../hooks/usePosts'
import PostEditorModal from '../components/PostEditorModal'
import DeleteConfirmDialog from '../components/DeleteConfirmDialog'
import { useAuth } from '../context/AuthContext'

// ── Tiny stat card ────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  accent: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 p-5 backdrop-blur-sm`}>
      <div className={`mb-3 inline-flex items-center justify-center rounded-xl p-2.5 ${accent}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

// ── Category pill ─────────────────────────────────────────────
const catStyles: Record<string, string> = {
  violet: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
  sky: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  blue: 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  orange: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
}

// ── Post row ─────────────────────────────────────────────────
function PostRow({
  post,
  index,
  onEdit,
  onDelete,
}: {
  post: Post
  index: number
  onEdit: (post: Post) => void
  onDelete: (post: Post) => void
}) {
  return (
    <tr className="group border-b border-white/5 transition-colors hover:bg-white/[0.02]">
      <td className="py-4 pr-4 pl-5 text-sm text-gray-600 tabular-nums">{index + 1}</td>
      <td className="py-4 pr-6 max-w-xs">
        <div className="flex flex-col gap-1">
          <span className="line-clamp-1 text-sm font-medium text-white leading-snug">{post.title}</span>
          <span className="line-clamp-1 text-xs text-gray-500">{post.excerpt}</span>
        </div>
      </td>
      <td className="py-4 pr-6 hidden sm:table-cell">
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${catStyles[post.categoryColor] ?? catStyles.violet}`}>
          {post.category}
        </span>
      </td>
      <td className="py-4 pr-6 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${post.author.avatarColor}`}>
            {post.author.initials}
          </span>
          <span className="text-xs text-gray-400">{post.author.name}</span>
        </div>
      </td>
      <td className="py-4 pr-6 hidden lg:table-cell">
        <span className="text-xs text-gray-500">{post.date}</span>
      </td>
      <td className="py-4 pr-6 hidden lg:table-cell">
        <span className="text-xs text-gray-500">{post.readTime}</span>
      </td>
      <td className="py-4 pr-6 hidden md:table-cell">
        {post.featured ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-300 ring-1 ring-violet-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            Featured
          </span>
        ) : (
          <span className="text-xs text-gray-600">—</span>
        )}
      </td>
      <td className="py-4 pr-5">
        <div className="flex items-center gap-2 opacity-60 transition-opacity group-hover:opacity-100">
          <button
            id={`edit-post-${post.slug}`}
            aria-label={`Edit "${post.title}"`}
            onClick={() => onEdit(post)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-violet-500/20 hover:text-violet-300"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button
            id={`delete-post-${post.slug}`}
            aria-label={`Delete "${post.title}"`}
            onClick={() => onDelete(post)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Main Dashboard ────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { posts, hydrated, addPost, updatePost, deletePost, resetToSeed } = usePosts()

  // ── Auth guard: redirect to /login if not authenticated ──
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [authLoading, user, router])

  // UI state
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorMode, setEditorMode] = useState<'add' | 'edit'>('add')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Derived
  const filtered = useMemo(() => {
    let list = posts
    if (categoryFilter !== 'All') list = list.filter((p) => p.category === categoryFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q)
      )
    }
    return list
  }, [posts, search, categoryFilter])

  const featuredCount = posts.filter((p) => p.featured).length
  const categories = ['All', ...CATEGORY_OPTIONS.map((c) => c.label)]

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Handlers ─────────────────────────────────────────────
  function openAdd() {
    setEditorMode('add')
    setEditingPost(null)
    setEditorOpen(true)
  }

  function openEdit(post: Post) {
    setEditorMode('edit')
    setEditingPost(post)
    setEditorOpen(true)
  }

  function handleSave(draft: DraftPost) {
    if (editorMode === 'add') {
      addPost(draft)
      showToast('Post published successfully!')
    } else if (editingPost) {
      updatePost(editingPost.slug, draft)
      showToast('Post updated successfully!')
    }
    setEditorOpen(false)
    setEditingPost(null)
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    deletePost(deleteTarget.slug)
    showToast(`"${deleteTarget.title.slice(0, 40)}…" deleted.`, 'error')
    setDeleteTarget(null)
  }

  // ── Loading / auth skeleton ───────────────────────────
  if (authLoading || !user || !hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded-xl bg-white/10" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-white/5" />)}
          </div>
          <div className="h-96 rounded-2xl bg-white/5" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* ── Toast ─────────────────────────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-sm transition-all ${
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
              : 'border-red-500/30 bg-red-500/15 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {/* ── Page header ───────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-violet-400">
            Content Management
          </p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, <span className="text-gray-300">{user.name.split(' ')[0]}</span> · {posts.length} post{posts.length !== 1 ? 's' : ''} · {featuredCount} featured
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="reset-posts"
            onClick={resetToSeed}
            title="Reset to sample data"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-gray-400 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Reset
          </button>
          <button
            id="new-post"
            onClick={openAdd}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Post
          </button>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Posts"
          value={posts.length}
          accent="bg-violet-500/15"
          icon={<svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /></svg>}
        />
        <StatCard
          label="Featured"
          value={featuredCount}
          accent="bg-indigo-500/15"
          icon={<svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
        />
        <StatCard
          label="Categories"
          value={new Set(posts.map((p) => p.category)).size}
          accent="bg-sky-500/15"
          icon={<svg className="h-5 w-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>}
        />
        <StatCard
          label="Authors"
          value={new Set(posts.map((p) => p.author.name)).size}
          accent="bg-emerald-500/15"
          icon={<svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
        />
      </div>

      {/* ── Filters ───────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative max-w-sm flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
            </svg>
          </span>
          <input
            id="dashboard-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Category tabs */}
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-${cat.toLowerCase().replace('.', '')}`}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-violet-600 text-white'
                  : 'border border-white/10 bg-white/5 text-gray-400 hover:border-violet-500/40 hover:text-violet-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-sm">
        {filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
              <svg className="h-7 w-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">
                {search || categoryFilter !== 'All' ? 'No posts match your filters' : 'No posts yet'}
              </p>
              <p className="mt-1 text-xs text-gray-600">
                {search || categoryFilter !== 'All'
                  ? 'Try adjusting your search or category filter'
                  : 'Click "New Post" to publish your first post'}
              </p>
            </div>
            {!search && categoryFilter === 'All' && (
              <button
                onClick={openAdd}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-indigo-500"
              >
                New Post
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="py-3 pr-4 pl-5 text-left text-xs font-medium uppercase tracking-wider text-gray-600">#</th>
                  <th className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Post</th>
                  <th className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-gray-600 hidden sm:table-cell">Category</th>
                  <th className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-gray-600 hidden md:table-cell">Author</th>
                  <th className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-gray-600 hidden lg:table-cell">Read time</th>
                  <th className="py-3 pr-6 text-left text-xs font-medium uppercase tracking-wider text-gray-600 hidden md:table-cell">Status</th>
                  <th className="py-3 pr-5 text-left text-xs font-medium uppercase tracking-wider text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, i) => (
                  <PostRow
                    key={post.slug}
                    post={post}
                    index={i}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-right text-xs text-gray-600">
        Showing {filtered.length} of {posts.length} posts
      </p>

      {/* ── Modals ─────────────────────────────────────── */}
      {editorOpen && (
        <PostEditorModal
          mode={editorMode}
          post={editingPost}
          onSave={handleSave}
          onClose={() => { setEditorOpen(false); setEditingPost(null) }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmDialog
          title={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
