import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'horizontal' | 'icon' | 'stacked';
  color?: 'green' | 'white' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  className?: string;
}

export default function Logo({
  variant = 'horizontal',
  color = 'auto',
  size = 'md',
  href = '/',
  className = '',
}: LogoProps) {
  // Dimensions based on size
  const iconSizes = {
    sm: { box: 'h-8 w-8 rounded-lg', img: 24, text: 'text-sm' },
    md: { box: 'h-10 w-10 sm:h-11 sm:w-11 rounded-xl', img: 30, text: 'text-lg sm:text-xl' },
    lg: { box: 'h-12 w-12 rounded-xl', img: 36, text: 'text-xl sm:text-2xl' },
    xl: { box: 'h-16 w-16 rounded-2xl', img: 48, text: 'text-2xl sm:text-3xl' },
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {variant === 'stacked' ? (
        <Image
          src={color === 'white' ? '/images/ilmbit-logo-white.png' : '/images/ilmbit-logo-green.png'}
          alt="Ilmbit Logo"
          width={size === 'xl' ? 140 : size === 'lg' ? 110 : 85}
          height={size === 'xl' ? 180 : size === 'lg' ? 140 : 110}
          className="object-contain"
          priority
        />
      ) : (
        <>
          <div
            className={`flex ${iconSizes.box} items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${
              color === 'white'
                ? 'bg-[#095F46]/40 border border-[#095F46]/60 shadow-md backdrop-blur-sm'
                : 'bg-[#095F46] text-white shadow-sm'
            }`}
          >
            <Image
              src="/images/ilmbit-icon-white.png"
              alt="Ilmbit Logo Icon"
              width={iconSizes.img}
              height={iconSizes.img}
              className="object-contain"
              priority
            />
          </div>
          {variant === 'horizontal' && (
            <span className={`${iconSizes.text} font-bold tracking-tight`}>
              <span className={color === 'white' ? 'text-white' : 'text-stone-950'}>Ilm</span>
              <span className={color === 'white' ? 'text-emerald-400' : 'text-[#095F46]'}>bit</span>
            </span>
          )}
        </>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
