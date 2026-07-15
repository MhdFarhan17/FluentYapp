"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Lock, CheckCircle2, Crown, Trophy, Target, Zap, Shield, Flame } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";

const CURRICULUM = [
  {
    unit: 1,
    title: "Unit 1: The Foundations",
    description: "Start your journey and learn your first words!",
    bgColor: "bg-blue-500",
    iconColor: "text-blue-300",
    lessons: [
      { id: "basics-1", title: "Basics 1", color: "bg-blue-500", shadow: "shadow-[0_8px_0_0_#1d4ed8]", position: "translate-x-0", requires: "" },
      { id: "basics-2", title: "Basics 2", color: "bg-purple-500", shadow: "shadow-[0_8px_0_0_#7e22ce]", position: "translate-x-12 md:translate-x-20", requires: "basics-1" },
      { id: "phrases-1", title: "Phrases", color: "bg-pink-500", shadow: "shadow-[0_8px_0_0_#be185d]", position: "-translate-x-12 md:-translate-x-20", requires: "basics-2" },
      { id: "food-1", title: "Food", color: "bg-orange-500", shadow: "shadow-[0_8px_0_0_#c2410c]", position: "translate-x-0", requires: "phrases-1" },
      { id: "animals-1", title: "Animals", color: "bg-green-500", shadow: "shadow-[0_8px_0_0_#15803d]", position: "translate-x-12 md:translate-x-20", requires: "food-1" },
    ]
  },
  {
    unit: 2,
    title: "Unit 2: Expressing Yourself",
    description: "Learn plurals, adjectives, and colors.",
    bgColor: "bg-purple-600",
    iconColor: "text-purple-300",
    lessons: [
      { id: "plurals-1", title: "Plurals", color: "bg-purple-500", shadow: "shadow-[0_8px_0_0_#7e22ce]", position: "-translate-x-12 md:-translate-x-20", requires: "animals-1" },
      { id: "adjectives-1", title: "Adjectives", color: "bg-pink-500", shadow: "shadow-[0_8px_0_0_#be185d]", position: "translate-x-0", requires: "plurals-1" },
      { id: "present-tense-1", title: "Present Tense", color: "bg-blue-500", shadow: "shadow-[0_8px_0_0_#1d4ed8]", position: "translate-x-12 md:translate-x-20", requires: "adjectives-1" },
      { id: "clothing-1", title: "Clothing", color: "bg-orange-500", shadow: "shadow-[0_8px_0_0_#c2410c]", position: "-translate-x-12 md:-translate-x-20", requires: "present-tense-1" },
      { id: "colors-1", title: "Colors", color: "bg-green-500", shadow: "shadow-[0_8px_0_0_#15803d]", position: "translate-x-0", requires: "clothing-1" },
    ]
  },
  {
    unit: 3,
    title: "Unit 3: Navigating the World",
    description: "Questions, prepositions, time, family, and jobs.",
    bgColor: "bg-pink-600",
    iconColor: "text-pink-300",
    lessons: [
      { id: "questions-1", title: "Questions", color: "bg-pink-500", shadow: "shadow-[0_8px_0_0_#be185d]", position: "translate-x-12 md:translate-x-20", requires: "colors-1" },
      { id: "prepositions-1", title: "Prepositions", color: "bg-blue-500", shadow: "shadow-[0_8px_0_0_#1d4ed8]", position: "-translate-x-12 md:-translate-x-20", requires: "questions-1" },
      { id: "time-1", title: "Time", color: "bg-orange-500", shadow: "shadow-[0_8px_0_0_#c2410c]", position: "translate-x-0", requires: "prepositions-1" },
      { id: "family-1", title: "Family", color: "bg-purple-500", shadow: "shadow-[0_8px_0_0_#7e22ce]", position: "translate-x-12 md:translate-x-20", requires: "time-1" },
      { id: "jobs-1", title: "Jobs", color: "bg-green-500", shadow: "shadow-[0_8px_0_0_#15803d]", position: "-translate-x-12 md:-translate-x-20", requires: "family-1" },
    ]
  },
  {
    unit: 4,
    title: "Unit 4: Real-World Survival",
    description: "Travel, restaurant, shopping, health, and hobbies.",
    bgColor: "bg-orange-500",
    iconColor: "text-orange-200",
    lessons: [
      { id: "travel-1", title: "Travel", color: "bg-orange-500", shadow: "shadow-[0_8px_0_0_#c2410c]", position: "translate-x-0", requires: "jobs-1" },
      { id: "restaurant-1", title: "Restaurant", color: "bg-blue-500", shadow: "shadow-[0_8px_0_0_#1d4ed8]", position: "translate-x-12 md:translate-x-20", requires: "travel-1" },
      { id: "shopping-1", title: "Shopping", color: "bg-pink-500", shadow: "shadow-[0_8px_0_0_#be185d]", position: "-translate-x-12 md:-translate-x-20", requires: "restaurant-1" },
      { id: "health-1", title: "Health", color: "bg-purple-500", shadow: "shadow-[0_8px_0_0_#7e22ce]", position: "translate-x-0", requires: "shopping-1" },
      { id: "hobbies-1", title: "Hobbies", color: "bg-green-500", shadow: "shadow-[0_8px_0_0_#15803d]", position: "translate-x-12 md:translate-x-20", requires: "health-1" },
    ]
  },
  {
    unit: 5,
    title: "Unit 5: Business & Professional",
    description: "Master workplace communication and business terms.",
    bgColor: "bg-teal-600",
    iconColor: "text-teal-300",
    lessons: [
      { id: "business-1", title: "Business", color: "bg-teal-500", shadow: "shadow-[0_8px_0_0_#0f766e]", position: "-translate-x-12 md:-translate-x-20", requires: "hobbies-1" },
      { id: "emails-1", title: "Emails", color: "bg-blue-500", shadow: "shadow-[0_8px_0_0_#1d4ed8]", position: "translate-x-0", requires: "business-1" },
      { id: "interview-1", title: "Interview", color: "bg-orange-500", shadow: "shadow-[0_8px_0_0_#c2410c]", position: "translate-x-12 md:translate-x-20", requires: "emails-1" },
      { id: "tech-1", title: "Tech", color: "bg-purple-500", shadow: "shadow-[0_8px_0_0_#7e22ce]", position: "-translate-x-12 md:-translate-x-20", requires: "interview-1" },
      { id: "finance-1", title: "Finance", color: "bg-green-500", shadow: "shadow-[0_8px_0_0_#15803d]", position: "translate-x-0", requires: "tech-1" },
    ]
  },
  {
    unit: 6,
    title: "Unit 6: Mastery & Nuance",
    description: "Tenses, idioms, slang, and conditionals.",
    bgColor: "bg-indigo-600",
    iconColor: "text-indigo-300",
    lessons: [
      { id: "past-tense-1", title: "Past Tense", color: "bg-indigo-500", shadow: "shadow-[0_8px_0_0_#3730a3]", position: "translate-x-12 md:translate-x-20", requires: "finance-1" },
      { id: "future-tense-1", title: "Future Tense", color: "bg-pink-500", shadow: "shadow-[0_8px_0_0_#be185d]", position: "-translate-x-12 md:-translate-x-20", requires: "past-tense-1" },
      { id: "idioms-1", title: "Idioms", color: "bg-blue-500", shadow: "shadow-[0_8px_0_0_#1d4ed8]", position: "translate-x-0", requires: "future-tense-1" },
      { id: "slang-1", title: "Slang", color: "bg-orange-500", shadow: "shadow-[0_8px_0_0_#c2410c]", position: "translate-x-12 md:translate-x-20", requires: "idioms-1" },
      { id: "conditionals-1", title: "Conditionals", color: "bg-green-500", shadow: "shadow-[0_8px_0_0_#15803d]", position: "-translate-x-12 md:-translate-x-20", requires: "slang-1" },
    ]
  },
  {
    unit: 7,
    title: "Unit 7: Local Context (Jakarta)",
    description: "Jabodetabek lifestyle, commute, streetfood, and social.",
    bgColor: "bg-red-600",
    iconColor: "text-red-300",
    lessons: [
      { id: "commute-jkt", title: "Commute", color: "bg-red-500", shadow: "shadow-[0_8px_0_0_#991b1b]", position: "translate-x-0", requires: "conditionals-1" },
      { id: "streetfood-jkt", title: "Street Food", color: "bg-orange-500", shadow: "shadow-[0_8px_0_0_#c2410c]", position: "translate-x-12 md:translate-x-20", requires: "commute-jkt" },
      { id: "social-jkt", title: "Social", color: "bg-purple-500", shadow: "shadow-[0_8px_0_0_#7e22ce]", position: "-translate-x-12 md:-translate-x-20", requires: "streetfood-jkt" },
      { id: "housing-jkt", title: "Housing", color: "bg-blue-500", shadow: "shadow-[0_8px_0_0_#1d4ed8]", position: "translate-x-0", requires: "social-jkt" },
      { id: "office-jkt", title: "Office", color: "bg-green-500", shadow: "shadow-[0_8px_0_0_#15803d]", position: "translate-x-12 md:translate-x-20", requires: "housing-jkt" },
    ]
  }
];

