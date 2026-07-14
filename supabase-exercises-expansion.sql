-- Clear existing data for basics-1 and basics-2 to avoid duplicates
DELETE FROM public.exercises WHERE lesson_id IN ('basics-1', 'basics-2');

-- Seed data for Basics 1 (10 Questions)
INSERT INTO public.exercises (lesson_id, type, question, options, correct_answer) VALUES
-- 1
('basics-1', 'MULTIPLE_CHOICE', 'Pilih terjemahan untuk "Anak laki-laki"', '["Girl", "Man", "Boy", "Woman"]'::jsonb, 'Boy'),
-- 2
('basics-1', 'MULTIPLE_CHOICE', 'Pilih terjemahan untuk "Anak perempuan"', '["Girl", "Man", "Boy", "Woman"]'::jsonb, 'Girl'),
-- 3
('basics-1', 'WORD_BANK', 'Terjemahkan kalimat ini: "Saya seorang pria"', '["I", "am", "a", "man", "woman", "boy"]'::jsonb, 'I am a man'),
-- 4
('basics-1', 'WORD_BANK', 'Terjemahkan kalimat ini: "Dia (perempuan) makan apel"', '["She", "He", "eats", "eat", "an", "apple"]'::jsonb, 'She eats an apple'),
-- 5
('basics-1', 'TRANSLATION', 'Ketik dalam bahasa Inggris: "Saya minum air"', null, 'I drink water'),
-- 6
('basics-1', 'MULTIPLE_CHOICE', 'Pilih kata yang hilang: "___ is a woman"', '["She", "He", "It", "I"]'::jsonb, 'She'),
-- 7
('basics-1', 'WORD_BANK', 'Terjemahkan: "Kamu adalah seorang anak laki-laki"', '["You", "are", "is", "a", "boy", "girl"]'::jsonb, 'You are a boy'),
-- 8
('basics-1', 'WORD_BANK', 'Terjemahkan: "Pria itu minum air"', '["The", "A", "man", "woman", "drinks", "water"]'::jsonb, 'The man drinks water'),
-- 9
('basics-1', 'TRANSLATION', 'Ketik dalam bahasa Inggris: "Dia (laki-laki) makan"', null, 'He eats'),
-- 10
('basics-1', 'MULTIPLE_CHOICE', 'Pilih terjemahan untuk "Roti"', '["Bread", "Water", "Apple", "Milk"]'::jsonb, 'Bread');

-- Seed data for Basics 2 (10 Questions)
INSERT INTO public.exercises (lesson_id, type, question, options, correct_answer) VALUES
-- 1
('basics-2', 'MULTIPLE_CHOICE', 'Pilih terjemahan untuk "Buku"', '["Newspaper", "Book", "Letter", "Menu"]'::jsonb, 'Book'),
-- 2
('basics-2', 'MULTIPLE_CHOICE', 'Pilih terjemahan untuk "Koran"', '["Book", "Newspaper", "Word", "Pen"]'::jsonb, 'Newspaper'),
-- 3
('basics-2', 'WORD_BANK', 'Terjemahkan kalimat ini: "Saya membaca buku"', '["I", "am", "read", "a", "book", "the"]'::jsonb, 'I read a book'),
-- 4
('basics-2', 'WORD_BANK', 'Terjemahkan kalimat ini: "Mereka membaca koran"', '["They", "We", "read", "reads", "a", "newspaper"]'::jsonb, 'They read a newspaper'),
-- 5
('basics-2', 'TRANSLATION', 'Ketik dalam bahasa Inggris: "Kami memiliki apel"', null, 'We have apples'),
-- 6
('basics-2', 'MULTIPLE_CHOICE', 'Pilih kata yang hilang: "___ write a letter"', '["I", "She", "He", "It"]'::jsonb, 'I'),
-- 7
('basics-2', 'WORD_BANK', 'Terjemahkan: "Anak-anak itu membaca buku"', '["The", "children", "child", "read", "reads", "books"]'::jsonb, 'The children read books'),
-- 8
('basics-2', 'WORD_BANK', 'Terjemahkan: "Kamu membaca menu"', '["You", "read", "reads", "a", "the", "menu"]'::jsonb, 'You read the menu'),
-- 9
('basics-2', 'TRANSLATION', 'Ketik dalam bahasa Inggris: "Dia (perempuan) memiliki sebuah buku"', null, 'She has a book'),
-- 10
('basics-2', 'MULTIPLE_CHOICE', 'Pilih terjemahan untuk "Susu"', '["Water", "Coffee", "Milk", "Tea"]'::jsonb, 'Milk');
