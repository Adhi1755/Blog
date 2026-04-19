import Link from 'next/link'
import type { Post } from '../data/posts'

export default function BlogCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex flex-col overflow-hidden bg-white transition-all duration-200 hover:bg-neutral-50 ${featured ? 'md:col-span-2' : ''}`}
    >
      <div className={`flex flex-1 flex-col gap-4 p-6 ${featured ? 'md:p-8' : ''}`}>
        {/* Meta row */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 bg-neutral-50">
            {post.category}
          </span>
          {featured && (
            <span className="inline-flex items-center gap-1.5 border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-neutral-500 bg-white">
              <span className="h-1.5 w-1.5 bg-black" />
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className={`font-bold leading-snug text-black transition-colors duration-150 group-hover:text-neutral-700 ${featured ? 'text-xl md:text-2xl' : 'text-base lg:text-lg'}`}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-500">
          {post.excerpt}
        </p>

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-black text-xs font-bold text-white">
              {post.author.initials.charAt(0)}
            </span>
            <span className="text-xs text-neutral-500 font-medium">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-neutral-400">
            <span>{post.date}</span>
            <span className="h-0.5 w-0.5 bg-neutral-300" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Hover arrow */}
      <div className="absolute bottom-5 right-5 flex h-7 w-7 items-center justify-center border border-neutral-200 bg-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:border-black">
        <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </Link>
  )
}
