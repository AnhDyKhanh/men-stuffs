/**
 * Root page - redirects to default locale
 * This is handled by middleware, but keeping this as fallback
 */
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n';

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
