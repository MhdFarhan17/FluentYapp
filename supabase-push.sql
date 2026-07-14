-- Migration: Create Push Subscriptions Table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    auth TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique constraint so a user doesn't have duplicate endpoints
ALTER TABLE public.push_subscriptions ADD CONSTRAINT unique_user_endpoint UNIQUE (user_id, endpoint);

-- Enable RLS (Row Level Security)
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert/update/delete their own subscriptions
CREATE POLICY "Users can manage their own push subscriptions"
ON public.push_subscriptions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only service role can read all subscriptions (for the cron job to send reminders)
CREATE POLICY "Service role can read all subscriptions"
ON public.push_subscriptions
FOR SELECT
TO service_role
USING (true);
