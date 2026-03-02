# Supabase Setup Instructions

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project

## Setup Steps

### 1. Run the Migration
Copy the contents of `migrations/001_create_tables.sql` and run it in the Supabase SQL Editor:
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Paste the migration SQL
4. Click "Run"

### 2. Get Your API Keys
1. Go to Project Settings > API
2. Copy the following values to your `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Create Admin User
1. Go to Authentication > Users
2. Click "Add user"
3. Create a user with email/password (this will be your admin account)
4. Note the user's ID - you'll use this as `author_id` when creating articles

## Database Schema

### Tables
- **articles**: Stores article content, metadata, and pricing info
- **purchases**: Records individual article purchases
- **subscriptions**: (Phase 2) Tracks subscription status

### Security
All tables have Row Level Security (RLS) enabled:
- **Articles**: Public can read published articles, only authors can create/edit
- **Purchases**: Users can only access their own purchases
- **Subscriptions**: Users can only access their own subscriptions
