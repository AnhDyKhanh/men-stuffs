/**
 * Simple cookie-based authentication utilities
 * Mock implementation for role-based access control
 */

export type UserRole = 'guest' | 'user' | 'admin';

/**
 * Mock admin credentials
 */
export const MOCK_ADMIN = {
  email: 'admin@menstuff.local',
  password: 'admin123',
  role: 'admin' as const,
};

/**
 * Get user role from cookies
 */
export function getUserRole(cookies: any): UserRole {
  const role = cookies.get('role')?.value;
  if (role === 'user' || role === 'admin') {
    return role;
  }
  return 'guest';
}

/**
 * Set user role in cookies (for mock auth)
 * Client-side only
 */
export function setUserRole(role: UserRole) {
  if (typeof document !== 'undefined') {
    document.cookie = `role=${role}; path=/; max-age=86400`; // 24 hours
  }
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  if (requiredRole === 'guest') return true;
  if (requiredRole === 'user') return userRole === 'user' || userRole === 'admin';
  if (requiredRole === 'admin') return userRole === 'admin';
  return false;
}

/**
 * Check if current user is admin (server-side)
 */
export function isAdmin(cookies: any): boolean {
  return getUserRole(cookies) === 'admin';
}

/**
 * Login as admin (client-side)
 * Validates credentials and sets admin cookie
 */
export function loginAsAdmin(email: string, password: string): boolean {
  if (email === MOCK_ADMIN.email && password === MOCK_ADMIN.password) {
    setUserRole('admin');
    return true;
  }
  return false;
}

/**
 * Logout (client-side)
 * Removes role cookie
 */
export function logout() {
  if (typeof document !== 'undefined') {
    document.cookie = 'role=; path=/; max-age=0';
  }
}

