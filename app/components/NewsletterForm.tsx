'use client'

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full flex-col gap-3 sm:flex-row md:w-auto"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="your@email.com"
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 backdrop-blur-sm transition-colors duration-200 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20 sm:w-64"
      />
      <button
        id="newsletter-subscribe"
        type="submit"
        className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:from-violet-500 hover:to-indigo-500"
      >
        Subscribe
      </button>
    </form>
  )
}
