export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  categoryColor: string
  author: {
    name: string
    initials: string
    avatarColor: string
  }
  featured?: boolean
}

export const posts: Post[] = [
  {
    slug: 'building-modern-web-apps',
    title: 'Building Modern Web Apps with Next.js 16 and React 19',
    excerpt:
      'Explore the latest features in Next.js 16 — from the improved App Router and server actions to the new caching model that makes your apps blazingly fast.',
    date: 'Apr 18, 2026',
    readTime: '8 min read',
    category: 'Next.js',
    categoryColor: 'violet',
    author: { name: 'Adithyan R', initials: 'AR', avatarColor: 'from-violet-500 to-indigo-600' },
    featured: true,
  },
  {
    slug: 'tailwind-css-v4-deep-dive',
    title: 'Tailwind CSS v4 — What Changed and Why It Matters',
    excerpt:
      'Tailwind v4 drops the config file and embraces CSS-first configuration. Here\'s everything you need to know to migrate your project without breaking a sweat.',
    date: 'Apr 15, 2026',
    readTime: '6 min read',
    category: 'CSS',
    categoryColor: 'sky',
    author: { name: 'Priya M', initials: 'PM', avatarColor: 'from-sky-500 to-cyan-600' },
  },
  {
    slug: 'typescript-tips-2026',
    title: '10 TypeScript Patterns Every Developer Should Know in 2026',
    excerpt:
      'From template literal types to using `satisfies` for safer type inference, these patterns will level up your TypeScript and make your codebase bulletproof.',
    date: 'Apr 12, 2026',
    readTime: '10 min read',
    category: 'TypeScript',
    categoryColor: 'blue',
    author: { name: 'Kiran S', initials: 'KS', avatarColor: 'from-blue-500 to-blue-700' },
  },
  {
    slug: 'react-server-components-patterns',
    title: 'React Server Components — Patterns, Pitfalls & Best Practices',
    excerpt:
      'RSC fundamentally changes how we think about data fetching and component boundaries. Learn real-world patterns that keep your app fast without sacrificing DX.',
    date: 'Apr 10, 2026',
    readTime: '12 min read',
    category: 'React',
    categoryColor: 'cyan',
    author: { name: 'Meera J', initials: 'MJ', avatarColor: 'from-cyan-500 to-teal-600' },
  },
  {
    slug: 'api-design-rest-vs-trpc',
    title: 'REST vs tRPC in 2026 — Choosing the Right API Layer',
    excerpt:
      'With tRPC gaining serious traction, is REST still king? We compare both approaches across type-safety, DX, and scalability to help you make the right call.',
    date: 'Apr 7, 2026',
    readTime: '7 min read',
    category: 'Backend',
    categoryColor: 'emerald',
    author: { name: 'Rahul D', initials: 'RD', avatarColor: 'from-emerald-500 to-green-600' },
  },
  {
    slug: 'postgres-full-text-search',
    title: 'Full-Text Search in Postgres — No Elastic Needed',
    excerpt:
      'Postgres has powerful built-in FTS that most developers overlook. This guide shows you how to build fast, ranked search with tsvectors, GIN indexes, and more.',
    date: 'Apr 4, 2026',
    readTime: '9 min read',
    category: 'Database',
    categoryColor: 'orange',
    author: { name: 'Sneha K', initials: 'SK', avatarColor: 'from-orange-500 to-amber-600' },
  },
]
