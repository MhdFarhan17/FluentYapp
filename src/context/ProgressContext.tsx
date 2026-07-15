"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Quest {
  id: string;
  quest_id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  is_claimed: boolean;
  reward_amount: number;
}

interface ProgressContextType {
  xp: number;
  streak: number;
  hearts: number;
  emptyAt: number | null;
  completedLessons: string[];
  quests: Quest[];
  refreshProgress: () => Promise<void>;
  addXpLocally: (amount: number) => void;
  deductHeartLocally: () => void;
  addCompletedLessonLocally: (lessonId: string) => void;
  updateQuestProgress: (questId: string, amount: number) => Promise<void>;
  claimQuestReward: (id: string, rewardAmount: number) => Promise<void>;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [emptyAt, setEmptyAt] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to generate quests if they don't exist
  const generateDailyQuests = async (supabase: any, userId: string, todayStr: string) => {
    const defaultQuests = [
      {
        user_id: userId,
        quest_date: todayStr,
        quest_id: "earn_xp",
        title: "XP Grinder",
        description: "Earn 50 XP today.",
        target_value: 50,
        reward_amount: 15
      },
      {
        user_id: userId,
        quest_date: todayStr,
        quest_id: "complete_lessons",
        title: "The Scholar",
        description: "Complete 3 lessons.",
        target_value: 3,
        reward_amount: 20
      },
      {
        user_id: userId,
        quest_date: todayStr,
        quest_id: "perfect_lesson",
        title: "Flawless Victory",
        description: "Complete 1 lesson with no mistakes.",
        target_value: 1,
        reward_amount: 25
      }
    ];

    try {
      const { data, error } = await supabase.from('user_quests').insert(defaultQuests).select();
      if (!error && data) {
        setQuests(data as Quest[]);
      }
    } catch (e) {
      console.error("Failed to generate quests", e);
    }
  };

  const fetchProgress = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch XP, Hearts, and Streak
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("points, hearts, hearts_empty_at, current_streak")
          .eq("id", user.id)
          .single();
          
        // Fetch Completed Lessons
        const { data: completed } = await supabase
          .from("user_completed_lessons")
          .select("lesson_id")
          .eq("user_id", user.id);

        // Fetch Quests for today
        const todayStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
        const { data: todayQuests, error: questsError } = await supabase
          .from("user_quests")
          .select("*")
          .eq("user_id", user.id)
          .eq("quest_date", todayStr);

        if (questsError) {
          console.error("Quests fetch error. Ensure user_quests table exists.", questsError);
        } else if (todayQuests && todayQuests.length > 0) {
          setQuests(todayQuests as Quest[]);
        } else {
          // No quests for today, generate them
          await generateDailyQuests(supabase, user.id, todayStr);
        }

        if (profile) {
          // Only update if it's strictly greater (prevents optimistic update flicker)
          setXp(prev => Math.max(prev, profile.points || 0));
          
          let currentHearts = profile.hearts !== undefined ? profile.hearts : 5;
          let currentEmptyAt = profile.hearts_empty_at ? new Date(profile.hearts_empty_at).getTime() : null;
          
          // Fallback for users stuck due to old bug (hearts < 5 but no timer)
          if (currentHearts < 5 && !currentEmptyAt) {
             currentEmptyAt = new Date().getTime();
             supabase.from("user_profiles")
               .update({ hearts_empty_at: new Date(currentEmptyAt).toISOString() })
               .eq("id", user.id)
               .then(({ error }) => {
                  if (error) console.error("Failed to set fallback timer in DB", error);
               });
          }
          
          // Heart Regeneration Logic (1 heart per 30 mins)
          if (currentHearts < 5 && currentEmptyAt) {
            const now = new Date().getTime();
            const diffMinutes = Math.floor((now - currentEmptyAt) / 1000 / 60);
            
            if (diffMinutes >= 30) {
              const heartsToAdd = Math.floor(diffMinutes / 30);
              currentHearts = Math.min(5, currentHearts + heartsToAdd);
              
              if (currentHearts === 5) {
                currentEmptyAt = null;
              } else {
                // Advance the timer by the exact intervals gained
                currentEmptyAt = currentEmptyAt + (heartsToAdd * 30 * 60 * 1000);
              }
              
              supabase.from("user_profiles")
                .update({ 
                  hearts: currentHearts, 
                  hearts_empty_at: currentEmptyAt ? new Date(currentEmptyAt).toISOString() : null 
                })
                .eq("id", user.id)
                .then(({ error }) => {
                   if (error) console.error("Failed to restore heart in DB", error);
                });
            }
          }
          
          setHearts(currentHearts);
          setEmptyAt(currentEmptyAt);
          setStreak(profile.current_streak || 0);
        }
        
