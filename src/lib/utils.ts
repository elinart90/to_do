import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`
  return `$${value.toLocaleString()}`
}

export function getProgressColor(percent: number): string {
  if (percent >= 80) return 'text-emerald-400'
  if (percent >= 50) return 'text-amber-400'
  return 'text-red-400'
}

export function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 6) return 'Still grinding?'
  if (hour < 12) return 'Battle stations.'
  if (hour < 17) return 'Stay locked in.'
  if (hour < 22) return 'Finish strong.'
  return 'Late night grind.'
}