export default function DashboardPage() {
  const { xp, streak, hearts, completedLessons, isLoading, addXpLocally } = useProgress();
  const [dailyXp, setDailyXp] = useState(0);

  // Daily Tracker Logic
  useEffect(() => {
    if (isLoading) return; // Wait until global xp is loaded
    // Get current date in WIB (Asia/Jakarta) format YYYY-MM-DD
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
    const stored = localStorage.getItem('daily_quest_tracker');
    
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        const earnedToday = Math.max(0, xp - data.startXp);
        setDailyXp(earnedToday);
        data.currentXp = xp;
        localStorage.setItem('daily_quest_tracker', JSON.stringify(data));
      } else {
        localStorage.setItem('daily_quest_tracker', JSON.stringify({
          date: today,
          startXp: xp,
          currentXp: xp
        }));
        setDailyXp(0);
      }
    } else {
      localStorage.setItem('daily_quest_tracker', JSON.stringify({
        date: today,
        startXp: xp,
        currentXp: xp
      }));
      setDailyXp(0);
    }
  }, [xp, isLoading]);

  const isUnlocked = (requires?: string) => {
    if (!requires) return true;
    return completedLessons.includes(requires);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Learning Path */}
        <div className="lg:col-span-8 flex flex-col items-center relative">
          
          {CURRICULUM.map((unit, uIdx) => (
            <motion.div 
              key={unit.unit} 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
              className="w-full flex flex-col items-center relative mb-12 pb-12 md:mb-16 md:pb-16 bg-secondary/20 dark:bg-secondary/10 rounded-[2.5rem] md:rounded-[3rem] border-2 border-border/50 shadow-sm overflow-hidden"
            >
              
              {/* Header Banner */}
              <div className={`w-full ${unit.bgColor} text-white rounded-t-[2.5rem] md:rounded-t-[3rem] rounded-b-3xl p-6 md:p-8 mb-8 md:mb-12 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-center justify-between z-20`}>
                <div className="relative z-10 text-center sm:text-left mb-4 sm:mb-0">
                  <h1 className="text-2xl md:text-4xl font-extrabold mb-2 tracking-tight drop-shadow-md">{unit.title}</h1>
                  <p className="text-white/90 font-bold text-sm md:text-lg drop-shadow-sm">{unit.description}</p>
                </div>
                <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center relative z-10 shadow-inner backdrop-blur-md border-2 border-white/20 transform rotate-6 hover:rotate-12 transition-transform duration-500">
                  <Crown className={`w-8 h-8 md:w-12 md:h-12 ${unit.iconColor} drop-shadow-lg`} />
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-xl"></div>
              </div>

              {/* Path Container */}
              <div className="flex flex-col items-center space-y-12 md:space-y-16 relative w-full py-8">
                
                {/* 3D Deep Track Background */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 md:w-12 bg-secondary/80 dark:bg-secondary/40 rounded-full z-0 border-x-4 border-black/5 dark:border-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]"></div>

                {/* Floating Clouds / Stars for decoration */}
                <div className="absolute top-20 left-[10%] text-4xl opacity-60 animate-pulse hidden md:block select-none">☁️</div>
                <div className="absolute top-60 right-[15%] text-3xl opacity-50 animate-bounce-slow hidden md:block select-none">✨</div>
                <div className="absolute bottom-40 left-[15%] text-4xl opacity-60 animate-pulse hidden md:block select-none">☁️</div>

                {unit.lessons.map((lesson, index) => {
                  const unlocked = isUnlocked(lesson.requires);
                  const completed = completedLessons.includes(lesson.id);
                  const isCurrent = unlocked && !completed;

                  return (
                    <motion.div 
                      key={lesson.id} 
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ 
                        duration: 0.5, 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100 
                      }}
                      className={`relative z-10 flex flex-col items-center group transition-transform duration-500 ${lesson.position}`}
                    >
                      
                      {/* Tooltip description */}
                      <div className={`mb-4 px-6 py-3 rounded-2xl text-sm font-extrabold shadow-xl whitespace-nowrap transition-all duration-300 relative ${
                        isCurrent 
                          ? "bg-foreground text-background opacity-100 translate-y-0 scale-110 border-2 border-foreground/10" 
                          : "bg-background border-2 border-border text-foreground opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hidden md:block"
                      }`}>
                        {lesson.title}
                        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${isCurrent ? "bg-foreground" : "bg-background border-b-2 border-r-2 border-border"}`}></div>
                      </div>

                      {/* Node Button with massive 3D shadows */}
                      {unlocked ? (
                        <Link 
                          href={`/lesson/${lesson.id}`}
                          className={`w-[85px] h-[85px] md:w-[110px] md:h-[110px] rounded-full flex items-center justify-center transition-all outline-none relative
                            ${lesson.color} ${lesson.shadow} text-white border-[4px] border-white/20
                            hover:brightness-110 active:translate-y-[8px] active:shadow-none hover:scale-105
                            ${isCurrent ? "ring-[8px] ring-offset-4 ring-primary/30 animate-pulse-slow shadow-[0_12px_0_0_rgba(0,0,0,0.2)]" : ""}
                          `}
                        >
                          <Star size={48} strokeWidth={completed ? 3 : 2} className={completed ? "fill-yellow-300 text-yellow-300 drop-shadow-sm" : "fill-white/30 text-white/50 drop-shadow-sm"} />
                          
                          {/* Checkmark Badge if completed */}
                          {completed && (
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-2 border-[4px] border-background shadow-lg transform rotate-6 hover:rotate-12 transition-transform">
                              <CheckCircle2 size={24} strokeWidth={3.5} />
                            </div>
                          )}
                          
                          {/* Highlight glow if current */}
                          {isCurrent && (
                             <div className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-50"></div>
                          )}
                        </Link>
                      ) : (
                        <div className="w-[85px] h-[85px] md:w-[110px] md:h-[110px] rounded-full flex items-center justify-center bg-secondary shadow-[0_8px_0_0_#cbd5e1] dark:shadow-[0_8px_0_0_#334155] text-foreground/40 cursor-not-allowed border-4 border-background opacity-80">
                          <Lock size={40} strokeWidth={2.5} />
                        </div>
                      )}
                      
                    </motion.div>
                  );
                })}

              </div>
            </motion.div>
          ))}

            {/* Next Section locked node */}
            <div className="relative z-10 mt-10 mb-20 flex flex-col items-center opacity-60">
              <div className="w-[100px] h-[100px] rounded-3xl bg-secondary border-4 border-dashed border-border flex items-center justify-center transform rotate-12">
                <Shield size={40} className="text-foreground/30" />
              </div>
              <p className="mt-6 font-extrabold text-foreground/40 uppercase tracking-[0.2em] text-sm">Next Section Coming Soon</p>
            </div>

        </div>

        {/* Right Column: Premium Sticky Sidebar */}
        <div className="lg:col-span-4 hidden lg:block relative">
          <div className="sticky top-32 space-y-8">
            
            {/* League Promo */}
            <div className="bg-background rounded-3xl p-6 border-2 border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-lg flex items-center">
                  <Trophy className="text-yellow-500 mr-2" size={24} />
                  Leaderboard
                </h3>
              </div>
              <p className="text-foreground/70 font-medium text-sm mb-6">
                You have {xp} XP! Compete with others in the global league.
              </p>
              <Link href="/leaderboard" className="w-full block text-center py-3 rounded-xl font-bold uppercase tracking-wider text-primary border-2 border-primary hover:bg-primary/10 transition-colors">
                View League
              </Link>
            </div>

            {/* Daily Quests Widget */}
            <div className="bg-background rounded-3xl p-6 md:p-8 border-2 border-border mb-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-extrabold text-foreground flex items-center">
                  <Star className="mr-2 text-yellow-400" />
                  Daily Quests
                </h2>
                <Link href="/quests" className="text-sm font-bold text-primary hover:underline">View all</Link>
              </div>
              
              <div className="space-y-6">
                {quests.length === 0 ? (
                  <div className="text-center py-4 text-foreground/50 font-medium">
                    Loading quests...
                  </div>
                ) : (
                  quests.slice(0, 2).map((quest, i) => {
                    const percent = Math.min((quest.current_value / quest.target_value) * 100, 100);
                    const isComplete = quest.current_value >= quest.target_value;
                    
                    return (
                      <div key={quest.id} className="flex items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${isComplete ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-secondary'}`}>
                          {isComplete ? (
                            <Star className="text-amber-500" size={24} />
                          ) : (
                            <Zap className="text-foreground/40" size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className={`font-bold ${quest.is_claimed ? 'text-foreground/50 line-through' : 'text-foreground'}`}>
                              {quest.title}
                            </span>
                            <span className={`font-bold ${isComplete ? 'text-amber-500' : 'text-foreground/50'}`}>
                              {quest.current_value}/{quest.target_value}
                            </span>
                          </div>
                          <div className="h-3 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isComplete ? (quest.is_claimed ? 'bg-amber-500/50' : 'bg-amber-400') : 'bg-primary'} transition-all duration-1000`} 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Achievements Teaser */}
            <div className="bg-background rounded-3xl p-6 border-2 border-border shadow-sm flex items-center justify-between group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => window.location.href='/achievements'}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center">
                  <Zap className="text-pink-500" size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Achievements</h4>
                  <p className="text-xs text-foreground/60 font-medium">View your badges</p>
                </div>
              </div>
              <div className="text-border group-hover:text-primary transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
