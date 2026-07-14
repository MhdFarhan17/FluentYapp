"use client";

import { Star, Zap, Flame, Trophy, Gift, Target, Medal, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { useState, useEffect } from "react";

export default function QuestsPage() {
  const { xp, isLoading } = useProgress();
  const [dailyXp, setDailyXp] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('daily_quest_tracker');
    
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        const earnedToday = Math.max(0, xp - data.startXp);
        setDailyXp(earnedToday);
      } else {
        setDailyXp(0);
      }
    } else {
      setDailyXp(0);
    }
  }, [xp, isLoading]);

  // Define Quests Data
  const dailyQuests = [
    {
      id: 1,
      title: "Earn 50 XP",
      description: "Complete lessons to earn points.",
      current: Math.min(dailyXp, 50),
      total: 50,
      icon: <Zap size={28} className="text-amber-500" />,
      bg: "bg-amber-100 dark:bg-amber-900/30",
      color: "bg-amber-500",
      text: "text-amber-500"
    },
    {
      id: 2,
      title: "Maintain Your Streak",
      description: "Complete any activity today.",
      current: dailyXp > 0 ? 1 : 0,
      total: 1,
      icon: <Flame size={28} className="text-orange-500" />,
      bg: "bg-orange-100 dark:bg-orange-900/30",
      color: "bg-orange-500",
      text: "text-orange-500"
    },
    {
      id: 3,
      title: "Earn 150 XP",
      description: "Be the most diligent student today!",
      current: Math.min(dailyXp, 150),
      total: 150,
      icon: <Trophy size={28} className="text-yellow-500" />,
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      color: "bg-yellow-500",
      text: "text-yellow-500"
    }
  ];

  // Mock Monthly Challenge
  const monthlyGoal = 1000;
  const monthlyCurrent = Math.min(xp, monthlyGoal); // Using total XP as a placeholder
  const isMonthlyComplete = monthlyCurrent >= monthlyGoal;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 md:p-10 mb-12 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between">
        <div className="relative z-10 text-center sm:text-left mb-6 sm:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-md">
            Quests & Achievements
          </h1>
          <p className="text-white/90 font-bold text-lg md:text-xl drop-shadow-sm">
            Complete daily quests to win mysterious rewards!
          </p>
        </div>
        <div className="relative z-10 w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border-2 border-white/30 shadow-inner transform rotate-6 hover:rotate-12 transition-transform duration-500">
          <Target className="text-white drop-shadow-lg" size={48} />
        </div>
        
        {/* Decorative clouds */}
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-cyan-300/30 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Daily Quests */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-2xl font-extrabold text-foreground flex items-center mb-6">
            <Star className="text-yellow-400 mr-2" size={28} />
            Daily Quests
          </h2>

          <div className="bg-background rounded-3xl border-2 border-border shadow-sm p-2 md:p-4">
            {dailyQuests.map((quest, index) => {
              const isComplete = quest.current >= quest.total;
              const percent = (quest.current / quest.total) * 100;
              
              return (
                <div key={quest.id} className={`p-4 md:p-6 flex items-center ${index !== dailyQuests.length - 1 ? 'border-b-2 border-border/50' : ''}`}>
                  
                  {/* Quest Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 mr-6 shadow-inner border-2 border-background ${quest.bg}`}>
                    {isComplete ? (
                      <CheckCircle2 size={32} className={quest.text} />
                    ) : (
                      quest.icon
                    )}
                  </div>

                  {/* Quest Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h3 className={`text-lg font-extrabold truncate ${isComplete ? 'text-foreground/50 line-through' : 'text-foreground'}`}>
                          {quest.title}
                        </h3>
                        <p className="text-sm font-bold text-foreground/50 truncate hidden sm:block">
                          {quest.description}
                        </p>
                      </div>
                      <span className={`font-extrabold text-lg flex-shrink-0 ml-4 ${isComplete ? quest.text : 'text-foreground/40'}`}>
                        {quest.current} / {quest.total}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner relative">
                      <div 
                        className={`absolute top-0 bottom-0 left-0 ${quest.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${percent}%` }}
                      >
                        {/* Highlight reflex */}
                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/30 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Reward Chest */}
                  <div className="ml-6 flex-shrink-0 hidden md:flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transform transition-transform ${isComplete ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-500 scale-110 shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-secondary text-foreground/30 grayscale opacity-50'}`}>
                      <Gift size={24} className={isComplete ? "animate-bounce-slow" : ""} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Monthly Challenge */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-extrabold text-foreground flex items-center mb-6">
            <Medal className="text-purple-500 mr-2" size={28} />
            Monthly Challenge
          </h2>

          <div className="bg-background rounded-3xl border-2 border-border shadow-sm p-8 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
            
            <h3 className="text-xl font-extrabold mb-8 text-foreground/80 uppercase tracking-widest">
              {new Date().toLocaleString('en-US', { month: 'long' })} Badge
            </h3>

            {/* Massive 3D Badge */}
            <div className={`relative mb-8 transition-transform duration-700 hover:scale-105 ${isMonthlyComplete ? 'animate-pulse-slow' : ''}`}>
              {/* Outer Glow */}
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${isMonthlyComplete ? 'bg-purple-500' : 'bg-foreground/10'}`}></div>
              
              {/* The Badge */}
              <div className={`w-40 h-40 rounded-full flex items-center justify-center relative z-10 border-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_4px_20px_rgba(255,255,255,0.5)] overflow-hidden
                ${isMonthlyComplete 
                  ? 'border-purple-300 bg-gradient-to-br from-purple-400 via-fuchsia-500 to-indigo-600' 
                  : 'border-border bg-secondary grayscale'
                }
              `}>
                <Medal size={80} className={`${isMonthlyComplete ? 'text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]' : 'text-foreground/30'}`} />
                
                {/* Shine effect */}
                <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] animate-[shine_3s_infinite]"></div>
              </div>
            </div>

            <p className="text-foreground/70 font-bold mb-4 text-lg">
              Collect <strong className="text-purple-500">1,000 XP</strong> this month to earn an exclusive badge!
            </p>

            {/* Progress */}
            <div className="w-full mt-4">
              <div className="flex justify-between items-center mb-2 font-extrabold">
                <span className="text-foreground/50">Progress</span>
                <span className="text-purple-500">{monthlyCurrent} / {monthlyGoal}</span>
              </div>
              <div className="h-6 bg-secondary rounded-full overflow-hidden shadow-inner p-1">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${(monthlyCurrent / monthlyGoal) * 100}%` }}
                >
                   <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
