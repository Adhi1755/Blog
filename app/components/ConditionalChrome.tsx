'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

// Routes that should suppress the global Navbar + Footer and use their own chrome
const STANDALONE_ROUTES = ['/dashboard']

export default function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStandalone = STANDALONE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))

  if (isStandalone) {
    // Dashboard manages its own full-height layout — no extra wrappers
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
