'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      login(data.user, data.token);
      const rawRole = (data.user?.role || '').toLowerCase();
      const routeRole = rawRole === 'super_admin' ? 'admin' : rawRole;
      router.push(`/${routeRole}/dashboard`);
    } catch (err) {
      setError(getErrorMessage(err, 'Invalid email or password. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-stone-950">
      <div className="grid min-h-screen w-full gap-0 lg:grid-cols-[1fr_1.06fr]">
        <section className="flex min-h-screen flex-col justify-between bg-white px-7 py-8 sm:px-12 lg:px-20">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 shadow-xs transition-transform group-hover:scale-105">
                <BookOpen className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-stone-950">Ilm</span>
                <span className="text-emerald-700">Connect</span>
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-stone-200 px-3 text-xs font-bold text-stone-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-[hsl(var(--primary))]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md py-10 lg:-mt-8">
            <div className="mb-9">
              <h1 className="text-4xl font-black tracking-tight text-stone-950">Welcome back</h1>
              <p className="mt-3 text-base font-medium text-stone-500">
                Sign in to continue your learning journey
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-stone-800">
                  Email address*
                </label>
                <input
                  id="email"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-14 w-full rounded-full border border-stone-200 bg-white px-5 text-base text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-stone-800">
                  Password*
                </label>
                <div className="relative">
                  <input
                    id="password"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-14 w-full rounded-full border border-stone-200 bg-white px-5 pr-12 text-base text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-stone-300 text-[hsl(var(--primary))]" />
                  Remember me
                </label>
                <Link href="/auth/forgot-password" className="text-xs font-bold text-[hsl(var(--primary))] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="mt-3 h-14 w-full rounded-full bg-stone-950 text-base font-bold text-white shadow-[0_18px_36px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[hsl(var(--primary))] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-5 text-sm font-medium text-stone-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-bold text-[hsl(var(--primary))] hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <p className="text-xs font-medium text-stone-400">Secure scholar-led learning, wherever you are.</p>
        </section>

        <aside className="relative hidden min-h-screen overflow-hidden bg-stone-950 lg:block">
          <Image
            src="/images/signin-side.png"
            alt="Islamic learning environment"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          {/* Light black overlay across picture for higher text visibility like hero */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/50 to-stone-950/20" />
          <div className="absolute inset-x-10 bottom-16 text-center text-white">
            <blockquote className="mx-auto max-w-2xl text-4xl font-black leading-tight tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]">
              &ldquo;Seek knowledge from the cradle to the grave&rdquo;
            </blockquote>
            <p className="mt-5 text-lg font-semibold text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)]">
              — Prophet Muhammad ﷺ
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