        if (completed) {
          setCompletedLessons(prev => {
            const newLessons = completed.map(c => c.lesson_id);
            return Array.from(new Set([...prev, ...newLessons]));
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch progress", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();

    // Set up Realtime Subscription for Global Sync
    let isMounted = true;
    let channel: any = null;
    
    const setupRealtime = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && isMounted) {
        channel = supabase
          .channel(`global-progress-${user.id}-${Date.now()}`)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'user_profiles', filter: `id=eq.${user.id}` },
            (payload) => {
              if (payload.new) {
                if (payload.new.points !== undefined) {
                  setXp(prev => Math.max(prev, payload.new.points));
                }
                if (payload.new.hearts !== undefined) {
                  setHearts(payload.new.hearts);
                }
                if (payload.new.hearts_empty_at !== undefined) {
                  setEmptyAt(payload.new.hearts_empty_at ? new Date(payload.new.hearts_empty_at).getTime() : null);
                }
              }
            }
          )
          .subscribe();
      }
    };
    
    setupRealtime();

    const interval = setInterval(() => {
      setHearts(current => {
        if (current < 5) fetchProgress();
        return current;
      });
    }, 60000);

    return () => {
      isMounted = false;
      if (channel) {
        const supabase = createClient();
        supabase.removeChannel(channel);
      }
      clearInterval(interval);
    };
  }, []);

  const refreshProgress = async () => {
    await fetchProgress();
  };

  const addXpLocally = (amount: number) => {
    setXp(prev => prev + amount);
    // Also update XP quest if it exists
    updateQuestProgress("earn_xp", amount);
  };

  const deductHeartLocally = () => {
    setHearts(prev => Math.max(0, prev - 1));
  };

  const addCompletedLessonLocally = (lessonId: string) => {
    setCompletedLessons(prev => {
      if (!prev.includes(lessonId)) return [...prev, lessonId];
      return prev;
    });
    // Update lesson quest
    updateQuestProgress("complete_lessons", 1);
  };

  const updateQuestProgress = async (questId: string, amount: number) => {
    setQuests(prev => {
      const updated = [...prev];
      const qIndex = updated.findIndex(q => q.quest_id === questId);
      if (qIndex !== -1 && !updated[qIndex].is_claimed) {
        const quest = updated[qIndex];
        if (quest.current_value < quest.target_value) {
          const newValue = Math.min(quest.target_value, quest.current_value + amount);
          quest.current_value = newValue;
          
          // Fire and forget DB update
          const supabase = createClient();
          supabase.from('user_quests')
            .update({ current_value: newValue })
            .eq('id', quest.id)
            .then(({ error }) => {
              if (error) console.error("Failed to update quest in DB", error);
            });
        }
      }
      return updated;
    });
  };

  const claimQuestReward = async (id: string, rewardAmount: number) => {
    // 1. Mark as claimed locally
    setQuests(prev => {
      const updated = [...prev];
      const qIndex = updated.findIndex(q => q.id === id);
      if (qIndex !== -1) {
        updated[qIndex].is_claimed = true;
      }
      return updated;
    });
    
    // 2. Add XP
    addXpLocally(rewardAmount);

    // 3. Mark as claimed in DB and update XP
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('user_quests')
        .update({ is_claimed: true })
        .eq('id', id);
        
      const { data: profile } = await supabase.from('user_profiles').select('points').eq('id', user.id).single();
      if (profile) {
        await supabase.from('user_profiles').update({ points: profile.points + rewardAmount }).eq('id', user.id);
      }
    }
  };

  return (
    <ProgressContext.Provider value={{ 
      xp, streak, hearts, emptyAt, completedLessons, quests,
      refreshProgress, addXpLocally, deductHeartLocally, addCompletedLessonLocally, 
      updateQuestProgress, claimQuestReward,
      isLoading 
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
