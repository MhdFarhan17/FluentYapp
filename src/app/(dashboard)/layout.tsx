"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { ProgressProvider, useProgress } from "@/context/ProgressContext";
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Settings, 
  LogOut,
  Menu,
  X,
  Flame,
  Star,
  Heart,
  Brain
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Library", href: "/library", icon: BookOpen },
  { name: "Review", href: "/review", icon: Brain },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Achievements", href: "/achievements", icon: Star },
  { name: "Settings", href: "/settings", icon: Settings },
];

import { createPortal } from "react-dom";

import { useEffect } from "react";

function TopStats() {
  const { xp, streak, hearts, emptyAt, isLoading } = useProgress();
  const [activeModal, setActiveModal] = useState<'hearts' | 'streak' | 'xp' | null>(null);
  const [timeToNextHeart, setTimeToNextHeart] = useState("30:00");
  
  useEffect(() => {
    if (activeModal === 'hearts' && emptyAt && hearts < 5) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const diff = now - emptyAt;
        const remaining = (30 * 60 * 1000) - diff;
        
        if (remaining <= 0) {
          setTimeToNextHeart("Refilling...");
        } else {
          const mins = Math.floor(remaining / (1000 * 60));
          const secs = Math.floor((remaining % (1000 * 60)) / 1000);
          setTimeToNextHeart(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeToNextHeart(hearts === 5 ? "Full" : "30:00");
    }
  }, [activeModal, emptyAt, hearts]);

  if (isLoading) return <div className="w-32 h-6 bg-secondary animate-pulse rounded-full"></div>;

  // Advanced Gamification Streak Logic (6 Tiers)
  const getStreakTier = (days: number) => {
    if (days >= 365) return { name: "Diamond Eternal", color: "text-cyan-300", bg: "bg-cyan-300/10", hoverBg: "hover:bg-cyan-300/20", fill: "fill-cyan-300", glow: "hover:shadow-[0_4px_20px_rgba(103,232,249,0.8)]", next: null, min: 365, max: 365 };
    if (days >= 100) return { name: "Golden Supernova", color: "text-yellow-400", bg: "bg-yellow-400/10", hoverBg: "hover:bg-yellow-400/20", fill: "fill-yellow-400", glow: "hover:shadow-[0_4px_20px_rgba(250,204,21,0.8)]", next: 365, min: 100, max: 365 };
    if (days >= 30) return { name: "Purple Phoenix", color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", hoverBg: "hover:bg-fuchsia-500/20", fill: "fill-fuchsia-500", glow: "hover:shadow-[0_4px_20px_rgba(217,70,239,0.8)]", next: 100, min: 30, max: 100 };
    if (days >= 14) return { name: "Blue Heat", color: "text-blue-500", bg: "bg-blue-500/10", hoverBg: "hover:bg-blue-500/20", fill: "fill-blue-500", glow: "hover:shadow-[0_4px_15px_rgba(59,130,246,0.8)]", next: 30, min: 14, max: 30 };
    if (days >= 7) return { name: "The Blaze", color: "text-red-600", bg: "bg-red-600/10", hoverBg: "hover:bg-red-600/20", fill: "fill-red-600", glow: "hover:shadow-[0_4px_15px_rgba(220,38,38,0.8)]", next: 14, min: 7, max: 14 };
    return { name: "The Spark", color: "text-orange-500", bg: "bg-orange-500/10", hoverBg: "hover:bg-orange-500/20", fill: "fill-orange-500", glow: "hover:shadow-[0_4px_12px_rgba(249,115,22,0.5)]", next: 7, min: 0, max: 7 };
  };

  const currentTier = getStreakTier(streak);
  const streakProgressPercent = currentTier.next ? ((streak - currentTier.min) / (currentTier.next - currentTier.min)) * 100 : 100;
  
  return (
    <>
      <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar">
        {/* Hearts Widget */}
        <button 
          onClick={() => setActiveModal('hearts')}
          className="flex items-center space-x-1 font-bold text-red-500 hover:bg-red-500/10 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-colors relative flex-shrink-0"
        >
          <Heart size={18} className={`sm:w-5 sm:h-5 ${hearts > 0 ? "fill-red-500" : ""}`} />
          <span className="text-sm sm:text-base">{hearts === 5 ? "MAX" : hearts}</span>
        </button>

        {/* Streak Widget */}
        <button 
          onClick={() => setActiveModal('streak')}
          className="flex items-center space-x-1 font-bold text-orange-500 hover:bg-orange-500/10 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-colors relative flex-shrink-0"
        >
          <Flame size={18} className={`sm:w-5 sm:h-5 ${streak > 0 ? "fill-orange-500" : ""}`} />
          <span className="text-sm sm:text-base">{streak}</span>
        </button>
        
        {/* XP Widget */}
        <button 
          onClick={() => setActiveModal('xp')}
          className="flex items-center space-x-1 font-bold text-blue-500 hover:bg-blue-500/10 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl transition-colors relative flex-shrink-0"
        >
          <Star size={18} className="sm:w-5 sm:h-5 fill-blue-500" />
          <span className="text-sm sm:text-base">{xp}</span>
        </button>
      </div>

      {/* Global Modal Layer */}
      {activeModal && createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveModal(null)}
          ></div>
          
          {/* Modal Content Box */}
          <div className="relative bg-background border-2 border-border/50 rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 bg-secondary/50 rounded-full text-foreground/50 hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X size={20} />
            </button>

            {/* Hearts Modal */}
            {activeModal === 'hearts' && (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center shadow-inner">
                  <Heart size={50} className="text-red-500 fill-red-500 animate-pulse" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground mb-3">Hearts</h2>
                <p className="text-foreground/70 font-medium leading-relaxed mb-6">
                  Hearts are used when you make mistakes in lessons. You lose 1 heart for every mistake. 
                  When you run out of hearts, you cannot start new lessons.
                </p>
                <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center font-bold">
                    <span>Remaining Hearts</span>
                    <span className="text-red-500 text-xl">{hearts} / 5</span>
                  </div>
                  {hearts < 5 && (
                    <div className="flex justify-between items-center text-sm font-medium border-t border-border/50 pt-3">
                      <span className="text-foreground/60">Next heart in:</span>
                      <span className="text-primary font-bold">{timeToNextHeart}</span>
                    </div>
                  )}
                  {hearts < 5 && emptyAt && (
                    <div className="flex justify-between items-center text-sm font-medium pt-1">
                      <span className="text-foreground/60">Full in:</span>
                      <span className="text-foreground font-bold">{Math.ceil((emptyAt + (5 - hearts) * 30 * 60 * 1000 - Date.now()) / (60 * 1000))} mins</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Streak Modal */}
            {activeModal === 'streak' && (
              <div className="text-center">
                <div className={`w-24 h-24 mx-auto mb-6 ${currentTier.bg} rounded-full flex items-center justify-center shadow-inner`}>
                  <Flame size={50} className={`${currentTier.color} fill-current`} />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground mb-1">{currentTier.name} Streak</h2>
                <p className="text-foreground/70 font-medium leading-relaxed mb-6 mt-3">
                  Keep your flame burning! You have learned for <strong className={`${currentTier.color} text-xl`}>{streak} Days</strong> in a row. Don't skip a day, or your flame will go out!
                </p>
                
                {/* Streak Next Tier Progress */}
                {currentTier.next && (
                  <div className="bg-secondary/50 rounded-2xl p-4 text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">To Next Level</span>
                      <span className={`font-extrabold text-sm ${currentTier.color}`}>{currentTier.next - streak} Days Left</span>
                    </div>
                    <div className="h-3 bg-background rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`h-full ${currentTier.bg.replace('/10', '/80')} transition-all duration-1000`}
                        style={{ width: `${streakProgressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                {!currentTier.next && (
                  <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 font-bold text-cyan-600 dark:text-cyan-400">
                    🏆 You are an Eternal Master of Consistency! (Max Level)
                  </div>
                )}
              </div>
            )}

            {/* XP Modal */}
            {activeModal === 'xp' && (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center shadow-inner">
                  <Star size={50} className="text-blue-500 fill-blue-500" />
                </div>
                <h2 className="text-2xl font-extrabold text-foreground mb-3">Experience Points (XP)</h2>
                <p className="text-foreground/70 font-medium leading-relaxed mb-6">
                  Prove your dedication! Earn XP by completing lessons. You get <strong className="text-blue-500">100 XP</strong> for a perfect score, or <strong className="text-blue-500">90 XP</strong> if you make a mistake. XP is used to compete on the global Leaderboard!
                </p>
                <div className="bg-secondary/50 rounded-2xl p-4 flex items-center justify-between font-bold">
                  <span>Your Total XP:</span>
                  <span className="text-blue-500 text-xl flex items-center"><Star size={20} className="fill-blue-500 mr-2" /> {xp}</span>
                </div>
              </div>
            )}

            {/* Common Close Action Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="w-full mt-6 py-4 rounded-2xl bg-foreground text-background font-extrabold uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              GOT IT
            </button>

          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isLesson = pathname.startsWith('/lesson');

  if (isLesson) {
    return (
      <ProgressProvider>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </ProgressProvider>
    );
  }

  return (
    <ProgressProvider>
      <div className="min-h-screen bg-secondary/30 flex relative">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-72 bg-background border-r border-border p-6 fixed h-full z-20">
          <Link href="/dashboard" className="flex items-center space-x-3 mb-12 group">
            <div className="w-10 h-10 relative group-hover:scale-110 transition-transform">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-primary">FluentYapp</span>
          </Link>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl font-semibold transition-all ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-xl text-red-500 font-semibold hover:bg-red-500/10 transition-all"
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Header (Top) */}
        <div className="lg:hidden fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-[100] px-4 py-3 flex items-center justify-between shadow-sm">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-primary hidden sm:block">FluentYapp</span>
          </Link>
          <div className="flex items-center space-x-2">
            <TopStats />
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:ml-72 min-h-screen relative pb-28 lg:pb-0">
          {/* Desktop Top Bar */}
          <header className="hidden lg:flex items-center justify-end px-10 py-6 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-[100]">
            <TopStats />
            <ThemeToggle />
          </header>
          
          <div className="flex-1 pt-[72px] lg:pt-0">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 w-full bg-background border-t border-border z-[100] flex items-center justify-around px-2 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[48px] transition-all ${
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-foreground/50 hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "mb-1" : "mb-1"} />
                <span className={`text-[10px] font-bold ${isActive ? "opacity-100" : "opacity-0 h-0"}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </ProgressProvider>
  );
}
