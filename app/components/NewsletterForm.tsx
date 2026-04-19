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
        className="w-full border border-neutral-300 bg-white px-4 py-3 text-sm text-black placeholder-neutral-400 outline-none transition-colors duration-200 focus:border-black sm:w-64"
      />
      <button
        id="newsletter-subscribe"
        type="submit"
        className="shrink-0 border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-neutral-800"
      >
        Subscribe
      </button>
    </form>
  )
}
