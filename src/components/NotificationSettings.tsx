'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, BellOff, X, Check, Loader2, ChevronRight, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  registerServiceWorker,
  subscribeToPush,
  unsubscribeFromPush,
  getExistingSubscription,
  getPermissionStatus,
  saveSubscriptionToServer,
  removeSubscriptionFromServer,
  scheduleDailyNotifications,
  cancelAllLocalNotifications,
  type NotificationPrefs,
} from '@/lib/push-client'

interface Props {
  userId: string
}

const DEFAULT_PREFS: NotificationPrefs = {
  wakeup: true,
  winddown: true,
  habitReminder: true,
  financialCheck: true,
  pomodoroAlert: true,
}

const NOTIFICATION_TYPES = [
  {
    key: 'wakeup' as keyof NotificationPrefs,
    emoji: '⚡',
    title: '6:00am Wake-Up Call',
    desc: '"Rise & Conquer — your empire awaits."',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/5',
  },
  {
    key: 'winddown' as keyof NotificationPrefs,
    emoji: '🌙',
    title: '1:00am Wind-Down',
    desc: '"Stop building. Journal. Plan tomorrow. Sleep."',
    color: 'text-indigo-400',
    border: 'border-indigo-500/20',
    bg: 'bg-indigo-500/5',
  },
  {
    key: 'habitReminder' as keyof NotificationPrefs,
    emoji: '🔥',
    title: '9:00pm Habit Check',
    desc: '"Your habits don\'t care about your mood."',
    color: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/5',
  },
  {
    key: 'financialCheck' as keyof NotificationPrefs,
    emoji: '💰',
    title: '7:00pm Financial Check-in',
    desc: '"Millionaires know their numbers daily."',
    color: 'text-green-400',
    border: 'border-green-500/20',
    bg: 'bg-green-500/5',
  },
  {
    key: 'pomodoroAlert' as keyof NotificationPrefs,
    emoji: '🍅',
    title: 'Pomodoro Complete',
    desc: '"Instant alert when your deep work session ends."',
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/5',
  },
]

type Status = 'idle' | 'loading' | 'enabled' | 'disabled' | 'denied' | 'unsupported'

