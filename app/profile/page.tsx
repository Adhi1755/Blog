'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { usePosts } from '../hooks/usePosts'
import AppHeader from '../components/AppHeader'

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { posts, hydrated, deletePost } = usePosts()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, user, router])

  if (authLoading || !user) return null

  const myPosts = hydrated ? posts.filter((p) => p.author.name === user.name) : []
  const totalLikes = myPosts.reduce((sum, p) => sum + (p.likes ?? 0), 0)
  const totalViews = myPosts.reduce((sum, p) => sum + (p.views ?? 0), 0)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader />

      {/* ── Profile header ─────────────────────────────── */}
      <div className="border-b border-neutral-200">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Avatar + info */}
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-black bg-black text-2xl font-black text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-black text-black">{user.name}</h1>
                <p className="mt-0.5 text-sm text-neutral-500">{user.email}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-400">
                  <span><strong className="text-black">{myPosts.length}</strong> post{myPosts.length !== 1 ? 's' : ''}</span>
                  <span className="h-3 w-px bg-neutral-200" />
                  <span><strong className="text-black">{totalLikes}</strong> likes</span>
                  <span className="h-3 w-px bg-neutral-200" />
                  <span><strong className="text-black">{totalViews}</strong> views</span>
                </div>
              </div>
            </div>

            {/* New post CTA */}
            <Link
              href="/editor"
              className="inline-flex items-center gap-1.5 border border-black bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 shrink-0"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              New Post
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats row ──────────────────────────────────── */}
      {myPosts.length > 0 && (
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid grid-cols-2 divide-x divide-neutral-200 sm:grid-cols-4">
              {[
                { label: 'Total Posts',  value: myPosts.length },
                { label: 'Total Likes',  value: totalLikes },
                { label: 'Total Views',  value: totalViews },
                { label: 'Featured',     value: myPosts.filter((p) => p.featured).length },
              ].map(({ label, value }) => (
                <div key={label} className="px-6 py-5">
                  <p className="text-xl font-black text-black">{value}</p>
                  <p className="mt-0.5 text-xs font-medium text-neutral-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Posts list ─────────────────────────────────── */}
      <div className="flex-1 mx-auto w-full max-w-4xl px-6 py-8">
        <div className="flex items-center justify-between mb-6 pb-5 border-b border-neutral-200">
          <h2 className="text-sm font-black uppercase tracking-widest text-black">Your Posts</h2>
          <span className="text-xs text-neutral-400 font-medium">{myPosts.length} total</span>
        </div>

        {/* Loading skeleton */}
        {!hydrated ? (
          <div className="space-y-px border border-neutral-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-4 p-5 border-b border-neutral-100">
                <div className="h-16 w-24 bg-neutral-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-neutral-100" />
                  <div className="h-2.5 w-1/2 bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        ) : myPosts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-5 py-24 text-center border border-neutral-200">
            <div className="flex h-14 w-14 items-center justify-center border border-neutral-200 bg-neutral-50">
              <svg className="h-7 w-7 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-black">No posts yet</p>
              <p className="mt-1 text-xs text-neutral-400">Start writing your first article</p>
            </div>
            <Link
              href="/editor"
              className="border border-black bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800"
            >
              Write First Post
            </Link>
          </div>
        ) : (
          /* Post rows */
          <div className="border border-neutral-200 divide-y divide-neutral-100">
            {myPosts.map((post) => (
              <div
                key={post.slug}
                className="group flex items-start gap-4 p-5 transition-colors hover:bg-neutral-50"
              >
                {/* Thumbnail */}
                {post.thumbnail && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="h-16 w-24 shrink-0 object-cover border border-neutral-100 grayscale"
                  />
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="border border-neutral-200 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-neutral-500">
                      {post.category}
                    </span>
                    {post.featured && (
                      <span className="border border-black bg-black px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-black line-clamp-1">{post.title}</p>
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-1">{post.excerpt}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-neutral-400">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                    <span>·</span>
                    <span>{post.likes ?? 0} likes</span>
                    <span>·</span>
                    <span>{post.views ?? 0} views</span>
                  </div>
                </div>

                {/* Edit / Delete actions */}
                <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                  <Link
                    href={`/editor?edit=${post.slug}`}
                    id={`profile-edit-${post.slug}`}
                    title="Edit post"
                    className="flex h-8 w-8 items-center justify-center border border-neutral-200 text-neutral-500 transition-colors hover:border-black hover:bg-black hover:text-white"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                  </Link>
                  <button
                    id={`profile-delete-${post.slug}`}
                    onClick={() => deletePost(post.slug)}
                    title="Delete post"
                    className="flex h-8 w-8 items-center justify-center border border-neutral-200 text-neutral-500 transition-colors hover:border-neutral-400 hover:bg-neutral-100 hover:text-black"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
