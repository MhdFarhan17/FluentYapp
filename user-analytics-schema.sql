-- 1. ADD STREAK COLUMNS TO USER_PROFILES
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='current_streak') THEN
        ALTER TABLE public.user_profiles ADD COLUMN current_streak INTEGER DEFAULT 0 NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='longest_streak') THEN
        ALTER TABLE public.user_profiles ADD COLUMN longest_streak INTEGER DEFAULT 0 NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='last_activity_date') THEN
        ALTER TABLE public.user_profiles ADD COLUMN last_activity_date DATE;
    END IF;
END $$;

-- 2. CREATE TABLE FOR USER MISTAKES (SMART REVIEW)
CREATE TABLE IF NOT EXISTS public.user_mistakes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID, -- Optional, if we want to link directly to an exercise
    lesson_id TEXT NOT NULL,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    wrong_answer TEXT NOT NULL,
    mistake_count INTEGER DEFAULT 1 NOT NULL,
    last_mistake_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, question) -- Track mistakes per question unique to user
);

-- Enable RLS
ALTER TABLE public.user_mistakes ENABLE ROW LEVEL SECURITY;

-- Policies for user_mistakes
DROP POLICY IF EXISTS "Users can view own mistakes" ON public.user_mistakes;
CREATE POLICY "Users can view own mistakes" ON public.user_mistakes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own mistakes" ON public.user_mistakes;
CREATE POLICY "Users can insert own mistakes" ON public.user_mistakes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own mistakes" ON public.user_mistakes;
CREATE POLICY "Users can update own mistakes" ON public.user_mistakes FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own mistakes" ON public.user_mistakes;
CREATE POLICY "Users can delete own mistakes" ON public.user_mistakes FOR DELETE USING (auth.uid() = user_id);
