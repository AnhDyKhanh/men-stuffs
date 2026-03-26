import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
}

export function getFetchUrl(apiRoute: string) {
  // In browser, always use relative URL so requests follow current host/port.
  if (typeof window !== 'undefined') return apiRoute
  return `${getBaseUrl()}${apiRoute}`
}

// hàm này để compile path với params //check sau
export function compilePath(path: string, params: Record<string, string | number>) {
  return Object.entries(params).reduce((acc: string, [key, value]) => {
    return acc.replace(`:${key}`, String(value))
  }, path)
}
