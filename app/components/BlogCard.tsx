import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '../data/posts'

export default function BlogCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex flex-col overflow-hidden bg-white transition-all duration-200 hover:bg-neutral-50 ${featured ? 'md:col-span-2' : ''}`}
    >
      {/* Thumbnail */}
      {post.thumbnail && (
        <div className={`relative overflow-hidden border-b border-neutral-100 ${featured ? 'h-52 md:h-64' : 'h-44'}`}>
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className={`flex flex-1 flex-col gap-3 p-6 ${featured ? 'md:p-7' : ''}`}>
        {/* Meta row */}
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
            {post.category}
          </span>
          {featured && (
            <span className="inline-flex items-center gap-1.5 border border-neutral-200 px-2.5 py-0.5 text-xs font-semibold text-neutral-500">
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
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-500">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="border border-neutral-100 bg-neutral-50 px-2 py-0.5 text-xs text-neutral-400">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center bg-black text-xs font-bold text-white">
              {post.author.initials.charAt(0)}
            </span>
            <span className="text-xs text-neutral-500 font-medium">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span>{post.date}</span>
            <span className="h-0.5 w-0.5 bg-neutral-300" />
            <span>{post.readTime}</span>
            {post.likes !== undefined && (
              <>
                <span className="h-0.5 w-0.5 bg-neutral-300" />
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likes}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
