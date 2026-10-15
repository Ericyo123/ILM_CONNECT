'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PublicZoomController() {
  const pathname = usePathname();

  useEffect(() => {
    const isInternal =
      pathname.startsWith('/student') ||
      pathname.startsWith('/lecturer') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/auth');

    const root = document.documentElement;

    if (isInternal) {
      root.classList.remove('public-zoom-root');
    } else {
      root.classList.add('public-zoom-root');
    }
  }, [pathname]);

  return null;
}
