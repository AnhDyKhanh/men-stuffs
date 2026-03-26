'use client'

import { useEffect } from 'react'

/**
 * Force light theme for the whole admin route (including Radix portals),
 * by moving theme-related classes from a wrapper div to `documentElement`.
 */
export default function AdminThemeApplier() {
  useEffect(() => {
    const root = document.documentElement

    // Enable light token overrides from `.admin-theme` in `globals.css`
    root.classList.add('admin-theme', 'admin')

    // Disable Tailwind `dark:` variants globally for admin
    root.classList.remove('dark')

    return () => {
      // Restore default app behavior when leaving admin routes
      root.classList.remove('admin-theme', 'admin')
      root.classList.add('dark')
    }
  }, [])

  return null
}

