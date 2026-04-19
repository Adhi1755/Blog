import Link from 'next/link'
import type { Post } from '../data/posts'

const categoryStyles: Record<string, string> = {
  violet: 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30',
  sky: 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30',
  blue: 'bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30',
  cyan: 'bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
  orange: 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30',
}

const glowStyles: Record<string, string> = {
  violet: 'group-hover:shadow-violet-500/20',
  sky: 'group-hover:shadow-sky-500/20',
  blue: 'group-hover:shadow-blue-500/20',
  cyan: 'group-hover:shadow-cyan-500/20',
  emerald: 'group-hover:shadow-emerald-500/20',
  orange: 'group-hover:shadow-orange-500/20',
}

const accentStyles: Record<string, string> = {
  violet: 'from-violet-500 to-indigo-500',
  sky: 'from-sky-500 to-cyan-500',
  blue: 'from-blue-500 to-blue-700',
  cyan: 'from-cyan-500 to-teal-500',
  emerald: 'from-emerald-500 to-green-600',
  orange: 'from-orange-500 to-amber-500',
}

type BlogCardProps = {
  post: Post
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const category = categoryStyles[post.categoryColor] ?? categoryStyles.violet
  const glow = glowStyles[post.categoryColor] ?? glowStyles.violet
  const accent = accentStyles[post.categoryColor] ?? accentStyles.violet

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl ${glow} ${featured ? 'md:col-span-2' : ''}`}
    >
      {/* Top accent bar */}
      <div className={`h-px w-full bg-gradient-to-r ${accent} opacity-60 transition-opacity duration-300 group-hover:opacity-100`} />

      <div className={`flex flex-col gap-4 p-6 ${featured ? 'md:p-8' : ''}`}>
        {/* Meta row */}
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${category}`}>
            {post.category}
          </span>
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-400 ring-1 ring-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h2
          className={`font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-violet-200 ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">
          {post.excerpt}
        </p>

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${post.author.avatarColor}`}
            >
              {post.author.initials}
            </span>
            <span className="text-xs text-gray-400">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{post.date}</span>
            <span className="h-0.5 w-0.5 rounded-full bg-gray-600" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Hover arrow indicator */}
      <div
        className={`absolute bottom-6 right-6 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${accent} opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  )
}
