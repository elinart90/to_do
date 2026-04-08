'use client'

import { useEffect } from 'react'
import {
  registerServiceWorker,
  getExistingSubscription,
  scheduleDailyNotifications,
} from '@/lib/push-client'
import type { NotificationPrefs } from '@/lib/push-client'

/**
 * Runs silently on mount:
 * 1. Registers the service worker
 * 2. If push is already subscribed, reschedules today's notifications
 *    (important after page refresh — timers are lost when SW restarts)
 */
export default function NotificationInit() {
  useEffect(() => {
    async function init() {
      await registerServiceWorker()

      const sub = await getExistingSubscription()
      if (!sub) return

      // Reload saved prefs and reschedule
      try {
        const raw = localStorage.getItem('power-os-notif-prefs')
        const prefs: NotificationPrefs = raw
          ? JSON.parse(raw)
          : { wakeup: true, winddown: true, habitReminder: true, financialCheck: true, pomodoroAlert: true }

        await scheduleDailyNotifications(prefs)
      } catch (e) {
        console.error('[NotificationInit]', e)
      }
    }

    init()
  }, [])

  return null
}
