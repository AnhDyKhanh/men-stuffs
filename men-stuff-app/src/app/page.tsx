/**
 * Root page - redirects to default locale
 * This is handled by middleware, but keeping this as fallback
 */
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/vi');
}
