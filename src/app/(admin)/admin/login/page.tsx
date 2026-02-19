'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Eye, EyeOff, LogIn, Loader2, Lock, Mail } from 'lucide-react'
import {createClientSupabaseClient } from '@/src/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
const redirect = searchParams.get('redirect') ?? '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase =createClientSupabaseClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Invalid email or password')
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('Please verify your email before logging in')
        } else if (error.message.includes('Too many requests')) {
          toast.error('Too many attempts. Please wait a few minutes and try again.')
        } else {
          toast.error(error.message)
        }
        return
      }

      toast.success('Welcome back!')
      router.push(redirect)
      router.refresh()
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      toast.error('Enter your email address first')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset email sent. Check your inbox.')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(139,31,168,0.35) 0%, rgba(15,15,19,1) 60%)' }}>

      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 rounded-full opacity-20 blur-3xl"
        style={{ background: 'var(--purple)' }} />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 rounded-full opacity-15 blur-3xl"
        style={{ background: 'var(--gold)' }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, var(--purple-dark), var(--purple))' }}>
            <Lock className="w-6 h-6 text-gold-gradient" style={{ color: 'var(--gold)' }} />
          </div>
          <h1 className="text-3xl mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
            <span className="text-gold-gradient">Admin</span> Portal
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-faint)' }}>
            Sign in to manage your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="card p-8" style={{ background: 'rgba(26,18,37,0.9)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-faint)' }} />
                <input
                  type="email"
                  className="input pl-10"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: 'var(--text-faint)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-faint)' }}
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded"
                  style={{ accentColor: 'var(--purple)' }}
                />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm transition-colors hover:underline"
                style={{ color: 'var(--gold)' }}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                : <><LogIn className="w-4 h-4" /> Sign In</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-faint)' }}>secure access</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <p className="text-center text-xs" style={{ color: 'var(--text-faint)' }}>
            Protected by Supabase Auth &amp; Row-Level Security
          </p>
        </div>
      </div>
    </main>
  )
}