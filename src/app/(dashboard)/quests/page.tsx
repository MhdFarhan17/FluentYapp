"use client";

import { Star, Zap, Flame, Trophy, Gift, Target, Medal, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export default function QuestsPage() {
  const { xp, quests, claimQuestReward, isLoading } = useProgress();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (id: string, rewardAmount: number) => {
    if (claimingId) return;
    setClaimingId(id);
    
    // Fire confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#eab308', '#f59e0b', '#d97706']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#eab308', '#f59e0b', '#d97706']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    await claimQuestReward(id, rewardAmount);
    setClaimingId(null);
  };

  const getQuestIcon = (questId: string) => {
    switch (questId) {
      case 'earn_xp': return <Zap size={28} className="text-amber-500" />;
      case 'complete_lessons': return <Trophy size={28} className="text-blue-500" />;
      case 'perfect_lesson': return <Star size={28} className="text-yellow-500" />;
      default: return <Flame size={28} className="text-orange-500" />;
    }
  };

  const getQuestColors = (questId: string) => {
    switch (questId) {
      case 'earn_xp': return { bg: 'bg-amber-100 dark:bg-amber-900/30', fill: 'bg-amber-500', text: 'text-amber-500' };
      case 'complete_lessons': return { bg: 'bg-blue-100 dark:bg-blue-900/30', fill: 'bg-blue-500', text: 'text-blue-500' };
      case 'perfect_lesson': return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', fill: 'bg-yellow-500', text: 'text-yellow-500' };
      default: return { bg: 'bg-orange-100 dark:bg-orange-900/30', fill: 'bg-orange-500', text: 'text-orange-500' };
    }
  };

  // Mock Monthly Challenge
  const monthlyGoal = 1000;
  const monthlyCurrent = Math.min(xp, monthlyGoal);
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
            Complete daily quests to earn XP and rewards!
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
            {isLoading ? (
              <div className="p-8 text-center text-foreground/50 animate-pulse">Loading quests...</div>
            ) : quests.length === 0 ? (
              <div className="p-8 text-center text-foreground/50 font-medium">No quests available today. Check back tomorrow!</div>
            ) : (
              quests.map((quest, index) => {
                const isComplete = quest.current_value >= quest.target_value;
                const percent = Math.min((quest.current_value / quest.target_value) * 100, 100);
                const colors = getQuestColors(quest.quest_id);
                
                return (
                  <div key={quest.id} className={`p-4 md:p-6 flex flex-col sm:flex-row sm:items-center ${index !== quests.length - 1 ? 'border-b-2 border-border/50' : ''}`}>
                    
                    {/* Quest Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 shadow-inner border-2 border-background ${colors.bg}`}>
                      {quest.is_claimed ? (
                        <CheckCircle2 size={32} className={colors.text} />
                      ) : (
                        getQuestIcon(quest.quest_id)
                      )}
                    </div>

                    {/* Quest Content */}
                    <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <h3 className={`text-lg font-extrabold truncate ${quest.is_claimed ? 'text-foreground/50 line-through' : 'text-foreground'}`}>
                            {quest.title}
                          </h3>
                          <p className="text-sm font-bold text-foreground/50 hidden sm:block">
                            {quest.description}
                          </p>
                        </div>
                        <span className={`font-extrabold text-lg flex-shrink-0 ml-4 ${isComplete ? colors.text : 'text-foreground/40'}`}>
                          {quest.current_value} / {quest.target_value}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-4 bg-secondary rounded-full overflow-hidden shadow-inner relative mb-2">
                        <div 
                          className={`absolute top-0 bottom-0 left-0 ${colors.fill} transition-all duration-1000 ease-out`}
                          style={{ width: `${percent}%` }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/30 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Reward Claim Button */}
                    <div className="sm:ml-6 flex-shrink-0 flex items-center justify-center">
                      {quest.is_claimed ? (
                        <div className="px-4 py-2 bg-secondary text-foreground/40 rounded-xl font-bold flex items-center">
                          <CheckCircle2 size={18} className="mr-2" /> Claimed
                        </div>
                      ) : isComplete ? (
                        <button 
                          onClick={() => handleClaim(quest.id, quest.reward_amount)}
                          disabled={claimingId === quest.id}
                          className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-xl font-extrabold shadow-[0_4px_0_0_#ca8a04] hover:translate-y-1 hover:shadow-[0_0px_0_0_#ca8a04] transition-all flex items-center animate-pulse"
                        >
                          {claimingId === quest.id ? 'Claiming...' : 'Claim Reward'}
                        </button>
                      ) : (
                        <div className="px-4 py-2 bg-secondary/50 text-foreground/50 rounded-xl font-bold flex items-center border-2 border-transparent">
                          <Gift size={18} className="mr-2" /> {quest.reward_amount} XP
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Monthly Challenge */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-extrabold text-foreground flex items-center mb-6">
            <Medal className="text-purple-500 mr-2" size={28} />
            Monthly Challenge
          </h2>

          <div className="bg-background rounded-3xl border-2 border-border shadow-sm p-8 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
            
            <h3 className="text-xl font-extrabold mb-8 text-foreground/80 uppercase tracking-widest">
              {new Date().toLocaleString('en-US', { month: 'long' })} Badge
            </h3>

            {/* Massive 3D Badge */}
            <div className={`relative mb-8 transition-transform duration-700 hover:scale-105 ${isMonthlyComplete ? 'animate-pulse-slow' : ''}`}>
              <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${isMonthlyComplete ? 'bg-purple-500' : 'bg-foreground/10'}`}></div>
              
              <div className={`w-40 h-40 rounded-full flex items-center justify-center relative z-10 border-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_4px_20px_rgba(255,255,255,0.5)] overflow-hidden
                ${isMonthlyComplete 
                  ? 'border-purple-300 bg-gradient-to-br from-purple-400 via-fuchsia-500 to-indigo-600' 
                  : 'border-border bg-secondary grayscale'
                }
              `}>
                <Medal size={80} className={`${isMonthlyComplete ? 'text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]' : 'text-foreground/30'}`} />
                
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
