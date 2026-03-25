const STORAGE_KEY = 'menstuff:product-clicks-by-day'

type DailyClicks = Record<string, Record<string, number>>

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function readStore(): DailyClicks {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as DailyClicks
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: DailyClicks) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Ignore quota/private mode errors.
  }
}

export function trackProductClick(productId: string) {
  if (!productId) return
  const today = getTodayKey()
  const store = readStore()
  const todayMap = store[today] ?? {}
  todayMap[productId] = (todayMap[productId] ?? 0) + 1
  store[today] = todayMap
  writeStore(store)
}

export function getHotProductIdsToday(limit = 6): string[] {
  const today = getTodayKey()
  const store = readStore()
  const todayMap = store[today] ?? {}
  return Object.entries(todayMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id)
}

