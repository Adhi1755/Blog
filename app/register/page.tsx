'use client'

import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

type FormState = { name: string; email: string; password: string; confirmPassword: string }
type FieldError = Partial<FormState>

function getStrength(pw: string): { score: number; label: string } {
  if (!pw) return { score: 0, label: '' }
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  const map = [
    { score: 1, label: 'Weak' },
    { score: 2, label: 'Fair' },
    { score: 3, label: 'Good' },
    { score: 4, label: 'Strong' },
  ]
  return map[s - 1] ?? { score: 0, label: '' }
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

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="text-sm font-semibold text-black">{children}</label>
}

function ErrorMsg({ id, msg }: { id?: string; msg: string }) {
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-xs text-black font-medium">
      <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [values, setValues] = useState<FormState>({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<FieldError>({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [agreeError, setAgreeError] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setServerError('')
    if (errors[name as keyof FieldError]) setErrors((prev) => ({ ...prev, [name]: undefined }))
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
  const inputBase = "w-full border bg-white py-3 pl-10 pr-4 text-sm text-black placeholder-neutral-400 outline-none transition-all duration-150"
  const inputNormal = "border-neutral-200 focus:border-black"
  const inputError = "border-neutral-400 focus:border-black"
  const inputOk = "border-neutral-300 focus:border-black"

  const strengthColors = ['bg-neutral-200', 'bg-neutral-400', 'bg-neutral-600', 'bg-black']

  const EyeOpen = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
  const EyeClosed = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  )

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16 bg-white">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="border border-neutral-200 bg-white p-8 sm:p-10">

          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center border border-black bg-black text-xs font-black text-white">B</span>
            <span className="text-sm font-bold text-black">BlogSpace</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black tracking-tight text-black">Create an account</h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Already have one?{' '}
              <Link href="/login" className="font-semibold text-black underline underline-offset-2 transition-colors hover:text-neutral-600">
                Sign in instead
              </Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div role="alert" className="mb-6 flex items-start gap-2.5 border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-black">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {serverError}
            </div>
          )}

          <form id="register-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="register-name">Full name</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <input id="register-name" name="name" type="text" autoComplete="name"
                  value={values.name} onChange={handleChange} placeholder="Jane Doe"
                  aria-invalid={!!errors.name} aria-describedby={errors.name ? 'register-name-error' : undefined}
                  className={`${inputBase} ${errors.name ? inputError : inputNormal}`} />
              </div>
              {errors.name && <ErrorMsg id="register-name-error" msg={errors.name} />}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="register-email">Email address</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input id="register-email" name="email" type="email" autoComplete="email"
                  value={values.email} onChange={handleChange} placeholder="you@example.com"
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'register-email-error' : undefined}
                  className={`${inputBase} ${errors.email ? inputError : inputNormal}`} />
              </div>
              {errors.email && <ErrorMsg id="register-email-error" msg={errors.email} />}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input id="register-password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password" value={values.password} onChange={handleChange}
                  placeholder="Min. 8 characters" aria-invalid={!!errors.password}
                  aria-describedby="register-password-hint"
                  className={`${inputBase} pr-11 ${errors.password ? inputError : inputNormal}`} />
                <button type="button" id="register-toggle-password"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-neutral-400 transition-colors hover:text-black">
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
              {/* Strength meter - B&W version */}
              {values.password && (
                <div id="register-password-hint" className="flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className={`h-0.5 flex-1 transition-all duration-200 ${n <= strength.score ? strengthColors[strength.score - 1] : 'bg-neutral-100'}`} />
                    ))}
                  </div>
                  {strength.label && <span className="text-xs text-neutral-500 font-medium">{strength.label}</span>}
                </div>
              )}
              {errors.password && <ErrorMsg msg={errors.password} />}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="register-confirm">Confirm password</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </span>
                <input id="register-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password" value={values.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter your password" aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'register-confirm-error' : undefined}
                  className={`${inputBase} pr-20 ${errors.confirmPassword ? inputError : values.confirmPassword && values.confirmPassword === values.password ? inputOk : inputNormal}`} />
                <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3.5">
                  {values.confirmPassword && values.confirmPassword === values.password && (
                    <svg className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <button type="button" id="register-toggle-confirm"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirm((p) => !p)}
                    className="flex items-center text-neutral-400 transition-colors hover:text-black">
                    {showConfirm ? <EyeClosed /> : <EyeOpen />}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && <ErrorMsg id="register-confirm-error" msg={errors.confirmPassword} />}
            </div>

            {/* Terms */}
            <div className="flex flex-col gap-1">
              <label className="flex cursor-pointer items-start gap-3">
                <div className="relative mt-0.5 shrink-0">
                  <input id="register-agree" type="checkbox" checked={agreed}
                    onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setAgreeError(false) }}
                    className="peer sr-only" />
                  <div className={`flex h-4 w-4 items-center justify-center border transition-all duration-150 peer-checked:border-black peer-checked:bg-black peer-focus-visible:ring-1 peer-focus-visible:ring-black/30 ${agreeError ? 'border-neutral-400' : 'border-neutral-300 bg-white'}`}>
                    {agreed && (
                      <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs leading-5 text-neutral-500">
                  I agree to the{' '}
                  <Link href="#" className="font-semibold text-black underline underline-offset-2 hover:text-neutral-600">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="#" className="font-semibold text-black underline underline-offset-2 hover:text-neutral-600">Privacy Policy</Link>
                </span>
              </label>
              {agreeError && <p role="alert" className="ml-7 text-xs text-black font-medium">You must agree to continue</p>}
            </div>

            {/* Submit */}
            <button id="register-submit" type="submit" disabled={loading}
              className="group mt-1 flex w-full items-center justify-center gap-2 border border-black bg-black py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <svg className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-400">
          Protected by end-to-end encryption.{' '}
          <Link href="#" className="text-neutral-500 underline underline-offset-2 hover:text-black">Learn more</Link>
        </p>
      </div>
    </div>
  )
}
