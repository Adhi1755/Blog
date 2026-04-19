'use client'

import { usePathname } from 'next/navigation'

// Every route manages its own chrome — this component is a pure passthrough.
// It exists so the root layout (a Server Component) can mount a Client Component
// boundary without the overhead of Navbar/Footer on every single page.
export default function ConditionalChrome({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _pathname = usePathname() // keeps this as a client component boundary
  return <>{children}</>
}
