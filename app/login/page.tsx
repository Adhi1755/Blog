'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

type FormState  = { email: string; password: string }
type FieldError = Partial<FormState>

function validate(v: FormState): FieldError {
  const e: FieldError = {}
  if (!v.email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address'
  if (!v.password) e.password = 'Password is required'
  else if (v.password.length < 6) e.password = 'Password must be at least 6 characters'
  return e
}

/* ── Shared micro-components ─────────────────────────────────────── */
function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text-secondary)',
        display: 'block',
        marginBottom: '8px',
      }}
    >
      {children}
    </label>
  )
}

function FieldError({ id, msg }: { id?: string; msg: string }) {
  return (
    <p id={id} role="alert" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '12px',
      color: '#C0392B',
      marginTop: '6px',
      fontWeight: 500,
    }}>
      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
      </svg>
      {msg}
    </p>
  )
}

/* ── Icons ───────────────────────────────────────────────────────── */
function MailIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
    </svg>
  )
}
function EyeIcon({ off }: { off?: boolean }) {
  return off ? (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
    </svg>
  ) : (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  )
}
function ArrowRight() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

/* ── Page ─────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [values, setValues]           = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors]           = useState<FieldError>({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]         = useState(false)

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

  /* ── shared input style ── */
  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '13px 44px 13px 44px',
    fontSize: '14px',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    background: '#FAFAFA',
    border: `1.5px solid ${hasError ? '#C0392B' : 'var(--border)'}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
  })

  const EDITORIAL_QUOTES = [
    { text: "Good writing carries ideas across time.", attr: '— George Orwell' },
    { text: "The secret to editing your work is simple: you need to become its reader instead of its writer.", attr: '— Zadie Smith' },
    { text: "A writer only begins a book. A reader finishes it.", attr: '— Samuel Johnson' },
  ]
  const quote = EDITORIAL_QUOTES[1]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-sans)' }}>

      {/* ── LEFT PANEL ──────────────────────────────────────── */}
      <div
        style={{
          flex: '0 0 45%',
          display: 'none',
          position: 'relative',
          background: 'var(--text-primary)',
          overflow: 'hidden',
        }}
        className="auth-left-panel"
      >
        {/* Background image with overlay */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&q=75&auto=format&fit=crop"
            alt="Editorial background"
            fill
            priority
            style={{ objectFit: 'cover', opacity: 0.18 }}
          />
        </div>

        {/* Top-left logo */}
        <div style={{ position: 'relative', zIndex: 2, padding: '40px 48px 0' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>Blog</span>
            <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--accent)' }}>Space</span>
          </Link>
        </div>

        {/* Center content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '0 48px 80px',
        }}>
          {/* Kicker */}
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '24px',
          }}>
            Welcome Back
          </p>

          {/* Big headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 3.5vw, 52px)',
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: '-0.04em',
            color: '#FFFFFF',
            marginBottom: '24px',
          }}>
            Your stories
            <br />
            are waiting
            <br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>for you.</span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '15px',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '360px',
            marginBottom: '48px',
          }}>
            Sign in to continue reading, writing, and connecting with a community of curious minds.
          </p>

          {/* Quote */}
          <div style={{
            borderLeft: '2px solid var(--accent)',
            paddingLeft: '20px',
          }}>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginBottom: '8px' }}>
              &ldquo;{quote.text}&rdquo;
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.04em' }}>
              {quote.attr}
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '56px' }}>
            {[
              { value: '2.4K+', label: 'Articles' },
              { value: '18K+', label: 'Readers' },
              { value: '340+', label: 'Writers' },
            ].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>{s.value}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--bg-page)',
        padding: 'clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)',
        minHeight: '100vh',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Back link */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textDecoration: 'none',
              letterSpacing: '0.04em',
              marginBottom: '48px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
            </svg>
            Back to Home
          </Link>

          {/* Mobile-only logo */}
          <div className="auth-mobile-logo" style={{ marginBottom: '32px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>Blog</span>
              <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--accent)' }}>Space</span>
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '36px' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '12px',
            }}>
              Sign In
            </p>
            <h2 style={{
              fontSize: 'clamp(26px, 3vw, 34px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '10px',
            }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                style={{
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  textDecoration: 'none',
                  borderBottom: '1.5px solid var(--text-primary)',
                  paddingBottom: '1px',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                Create one free
              </Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div role="alert" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#FFF5F5',
              border: '1px solid #FED7D7',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '13px',
              color: '#C0392B',
              fontWeight: 500,
              marginBottom: '24px',
            }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form id="login-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email */}
            <div>
              <FieldLabel htmlFor="login-email">Email address</FieldLabel>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex',
                }}>
                  <MailIcon />
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  style={inputStyle(!!errors.email)}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.email ? '#C0392B' : 'var(--border)'; e.currentTarget.style.background = '#FAFAFA' }}
                />
              </div>
              {errors.email && <FieldError id="login-email-error" msg={errors.email} />}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <FieldLabel htmlFor="login-password">Password</FieldLabel>
                <Link
                  href="#"
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'color 0.2s ease',
                    marginBottom: '8px',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex',
                }}>
                  <LockIcon />
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  style={{ ...inputStyle(!!errors.password), paddingRight: '44px' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.password ? '#C0392B' : 'var(--border)'; e.currentTarget.style.background = '#FAFAFA' }}
                />
                <button
                  type="button"
                  id="login-toggle-password"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {errors.password && <FieldError id="login-password-error" msg={errors.password} />}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px 24px',
                background: loading ? '#555' : 'var(--text-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                fontFamily: 'var(--font-sans)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease, transform 0.15s ease',
                letterSpacing: '0.02em',
                marginTop: '4px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2a2a2a' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = 'var(--text-primary)' }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                    <path fill="currentColor" fillOpacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in…
                </>
              ) : (
                <>Sign In <ArrowRight /></>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p style={{
            marginTop: '28px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            By signing in you agree to our{' '}
            <Link href="#" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>Terms</Link>
            {' '}and{' '}
            <Link href="#" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 900px) {
          .auth-left-panel { display: flex !important; flex-direction: column; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  )
}
