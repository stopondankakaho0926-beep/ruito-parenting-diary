-- Add view_count column to articles table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0 NOT NULL;

-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    commenter_name TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    approved BOOLEAN DEFAULT true NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS comments_article_id_idx ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON public.comments(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for comments table
-- Anyone can read approved comments
CREATE POLICY "Anyone can read approved comments"
    ON public.comments FOR SELECT
    USING (approved = true);

-- Anyone can insert comments (for visitors)
CREATE POLICY "Anyone can insert comments"
    ON public.comments FOR INSERT
    WITH CHECK (true);

-- Only authenticated users (admin) can update comments
CREATE POLICY "Authenticated users can update comments"
    ON public.comments FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Only authenticated users (admin) can delete comments
CREATE POLICY "Authenticated users can delete comments"
    ON public.comments FOR DELETE
    TO authenticated
    USING (true);
