"use client";

import { useEffect, useState } from "react";
import { Trophy, Star, Crown, Loader2, Medal } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useProgress } from "@/context/ProgressContext";

interface Player {
  id: string;
  name: string;
  xp: number;
}

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { xp: currentUserXp } = useProgress();

  const [timeLeft, setTimeLeft] = useState<string>("Loading...");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Find the next Sunday (0 is Sunday, 1 is Monday, etc.)
      const nextSunday = new Date();
      const daysUntilSunday = (7 - now.getDay()) % 7;
      // If it's Sunday, we want the target to be today at 23:59:59.
      // If it's passed 23:59:59, it goes to next week, but 23:59:59 is the very end of the day.
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      nextSunday.setHours(23, 59, 59, 999);
      
      const difference = nextSunday.getTime() - now.getTime();
      
      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const m = Math.floor((difference / 1000 / 60) % 60);
        const s = Math.floor((difference / 1000) % 60);
        
        // Urgent if less than 24 hours (d === 0)
        setIsUrgent(d === 0);
        
        if (d > 0) {
          setTimeLeft(`${d}d ${h}h ${m}m`);
        } else {
          setTimeLeft(`${h}h ${m}m ${s}s`);
        }
      } else {
        setTimeLeft("0h 0m 0s");
        setIsUrgent(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const supabase = createClient();
        
        // Get current user for highlighting
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setCurrentUserId(user.id);
        
        // Fetch top 15 from user_profiles
        const { data, error } = await supabase
          .from("user_profiles")
          .select("id, points")
          .order("points", { ascending: false })
          .limit(15);
          
        if (error) throw error;
        
        if (data) {
          const formattedPlayers: Player[] = data.map((p, index) => ({
            id: p.id,
            name: user && user.id === p.id ? "You" : `Learner ${p.id.substring(0, 4).toUpperCase()}`,
            xp: (user && user.id === p.id) ? Math.max(p.points || 0, currentUserXp) : (p.points || 0)
          }));
          
          formattedPlayers.sort((a, b) => b.xp - a.xp);
          setPlayers(formattedPlayers);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();

    // Subscribe to real-time changes
    const supabase = createClient();
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log("Realtime update received:", payload);
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserXp]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const top3 = players.slice(0, 3);
  const rest = players.slice(3);
  
  // Promo / Demo Zones thresholds (assuming 15 max)
  const PROMO_ZONE = 5;
  const DEMO_ZONE = 10;

  // Reorder Top 3 for Podium visually: 2nd, 1st, 3rd
  const podiumOrder = [
    top3[1] || null, // 2nd
    top3[0] || null, // 1st
    top3[2] || null  // 3rd
  ];
  
  const getAvatarColor = (name: string) => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-teal-500", "bg-indigo-500"];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      
      {/* League Banner */}
      <div className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-3xl p-6 md:p-8 mb-12 md:mb-16 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border-b-4 border-violet-800">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:space-x-6 mb-6 md:mb-0 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border-2 border-white/30 shadow-inner transform rotate-3 mb-4 sm:mb-0">
            <Trophy className="text-yellow-300 drop-shadow-md" size={36} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">Diamond League</h1>
            <p className="text-white/80 font-bold mt-1 text-sm sm:text-base">Top 5 advance to the next league!</p>
          </div>
        </div>
        
        <div className={`relative z-10 bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 text-center min-w-[160px] w-full md:w-auto transition-colors duration-1000 ${isUrgent ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)] animate-pulse' : 'border-white/10'}`}>
          <p className={`font-bold text-xs uppercase tracking-wider mb-1 ${isUrgent ? 'text-orange-400' : 'text-white/60'}`}>
            Time Remaining
          </p>
          <p className={`font-extrabold text-xl font-mono ${isUrgent ? 'text-orange-500' : 'text-white'}`}>
            {timeLeft}
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 left-1/2 w-64 h-64 bg-fuchsia-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Podium for Top 3 */}
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-1 sm:gap-2 md:gap-6 mb-12 md:mb-16 h-60 sm:h-72 px-1">
          
          {/* 2nd Place */}
          {podiumOrder[0] && (
            <div className="flex flex-col items-center flex-1 max-w-[90px] sm:max-w-[120px] animate-in slide-in-from-bottom-8 duration-700 delay-150">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${getAvatarColor(podiumOrder[0].name)} rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] border-4 border-gray-300 relative z-10 text-white font-extrabold text-2xl sm:text-3xl`}>
                {podiumOrder[0].name.charAt(0)}
                <div className="absolute -bottom-3 sm:-bottom-4 bg-gray-400 text-white rounded-full p-1 border-2 border-background shadow-md">
                  <Medal size={16} className="drop-shadow-sm sm:w-[20px] sm:h-[20px]" />
                </div>
              </div>
              <div className="w-full bg-gradient-to-b from-gray-300 to-gray-400 rounded-t-xl sm:rounded-t-2xl h-24 sm:h-32 flex flex-col items-center justify-start pt-3 sm:pt-5 border-t-4 border-gray-200 shadow-[inset_0_4px_10px_rgba(255,255,255,0.4)]">
                <span className="font-extrabold text-gray-800 truncate w-full text-center px-1 text-[10px] sm:text-sm">{podiumOrder[0].name}</span>
                <span className="text-gray-700 font-bold text-[9px] sm:text-xs mt-1 bg-white/30 px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">{podiumOrder[0].xp} XP</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {podiumOrder[1] && (
            <div className="flex flex-col items-center flex-1 max-w-[110px] sm:max-w-[150px] animate-in slide-in-from-bottom-12 duration-700 z-10">
              <Crown className="text-yellow-400 mb-1 sm:mb-2 animate-bounce-slow drop-shadow-md w-[28px] h-[28px] sm:w-[36px] sm:h-[36px]" />
              <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${getAvatarColor(podiumOrder[1].name)} rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] border-4 border-yellow-400 relative z-10 text-white font-extrabold text-3xl sm:text-4xl ring-4 ring-yellow-400/30`}>
                {podiumOrder[1].name.charAt(0)}
                <div className="absolute -bottom-3 sm:-bottom-4 bg-yellow-500 text-white rounded-full p-1 sm:p-1.5 border-2 border-background shadow-lg">
                  <Medal size={18} className="drop-shadow-sm sm:w-[24px] sm:h-[24px]" />
                </div>
              </div>
              <div className="w-full bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-xl sm:rounded-t-2xl h-32 sm:h-44 flex flex-col items-center justify-start pt-3 sm:pt-5 border-t-4 border-yellow-300 shadow-[0_-10px_20px_rgba(250,204,21,0.3),inset_0_4px_10px_rgba(255,255,255,0.4)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
                <span className="font-extrabold text-yellow-900 truncate w-full text-center px-1 text-[11px] sm:text-sm relative z-10">{podiumOrder[1].name}</span>
                <span className="text-yellow-900 font-bold text-[10px] sm:text-sm mt-1 bg-white/40 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg relative z-10">{podiumOrder[1].xp} XP</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {podiumOrder[2] && (
            <div className="flex flex-col items-center flex-1 max-w-[90px] sm:max-w-[120px] animate-in slide-in-from-bottom-8 duration-700 delay-300">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 ${getAvatarColor(podiumOrder[2].name)} rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] border-4 border-amber-600 relative z-10 text-white font-extrabold text-2xl sm:text-3xl`}>
                {podiumOrder[2].name.charAt(0)}
                <div className="absolute -bottom-3 sm:-bottom-4 bg-amber-600 text-white rounded-full p-1 border-2 border-background shadow-md">
                  <Medal size={16} className="drop-shadow-sm sm:w-[20px] sm:h-[20px]" />
                </div>
              </div>
              <div className="w-full bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-xl sm:rounded-t-2xl h-20 sm:h-24 flex flex-col items-center justify-start pt-3 sm:pt-5 border-t-4 border-amber-500 shadow-[inset_0_4px_10px_rgba(255,255,255,0.2)]">
                <span className="font-extrabold text-white truncate w-full text-center px-1 text-[10px] sm:text-sm">{podiumOrder[2].name}</span>
                <span className="text-white/90 font-bold text-[9px] sm:text-xs mt-1 bg-black/20 px-1 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg">{podiumOrder[2].xp} XP</span>
              </div>
            </div>
          )}

        </div>
      )}

      {/* List for the rest */}
      <div className="space-y-3 max-w-2xl mx-auto relative pb-20">
        
        {/* Promotion Zone Divider (if we have players) */}
        {players.length > 3 && (
           <div className="w-full text-center relative py-4">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t-2 border-green-500/30 border-dashed"></div>
             </div>
             <span className="relative bg-background px-4 text-xs font-extrabold tracking-widest text-green-500 uppercase">Promotion Zone</span>
           </div>
        )}

        {rest.map((player, index) => {
          const rank = index + 4;
          const isMe = currentUserId === player.id;
          const isPromo = rank <= PROMO_ZONE;
          const isDemo = rank > DEMO_ZONE;
          
          return (
            <div key={player.id}>
              {/* Demotion Zone Divider */}
              {rank === DEMO_ZONE + 1 && (
                 <div className="w-full text-center relative py-6">
                   <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t-2 border-red-500/30 border-dashed"></div>
                   </div>
                   <span className="relative bg-background px-4 text-xs font-extrabold tracking-widest text-red-500 uppercase">Demotion Zone</span>
                 </div>
              )}

              <div 
                className={`flex items-center p-4 md:p-5 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-default
                  ${isMe ? "bg-primary/10 border-2 border-primary shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "bg-background border-2 border-border hover:bg-secondary/50 shadow-sm"}
                  ${isPromo && !isMe ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-900" : ""}
                  ${isDemo && !isMe ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900" : ""}
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-8 font-extrabold text-lg text-center mr-2 md:mr-4 ${
                  isPromo ? "text-green-500" : isDemo ? "text-red-500" : "text-foreground/40"
                }`}>
                  {rank}
                </div>
                
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mr-4 md:mr-6 font-extrabold text-white text-xl border-2 border-background shadow-sm ${getAvatarColor(player.name)}`}>
                  {player.name.charAt(0)}
                </div>
                
                <div className="flex-1 font-bold text-lg md:text-xl text-foreground">
                  {player.name}
                  {isMe && <span className="ml-3 text-xs bg-primary text-white px-2 py-1 rounded-md uppercase tracking-wider">You</span>}
                </div>
                
                <div className="font-extrabold text-foreground flex items-center space-x-1.5 bg-secondary/50 px-4 py-2 rounded-xl">
                  <span className={`text-xl ${isPromo ? 'text-green-600 dark:text-green-400' : isDemo ? 'text-red-600 dark:text-red-400' : 'text-primary'}`}>
                    {player.xp}
                  </span>
                  <span className="text-sm text-foreground/50">XP</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {players.length === 0 && (
          <div className="text-center p-12 text-foreground/50 font-medium border-2 border-dashed border-border rounded-3xl bg-secondary/20">
            <Trophy size={48} className="mx-auto mb-4 text-foreground/30" />
            <p className="text-xl font-bold mb-2">The league is empty!</p>
            <p>Start learning to claim the #1 spot.</p>
          </div>
        )}
      </div>

    </div>
  );
}
