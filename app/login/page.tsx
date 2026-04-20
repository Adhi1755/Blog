'use client'

import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

/* ── Brand tokens ── */
const C = {
  bg:      '#F7F7F7',
  surface: '#FFFFFF',
  dark:    '#111111',
  muted:   '#6B6B6B',
  accent:  '#FF6A00',
  border:  '#DCDCDC',
  error:   '#D93025',
}

type FormState  = { email: string; password: string }
type FieldError = Partial<FormState>

function validate(v: FormState): FieldError {
  const e: FieldError = {}
  if (!v.email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email'
  if (!v.password) e.password = 'Password is required'
  else if (v.password.length < 6) e.password = 'At least 6 characters'
  return e
}

/* ── Tiny icons ── */
function MailIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}
function EyeIcon({ off }: { off?: boolean }) {
  return off ? (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [values, setValues]             = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors]             = useState<FieldError>({})
  const [serverError, setServerError]   = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    setServerError('')
    if (errors[name as keyof FieldError]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errs = validate(values)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    const result = await login(values.email, values.password)
    setLoading(false)
    if (result.error) { setServerError(result.error); return }
    router.push('/dashboard')
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    paddingTop: '11px',
    paddingBottom: '11px',
    paddingLeft: '40px',
    paddingRight: '14px',
    fontSize: '13px',
    color: C.dark,
    background: C.bg,
    border: `1.5px solid ${C.border}`,
    borderRadius: '8px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color .18s, background .18s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>

      {/* Back link */}
      <Link href="/" style={{
        position: 'fixed', top: 24, left: 28,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 12, fontWeight: 600, color: C.muted, textDecoration: 'none',
        transition: 'color .18s',
        zIndex: 10,
      }}
        onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
        onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Home
      </Link>

      {/* Centered card */}
      <div style={{
        width: '100%',
        maxWidth: 860,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 24px 80px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)',
      }} className="auth-card">

        {/* ── LEFT — dark panel ── */}
        <div style={{
          background: C.dark,
          padding: 'clamp(36px,5vw,56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 520,
        }}>
          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
            pointerEvents: 'none',
          }} />
          {/* Orange glow blob */}
          <div style={{
            position: 'absolute', bottom: -80, right: -80,
            width: 260, height: 260,
            background: `radial-gradient(circle, rgba(255,106,0,0.22) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline' }}>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: C.accent }}>BLOG</span>
              <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.05em', color: '#fff' }}>RAM</span>
            </Link>
          </div>

          {/* Main copy */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: 16 }}>
              Welcome back
            </p>
            <h1 style={{
              fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 800,
              lineHeight: 1.08, letterSpacing: '-0.04em', color: '#fff', marginBottom: 16,
            }}>
              Your stories<br />
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>are waiting.</span>
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', maxWidth: 280, marginBottom: 36 }}>
              Sign in to continue reading, writing, and connecting with a community of curious minds.
            </p>

            {/* Editorial quote */}
            <div style={{ borderLeft: `2px solid ${C.accent}`, paddingLeft: 16 }}>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginBottom: 6 }}>
                &ldquo;A writer only begins a book. A reader finishes it.&rdquo;
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 500, letterSpacing: '0.04em' }}>
                — Samuel Johnson
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 28 }}>
            {[{ v: '12k+', l: 'Writers' }, { v: '48k', l: 'Articles' }, { v: '200k', l: 'Readers' }].map(s => (
              <div key={s.l}>
                <p style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>{s.v}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — form panel ── */}
        <div style={{
          background: C.surface,
          padding: 'clamp(36px,5vw,56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>
              Sign In
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: C.dark, marginBottom: 8 }}>
              Welcome back
            </h2>
            <p style={{ fontSize: 13, color: C.muted }}>
              No account?{' '}
              <Link href="/register" style={{ color: C.accent, fontWeight: 700, textDecoration: 'none' }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div role="alert" style={{
              display: 'flex', alignItems: 'center', gap: 9,
              background: '#fff5f5', border: `1px solid #fcc`, borderRadius: 8,
              padding: '10px 14px', fontSize: 12, color: C.error, fontWeight: 500,
              marginBottom: 20,
            }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
              </svg>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form id="login-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email */}
            <div>
              <label htmlFor="login-email" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 7 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, display: 'flex', pointerEvents: 'none' }}>
                  <MailIcon />
                </span>
                <input
                  id="login-email" name="email" type="email" autoComplete="email"
                  value={values.email} onChange={handleChange}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  style={{ ...inputBase, borderColor: errors.email ? C.error : C.border }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.email ? C.error : C.border; e.currentTarget.style.background = C.bg }}
                />
              </div>
              {errors.email && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 5, fontWeight: 500 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                <label htmlFor="login-password" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted }}>
                  Password
                </label>
                <Link href="#" style={{ fontSize: 11, color: C.muted, textDecoration: 'none', fontWeight: 500, transition: 'color .18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, display: 'flex', pointerEvents: 'none' }}>
                  <LockIcon />
                </span>
                <input
                  id="login-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={values.password} onChange={handleChange}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  style={{ ...inputBase, paddingRight: 40, borderColor: errors.password ? C.error : C.border }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.password ? C.error : C.border; e.currentTarget.style.background = C.bg }}
                />
                <button type="button" id="login-toggle-password"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {errors.password && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 5, fontWeight: 500 }}>{errors.password}</p>}
            </div>

            {/* Submit */}
            <button id="login-submit" type="submit" disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', paddingTop: 13, paddingBottom: 13,
                background: loading ? '#555' : C.dark, color: '#fff',
                border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background .18s, transform .15s',
                letterSpacing: '0.02em', marginTop: 4,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = C.dark; e.currentTarget.style.transform = 'none' } }}>
              {loading ? (
                <>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" style={{ animation: 'auth-spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path fill="currentColor" fillOpacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{ marginTop: 22, fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 1.7 }}>
            By signing in you agree to our{' '}
            <Link href="#" style={{ color: C.muted, fontWeight: 600, textDecoration: 'underline' }}>Terms</Link>
            {' '}and{' '}
            <Link href="#" style={{ color: C.muted, fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');
        @keyframes auth-spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .auth-card { grid-template-columns: 1fr !important; }
          .auth-card > div:first-child { display: none !important; }
        }
      `}</style>
    </div>
  )
}
