'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

type FormState  = { name: string; email: string; password: string; confirmPassword: string }
type FieldError = Partial<FormState>

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const map = [
    { score: 1, label: 'Weak',   color: '#E74C3C' },
    { score: 2, label: 'Fair',   color: '#E67E22' },
    { score: 3, label: 'Good',   color: '#2ECC71' },
    { score: 4, label: 'Strong', color: '#27AE60' },
  ]
  return map[s - 1] ?? { score: 0, label: '', color: '' }
}

function validate(v: FormState): FieldError {
  const e: FieldError = {}
  if (!v.name.trim()) e.name = 'Full name is required'
  else if (v.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
  if (!v.email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address'
  if (!v.password) e.password = 'Password is required'
  else if (v.password.length < 8) e.password = 'Password must be at least 8 characters'
  else if (getStrength(v.password).score < 2) e.password = 'Password is too weak — add uppercase letters or numbers'
  if (!v.confirmPassword) e.confirmPassword = 'Please confirm your password'
  else if (v.confirmPassword !== v.password) e.confirmPassword = 'Passwords do not match'
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
function UserIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
    </svg>
  )
}
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
function ShieldIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
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
function CheckIcon() {
  return (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7"/>
    </svg>
  )
}


/* ── Page ─────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [values, setValues]             = useState<FormState>({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors]             = useState<FieldError>({})
  const [serverError, setServerError]   = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [agreed, setAgreed]             = useState(false)
  const [agreeError, setAgreeError]     = useState(false)
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
    const hasErrors = Object.keys(errs).length > 0
    if (!agreed) setAgreeError(true); else setAgreeError(false)
    if (hasErrors || !agreed) { setErrors(errs); return }
    setLoading(true)
    const result = await register(values.name, values.email, values.password)
    setLoading(false)
    if (result.error) { setServerError(result.error); return }
    router.push('/dashboard')
  }

  const strength = getStrength(values.password)

  /* ── shared input style ── */
  const inputStyle = (hasError?: boolean, hasSuccess?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '13px 44px 13px 44px',
    fontSize: '14px',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    background: '#FAFAFA',
    border: `1.5px solid ${hasError ? '#C0392B' : hasSuccess ? '#27AE60' : 'var(--border)'}`,
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s ease, background 0.2s ease',
  })

  const FEATURES = [
    'Publish unlimited articles',
    'Rich markdown editor',
    'Grow your readership',
    'Analytics dashboard',
  ]

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
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200&q=75&auto=format&fit=crop"
            alt="Editorial background"
            fill
            priority
            style={{ objectFit: 'cover', opacity: 0.15 }}
          />
        </div>

        {/* Noise texture overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }} />

        {/* Top-left logo */}
        <div style={{ position: 'relative', zIndex: 2, padding: '40px 48px 0' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: '2px' }}>
            <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--accent)' }}>BLOG</span>
            <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.05em', color: '#fff' }}>RAM</span>
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
            Join the Community
          </p>

          {/* Big headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 3.5vw, 52px)',
            fontWeight: 900,
            lineHeight: 1.06,
            letterSpacing: '-0.04em',
            color: '#FFFFFF',
            marginBottom: '20px',
          }}>
            Start writing
            <br />
            your story
            <br />
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>today.</span>
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '15px',
            lineHeight: 1.75,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: '360px',
            marginBottom: '48px',
          }}>
            Join thousands of writers and curious readers on a platform built for serious ideas and beautiful writing.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '56px' }}>
            {FEATURES.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '22px', height: '22px', borderRadius: '50%',
                  background: 'rgba(255, 106, 0, 0.2)',
                  color: 'var(--accent)',
                  flexShrink: 0,
                }}>
                  <CheckIcon />
                </span>
                <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '20px 24px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '12px' }}>
              &ldquo;Blogram completely transformed how I share my engineering insights. The editor is beautiful and my readership grew 4x in 3 months.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff',
              }}>
                J
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>James Park</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Senior Engineer, 340+ followers</p>
              </div>
            </div>
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
        padding: 'clamp(40px, 6vw, 72px) clamp(24px, 5vw, 64px)',
        minHeight: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>

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
              marginBottom: '40px',
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
          <div className="auth-mobile-logo" style={{ marginBottom: '28px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--accent)' }}>BLOG</span>
              <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--text-primary)' }}>RAM</span>
            </Link>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '12px',
            }}>
              Create Account
            </p>
            <h2 style={{
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '10px',
            }}>
              Start your journey
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Already have an account?{' '}
              <Link
                href="/login"
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
                Sign in instead
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
          <form id="register-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Full Name */}
            <div>
              <FieldLabel htmlFor="register-name">Full name</FieldLabel>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex',
                }}>
                  <UserIcon />
                </span>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'register-name-error' : undefined}
                  style={inputStyle(!!errors.name)}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.name ? '#C0392B' : 'var(--border)'; e.currentTarget.style.background = '#FAFAFA' }}
                />
              </div>
              {errors.name && <FieldError id="register-name-error" msg={errors.name} />}
            </div>

            {/* Email */}
            <div>
              <FieldLabel htmlFor="register-email">Email address</FieldLabel>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex',
                }}>
                  <MailIcon />
                </span>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'register-email-error' : undefined}
                  style={inputStyle(!!errors.email)}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.email ? '#C0392B' : 'var(--border)'; e.currentTarget.style.background = '#FAFAFA' }}
                />
              </div>
              {errors.email && <FieldError id="register-email-error" msg={errors.email} />}
            </div>

            {/* Password */}
            <div>
              <FieldLabel htmlFor="register-password">Password</FieldLabel>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex',
                }}>
                  <LockIcon />
                </span>
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  aria-invalid={!!errors.password}
                  aria-describedby="register-password-hint"
                  style={{ ...inputStyle(!!errors.password), paddingRight: '44px' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.password ? '#C0392B' : 'var(--border)'; e.currentTarget.style.background = '#FAFAFA' }}
                />
                <button
                  type="button"
                  id="register-toggle-password"
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

              {/* Strength meter */}
              {values.password && (
                <div id="register-password-hint" style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4].map(n => (
                      <div
                        key={n}
                        style={{
                          flex: 1,
                          height: '3px',
                          borderRadius: '2px',
                          background: n <= strength.score ? strength.color : 'var(--border)',
                          transition: 'background 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: strength.color, letterSpacing: '0.04em' }}>
                      {strength.label}
                    </span>
                  )}
                </div>
              )}
              {errors.password && <FieldError msg={errors.password} />}
            </div>

            {/* Confirm Password */}
            <div>
              <FieldLabel htmlFor="register-confirm">Confirm password</FieldLabel>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none', display: 'flex',
                }}>
                  <ShieldIcon />
                </span>
                <input
                  id="register-confirm"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined}
                  style={{
                    ...inputStyle(
                      !!errors.confirmPassword,
                      !!(values.confirmPassword && values.confirmPassword === values.password)
                    ),
                    paddingRight: '72px',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => {
                    const isMatch = values.confirmPassword && values.confirmPassword === values.password
                    e.currentTarget.style.borderColor = errors.confirmPassword ? '#C0392B' : isMatch ? '#27AE60' : 'var(--border)'
                    e.currentTarget.style.background = '#FAFAFA'
                  }}
                />
                <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {values.confirmPassword && values.confirmPassword === values.password && (
                    <span style={{ color: '#27AE60', display: 'flex' }}><CheckIcon /></span>
                  )}
                  <button
                    type="button"
                    id="register-toggle-confirm"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirm(p => !p)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', display: 'flex', transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <EyeIcon off={showConfirm} />
                  </button>
                </div>
              </div>
              {errors.confirmPassword && <FieldError id="register-confirm-error" msg={errors.confirmPassword} />}
            </div>

            {/* Terms checkbox */}
            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <div style={{ position: 'relative', marginTop: '1px', flexShrink: 0 }}>
                  <input
                    id="register-agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={e => { setAgreed(e.target.checked); if (e.target.checked) setAgreeError(false) }}
                    style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', margin: 0 }}
                  />
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '5px',
                    border: `1.5px solid ${agreeError ? '#C0392B' : agreed ? 'var(--text-primary)' : 'var(--border-strong)'}`,
                    background: agreed ? 'var(--text-primary)' : '#FAFAFA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {agreed && <span style={{ color: '#fff', display: 'flex', transform: 'scale(0.85)' }}><CheckIcon /></span>}
                  </div>
                </div>
                <span style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                  I agree to the{' '}
                  <Link
                    href="#"
                    style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(17,17,17,0.3)' }}
                  >
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link
                    href="#"
                    style={{ color: 'var(--text-primary)', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid rgba(17,17,17,0.3)' }}
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {agreeError && (
                <p role="alert" style={{
                  marginLeft: '30px',
                  marginTop: '6px',
                  fontSize: '12px',
                  color: '#C0392B',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}>
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  You must agree to continue
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
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
                  Creating account…
                </>
              ) : (
                <>Create Account <ArrowRight /></>
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={{
            marginTop: '24px',
            fontSize: '12px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            Protected by end-to-end encryption.{' '}
            <Link href="#" style={{ color: 'var(--text-secondary)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid var(--border)' }}>
              Learn more
            </Link>
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
