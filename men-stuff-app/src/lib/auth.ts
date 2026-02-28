/**
 * Auth utilities: cookie-based role and account_id.
 * Admin = có bản ghi trong bảng staff (kiểm tra ở middleware + API login).
 */

export type UserRole = 'guest' | 'user' | 'admin'

/**
 * Get user role from cookies (set by API login after verifying staff).
 */
export function getUserRole(cookies: { get: (name: string) => { value?: string } | undefined }): UserRole {
  const role = cookies.get('role')?.value
  if (role === 'user' || role === 'admin') return role
  return 'guest'
}

/**
 * Get account_id from cookie (set by API login). Server/middleware use.
 */
export function getAccountIdFromCookie(cookies: { get: (name: string) => { value?: string } | undefined }): string | undefined {
  return cookies.get('account_id')?.value
}

/**
 * Set user role in cookies (client-side, e.g. after guest→user).
 * Admin role is set only by API login after staff check.
 */
export function setUserRole(role: UserRole) {
  if (typeof document !== 'undefined') {
    document.cookie = `role=${role}; path=/; max-age=86400`
  }
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  if (requiredRole === 'guest') return true
  if (requiredRole === 'user') return userRole === 'user' || userRole === 'admin'
  if (requiredRole === 'admin') return userRole === 'admin'
  return false
}

/**
 * Check if current user is admin (server-side, from cookie only).
 * Middleware uses staff table check for admin routes.
 */
export function isAdmin(cookies: { get: (name: string) => { value?: string } | undefined }): boolean {
  return getUserRole(cookies) === 'admin'
}

/**
 * Logout: gọi API để xóa cookie httpOnly (account_id, role).
 */
export async function logout() {
  if (typeof document === 'undefined') return
  await fetch('/api/auth/logout', { method: 'POST' })
  document.cookie = 'role=; path=/; max-age=0'
}
