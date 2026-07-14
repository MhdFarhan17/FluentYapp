-- Create exercises table
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id TEXT NOT NULL,
    type TEXT NOT NULL, -- 'TRANSLATION', 'WORD_BANK', or 'MULTIPLE_CHOICE'
    question TEXT NOT NULL,
    options JSONB, -- Array of strings for choices or word banks
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Allow public read access to exercises (everyone can read questions)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.exercises;
CREATE POLICY "Enable read access for all users" ON public.exercises FOR SELECT USING (true);

-- Delete existing seed data if any (idempotency)
DELETE FROM public.exercises WHERE lesson_id = 'basics-1';

-- Seed data for basics-1
INSERT INTO public.exercises (lesson_id, type, question, options, correct_answer) VALUES
(
    'basics-1', 
    'MULTIPLE_CHOICE', 
    'Pilih terjemahan untuk "Kucing"', 
    '["Dog", "Cat", "Bird", "Mouse"]'::jsonb, 
    'Cat'
),
(
    'basics-1', 
    'WORD_BANK', 
    'Terjemahkan kalimat ini: "Saya minum air"', 
    '["drink", "water", "I", "eat", "apple"]'::jsonb, 
    'I drink water'
),
(
    'basics-1', 
    'TRANSLATION', 
    'Ketik dalam bahasa Inggris: "Buku itu berwarna merah"', 
    null, 
    'The book is red'
);
