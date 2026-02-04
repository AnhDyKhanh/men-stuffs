'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Language switcher component
 * Switches locale while preserving the current path
 */
export default function LanguageSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname();
  
  // Remove current locale from pathname
  const pathWithoutLocale = pathname.replace(/^\/(vi|en)/, '') || '/';
  
  return (
    <div className="flex gap-2">
      <Link 
        href={`/vi${pathWithoutLocale}`}
        className={lang === 'vi' ? 'font-bold' : ''}
      >
        VI
      </Link>
      <span>|</span>
      <Link 
        href={`/en${pathWithoutLocale}`}
        className={lang === 'en' ? 'font-bold' : ''}
      >
        EN
      </Link>
    </div>
  );
}

