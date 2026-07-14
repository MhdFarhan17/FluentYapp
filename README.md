# FluentYapp

FluentYapp is a modern, interactive, and professional English learning web application inspired by Duolingo. It is built with Next.js 15, Tailwind CSS, Supabase, and AI integration for an engaging gamified learning experience.

## Features

- **Gamified Learning**: Earn XP, maintain streaks, and complete daily/monthly quests.
- **Heart System**: Lose hearts on mistakes; hearts regenerate over time.
- **Interactive Lessons**: Multiple choice, word bank, pronunciation (using browser SpeechRecognition API), and more.
- **Smart Review**: Practice your weaknesses based on previous mistakes.
- **Rich User Interface**: Smooth animations, dark/light mode, and modern glassmorphism design.
- **Leaderboard**: Compete with other learners globally.
- **Achievements**: Unlock various badges and reach new tiers by staying consistent.
- **Grammar Library**: Access comprehensive grammar lessons ranging from Beginner to Advanced.
- **Authentication**: Seamless login and signup powered by Supabase Auth.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **AI/LLM**: Google AI / Anthropic (via API integration for generative content)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/MhdFarhan17/FluentYapp.git
   cd FluentYapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials and API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   # other env vars...
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Project Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable React components (UI, theme toggle, etc.).
- `src/context/`: React Context providers (e.g., ProgressContext for global state).
- `src/lib/`: Utility functions and library wrappers (e.g., Supabase client).
- `supabase/`: Database schemas, edge functions, and migrations.

## Author
[MhdFarhan17](https://github.com/MhdFarhan17)
