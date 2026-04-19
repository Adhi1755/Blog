export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'tip'; text: string }
  | { type: 'list'; items: string[] }

export type Comment = {
  id: string
  authorName: string
  authorInitials: string
  text: string
  date: string
}

export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  category: string
  categoryColor: string
  thumbnail?: string
  tags?: string[]
  likes?: number
  views?: number
  comments?: Comment[]
  author: {
    name: string
    initials: string
    avatarColor: string
  }
  featured?: boolean
  body?: ContentBlock[]
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
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    tags: ['Next.js', 'React', 'Performance', 'App Router'],
    likes: 142,
    views: 3840,
    comments: [],
    author: { name: 'Adithyan R', initials: 'AR', avatarColor: 'from-violet-500 to-indigo-600' },
    featured: true,
    body: [
      { type: 'paragraph', text: 'Next.js 16 represents a significant leap forward in how we build full-stack React applications. With React 19 as the foundation, the framework now ships with a dramatically improved App Router, rethought caching semantics, and first-class support for React Server Components (RSC) that make it easier than ever to build fast, scalable web apps.' },
      { type: 'heading', text: 'What is New in the App Router' },
      { type: 'paragraph', text: 'The App Router in Next.js 16 stabilises a number of APIs that were previously experimental. The most notable change is how layouts, pages, and templates interact. Every segment in your route tree can now export a `loading.tsx` that integrates cleanly with React Suspense, giving you granular streaming control without any extra configuration.' },
      { type: 'code', language: 'tsx', code: '// app/dashboard/layout.tsx\nexport default function DashboardLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <section className="flex min-h-screen flex-col">\n      <DashboardNav />\n      <main className="flex-1 p-6">{children}</main>\n    </section>\n  )\n}' },
      { type: 'heading', text: 'The New Caching Model' },
      { type: 'paragraph', text: 'Next.js 16 ships with a completely rethought caching model. Gone are the days of implicit full-route caching that caught developers off guard. Routes are now uncached by default, giving you explicit control via `fetch` options, `cache()`, `revalidate`, and the new `use cache` directive.' },
      { type: 'tip', text: 'Use the `use cache` directive at the top of any async function to opt that specific data-fetching call into the data cache. This is far more granular than the old `getStaticProps` / `getServerSideProps` split.' },
      { type: 'heading', text: 'Server Actions and Forms' },
      { type: 'paragraph', text: 'Server Actions have graduated from experimental status and are now the recommended way to handle mutations. Combined with the new `useActionState` hook from React 19, you can build progressive-enhancement forms that work with and without JavaScript.' },
      { type: 'code', language: 'tsx', code: "'use server'\n\nexport async function createPost(formData: FormData) {\n  const title = formData.get('title') as string\n  const content = formData.get('content') as string\n  await db.post.create({ data: { title, content } })\n  revalidatePath('/blog')\n}" },
      { type: 'list', items: ['Partial Pre-rendering (PPR) is now stable for production use', 'The `next/image` component now lazy-loads by default with no config needed', 'Turbopack is the default bundler in development — builds are 3–5x faster', 'React 19 `use()` hook unlocks new patterns for async data in Client Components'] },
      { type: 'paragraph', text: 'Whether you are starting a greenfield project or migrating an existing Pages Router app, Next.js 16 offers a clear, well-documented upgrade path. Start with the official migration guide and incrementally adopt the App Router one route at a time.' },
    ],
  },
  {
    slug: 'tailwind-css-v4-deep-dive',
    title: 'Tailwind CSS v4 — What Changed and Why It Matters',
    excerpt:
      "Tailwind v4 drops the config file and embraces CSS-first configuration. Here's everything you need to know to migrate your project without breaking a sweat.",
    date: 'Apr 15, 2026',
    readTime: '6 min read',
    category: 'CSS',
    categoryColor: 'sky',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    tags: ['CSS', 'Tailwind', 'Design Systems', 'Frontend'],
    likes: 98,
    views: 2210,
    comments: [],
    author: { name: 'Priya M', initials: 'PM', avatarColor: 'from-sky-500 to-cyan-600' },
    body: [
      { type: 'paragraph', text: 'Tailwind CSS v4 is the most significant rewrite since the framework launched. The team has moved configuration out of JavaScript and into CSS itself — meaning zero config files, faster builds via the new Rust-based engine (Oxide), and a dramatically smaller output bundle.' },
      { type: 'heading', text: 'CSS-First Configuration' },
      { type: 'paragraph', text: 'Instead of a `tailwind.config.js` file, all customisation now lives in your global CSS file using the `@theme` block. This collocates your design tokens with your styles and makes the configuration tree-shakeable.' },
      { type: 'code', language: 'css', code: '@import "tailwindcss";\n\n@theme {\n  --color-brand: oklch(60% 0.2 270);\n  --font-display: "Cal Sans", sans-serif;\n  --radius-card: 1.25rem;\n}' },
      { type: 'heading', text: 'The Oxide Engine' },
      { type: 'paragraph', text: 'Tailwind v4 ships with a new Rust-based build engine called Oxide. In benchmarks it is 10x faster for full builds and up to 100x faster for incremental builds. The new engine also handles CSS nesting, `@layer`, and cascade layers natively — no PostCSS plugins required.' },
      { type: 'tip', text: 'If you are on Next.js, swap `tailwindcss` for `@tailwindcss/vite` or `@tailwindcss/postcss` depending on your bundler. The PostCSS plugin is the right choice for Next.js projects.' },
      { type: 'list', items: ['No more `purge` / `content` array — Oxide scans automatically', '`@apply` is still supported but less necessary with the new composition model', 'Arbitrary values like `w-[42px]` are now first-class, not a workaround', 'Dark mode via `prefers-color-scheme` is built in without config'] },
      { type: 'paragraph', text: 'Migration from v3 to v4 is straightforward for most projects. Run the official codemod, update your import syntax from `@tailwind base` to `@import "tailwindcss"`, and move any custom config values into `@theme`. Most projects take under an hour to migrate.' },
    ],
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
    thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
    tags: ['TypeScript', 'Type Safety', 'Patterns', 'Best Practices'],
    likes: 201,
    views: 5120,
    comments: [],
    author: { name: 'Kiran S', initials: 'KS', avatarColor: 'from-blue-500 to-blue-700' },
    body: [
      { type: 'paragraph', text: 'TypeScript continues to evolve at a rapid pace. TypeScript 5.x introduced a string of quality-of-life improvements — const type parameters, variadic tuple improvements, and the `satisfies` operator — that meaningfully change how experts write day-to-day type-safe code.' },
      { type: 'heading', text: '1. Use `satisfies` Instead of Type Assertions' },
      { type: 'paragraph', text: 'The `satisfies` operator lets you validate a value against a type while preserving the most specific inferred type. This catches errors at the definition site rather than at the use site.' },
      { type: 'code', language: 'ts', code: "type Route = 'home' | 'about' | 'blog'\n\n// Bad: loses the specific string literal types\nconst routes: Record<Route, string> = {\n  home: '/',\n  about: '/about',\n  blog: '/blog',\n}\n\n// Good: keeps literal types AND validates the shape\nconst routes = {\n  home: '/',\n  about: '/about',\n  blog: '/blog',\n} satisfies Record<Route, string>" },
      { type: 'heading', text: '2. Template Literal Types for Strict String APIs' },
      { type: 'paragraph', text: 'Template literal types allow you to construct new string types by combining existing ones. They are especially useful for event names, CSS class strings, and API endpoint patterns.' },
      { type: 'code', language: 'ts', code: "type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'\ntype ApiPath = '/users' | '/posts' | '/comments'\ntype Endpoint = `${HTTPMethod} ${ApiPath}`\n\n// Valid: 'GET /users', 'POST /posts', etc.\n// Invalid: 'PATCH /users' — caught at compile time\nfunction call(endpoint: Endpoint) { /* ... */ }" },
      { type: 'tip', text: 'Combine template literal types with `infer` inside conditional types to extract parts of a string literal type — for example, to parse route params like `/blog/:slug` at the type level.' },
      { type: 'list', items: ['Use `const` type parameters on generics to preserve literal types', 'Prefer `unknown` over `any` for values from external sources', 'Use `NoInfer<T>` utility type (TS 5.4+) to prevent unwanted inference from certain positions', 'Model discriminated unions with a `type` or `kind` field for exhaustive switch checking', 'Use branded types for IDs to prevent mixing `UserId` and `PostId`'] },
      { type: 'paragraph', text: 'These patterns are not just academic — they are the difference between a codebase where TypeScript catches real bugs versus one where you are fighting type errors all day. Adopt them incrementally, starting with the ones that solve pain points you already have.' },
    ],
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
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    tags: ['React', 'RSC', 'Performance', 'Architecture'],
    likes: 175,
    views: 4300,
    comments: [],
    author: { name: 'Meera J', initials: 'MJ', avatarColor: 'from-cyan-500 to-teal-600' },
    body: [
      { type: 'paragraph', text: 'React Server Components (RSC) shipped as stable in React 19 and are now the default in Next.js App Router. They represent the biggest architectural shift in React since hooks. Understanding where the server/client boundary lives — and how to use it strategically — is the most important skill for React developers in 2026.' },
      { type: 'heading', text: 'The Component Boundary' },
      { type: 'paragraph', text: 'Server Components render on the server and send HTML (plus a serialised component tree) to the client. They can be async, can access databases directly, and never ship their code to the browser. Client Components start on the server too (for the initial HTML), but their code runs in the browser for hydration and interactivity.' },
      { type: 'tip', text: 'Think of the boundary not as "server vs. client" but as "static vs. interactive". Anything that needs onClick, useState, or browser APIs must be a Client Component. Everything else should default to Server Component.' },
      { type: 'heading', text: 'Pattern: Push `use client` Down the Tree' },
      { type: 'paragraph', text: 'The most common mistake is marking an entire page or layout as `use client` because one small part needs interactivity. Instead, extract just the interactive piece into its own Client Component and keep the rest of the tree as Server Components.' },
      { type: 'code', language: 'tsx', code: '// Bad: entire page is client-side\n"use client"\nexport default function Page({ posts }) {\n  const [liked, setLiked] = useState(false)\n  return <PostList posts={posts} liked={liked} onLike={setLiked} />\n}\n\n// Good: only the interactive button is a Client Component\nexport default async function Page() {\n  const posts = await db.posts.findMany() // server-side!\n  return <PostList posts={posts} />        // Server Component\n}\n\n"use client"\nexport function LikeButton({ postId }) {  // Client Component\n  const [liked, setLiked] = useState(false)\n  return <button onClick={() => setLiked(p => !p)}>Like</button>\n}' },
      { type: 'list', items: ['Context providers must be Client Components — wrap them as close to the root as needed', 'You can pass Server Components as `children` prop into Client Components', 'Avoid serialising functions through the RSC boundary — use Server Actions instead', 'Use `Suspense` boundaries to stream slow data without blocking faster parts of the page'] },
      { type: 'paragraph', text: 'RSC is not a silver bullet — it adds cognitive overhead around the component boundary. But mastered correctly, it lets you fetch data at the component level without waterfalls, ship zero JS for static parts of your UI, and build apps that feel instant.' },
    ],
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
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    tags: ['Backend', 'API', 'tRPC', 'REST', 'TypeScript'],
    likes: 88,
    views: 1975,
    comments: [],
    author: { name: 'Rahul D', initials: 'RD', avatarColor: 'from-emerald-500 to-green-600' },
    body: [
      { type: 'paragraph', text: 'For years REST was the unquestioned default for web APIs. Then GraphQL arrived and promised type-safe, flexible queries. Now tRPC offers a third path: end-to-end type safety without schemas, code generation, or a query language. So which should you reach for in 2026?' },
      { type: 'heading', text: 'REST: Battle-Tested, Universal' },
      { type: 'paragraph', text: 'REST remains the right choice when your API needs to be consumed by clients you do not control — mobile apps, third-party integrations, public developer APIs. It is language-agnostic, cacheable at every layer (CDN, browser, proxy), and every developer already understands it.' },
      { type: 'heading', text: 'tRPC: End-to-End Type Safety Without the Ceremony' },
      { type: 'paragraph', text: 'tRPC lets you define your API using plain TypeScript functions and call them from your frontend with full type safety — no schema, no code generation step. If you change a procedure signature, your TypeScript compiler immediately tells every caller about the breakage.' },
      { type: 'code', language: 'ts', code: '// server\nexport const postRouter = router({\n  byId: publicProcedure\n    .input(z.object({ id: z.string() }))\n    .query(async ({ input }) => {\n      return db.post.findUnique({ where: { id: input.id } })\n    }),\n})\n\n// client — fully typed, no codegen\nconst { data } = trpc.post.byId.useQuery({ id: postId })' },
      { type: 'tip', text: 'tRPC works best in monorepos where the server and client share a TypeScript codebase. If you have a separate mobile app or third-party consumers, a REST or GraphQL API is a better fit.' },
      { type: 'list', items: ['Use REST for public APIs, microservices, and mobile backends', 'Use tRPC for full-stack TypeScript monorepos with a single frontend client', 'Consider Server Actions (Next.js) if you do not need a separate API layer at all', 'GraphQL remains a good choice for complex, graph-shaped data with many clients'] },
    ],
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
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
    tags: ['Database', 'PostgreSQL', 'Search', 'Performance'],
    likes: 113,
    views: 2680,
    comments: [],
    author: { name: 'Snehaa K', initials: 'SK', avatarColor: 'from-orange-500 to-amber-600' },
    body: [
      { type: 'paragraph', text: 'Most developers reach for Elasticsearch or Algolia the moment they need search. But for the vast majority of applications, Postgres full-text search is more than capable — and it eliminates an entire infrastructure dependency.' },
      { type: 'heading', text: 'tsvector and tsquery' },
      { type: 'paragraph', text: 'Postgres represents searchable text as a `tsvector` — a sorted list of lexemes (normalised word roots) with positional information. A search query is represented as a `tsquery`. The `@@` operator matches a vector against a query.' },
      { type: 'code', language: 'sql', code: "-- Create a search column\nALTER TABLE posts ADD COLUMN search_vector tsvector;\n\n-- Populate it\nUPDATE posts\nSET search_vector = to_tsvector('english', title || ' ' || content);\n\n-- Build a GIN index for fast lookups\nCREATE INDEX posts_search_idx ON posts USING GIN(search_vector);\n\n-- Search with ranking\nSELECT title, ts_rank(search_vector, query) AS rank\nFROM posts, to_tsquery('english', 'typescript & patterns') query\nWHERE search_vector @@ query\nORDER BY rank DESC;" },
      { type: 'heading', text: 'Keep the Index Fresh with Triggers' },
      { type: 'paragraph', text: 'Rather than manually updating the `search_vector` column, use a trigger to recompute it whenever a row changes. This keeps your search index always in sync without any application-level code.' },
      { type: 'code', language: 'sql', code: "CREATE FUNCTION update_search_vector() RETURNS trigger AS $$\nBEGIN\n  NEW.search_vector := to_tsvector('english', NEW.title || ' ' || NEW.content);\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER posts_search_trigger\nBEFORE INSERT OR UPDATE ON posts\nFOR EACH ROW EXECUTE FUNCTION update_search_vector();" },
      { type: 'tip', text: 'Use `ts_headline()` to extract and highlight matching snippets from your content — much like the bolded excerpts you see in Google search results.' },
      { type: 'list', items: ['Weight different fields differently (title > content) using `setweight()`', 'Support prefix searches with `lexeme:*` syntax in your tsquery', 'Combine FTS with regular `WHERE` clauses for faceted search (category, date, etc.)', 'For very large tables (>10M rows), consider Postgres FTS with a dedicated replica'] },
    ],
  },
]
