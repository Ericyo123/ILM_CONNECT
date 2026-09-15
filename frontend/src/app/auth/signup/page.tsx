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

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      const cleanEmail = email.trim().toLowerCase();
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: cleanEmail,
          password,
          role: 'STUDENT',
          fullName: `${firstName} ${lastName}`.trim(),
          phone: '000000000',
          country: 'Unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });

      const loginRes = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      login(loginRes.user, loginRes.token);
      router.push(`/student/dashboard`);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create account'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8f5] text-stone-950">
      <div className="grid min-h-screen w-full gap-0 lg:grid-cols-[1fr_1.06fr]">
        <section className="flex min-h-screen flex-col justify-between bg-white px-7 py-8 sm:px-12 lg:px-20">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex w-fit items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-[hsl(var(--primary))]">
                <BookOpen className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-black tracking-tight">
                <span>Ilm</span>
                <span className="text-[hsl(var(--primary))]">Connect</span>
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

          <div className="mx-auto w-full max-w-md py-8 lg:-mt-4">
            <div className="mb-8">
              <h1 className="text-4xl font-black tracking-tight text-stone-950">Create your account</h1>
              <p className="mt-3 text-base font-medium text-stone-500">
                Start your Islamic education journey today
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="mb-2 block text-sm font-bold text-stone-800">
                    First name*
                  </label>
                  <input
                    id="first-name"
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Aisha"
                    className="h-14 w-full rounded-full border border-stone-200 bg-white px-5 text-base text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="mb-2 block text-sm font-bold text-stone-800">
                    Last name*
                  </label>
                  <input
                    id="last-name"
                    required
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Khan"
                    className="h-14 w-full rounded-full border border-stone-200 bg-white px-5 text-base text-stone-900 shadow-sm outline-none transition-all placeholder:text-stone-400 focus:border-[hsl(var(--primary))] focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

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
                    placeholder="Min 8 characters"
                    minLength={6}
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

              <label className="flex items-start gap-2 pt-1 text-xs font-medium leading-relaxed text-stone-600">
                <input required type="checkbox" className="mt-0.5 h-4 w-4 rounded border-stone-300 text-[hsl(var(--primary))]" />
                <span>
                  I agree to the{' '}
                  <Link href="#" className="font-bold text-stone-900 hover:text-[hsl(var(--primary))]">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="font-bold text-stone-900 hover:text-[hsl(var(--primary))]">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <button
                disabled={isLoading}
                type="submit"
                className="mt-3 h-14 w-full rounded-full bg-stone-950 text-base font-bold text-white shadow-[0_18px_36px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[hsl(var(--primary))] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-5 text-sm font-medium text-stone-500">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-bold text-[hsl(var(--primary))] hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-xs font-medium text-stone-400">Your free trial starts with a live 1:1 session.</p>
        </section>

        <aside className="relative hidden min-h-screen overflow-hidden rounded-bl-[3rem] rounded-tl-[3rem] bg-stone-950 lg:block">
          <Image
            src="/images/signin-side.png"
            alt="Islamic learning environment"
            fill
            priority
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/94 via-stone-950/38 to-stone-950/8" />
          <div className="absolute inset-x-10 bottom-16 text-center text-white">
            <blockquote className="mx-auto max-w-2xl text-4xl font-black leading-tight tracking-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.65)]">
              &ldquo;The ink of the scholar is more sacred than the blood of the martyr&rdquo;
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
