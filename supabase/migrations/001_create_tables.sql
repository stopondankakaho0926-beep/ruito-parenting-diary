-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    published BOOLEAN DEFAULT false NOT NULL,
    is_paid BOOLEAN DEFAULT false NOT NULL,
    price INTEGER, -- Price in cents (e.g., 500 = $5.00)
    paywall_position INTEGER, -- Character position where paywall starts
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    stripe_payment_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed', -- completed, refunded, etc.
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create subscriptions table (for Phase 2)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_email TEXT UNIQUE NOT NULL,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL, -- active, canceled, past_due, etc.
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS articles_slug_idx ON public.articles(slug);
CREATE INDEX IF NOT EXISTS articles_published_idx ON public.articles(published);
CREATE INDEX IF NOT EXISTS articles_author_id_idx ON public.articles(author_id);
CREATE INDEX IF NOT EXISTS purchases_article_id_idx ON public.purchases(article_id);
CREATE INDEX IF NOT EXISTS purchases_user_email_idx ON public.purchases(user_email);
CREATE INDEX IF NOT EXISTS purchases_stripe_payment_id_idx ON public.purchases(stripe_payment_id);
CREATE INDEX IF NOT EXISTS subscriptions_user_email_idx ON public.subscriptions(user_email);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON public.subscriptions(stripe_subscription_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles table
-- Anyone can read published articles
CREATE POLICY "Anyone can read published articles"
    ON public.articles FOR SELECT
    USING (published = true);

-- Authenticated users (admin) can read all articles
CREATE POLICY "Authenticated users can read all articles"
    ON public.articles FOR SELECT
    TO authenticated
    USING (true);

-- Only article authors can insert articles
CREATE POLICY "Authors can insert articles"
    ON public.articles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = author_id);

-- Only article authors can update their articles
CREATE POLICY "Authors can update their articles"
    ON public.articles FOR UPDATE
    TO authenticated
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

-- Only article authors can delete their articles
CREATE POLICY "Authors can delete their articles"
    ON public.articles FOR DELETE
    TO authenticated
    USING (auth.uid() = author_id);

-- RLS Policies for purchases table
-- Users can only read their own purchases
CREATE POLICY "Users can read their own purchases"
    ON public.purchases FOR SELECT
    USING (true); -- We'll check email in the application layer

-- Only the system (service role) can insert purchases
-- This will be done via the API route handling Stripe webhooks
CREATE POLICY "Service role can insert purchases"
    ON public.purchases FOR INSERT
    WITH CHECK (true);

-- RLS Policies for subscriptions table
-- Users can read their own subscriptions
CREATE POLICY "Users can read their own subscriptions"
    ON public.subscriptions FOR SELECT
    USING (true);

-- Only the system can manage subscriptions
CREATE POLICY "Service role can manage subscriptions"
    ON public.subscriptions FOR ALL
    USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
