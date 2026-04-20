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
  ok:      '#1a8a1a',
}

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
    { score: 1, label: 'Weak',   color: '#D93025' },
    { score: 2, label: 'Fair',   color: '#E67E22' },
    { score: 3, label: 'Good',   color: '#2E8B57' },
    { score: 4, label: 'Strong', color: '#1a8a1a' },
  ]
  return map[s - 1] ?? { score: 0, label: '', color: '' }
}

function validate(v: FormState): FieldError {
  const e: FieldError = {}
  if (!v.name.trim()) e.name = 'Full name is required'
  else if (v.name.trim().length < 2) e.name = 'At least 2 characters'
  if (!v.email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email'
  if (!v.password) e.password = 'Password is required'
  else if (v.password.length < 8) e.password = 'At least 8 characters'
  else if (getStrength(v.password).score < 2) e.password = 'Too weak — add uppercase or numbers'
  if (!v.confirmPassword) e.confirmPassword = 'Please confirm your password'
  else if (v.confirmPassword !== v.password) e.confirmPassword = 'Passwords do not match'
  return e
}

/* ── Tiny icons ── */
function UserIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}
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
function CheckSmall() {
  return (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

const FEATURES = [
  'Publish unlimited articles',
  'Rich Markdown editor',
  'AI-powered categorisation',
  'Smart reading feed',
]

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

  const inputBase: React.CSSProperties = {
    width: '100%',
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '38px',
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
        transition: 'color .18s', zIndex: 10,
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
        maxWidth: 880,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 24px 80px -8px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)',
      }} className="auth-card">

        {/* ── LEFT — dark panel ── */}
        <div style={{
          background: C.dark,
          padding: 'clamp(36px,5vw,52px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 560,
        }}>
          {/* Grid texture */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
            pointerEvents: 'none',
          }} />
          {/* Orange glow */}
          <div style={{
            position: 'absolute', bottom: -80, right: -80,
            width: 280, height: 280,
            background: `radial-gradient(circle, rgba(255,106,0,0.2) 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />
          {/* Top-left glow */}
          <div style={{
            position: 'absolute', top: -60, left: -60,
            width: 200, height: 200,
            background: `radial-gradient(circle, rgba(255,106,0,0.08) 0%, transparent 70%)`,
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
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: 14 }}>
              Join the community
            </p>
            <h1 style={{
              fontSize: 'clamp(24px,3vw,34px)', fontWeight: 800,
              lineHeight: 1.1, letterSpacing: '-0.04em', color: '#fff', marginBottom: 14,
            }}>
              Start writing<br />
              <span style={{ color: 'rgba(255,255,255,0.35)' }}>your story today.</span>
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.48)', maxWidth: 280, marginBottom: 28 }}>
              Join thousands of writers on a platform built for serious ideas and beautiful writing.
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {FEATURES.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <span style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(255,106,0,0.2)',
                    color: C.accent, flexShrink: 0,
                  }}>
                    <CheckSmall />
                  </span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div style={{
            position: 'relative', zIndex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '16px 20px',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 10 }}>
              &ldquo;Blogram transformed how I share insights. My readership grew 4× in 3 months.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: C.accent,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff',
              }}>J</div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>James Park</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Senior Engineer · 340+ followers</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT — form panel ── */}
        <div style={{
          background: C.surface,
          padding: 'clamp(36px,5vw,52px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
        }}>

          {/* Heading */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.accent, marginBottom: 10 }}>
              Create Account
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: C.dark, marginBottom: 8 }}>
              Start your journey
            </h2>
            <p style={{ fontSize: 13, color: C.muted }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: C.accent, fontWeight: 700, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div role="alert" style={{
              display: 'flex', alignItems: 'center', gap: 9,
              background: '#fff5f5', border: `1px solid #fcc`, borderRadius: 8,
              padding: '10px 14px', fontSize: 12, color: C.error, fontWeight: 500,
              marginBottom: 18,
            }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
              </svg>
              {serverError}
            </div>
          )}

          {/* Form */}
          <form id="register-form" onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Name */}
            <div>
              <label htmlFor="register-name" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 7 }}>
                Full name
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, display: 'flex', pointerEvents: 'none' }}>
                  <UserIcon />
                </span>
                <input
                  id="register-name" name="name" type="text" autoComplete="name"
                  value={values.name} onChange={handleChange}
                  placeholder="Jane Doe"
                  aria-invalid={!!errors.name}
                  style={{ ...inputBase, borderColor: errors.name ? C.error : C.border }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.name ? C.error : C.border; e.currentTarget.style.background = C.bg }}
                />
              </div>
              {errors.name && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 5, fontWeight: 500 }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 7 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, display: 'flex', pointerEvents: 'none' }}>
                  <MailIcon />
                </span>
                <input
                  id="register-email" name="email" type="email" autoComplete="email"
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
              <label htmlFor="register-password" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 7 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, display: 'flex', pointerEvents: 'none' }}>
                  <LockIcon />
                </span>
                <input
                  id="register-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.password} onChange={handleChange}
                  placeholder="Min. 8 characters"
                  aria-invalid={!!errors.password}
                  style={{ ...inputBase, paddingRight: 40, borderColor: errors.password ? C.error : C.border }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => { e.currentTarget.style.borderColor = errors.password ? C.error : C.border; e.currentTarget.style.background = C.bg }}
                />
                <button type="button" id="register-toggle-password"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                  onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                  <EyeIcon off={showPassword} />
                </button>
              </div>
              {/* Strength bar */}
              {values.password && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, display: 'flex', gap: 3 }}>
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} style={{
                        flex: 1, height: 3, borderRadius: 2,
                        background: n <= strength.score ? strength.color : C.border,
                        transition: 'background .25s',
                      }} />
                    ))}
                  </div>
                  {strength.label && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: strength.color, letterSpacing: '0.04em', flexShrink: 0 }}>
                      {strength.label}
                    </span>
                  )}
                </div>
              )}
              {errors.password && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 5, fontWeight: 500 }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.muted, display: 'block', marginBottom: 7 }}>
                Confirm password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, display: 'flex', pointerEvents: 'none' }}>
                  <LockIcon />
                </span>
                <input
                  id="register-confirm" name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={values.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter your password"
                  aria-invalid={!!errors.confirmPassword}
                  style={{ ...inputBase, paddingRight: 68, borderColor: errors.confirmPassword ? C.error : (values.confirmPassword && values.confirmPassword === values.password) ? C.ok : C.border }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.dark; e.currentTarget.style.background = '#fff' }}
                  onBlur={e => {
                    const match = values.confirmPassword && values.confirmPassword === values.password
                    e.currentTarget.style.borderColor = errors.confirmPassword ? C.error : match ? C.ok : C.border
                    e.currentTarget.style.background = C.bg
                  }}
                />
                <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {values.confirmPassword && values.confirmPassword === values.password && (
                    <span style={{ color: C.ok, display: 'flex' }}><CheckSmall /></span>
                  )}
                  <button type="button" id="register-toggle-confirm"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirm(p => !p)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.dark)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                    <EyeIcon off={showConfirm} />
                  </button>
                </div>
              </div>
              {errors.confirmPassword && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 5, fontWeight: 500 }}>{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 11, cursor: 'pointer' }}>
                <div style={{ position: 'relative', marginTop: 2, flexShrink: 0 }}>
                  <input
                    id="register-agree" type="checkbox" checked={agreed}
                    onChange={e => { setAgreed(e.target.checked); if (e.target.checked) setAgreeError(false) }}
                    style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer', margin: 0 }}
                  />
                  <div style={{
                    width: 17, height: 17, borderRadius: 4,
                    border: `1.5px solid ${agreeError ? C.error : agreed ? C.dark : C.border}`,
                    background: agreed ? C.dark : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all .18s',
                  }}>
                    {agreed && <span style={{ color: '#fff', display: 'flex', transform: 'scale(0.85)' }}><CheckSmall /></span>}
                  </div>
                </div>
                <span style={{ fontSize: 12, lineHeight: 1.6, color: C.muted }}>
                  I agree to the{' '}
                  <Link href="#" style={{ color: C.dark, fontWeight: 700, textDecoration: 'none', borderBottom: `1px solid ${C.border}` }}>Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" style={{ color: C.dark, fontWeight: 700, textDecoration: 'none', borderBottom: `1px solid ${C.border}` }}>Privacy Policy</Link>
                </span>
              </label>
              {agreeError && (
                <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 5, fontWeight: 500, marginLeft: 28 }}>
                  You must agree to continue
                </p>
              )}
            </div>

            {/* Submit */}
            <button id="register-submit" type="submit" disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', paddingTop: 13, paddingBottom: 13,
                background: loading ? '#555' : C.dark, color: '#fff',
                border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background .18s, transform .15s',
                letterSpacing: '0.02em', marginTop: 2,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = C.dark; e.currentTarget.style.transform = 'none' } }}>
              {loading ? (
                <>
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" style={{ animation: 'auth-spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path fill="currentColor" fillOpacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p style={{ marginTop: 18, fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 1.7 }}>
            Protected by end-to-end encryption.{' '}
            <Link href="#" style={{ color: C.muted, fontWeight: 600, textDecoration: 'underline' }}>Learn more</Link>
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
