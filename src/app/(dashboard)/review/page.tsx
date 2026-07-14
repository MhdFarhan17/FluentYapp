"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Brain, Flame, Target, Trophy, Info } from "lucide-react";
import Link from "next/link";

interface Mistake {
  id: string;
  lesson_id: string;
  question: string;
  correct_answer: string;
  wrong_answer: string;
  mistake_count: number;
  last_mistake_at: string;
}

export default function ReviewPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMistakes() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_mistakes')
        .select('*')
        .eq('user_id', user.id)
        .order('mistake_count', { ascending: false })
        .order('last_mistake_at', { ascending: false });
        
      if (!error && data) {
        setMistakes(data as Mistake[]);
      }
      setLoading(false);
    }
    fetchMistakes();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 md:p-12 mb-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border-b-8 border-emerald-800">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:space-x-6 mb-6 md:mb-0 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border-4 border-white/30 shadow-inner mb-4 sm:mb-0">
            <Brain className="text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] w-[32px] h-[32px] sm:w-[48px] sm:h-[48px]" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md mb-1 sm:mb-2">Smart Review</h1>
            <p className="text-white/90 font-bold text-sm sm:text-lg drop-shadow-sm">Focus on your weaknesses. Practice smarter!</p>
          </div>
        </div>
        
        <div className="relative z-10 bg-black/20 backdrop-blur-md px-6 sm:px-8 py-4 sm:py-5 rounded-2xl sm:rounded-3xl border-2 border-white/10 text-center min-w-[180px] sm:min-w-[220px] shadow-lg w-full md:w-auto">
          <div className="text-white/80 font-bold text-xs sm:text-sm uppercase tracking-widest mb-1 flex items-center justify-center">
            <Target size={16} className="mr-1 text-red-300" /> Saved Mistakes
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white">{mistakes.length}</div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-10 w-64 h-64 bg-green-300/30 rounded-full -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-20 w-80 h-80 bg-teal-800/20 rounded-full translate-y-1/3 blur-3xl"></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : mistakes.length === 0 ? (
        <div className="bg-background rounded-3xl p-10 border-2 border-border text-center shadow-sm">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-3">Perfect!</h2>
          <p className="text-foreground/70 font-medium mb-8 max-w-md mx-auto">
            You haven't made any mistakes yet or haven't started learning. Keep it up!
          </p>
          <Link href="/dashboard" className="inline-block bg-primary text-white font-bold text-lg px-8 py-4 rounded-2xl border-b-4 border-primary-hover hover:translate-y-1 hover:border-b-0 active:translate-y-1 transition-all">
            Back to Learning
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-extrabold text-foreground flex items-center">
              <Flame className="mr-2 text-orange-500" /> 
              Your Top Mistakes
            </h2>
            <Link 
              href="/review/practice"
              className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-xl text-sm hover:bg-primary/20 transition-colors"
            >
              Practice Weakness
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mistakes.map((mistake) => (
              <div key={mistake.id} className="bg-background border-2 border-border rounded-2xl p-5 hover:border-emerald-500/50 transition-colors shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-bold text-xs px-3 py-1 rounded-bl-xl border-l-2 border-b-2 border-border">
                  Wrong {mistake.mistake_count}x
                </div>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wide">
                  {mistake.lesson_id}
                </p>
                <h3 className="text-lg font-extrabold text-foreground mb-4 pr-16 leading-tight">
                  {mistake.question}
                </h3>
                
                <div className="space-y-2">
                  <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-xl p-3 flex">
                    <div className="text-green-500 font-bold mr-3">✓</div>
                    <div className="text-green-700 dark:text-green-400 font-medium">{mistake.correct_answer}</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-3 flex opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="text-red-500 font-bold mr-3">✗</div>
                    <div className="text-red-700 dark:text-red-400 font-medium">
                      Your Answer: {mistake.wrong_answer === "N/A" ? "(Empty)" : mistake.wrong_answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
