-- 1. CREATE TABLE FOR DAILY QUESTS
CREATE TABLE IF NOT EXISTS public.user_quests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    quest_date DATE NOT NULL,
    quest_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0 NOT NULL,
    is_claimed BOOLEAN DEFAULT false NOT NULL,
    reward_amount INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, quest_date, quest_id) -- User can only have one unique quest ID per day
);

-- Enable RLS
ALTER TABLE public.user_quests ENABLE ROW LEVEL SECURITY;

-- Policies for user_quests
DROP POLICY IF EXISTS "Users can view own quests" ON public.user_quests;
CREATE POLICY "Users can view own quests" ON public.user_quests FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quests" ON public.user_quests;
CREATE POLICY "Users can insert own quests" ON public.user_quests FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quests" ON public.user_quests;
CREATE POLICY "Users can update own quests" ON public.user_quests FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own quests" ON public.user_quests;
CREATE POLICY "Users can delete own quests" ON public.user_quests FOR DELETE USING (auth.uid() = user_id);