export default function NotificationSettings({ userId }: Props) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS)
  const [saving, setSaving] = useState(false)
  const [testSent, setTestSent] = useState(false)

  // Detect current state on mount
  useEffect(() => {
    const permission = getPermissionStatus()
    if (permission === 'unsupported') { setStatus('unsupported'); return }
    if (permission === 'denied') { setStatus('denied'); return }

    getExistingSubscription().then(sub => {
      setStatus(sub ? 'enabled' : 'disabled')
    })

    // Load saved prefs from localStorage
    try {
      const saved = localStorage.getItem('power-os-notif-prefs')
      if (saved) setPrefs(JSON.parse(saved))
    } catch {}
  }, [])

  const savePrefs = useCallback((p: NotificationPrefs) => {
    localStorage.setItem('power-os-notif-prefs', JSON.stringify(p))
  }, [])

  // Enable notifications
  async function handleEnable() {
    setSaving(true)
    try {
      await registerServiceWorker()
      const sub = await subscribeToPush()
      if (!sub) {
        const perm = getPermissionStatus()
        setStatus(perm === 'denied' ? 'denied' : 'disabled')
        return
      }
      await saveSubscriptionToServer(sub, userId)
      await scheduleDailyNotifications(prefs)
      setStatus('enabled')
      savePrefs(prefs)
    } finally {
      setSaving(false)
    }
  }

  // Disable notifications
  async function handleDisable() {
    setSaving(true)
    try {
      await cancelAllLocalNotifications()
      await unsubscribeFromPush()
      await removeSubscriptionFromServer(userId)
      setStatus('disabled')
    } finally {
      setSaving(false)
    }
  }

  // Toggle individual pref
  async function togglePref(key: keyof NotificationPrefs) {
    const newPrefs = { ...prefs, [key]: !prefs[key] }
    setPrefs(newPrefs)
    savePrefs(newPrefs)

    if (status === 'enabled') {
      await cancelAllLocalNotifications()
      await scheduleDailyNotifications(newPrefs)
    }
  }

  // Send a test notification
  async function sendTest() {
    if (!('serviceWorker' in navigator)) return
    setTestSent(true)
    const reg = await navigator.serviceWorker.ready
    reg.showNotification('⚡ Power OS — Test Notification', {
      body: "Notifications are working. You're locked in. Let's get to work.",
      icon: '/favicon.ico',
      tag: 'test',
      data: { url: '/dashboard' },
    })
    setTimeout(() => setTestSent(false), 3000)
  }

  const isEnabled = status === 'enabled'

  return (
    <>
      {/* Bell button — in sidebar */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 w-full',
          isEnabled
            ? 'text-indigo-400 hover:bg-indigo-500/10'
            : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
        )}
      >
        {isEnabled ? <Bell size={16} /> : <BellOff size={16} />}
        Notifications
        {isEnabled && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="relative w-full md:w-[440px] max-h-[90vh] overflow-y-auto bg-[#0d0d18] border border-white/[0.08] rounded-t-3xl md:rounded-2xl shadow-2xl animate-fade-in">
            {/* Handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center',
                  isEnabled ? 'bg-indigo-500/20' : 'bg-white/5'
                )}>
                  <Bell size={16} className={isEnabled ? 'text-indigo-400' : 'text-gray-500'} />
                </div>
                <div>
                  <div className="text-sm font-black text-white">Notifications</div>
                  <div className="text-xs text-gray-600">Power OS Alerts</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-white/5 text-gray-500">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">

              {/* Status banner */}
              {status === 'unsupported' && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200">
                    <strong>Browser not supported.</strong> Push notifications require a modern browser (Chrome, Edge, or Firefox).
                    Safari on iOS has limited support.
                  </div>
                </div>
              )}

              {status === 'denied' && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-red-200">
                    <strong>Permission denied.</strong> You've blocked notifications for this site.
                    Go to your browser settings → Site Settings → Notifications → Allow this site.
                  </div>
                </div>
              )}

              {/* Master toggle */}
              {status !== 'unsupported' && status !== 'denied' && (
                <div className={cn(
                  'flex items-center justify-between p-4 rounded-2xl border transition-all',
                  isEnabled
                    ? 'bg-indigo-500/10 border-indigo-500/25'
                    : 'bg-white/[0.03] border-white/[0.07]'
                )}>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {isEnabled ? '🔔 Notifications Active' : '🔕 Notifications Off'}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {isEnabled
                        ? 'Your Power OS alerts are running.'
                        : 'Enable to get daily reminders + Pomodoro alerts.'}
                    </div>
                  </div>

                  <button
                    onClick={isEnabled ? handleDisable : handleEnable}
                    disabled={saving || status === 'loading'}
                    className={cn(
                      'relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ml-4',
                      isEnabled ? 'bg-indigo-500' : 'bg-white/10',
                      saving && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {saving ? (
                      <Loader2 size={12} className="absolute inset-0 m-auto text-white animate-spin" />
                    ) : (
                      <div className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300',
                        isEnabled ? 'left-7' : 'left-1'
                      )} />
                    )}
                  </button>
                </div>
              )}

              {/* Individual notification types */}
              {status !== 'unsupported' && status !== 'denied' && (
                <div className="space-y-2">
                  <div className="text-xs font-black text-gray-600 uppercase tracking-widest px-1 mb-3">
                    Alert Types
                  </div>
                  {NOTIFICATION_TYPES.map(({ key, emoji, title, desc, color, border, bg }) => (
                    <button
                      key={key}
                      onClick={() => isEnabled && togglePref(key)}
                      disabled={!isEnabled}
                      className={cn(
                        'w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all',
                        isEnabled ? 'hover:bg-white/[0.03] cursor-pointer' : 'opacity-40 cursor-not-allowed',
                        prefs[key] && isEnabled ? `${bg} ${border}` : 'bg-white/[0.02] border-white/[0.06]'
                      )}
                    >
                      <span className="text-xl shrink-0">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className={cn('text-xs font-bold', prefs[key] && isEnabled ? color : 'text-gray-400')}>
                          {title}
                        </div>
                        <div className="text-[10px] text-gray-600 mt-0.5 italic">{desc}</div>
                      </div>
                      <div className={cn(
                        'w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all',
                        prefs[key] && isEnabled
                          ? 'bg-indigo-500 border-indigo-500'
                          : 'border-white/20 bg-transparent'
                      )}>
                        {prefs[key] && isEnabled && <Check size={11} className="text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Test notification */}
              {isEnabled && (
                <button
                  onClick={sendTest}
                  disabled={testSent}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all border',
                    testSent
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-white/[0.03] border-white/[0.07] text-gray-400 hover:bg-white/[0.06] hover:text-white'
                  )}
                >
                  {testSent ? (
                    <><Check size={14} /> Notification Sent!</>
                  ) : (
                    <><Bell size={14} /> Send Test Notification</>
                  )}
                </button>
              )}

              {/* Info box */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                <div className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-2">How It Works</div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <ChevronRight size={12} className="shrink-0 mt-0.5 text-indigo-400" />
                    <span>Notifications are <strong className="text-gray-400">scheduled when you open the app</strong> and fire even when you switch tabs.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight size={12} className="shrink-0 mt-0.5 text-indigo-400" />
                    <span>For alerts when your <strong className="text-gray-400">browser is fully closed</strong>, keep the app tab open in the background.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ChevronRight size={12} className="shrink-0 mt-0.5 text-indigo-400" />
                    <span>Pomodoro alerts fire <strong className="text-gray-400">instantly</strong> when your session ends, even if you're in another tab.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
