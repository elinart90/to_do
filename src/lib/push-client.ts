'use client'

// ── Helpers ──────────────────────────────────────────────────────────────────
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

/** ms until the next occurrence of hour:minute (today or tomorrow) */
export function msUntilTime(hour: number, minute: number): number {
  const now = new Date()
  const target = new Date()
  target.setHours(hour, minute, 0, 0)
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1)
  }
  return target.getTime() - now.getTime()
}

// ── Service Worker ────────────────────────────────────────────────────────────
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) return null
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    return reg
  } catch (e) {
    console.error('[PushClient] SW registration failed:', e)
    return null
  }
}

// ── Permission ────────────────────────────────────────────────────────────────
export async function requestPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function getPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported'
  return Notification.permission
}

// ── Subscription ──────────────────────────────────────────────────────────────
export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) return null
  try {
    const reg = await navigator.serviceWorker.ready
    return reg.pushManager.getSubscription()
  } catch {
    return null
  }
}

export async function subscribeToPush(): Promise<PushSubscription | null> {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!publicKey) {
    console.error('[PushClient] NEXT_PUBLIC_VAPID_PUBLIC_KEY not set')
    return null
  }

  const granted = await requestPermission()
  if (!granted) return null

  try {
    const reg = await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    if (existing) return existing

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
    return sub
  } catch (e) {
    console.error('[PushClient] Push subscribe failed:', e)
    return null
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const sub = await getExistingSubscription()
    if (!sub) return true
    return sub.unsubscribe()
  } catch {
    return false
  }
}

// ── Send subscription to server ───────────────────────────────────────────────
export async function saveSubscriptionToServer(
  subscription: PushSubscription,
  userId: string
): Promise<boolean> {
  try {
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: subscription.toJSON(), userId }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function removeSubscriptionFromServer(userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    return res.ok
  } catch {
    return false
  }
}

// ── Schedule local notifications via SW ──────────────────────────────────────
interface ScheduleOptions {
  id: string
  title: string
  body: string
  url?: string
  tag?: string
  delayMs: number
  requireInteraction?: boolean
}

export async function scheduleLocalNotification(opts: ScheduleOptions): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.ready
    reg.active?.postMessage({ type: 'SCHEDULE_NOTIFICATION', ...opts })
  } catch (e) {
    console.error('[PushClient] Schedule failed:', e)
  }
}

export async function cancelLocalNotification(id: string): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.ready
    reg.active?.postMessage({ type: 'CANCEL_NOTIFICATION', id })
  } catch {}
}

export async function cancelAllLocalNotifications(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.ready
    reg.active?.postMessage({ type: 'CANCEL_ALL' })
  } catch {}
}

// ── Schedule all daily Power OS alerts ───────────────────────────────────────
export interface NotificationPrefs {
  wakeup: boolean       // 6:00am
  winddown: boolean     // 1:00am
  habitReminder: boolean // 9:00pm
  financialCheck: boolean // 7:00pm
  pomodoroAlert: boolean  // instant on completion (handled by FocusClient)
}

export async function scheduleDailyNotifications(prefs: NotificationPrefs): Promise<void> {
  if (prefs.wakeup) {
    await scheduleLocalNotification({
      id: 'daily-wakeup',
      title: '⚡ Power OS — Rise & Conquer',
      body: "6am. Your competitors are still asleep. Get up. Read your DCA. Build your empire.",
      url: '/dashboard',
      tag: 'daily-wakeup',
      delayMs: msUntilTime(6, 0),
      requireInteraction: true,
    })
  }

  if (prefs.winddown) {
    await scheduleLocalNotification({
      id: 'daily-winddown',
      title: '🌙 Power OS — Empire Review Time',
      body: "1am. Stop building. Open your journal. Score your day. Plan tomorrow. Then sleep.",
      url: '/dashboard',
      tag: 'daily-winddown',
      delayMs: msUntilTime(1, 0),
      requireInteraction: true,
    })
  }

  if (prefs.habitReminder) {
    await scheduleLocalNotification({
      id: 'habit-reminder',
      title: '🔥 Power OS — Habit Check',
      body: "Your habits don't care how tired you are. Have you logged them today?",
      url: '/dashboard/habits',
      tag: 'habit-reminder',
      delayMs: msUntilTime(21, 0),
    })
  }

  if (prefs.financialCheck) {
    await scheduleLocalNotification({
      id: 'financial-check',
      title: '💰 Power OS — Money Review',
      body: "Did you log your expenses today? Millionaires know their numbers. Check your cashflow.",
      url: '/dashboard/goals',
      tag: 'financial-check',
      delayMs: msUntilTime(19, 0),
    })
  }
}

// ── Fire a Pomodoro completion notification instantly ─────────────────────────
export async function notifyPomodoroComplete(sessionCount: number): Promise<void> {
  const granted = await requestPermission()
  if (!granted) return

  // Use the Notification API directly for instant (no delay needed)
  try {
    const reg = await navigator.serviceWorker.ready
    reg.showNotification('🍅 Power OS — Session Complete', {
      body: `Deep work session #${sessionCount} done. Take your break — you earned it. 💪`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200, 100, 200],
      tag: 'pomodoro-done',
      renotify: true,
      data: { url: '/dashboard/focus' },
    })
  } catch {
    // Fallback to basic Notification API
    new Notification('🍅 Power OS — Session Complete', {
      body: `Deep work session #${sessionCount} done. Take your break — you earned it. 💪`,
      icon: '/favicon.ico',
    })
  }
}
