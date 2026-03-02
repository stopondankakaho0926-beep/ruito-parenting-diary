import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// This is critical: we need to use the service role key for database writes
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  if (!stripe) {
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 503 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        // Extract metadata
        const articleId = session.metadata?.article_id
        const userEmail = session.metadata?.user_email || session.customer_email

        if (!articleId || !userEmail) {
          console.error('Missing metadata in checkout session')
          return NextResponse.json(
            { error: 'Missing metadata' },
            { status: 400 }
          )
        }

        // Record the purchase
        const purchaseData = {
          article_id: articleId,
          user_email: userEmail,
          stripe_payment_id: session.payment_intent as string,
          status: 'completed',
        }

        const { error: insertError } = await supabaseAdmin
          .from('purchases')
          .insert(purchaseData as any)

        if (insertError) {
          console.error('Failed to record purchase:', insertError)
          return NextResponse.json(
            { error: 'Failed to record purchase' },
            { status: 500 }
          )
        }

        console.log(`Purchase recorded: ${articleId} for ${userEmail}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        console.error('Payment failed:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
