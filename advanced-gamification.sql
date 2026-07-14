-- 1. ADD HEARTS_EMPTY_AT FOR REGENERATION TIMER
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema='public' AND table_name='user_profiles' AND column_name='hearts_empty_at') THEN
        ALTER TABLE public.user_profiles ADD COLUMN hearts_empty_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- 2. CREATE TABLE FOR LEARNING MATERIALS
CREATE TABLE IF NOT EXISTS public.lesson_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content_markdown TEXT NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL,
    UNIQUE(lesson_id)
);

-- Enable RLS
ALTER TABLE public.lesson_materials ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read materials
DROP POLICY IF EXISTS "Users can view learning materials" ON public.lesson_materials;
CREATE POLICY "Users can view learning materials" ON public.lesson_materials FOR SELECT USING (auth.role() = 'authenticated');

-- 3. INSERT PREMIUM CURRICULUM DATA
DELETE FROM public.lesson_materials;

INSERT INTO public.lesson_materials (lesson_id, title, content_markdown, order_index) VALUES
('basics-1', 'Basics 1: First Words & Articles', 
'# Welcome to Basics 1!

Di modul ini, kita akan mempelajari kata-kata paling dasar dalam bahasa Inggris dan cara menggunakannya.

## 1. Kata Ganti Orang (Pronouns)
Kata ganti digunakan untuk mengganti nama orang atau benda:
- **I** (Saya)
- **You** (Kamu)
- **He** (Dia laki-laki)
- **She** (Dia perempuan)
- **It** (Itu - untuk hewan/benda)
- **We** (Kami/Kita)
- **They** (Mereka)

## 2. To Be (Am, Is, Are)
"To Be" adalah jembatan penghubung antara subjek dan kata sifat/benda.
- **I am** a boy. (Saya adalah seorang anak laki-laki.)
- **You are** a girl. (Kamu adalah seorang anak perempuan.)
- **He is** a man. (Dia adalah seorang pria.)

## 3. Artikel (A / An)
Kita menggunakan "a" atau "an" untuk menunjukkan benda tunggal (sebuah/seorang).
- Gunakan **a** jika kata benda berawalan suara konsonan. (Contoh: *a cat*, *a boy*)
- Gunakan **an** jika kata benda berawalan suara vokal - a, i, u, e, o. (Contoh: *an apple*, *an elephant*)

**Tips Belajar:**
Cobalah berlatih menyebutkan kata benda di sekitar Anda menggunakan *a* atau *an*!'
, 1),

('basics-2', 'Basics 2: Nouns & Reading', 
'# Basics 2: Memperluas Kosakata

Bagus sekali telah menyelesaikan Basics 1! Sekarang kita akan masuk ke kata benda umum dan struktur kalimat sederhana.

## 1. Kata Benda (Nouns)
Kata benda adalah nama dari suatu hal. Berikut adalah beberapa kata dasar:
- **Water** (Air) - *I drink water.*
- **Bread** (Roti) - *You eat bread.*
- **Milk** (Susu) - *The cat drinks milk.*

## 2. Kata Kerja Dasar (Verbs)
Kata kerja menunjukkan aksi.
- **Eat** (Makan) -> *I eat.* (Saya makan.)
- **Drink** (Minum) -> *I drink.* (Saya minum.)

*Catatan Penting*: Jika subjeknya adalah He, She, atau It, tambahkan akhiran **-s** atau **-es** pada kata kerja!
- I drink -> **He drinks**
- You eat -> **She eats**

## 3. The (Artikel Pasti)
Jika "a/an" berarti "sebuah" yang belum spesifik, maka **"the"** digunakan untuk benda yang sudah pasti/jelas.
- *I have a dog.* (Saya punya seekor anjing - anjing mana saja.)
- *The dog is black.* (Anjing itu berwarna hitam - spesifik anjing yang tadi saya bicarakan.)'
, 2),

('greetings', 'Greetings: Sapaan Sehari-hari', 
'# Greetings (Sapaan)

Bahasa Inggris sangat sopan. Mari pelajari cara menyapa seseorang dari pagi hingga malam!

## 1. Sapaan Berdasarkan Waktu
- **Good morning** = Selamat pagi (Digunakan sejak bangun tidur hingga jam 12 siang)
- **Good afternoon** = Selamat siang/sore (Digunakan dari jam 12 siang hingga jam 6 sore)
- **Good evening** = Selamat malam (Digunakan saat malam hari ketika baru bertemu seseorang)
- **Good night** = Selamat tidur (HANYA digunakan saat ingin berpisah untuk tidur)

## 2. Ungkapan Sopan (Magic Words)
Selalu gunakan kata-kata ini untuk terdengar seperti *Native Speaker*:
- **Please** = Tolong (Gunakan saat meminta bantuan)
- **Sorry** = Maaf
- **Thank you** = Terima kasih
- **You''re welcome** = Sama-sama

## 3. Sapaan Singkat
- **Hello** = Halo (Formal/Sopan)
- **Hi** = Hai (Lebih santai, untuk teman)
- **Goodbye** atau **Bye** = Selamat tinggal'
, 3);
