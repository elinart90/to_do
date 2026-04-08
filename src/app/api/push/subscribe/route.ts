import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { subscription, userId } = await req.json()

    if (!subscription || !userId) {
      return NextResponse.json({ error: 'Missing subscription or userId' }, { status: 400 })
    }

    const supabase = await createClient()

    // Upsert: one subscription record per user (replace on re-subscribe)
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        { user_id: userId, subscription, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )

    if (error) {
      console.error('[API/push/subscribe]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
