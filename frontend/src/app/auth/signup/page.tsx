'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const router = useRouter();

  return (
    <div className="min-h-screen flex">
      {/* Left block — Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">
              <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight">IlmConnect</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-[hsl(var(--muted-foreground))] mb-8">Start your Islamic education journey today</p>

          {/* Role toggle */}
          <div className="flex rounded-xl bg-[hsl(var(--muted))] p-1 mb-6">
            <button onClick={() => setRole('student')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${role === 'student' ? 'bg-[hsl(var(--card))] shadow-sm' : 'text-[hsl(var(--muted-foreground))]'}`}>I&apos;m a Student</button>
            <button onClick={() => setRole('lecturer')} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${role === 'lecturer' ? 'bg-[hsl(var(--card))] shadow-sm' : 'text-[hsl(var(--muted-foreground))]'}`}>I&apos;m a Lecturer</button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); router.push(`/${role}/dashboard`); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium mb-1.5">First name</label><input type="text" placeholder="Aisha" className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" /></div>
              <div><label className="block text-sm font-medium mb-1.5">Last name</label><input type="text" placeholder="Khan" className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" /></div>
            </div>
            <div><label className="block text-sm font-medium mb-1.5">Email address</label><input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" /></div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] pr-11" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs text-[hsl(var(--muted-foreground))]">
              <input type="checkbox" className="h-4 w-4 rounded mt-0.5" />
              <span>I agree to the <Link href="#" className="text-[hsl(var(--primary))] underline">Terms of Service</Link> and <Link href="#" className="text-[hsl(var(--primary))] underline">Privacy Policy</Link></span>
            </label>
            <button type="submit" className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-lg transition-all">
              Create Account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[hsl(var(--primary))] font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right block — Image */}
      <div className="hidden md:block w-1/2 relative">
        <Image src="/images/signin-side.png" alt="Islamic architecture and Quran" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-8 right-8 text-white">
          <p className="text-2xl font-bold leading-snug">&ldquo;The ink of the scholar is more sacred than the blood of the martyr&rdquo;</p>
          <p className="text-sm text-white/70 mt-2">— Prophet Muhammad ﷺ</p>
        </div>
      </div>
    </div>
  );
}
