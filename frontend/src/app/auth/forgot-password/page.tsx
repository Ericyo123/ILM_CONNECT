'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, ChevronRight, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 pattern-islamic">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="h-12 w-12 rounded-xl bg-[#095F46] p-2 flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
              <Image
                src="/images/ilmbit-icon-white.png"
                alt="Ilmbit Logo"
                width={34}
                height={34}
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold">
              <span>Ilm</span>
              <span className="text-[#095F46]">bit</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Enter your email and we&apos;ll send you a reset link</p>
        </div>
        <div className="p-6 sm:p-8 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-lg">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                <input id="email" type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
              </div>
            </div>
            <button type="submit" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)] hover:shadow-lg transition-all">
              Send Reset Link <ChevronRight className="h-4 w-4" />
            </button>
          </form>
        </div>
        <Link href="/auth/signin" className="flex items-center justify-center gap-1 text-sm text-[hsl(var(--muted-foreground))] mt-6 hover:text-[hsl(var(--primary))]">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
