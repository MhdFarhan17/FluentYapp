<div align="center">
  <img src="public/logo.png" alt="FluentYapp Logo" width="120" />
  <h1>FluentYapp 🚀</h1>
  <p><strong>A Modern, Interactive, and Gamified English Learning Platform.</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  </p>
</div>

<hr />

## 🌟 Overview

**FluentYapp** is an engaging and highly interactive web application designed to help users master the English language. Inspired by top-tier language learning apps like Duolingo, FluentYapp brings together a **rich, gamified experience** with a **modern glassmorphism UI**, making language acquisition both effective and incredibly fun.

## ✨ Key Features

- **🎮 Gamified Learning Engine:** Earn XP, climb the global Leaderboard, and maintain your daily learning streak to unlock exclusive badges (e.g., *Golden Supernova*, *Diamond Eternal*).
- **❤️ Dynamic Health System:** You start with 5 Hearts. Making a mistake costs 1 Heart. Hearts regenerate over time, requiring strategic learning and focus.
- **🎙️ Interactive Speech Practice:** Built-in voice recognition leverages the browser's `SpeechRecognition` API to validate pronunciation in real-time.
- **🧠 Smart Review (Weakness Practice):** The system automatically logs your mistakes and provides a customized review session to turn your weaknesses into strengths.
- **📚 Comprehensive Grammar Library:** A structured library containing dozens of easily digestible reading modules from Beginner to Advanced levels.
- **🎨 Premium UI/UX:** A stunning interface featuring dark/light mode, micro-animations, satisfying sounds, and gradient-rich glassmorphic components.
- **🔐 Secure Authentication:** Seamless and secure user authentication (Email/Password & Google OAuth) powered by Supabase.

## 🛠️ Tech Stack

| Category | Technologies |
| --- | --- |
| **Frontend** | Next.js 15 (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, Lucide React (Icons) |
| **Backend / DB** | Supabase (PostgreSQL), Edge Functions |
| **Deployment** | Vercel (Recommended) |

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) account for the database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MhdFarhan17/FluentYapp.git
   cd FluentYapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root of your project and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📂 Project Structure

```text
FluentYapp/
├── src/
│   ├── app/           # Next.js App Router (Pages & Layouts)
│   ├── components/    # Reusable UI Components & Hooks
│   ├── context/       # React Context Providers (e.g., Progress, Themes)
│   └── lib/           # Utility functions and Supabase configuration
├── public/            # Static assets (images, icons, sounds)
├── supabase/          # Supabase configuration, seed SQL, and migrations
└── tailwind.config.ts # TailwindCSS design system & animations
```

## 🎯 What's Next?
- [x] Gamified Lesson UI
- [x] Streak and Leaderboard System
- [x] Smart Weakness Review
- [x] Push Notifications & Reminders
- [ ] Mobile App (PWA) Enhancements

## 👨‍💻 Author

**MhdFarhan17**  
- GitHub: [@MhdFarhan17](https://github.com/MhdFarhan17)

---
*Built with ❤️ for a better learning experience.*
