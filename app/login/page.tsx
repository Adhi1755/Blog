'use client'

import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

type FormState = { email: string; password: string }
type FieldError = Partial<FormState>

function validate(v: FormState): FieldError {
  const e: FieldError = {}
  if (!v.email) e.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'Enter a valid email address'
  if (!v.password) e.password = 'Password is required'
  else if (v.password.length < 6) e.password = 'Password must be at least 6 characters'
  return e
}

function FieldWrap({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return <label htmlFor={htmlFor} className="text-sm font-semibold text-black">{children}</label>
}

function ErrorMsg({ id, msg }: { id: string; msg: string }) {
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
      <svg className="h-3 w-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [values, setValues] = useState<FormState>({ email: '', password: '' })
  const [errors, setErrors] = useState<FieldError>({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    const result = await login(values.email, values.password)
    setLoading(false)
    if (result.error) { setServerError(result.error); return }
    router.push('/dashboard')
  }

  const inputBase = "w-full border bg-white py-3 pl-10 pr-4 text-sm text-black placeholder-neutral-400 outline-none transition-all duration-150"
  const inputNormal = "border-neutral-200 focus:border-black"
  const inputError = "border-neutral-400 focus:border-black"

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16 bg-white">
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
            <h1 className="text-2xl font-black tracking-tight text-black">Sign in</h1>
            <p className="mt-1.5 text-sm text-neutral-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-black underline underline-offset-2 transition-colors hover:text-neutral-600">
                Create one free
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

          <form id="login-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <FieldWrap>
              <Label htmlFor="login-email">Email address</Label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <input
                  id="login-email" name="email" type="email" autoComplete="email"
                  value={values.email} onChange={handleChange} placeholder="you@example.com"
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'login-email-error' : undefined}
                  className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                />
              </div>
              {errors.email && <ErrorMsg id="login-email-error" msg={errors.email} />}
            </FieldWrap>

            {/* Password */}
            <FieldWrap>
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link href="#" className="text-xs text-neutral-500 underline underline-offset-2 transition-colors hover:text-black">Forgot password?</Link>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-neutral-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  id="login-password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password" value={values.password} onChange={handleChange}
                  placeholder="••••••••" aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  className={`${inputBase} pr-11 ${errors.password ? inputError : inputNormal}`}
                />
                <button
                  type="button" id="login-toggle-password"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-neutral-400 transition-colors hover:text-black"
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <ErrorMsg id="login-password-error" msg={errors.password} />}
            </FieldWrap>

            {/* Submit */}
            <button
              id="login-submit" type="submit" disabled={loading}
              className="group mt-1 flex w-full items-center justify-center gap-2 border border-black bg-black py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <svg className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-400">
          By signing in you agree to our{' '}
          <Link href="#" className="text-neutral-500 underline underline-offset-2 hover:text-black">Terms</Link>
          {' '}and{' '}
          <Link href="#" className="text-neutral-500 underline underline-offset-2 hover:text-black">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
