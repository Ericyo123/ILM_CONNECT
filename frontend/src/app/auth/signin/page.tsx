'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleDemoLogin = (role: 'student' | 'lecturer' | 'admin') => {
    router.push(`/${role}/dashboard`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:3001/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }
      const userRole = data.user.role.toLowerCase();
      router.push(`/${userRole}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Connection to authentication server failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left block — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">
              <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">IlmConnect</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-[hsl(var(--muted-foreground))] mb-8">Sign in to continue your learning journey</p>

          {error && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] pr-11 transition-colors" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 rounded" /> Remember me</label>
              <Link href="/auth/forgot-password" className="text-sm text-[hsl(var(--primary))] hover:underline">Forgot password?</Link>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-lg transition-all">
              Sign In
            </button>
          </form>

          {/* Demo Access */}
          <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
            <p className="text-xs text-[hsl(var(--muted-foreground))] text-center mb-3">Quick Demo Access</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { role: 'student' as const, label: 'Student', color: 'text-[hsl(var(--primary))]' },
                { role: 'lecturer' as const, label: 'Lecturer', color: 'text-purple-600 dark:text-purple-400' },
                { role: 'admin' as const, label: 'Admin', color: 'text-amber-600 dark:text-amber-400' },
              ].map((d) => (
                <button key={d.role} onClick={() => handleDemoLogin(d.role)} className={`py-2 rounded-xl text-xs font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors ${d.color}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-[hsl(var(--primary))] font-medium hover:underline">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right block — Image */}
      <div className="hidden md:block w-1/2 relative">
        <Image src="/images/signin-side.png" alt="Islamic architecture and Quran" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-8 right-8 text-white">
          <p className="text-2xl font-bold leading-snug">&ldquo;Seek knowledge from the cradle to the grave&rdquo;</p>
          <p className="text-sm text-white/70 mt-2">— Prophet Muhammad ﷺ</p>
        </div>
      </div>
    </div>
  );
}
