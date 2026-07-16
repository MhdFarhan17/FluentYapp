"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, BrainCircuit, Target, Trophy, Flame, Smartphone, Download, CheckCircle2, Heart, BookOpen, User } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-background pt-20 pb-16 sm:pb-24 lg:pb-32">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-start space-y-8 text-left z-10"
            >
              <div className="inline-flex items-center space-x-2 bg-secondary px-4 py-2 rounded-full border border-border">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <span className="text-sm font-semibold text-foreground/80">100% Free. Zero Hidden Costs.</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Master English<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Like a Native.</span>
              </h1>
              
              <p className="text-base sm:text-lg lg:text-xl text-foreground/70 max-w-xl leading-relaxed font-medium">
                Forget boring textbooks. Master real-world English through bite-sized, interactive lessons. Our smart adaptive curriculum aligns with global CEFR standards to perfectly match your unique skill level.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
                <Link 
                  href="/signup" 
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center space-x-2 group"
                >
                  <span>Start Learning for Free</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/placement-test" 
                  className="bg-secondary text-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-border transition-all duration-300 flex items-center justify-center border border-border shadow-sm hover:shadow-md"
                >
                  Take Placement Test
                </Link>
              </div>
              
              <div className="flex items-center space-x-4 pt-6 text-sm font-medium text-foreground/60">
                <div className="flex -space-x-3">
                   {/* Avatar Mockups */}
                   <div className="w-10 h-10 rounded-full border-2 border-background bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs z-40">JD</div>
                   <div className="w-10 h-10 rounded-full border-2 border-background bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-xs z-30">SA</div>
                   <div className="w-10 h-10 rounded-full border-2 border-background bg-green-100 flex items-center justify-center text-green-600 font-bold text-xs z-20">MR</div>
                   <div className="w-10 h-10 rounded-full border-2 border-background bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xs z-10">+9k</div>
                </div>
                <p>Join <span className="font-bold text-foreground">10,000+</span> learners worldwide</p>
              </div>
            </motion.div>

            {/* Right Visual (Asymmetric Mockup) */}
            <motion.div 
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative h-[600px] w-full hidden lg:block perspective-1000"
            >
              
              {/* Main App Mockup Card */}
              <div className="absolute top-10 right-0 w-[85%] h-[85%] bg-background border border-border rounded-[2rem] shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-all duration-700 z-20 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center space-x-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    <Flame size={14} className="text-orange-500 fill-orange-500" />
                    <span className="text-xs font-bold text-orange-600">14 Day Streak!</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-2xl mb-4">Daily Conversation</h3>
                <div className="space-y-4 flex-1">
                  <div className="w-[80%] p-4 bg-secondary rounded-2xl rounded-tl-none self-start border border-border hover:-translate-y-1 transition-transform">
                    <p className="text-sm font-medium">Hello! How was your weekend trip to the mountains?</p>
                  </div>
                  <div className="w-[80%] p-4 bg-primary text-white rounded-2xl rounded-tr-none self-end ml-auto shadow-md hover:-translate-y-1 transition-transform">
                    <p className="text-sm font-medium">It was amazing! We hiked for three hours and the view was breathtaking.</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-auto pt-4">
                    <button className="flex-1 bg-accent text-white py-3.5 rounded-xl font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/20 flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
                      <span>Speaking...</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card - Leaderboard */}
              <div className="absolute top-20 -left-10 bg-background border border-border p-4 rounded-2xl shadow-xl z-30 animate-bounce-slow flex flex-col space-y-3 w-48">
                <div className="flex items-center space-x-2">
                  <Trophy size={18} className="text-yellow-500" />
                  <span className="font-bold text-sm">Diamond League</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-secondary/50 p-2 rounded-lg">
                    <span className="text-xs font-bold text-primary">1. You</span>
                    <span className="text-xs font-bold text-foreground/60">4,520 XP</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg">
                    <span className="text-xs font-medium text-foreground/70">2. Sarah</span>
                    <span className="text-xs font-medium text-foreground/60">4,100 XP</span>
                  </div>
                </div>
              </div>

              {/* Floating Stat Card - Accuracy */}
              <div className="absolute bottom-24 -right-5 bg-background border border-border p-5 rounded-2xl shadow-xl z-30 transform hover:scale-105 transition-transform flex items-center space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <Target size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground/60">System Accuracy</p>
                  <p className="text-2xl font-black text-foreground">98.5%</p>
                </div>
              </div>

              {/* Floating Owl Logo */}
              <div className="absolute -top-6 right-10 w-24 h-24 z-30 transform rotate-12 hover:rotate-0 transition-transform duration-300">
                <Image src="/logo.png" alt="FluentYapp Owl" fill className="object-contain drop-shadow-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section className="w-full py-24 bg-secondary/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Smart Review Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16 mb-16 sm:mb-24 lg:mb-32"
          >
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
                <BrainCircuit size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">Smart Review System</h2>
              <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-medium leading-relaxed">
                Our Smart Algorithm constantly monitors your performance. Every mistake you make is logged, analyzed, and transformed into personalized review sessions. You'll never make the same mistake twice.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center space-x-3 text-foreground/80 font-medium">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <span>Real-time grammar and vocabulary correction</span>
                </li>
                <li className="flex items-center space-x-3 text-foreground/80 font-medium">
                  <CheckCircle2 size={20} className="text-green-500" />
                  <span>Spaced repetition algorithm for maximum retention</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 w-full bg-background border border-border rounded-3xl p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
              <h3 className="font-bold text-lg mb-6 flex items-center"><BrainCircuit size={18} className="mr-2 text-primary" /> Your Weaknesses Detected</h3>
              
              <div className="space-y-4">
                {/* Mockup Mistake Card */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 transform transition-all hover:scale-[1.02]">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-red-500/10 text-red-500 px-2 py-1 rounded-md">Grammar</span>
                    <span className="text-xs text-foreground/50">2 mins ago</span>
                  </div>
                  <p className="text-sm font-medium line-through text-foreground/60">She don't like apples.</p>
                  <p className="text-sm font-bold text-green-600 mt-1">She doesn't like apples.</p>
                  <p className="text-xs text-foreground/60 mt-2">Explanation: Use "doesn't" for third-person singular (he, she, it).</p>
                </div>
                
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 opacity-70">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold bg-orange-500/10 text-orange-600 px-2 py-1 rounded-md">Vocabulary</span>
                    <span className="text-xs text-foreground/50">Yesterday</span>
                  </div>
                  <p className="text-sm font-medium line-through text-foreground/60">I am very hungry.</p>
                  <p className="text-sm font-bold text-green-600 mt-1">I am starving.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gamification Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row-reverse items-center gap-16 mb-16 sm:mb-24 lg:mb-32"
          >
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-2">
                <Flame size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">Stay Addicted to Learning</h2>
              <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-medium leading-relaxed">
                Learning a language is a marathon, not a sprint. Maintain your daily streak, compete in global leaderboards, and unlock exclusive achievements to stay motivated every single day.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center space-x-3 text-foreground/80 font-medium">
                  <CheckCircle2 size={20} className="text-orange-500" />
                  <span>Daily Streaks that visually evolve as you progress</span>
                </li>
                <li className="flex items-center space-x-3 text-foreground/80 font-medium">
                  <CheckCircle2 size={20} className="text-orange-500" />
                  <span>Weekly Leagues from Bronze to Diamond</span>
                </li>
              </ul>
            </div>
            
            <div className="flex-1 w-full bg-background border border-border rounded-3xl p-8 shadow-xl">
               <div className="flex justify-center mb-8">
                 <div className="relative">
                   <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full" />
                   <Flame size={80} className="text-orange-500 drop-shadow-2xl relative z-10" />
                 </div>
               </div>
               <div className="text-center mb-8">
                 <h3 className="text-3xl font-black">365 Day Streak!</h3>
                 <p className="text-sm font-medium text-foreground/60">You're unstoppable! You've learned for a whole year.</p>
               </div>
               
               <div className="grid grid-cols-7 gap-2">
                 {[1,2,3,4,5,6,7].map((day, i) => (
                   <div key={day} className="flex flex-col items-center">
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${i < 5 ? 'bg-orange-500 text-white' : i === 5 ? 'bg-orange-500/20 text-orange-500 border-2 border-orange-500' : 'bg-secondary text-foreground/40'}`}>
                       {i < 5 ? <CheckCircle2 size={16} /> : day}
                     </div>
                     <span className="text-[10px] font-bold text-foreground/50">Day {day}</span>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>

          {/* PWA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-2">
                <Smartphone size={32} />
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">Learn Anywhere, Anytime</h2>
              <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-medium leading-relaxed">
                FluentYapp is a Progressive Web App (PWA). Install it directly on your iOS, Android, or Desktop device without going through an App Store. Enjoy a seamless, fullscreen native experience.
              </p>
              
              <button className="bg-background border-2 border-border text-foreground px-6 py-3 rounded-xl font-bold flex items-center space-x-3 hover:bg-secondary transition-colors shadow-sm">
                <Download size={20} />
                <span>Install App Now</span>
              </button>
            </div>
            
             <div className="flex-1 w-full flex justify-center relative">
               {/* Floating Badges outside the phone */}
               <div className="absolute top-10 right-10 bg-background/80 backdrop-blur-md p-3 rounded-2xl border border-border shadow-xl z-30 animate-bounce-slow hidden md:block">
                 <div className="flex items-center space-x-2">
                   <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                     <Download size={16} className="text-green-500" />
                   </div>
                   <div>
                     <p className="text-xs font-bold">100k+ Installs</p>
                     <p className="text-[10px] text-foreground/50">Via Browser</p>
                   </div>
                 </div>
               </div>

               {/* The Phone */}
               <div className="w-[260px] h-[520px] sm:w-[320px] sm:h-[650px] bg-black border-[12px] border-zinc-800 dark:border-zinc-900 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col group">
                 {/* Dynamic Island / Notch */}
                 <div className="h-7 w-[120px] bg-black absolute top-2 left-1/2 transform -translate-x-1/2 rounded-full z-30 flex items-center justify-between px-2">
                   <div className="w-2 h-2 rounded-full bg-zinc-800" />
                   <div className="w-2 h-2 rounded-full bg-green-900/50" />
                 </div>
                 
                 {/* Mobile App UI Mockup (Screen) */}
                 <div className="flex-1 bg-background relative flex flex-col z-10">
                   {/* Top Gradient Splash */}
                   <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent pointer-events-none"></div>
                   
                   <div className="relative z-10 flex-1 flex flex-col p-6 pt-14">
                     <div className="flex justify-between items-center mb-8">
                       <span className="font-extrabold text-xl text-primary tracking-tight">FluentYapp</span>
                       <div className="flex items-center space-x-2">
                         <div className="bg-red-500/10 text-red-500 px-2 py-1 rounded-full flex items-center text-xs font-bold shadow-sm">
                           <Heart size={12} className="mr-1 fill-red-500" /> 5
                         </div>
                         <div className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full flex items-center text-xs font-bold shadow-sm">
                           <Flame size={12} className="mr-1 fill-orange-500" /> 14
                         </div>
                       </div>
                     </div>
                   
                   {/* Lesson Card */}
                   <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-border/50 flex-1 mb-6 flex flex-col justify-between group-hover:shadow-primary/20 transition-all duration-500">
                     <div>
                       <div className="inline-block bg-accent/20 text-accent px-3 py-1 rounded-lg text-xs font-bold mb-4 uppercase tracking-wider">Unit 4</div>
                       <h3 className="font-black text-2xl leading-tight mb-2">Travel & Airport</h3>
                       <p className="text-sm font-medium text-foreground/60 mb-8">Order food, ask for directions, and check in.</p>
                     </div>
                     
                     <div className="space-y-4">
                       <div className="w-full bg-secondary rounded-2xl h-14 border border-border flex items-center px-4 space-x-3 cursor-pointer hover:border-primary transition-colors">
                         <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                         <span className="font-semibold text-sm">Vocabulary</span>
                       </div>
                       <div className="w-full bg-primary rounded-2xl h-14 shadow-lg shadow-primary/30 flex items-center px-4 space-x-3 cursor-pointer transform hover:scale-[1.02] transition-transform">
                         <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                           <Target size={16} />
                         </div>
                         <span className="font-semibold text-sm text-white">Start Lesson</span>
                       </div>
                      </div>
                    </div>
                  </div>

                   {/* Bottom Tab Bar Mockup */}
                   <div className="h-16 bg-background/90 backdrop-blur-md border-t border-border rounded-full mb-2 mx-4 flex items-center justify-around px-4 shadow-lg">
                     <div className="text-primary flex flex-col items-center"><Target size={20} className="mb-1" /><div className="w-1 h-1 bg-primary rounded-full" /></div>
                     <div className="text-foreground/40 hover:text-foreground/80 transition-colors flex flex-col items-center"><BookOpen size={20} /></div>
                     <div className="text-foreground/40 hover:text-foreground/80 transition-colors flex flex-col items-center"><Trophy size={20} /></div>
                     <div className="text-foreground/40 hover:text-foreground/80 transition-colors flex flex-col items-center"><User size={20} /></div>
                   </div>
                 </div>
               </div>
             </div>
          </motion.div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <div className="w-28 h-28 mx-auto mb-8 relative">
            <Image src="/logo.png" alt="FluentYapp Owl" fill className="object-contain hover:scale-110 transition-transform duration-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Ready to start yapping?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/70 mb-10 font-medium max-w-2xl mx-auto">
            Join FluentYapp today. It's 100% free forever. No credit cards, no hidden fees. Just pure language mastery.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary-hover hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto"
            >
              Create Free Account
            </Link>
          </div>
          <p className="mt-6 text-sm font-semibold text-foreground/50">Trusted by learners across 120+ countries.</p>
        </div>
      </section>
    </div>
  );
}
