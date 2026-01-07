'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

/**
 * Logout button component for admin
 */
export default function LogoutButton({ locale }: { locale: string }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/login`);
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition"
    >
      Logout
    </button>
  );
}

