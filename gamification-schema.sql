-- 1. ADD HEARTS SYSTEM TO PROFILES
-- We add 'hearts' column. If it exists, this will do nothing (idempotent).
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='hearts') THEN
        ALTER TABLE public.user_profiles ADD COLUMN hearts INTEGER DEFAULT 5 NOT NULL;
    END IF;
END $$;

-- 2. CREATE TABLE FOR COMPLETED LESSONS
CREATE TABLE IF NOT EXISTS public.user_completed_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id) -- A user can only complete a specific lesson once
);

-- Enable RLS
ALTER TABLE public.user_completed_lessons ENABLE ROW LEVEL SECURITY;

-- Allow user to read and insert their own progress
DROP POLICY IF EXISTS "Users can view own completed lessons" ON public.user_completed_lessons;
CREATE POLICY "Users can view own completed lessons" ON public.user_completed_lessons FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own completed lessons" ON public.user_completed_lessons;
CREATE POLICY "Users can insert own completed lessons" ON public.user_completed_lessons FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. EXPAND LESSON CONTENT FOR LEARNING PATH (Greetings Module)
DELETE FROM public.exercises WHERE lesson_id = 'greetings';

INSERT INTO public.exercises (lesson_id, type, question, options, correct_answer) VALUES
-- 1
('greetings', 'MULTIPLE_CHOICE', 'Pilih terjemahan untuk "Halo"', '["Goodbye", "Hello", "Yes", "No"]'::jsonb, 'Hello'),
-- 2
('greetings', 'WORD_BANK', 'Terjemahkan: "Selamat pagi"', '["Good", "morning", "night", "afternoon"]'::jsonb, 'Good morning'),
-- 3
('greetings', 'MULTIPLE_CHOICE', 'Pilih terjemahan untuk "Terima kasih"', '["Please", "Sorry", "Thank you", "Hello"]'::jsonb, 'Thank you'),
-- 4
('greetings', 'TRANSLATION', 'Ketik dalam bahasa Inggris: "Selamat malam"', null, 'Good night'),
-- 5
('greetings', 'WORD_BANK', 'Terjemahkan: "Ya, tolong"', '["Yes", "No", "please", "sorry"]'::jsonb, 'Yes please');
