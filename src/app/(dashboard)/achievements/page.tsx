"use client";

import { useProgress } from "@/context/ProgressContext";
import { Medal, Flame, Star, Zap, BookOpen, ShieldCheck, Lock, CheckCircle2, Trophy, Gift, Target, Info } from "lucide-react";
import { Loader2 } from "lucide-react";

// Need to import Crown at the top
function Crown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.24a2 2 0 0 1-1.929 1.466H6.784a2 2 0 0 1-1.93-1.466L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  )
}

export default function AchievementsPage() {
  const { xp, streak, hearts, completedLessons, isLoading } = useProgress();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Helper to calculate tier progress
  const getTierData = (currentValue: number, tiers: number[]) => {
    let currentTier = 0;
    for (let i = 0; i < tiers.length; i++) {
      if (currentValue >= tiers[i]) {
        currentTier = i + 1;
      } else {
        break;
      }
    }
    
    const isMaxed = currentTier === tiers.length;
    const nextGoal = isMaxed ? tiers[tiers.length - 1] : tiers[currentTier];
    const prevGoal = currentTier === 0 ? 0 : tiers[currentTier - 1];
    
    // Calculate percentage for the current tier only
    const progressInCurrentTier = isMaxed ? nextGoal : currentValue;
    
    return {
      currentTier,
      totalTiers: tiers.length,
      nextGoal,
      isMaxed,
      progress: progressInCurrentTier
    };
  };

  const badges = [
    {
      id: "wildfire",
      title: "Wildfire",
      description: "Maintain your learning streak.",
      icon: <Flame size={36} className="text-white drop-shadow-md" />,
      color: "bg-gradient-to-br from-orange-400 to-red-600",
      shadow: "shadow-[0_8px_0_0_#9a3412]",
      value: streak,
      tiers: [3, 7, 14, 30, 50],
      reward: "50 XP"
    },
    {
      id: "sage",
      title: "Sage",
      description: "Earn as much XP as possible.",
      icon: <Star size={36} className="text-white drop-shadow-md" />,
      color: "bg-gradient-to-br from-amber-300 to-yellow-600",
      shadow: "shadow-[0_8px_0_0_#ca8a04]",
      value: xp,
      tiers: [1000, 5000, 10000, 30000],
      reward: "100 XP"
    },
    {
      id: "scholar",
      title: "Scholar",
      description: "Complete new lessons.",
      icon: <BookOpen size={36} className="text-white drop-shadow-md" />,
      color: "bg-gradient-to-br from-blue-400 to-indigo-600",
      shadow: "shadow-[0_8px_0_0_#312e81]",
      value: completedLessons.length,
      tiers: [1, 5, 10, 20],
      reward: "Gem x10"
    },
    {
      id: "perfectionist",
      title: "Perfectionist",
      description: "Maintain full health (5 Hearts).",
      icon: <ShieldCheck size={36} className="text-white drop-shadow-md" />,
      color: "bg-gradient-to-br from-emerald-400 to-teal-600",
      shadow: "shadow-[0_8px_0_0_#064e3b]",
      value: hearts,
      tiers: [5],
      reward: "50 XP"
    },
  ];

  // Mystery Badge Logic
  const secretUnlocked = completedLessons.length >= 20; // Example secret trigger

  // Count total unlocked tiers
  const totalStarsEarned = badges.reduce((acc, badge) => acc + getTierData(badge.value, badge.tiers).currentTier, 0) + (secretUnlocked ? 1 : 0);
  const totalPossibleStars = badges.reduce((acc, badge) => acc + badge.tiers.length, 0) + 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      
      {/* Premium Header Banner */}
      <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 mb-8 md:mb-16 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border-b-[6px] md:border-b-8 border-orange-800">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:space-x-6 mb-4 md:mb-0 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-4 border-white/30 shadow-inner transform -rotate-12 hover:rotate-0 transition-transform duration-500 mb-3 sm:mb-0">
            <Trophy className="text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] w-8 h-8 sm:w-12 sm:h-12 md:w-[48px] md:h-[48px]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-1">Trophy Cabinet</h1>
            <p className="text-white/90 font-bold text-sm sm:text-lg drop-shadow-sm">Collect Stars and Level Up Badges.</p>
          </div>
        </div>
        
        <div className="relative z-10 bg-black/20 backdrop-blur-md px-6 py-4 sm:px-8 sm:py-5 rounded-2xl md:rounded-3xl border-2 border-white/10 text-center min-w-[180px] sm:min-w-[220px] shadow-lg w-full md:w-auto mt-2 md:mt-0">
          <div className="text-white/80 font-bold text-xs sm:text-sm uppercase tracking-widest mb-1 flex items-center justify-center">
            <Star size={16} className="mr-1 text-yellow-300" /> Stars Earned
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-white">{totalStarsEarned} <span className="text-lg sm:text-2xl text-white/50">/ {totalPossibleStars}</span></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-10 w-48 md:w-64 h-48 md:h-64 bg-yellow-300/30 rounded-full -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-64 md:w-80 h-64 md:h-80 bg-red-500/20 rounded-full translate-y-1/3 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Render Standard Badges */}
        {badges.map((badge, index) => {
          const { currentTier, totalTiers, nextGoal, isMaxed, progress } = getTierData(badge.value, badge.tiers);
          const unlocked = currentTier > 0;
          const isJustStarted = currentTier === 0 && progress === 0;

          return (
            <div 
              key={badge.id}
              className={`group relative p-6 pt-10 rounded-2xl sm:rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 ${
                unlocked 
                  ? "bg-background border-2 border-border shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-primary/30" 
                  : "bg-secondary/30 border-2 border-dashed border-border/50 grayscale opacity-90 hover:grayscale-0 hover:opacity-100"
              }`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
            >
              
              {/* Star Tiers Header */}
              <div className="absolute -top-4 bg-background border-2 border-border px-4 py-1.5 rounded-full shadow-md flex space-x-1 z-20">
                {Array.from({ length: totalTiers }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < currentTier ? "fill-yellow-400 text-yellow-500" : "fill-secondary text-border"} 
                  />
                ))}
              </div>

              {/* Reward Pill */}
              {!isMaxed && !isJustStarted && (
                <div className="absolute top-4 right-4 bg-purple-100 text-purple-600 font-extrabold text-xs px-2 py-1 rounded-lg border-2 border-purple-200 flex items-center shadow-sm">
                  <Gift size={12} className="mr-1" /> {badge.reward}
                </div>
              )}
              {isMaxed && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-600 font-extrabold text-xs px-2 py-1 rounded-lg border-2 border-green-200 flex items-center shadow-sm">
                  MAX LEVEL
                </div>
              )}

              {/* 3D Skeuomorphic Badge */}
              <div className={`relative mb-6 transform transition-transform duration-500 ${unlocked ? 'group-hover:scale-110 group-hover:rotate-3' : ''}`}>
                <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-4 border-white/20 relative z-10 
                  ${unlocked ? `${badge.color} ${badge.shadow}` : 'bg-gray-300 shadow-[0_8px_0_0_#9ca3af]'}
                `}>
                  <div className="absolute inset-1 rounded-full border-2 border-white/20 shadow-inner"></div>
                  {badge.icon}
                  
                  {!unlocked && (
                    <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] rounded-full flex items-center justify-center">
                      <Lock size={40} className="text-foreground/60 drop-shadow-md" />
                    </div>
                  )}
                  {isMaxed && (
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white rounded-full p-2 border-4 border-background shadow-lg">
                      <Crown size={24} strokeWidth={3} className="drop-shadow-sm" />
                    </div>
                  )}
                </div>
                
                {/* Background Glow for Unlocked */}
                {unlocked && (
                  <div className={`absolute inset-0 ${badge.color} opacity-20 blur-2xl rounded-full scale-150 -z-10 group-hover:opacity-40 transition-opacity`}></div>
                )}
              </div>

              {/* Content */}
              <h3 className={`text-2xl font-extrabold mb-1 ${unlocked ? 'text-foreground' : 'text-foreground/60'}`}>
                {badge.title}
              </h3>
              <p className="text-sm font-bold text-primary mb-3">Level {currentTier}</p>
              
              <p className="text-foreground/60 font-medium text-sm mb-6 max-w-[200px] h-10">
                {badge.description}
              </p>
              
              {/* Progress Bar (Next Level Target) */}
              <div className="w-full mt-auto">
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-xs font-bold text-foreground/40 uppercase tracking-wider">
                    {isMaxed ? 'Completed' : `Target Lvl ${currentTier + 1}`}
                  </span>
                  <span className={`text-sm font-extrabold ${isMaxed ? 'text-green-500' : (unlocked ? 'text-primary' : 'text-foreground/50')}`}>
                    {progress}/{nextGoal}
                  </span>
                </div>
                <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner p-0.5 relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 relative overflow-hidden ${
                      isMaxed 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                        : (unlocked ? 'bg-gradient-to-r from-blue-400 to-primary' : 'bg-primary/20')
                    }`}
                    style={{ width: `${(progress / nextGoal) * 100}%` }}
                  >
                    {/* Shiny sweep effect */}
                    {(unlocked || isMaxed) && (
                      <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}

        {/* Render Secret / Mystery Badge */}
        <div className={`group relative p-6 pt-10 rounded-[2.5rem] flex flex-col items-center text-center transition-all duration-500 animate-in fade-in slide-in-from-bottom-12 ${
          secretUnlocked 
            ? "bg-background border-2 border-border shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-primary/30" 
            : "bg-secondary/40 dark:bg-slate-900 border-2 border-dashed border-border dark:border-slate-800 shadow-[inset_0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden"
        }`}
        style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
          
          {/* Stars */}
          <div className="absolute -top-4 bg-background border-2 border-border px-4 py-1.5 rounded-full shadow-md flex space-x-1 z-20">
            <Star size={16} className={secretUnlocked ? "fill-yellow-400 text-yellow-500" : "fill-secondary text-border"} />
          </div>

          {!secretUnlocked && (
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 dark:opacity-30"></div>
          )}

          <div className={`relative mb-6 transform transition-transform duration-500 ${secretUnlocked ? 'group-hover:scale-110' : 'group-hover:rotate-12'}`}>
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-4 relative z-10 
              ${secretUnlocked ? 'bg-gradient-to-br from-fuchsia-500 to-purple-800 shadow-[0_8px_0_0_#4a044e] border-white/20' : 'bg-secondary dark:bg-slate-800 border-border dark:border-slate-700 shadow-inner'}
            `}>
              {secretUnlocked ? (
                <Target size={48} className="text-white drop-shadow-md w-[36px] h-[36px] sm:w-[48px] sm:h-[48px]" />
              ) : (
                <span className="text-5xl sm:text-6xl font-extrabold text-foreground/20 dark:text-slate-700">?</span>
              )}
            </div>
            {secretUnlocked && <div className="absolute inset-0 bg-fuchsia-500 opacity-30 blur-2xl rounded-full scale-150 -z-10"></div>}
          </div>

          <h3 className={`text-xl sm:text-2xl font-extrabold mb-1 ${secretUnlocked ? 'text-foreground' : 'text-foreground/40 dark:text-slate-400'}`}>
            {secretUnlocked ? "Sharpshooter" : "Mystery Badge"}
          </h3>
          
          <p className={`font-medium text-xs sm:text-sm mb-6 ${secretUnlocked ? 'text-foreground/60' : 'text-foreground/40 dark:text-slate-500'}`}>
            {secretUnlocked ? "Complete 20 lessons." : "Keep playing to discover this secret badge."}
          </p>

          {!secretUnlocked && (
            <div className="w-full mt-auto flex justify-center">
              <span className="text-[10px] sm:text-xs font-extrabold text-foreground/50 dark:text-slate-600 bg-secondary dark:bg-slate-800 px-3 py-1.5 rounded-lg border-2 border-border dark:border-slate-700 flex items-center">
                <Info size={14} className="mr-1" /> CLASSIFIED
              </span>
            </div>
          )}
          {secretUnlocked && (
             <div className="w-full mt-auto">
               <div className="h-4 bg-fuchsia-100 rounded-full overflow-hidden shadow-inner p-0.5 relative">
                 <div className="h-full w-full bg-gradient-to-r from-fuchsia-400 to-purple-500 rounded-full relative">
                   <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                 </div>
               </div>
             </div>
          )}
        </div>

      </div>

    </div>
  );
}
