import Link from 'next/link';
import { BookOpen, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pattern-islamic">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-[hsl(var(--primary)/0.15)] mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-[hsl(var(--muted-foreground))] mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us guide you back.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[hsl(168,80%,26%)] to-[hsl(168,60%,35%)]">
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <Link href="/lecturers" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]">
            <ArrowLeft className="h-4 w-4" /> Browse Scholars
          </Link>
        </div>
      </div>
    </div>
  );
}
