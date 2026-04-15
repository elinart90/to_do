import { NextRequest, NextResponse } from 'next/server'
import webPush from 'web-push'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  webPush.setVapidDetails(
    process.env.VAPID_EMAIL!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )
  try {
    const { userId, title, body, url, tag, requireInteraction } = await req.json()

    if (!userId || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'No subscription found for user' }, { status: 404 })
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/dashboard',
      tag: tag || 'power-os',
      requireInteraction: requireInteraction || false,
    })

    await webPush.sendNotification(data.subscription as webPush.PushSubscription, payload)

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const err = e as { statusCode?: number; message?: string }
    // 410 = subscription expired/unsubscribed — clean it up
    if (err?.statusCode === 410) {
      const { userId } = await req.json().catch(() => ({}))
      if (userId) {
        const supabase = await createClient()
        await supabase.from('push_subscriptions').delete().eq('user_id', userId)
      }
      return NextResponse.json({ error: 'Subscription expired' }, { status: 410 })
    }
    console.error('[API/push/send]', e)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
