"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ProgressContextType {
  xp: number;
  streak: number;
  hearts: number;
  emptyAt: number | null;
  completedLessons: string[];
  refreshProgress: () => Promise<void>;
  addXpLocally: (amount: number) => void;
  deductHeartLocally: () => void;
  addCompletedLessonLocally: (lessonId: string) => void;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [emptyAt, setEmptyAt] = useState<number | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

        if (profile) {
          // Only update if it's strictly greater (prevents optimistic update flicker)
          setXp(prev => Math.max(prev, profile.points || 0));
          
          let currentHearts = profile.hearts !== undefined ? profile.hearts : 5;
          let currentEmptyAt = profile.hearts_empty_at ? new Date(profile.hearts_empty_at).getTime() : null;
          
          // Heart Regeneration Logic
          if (currentHearts === 0 && currentEmptyAt) {
            const now = new Date().getTime();
            const diffMinutes = Math.floor((now - currentEmptyAt) / 1000 / 60);
            
            if (diffMinutes >= 30) {
              currentHearts = 1;
              currentEmptyAt = null;
              supabase.from("user_profiles")
                .update({ hearts: 1, hearts_empty_at: null })
                .eq("id", user.id)
                .then(({ error }) => {
                   if (error) console.error("Failed to restore heart in DB", error);
                });
            }
          }
          
          // Prevent local heart deduction from flickering back if DB is slow
          setHearts(currentHearts);
          setEmptyAt(currentEmptyAt);
          // Set streak from user_profiles, default to 0
          setStreak(profile.current_streak || 0);
        }
        
        if (completed) {
          setCompletedLessons(prev => {
            const newLessons = completed.map(c => c.lesson_id);
            // Merge to prevent local optimistic updates from disappearing
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
                // Update from DB, but respect optimistic max
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

    // Also run a timer to check heart regeneration every minute if hearts == 0
    const interval = setInterval(() => {
      setHearts(current => {
        if (current === 0) fetchProgress();
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
  };

  const deductHeartLocally = () => {
    setHearts(prev => Math.max(0, prev - 1));
  };

  const addCompletedLessonLocally = (lessonId: string) => {
    setCompletedLessons(prev => {
      if (!prev.includes(lessonId)) return [...prev, lessonId];
      return prev;
    });
  };

  return (
    <ProgressContext.Provider value={{ 
      xp, streak, hearts, emptyAt, completedLessons, 
      refreshProgress, addXpLocally, deductHeartLocally, addCompletedLessonLocally, 
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
