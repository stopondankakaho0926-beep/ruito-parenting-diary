import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { articleId, userEmail } = await request.json()

    if (!articleId || !userEmail) {
      return NextResponse.json(
        { error: 'Article ID and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Get article details
    const supabase = await createClient()
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .eq('published', true)
      .single()

    if (error || !article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    if (!article.is_paid || !article.price) {
      return NextResponse.json(
        { error: 'Article is not for sale' },
        { status: 400 }
      )
    }

    // Check if already purchased
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('*')
      .eq('article_id', articleId)
      .eq('user_email', userEmail)
      .eq('status', 'completed')
      .single()

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'Already purchased' },
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: article.title,
              description: article.excerpt || '有料記事',
            },
            unit_amount: article.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userEmail,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/articles/${article.slug}?purchased=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/articles/${article.slug}`,
      metadata: {
        article_id: articleId,
        user_email: userEmail,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
