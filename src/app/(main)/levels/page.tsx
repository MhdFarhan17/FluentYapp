"use client";

import { CheckCircle2, Globe, Target, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Levels() {
  const levels = [
    {
      level: "A1",
      title: "Beginner",
      desc: "Basic greetings, introductions, and simple everyday expressions. You'll learn to survive in an English-speaking environment.",
      color: "from-green-400 to-emerald-600",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-600 dark:text-green-400",
      delay: 0.1
    },
    {
      level: "A2",
      title: "Elementary",
      desc: "Routine tasks, simple shopping, directions, and basic personal info. You'll handle most practical, daily situations with ease.",
      color: "from-emerald-400 to-teal-600",
      bg: "bg-teal-500/10",
      border: "border-teal-500/30",
      text: "text-teal-600 dark:text-teal-400",
      delay: 0.2
    },
    {
      level: "B1",
      title: "Intermediate",
      desc: "Travel situations, expressing dreams/goals, and standard workplace chat. You can now maintain a flowing conversation.",
      color: "from-blue-400 to-indigo-600",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-600 dark:text-blue-400",
      delay: 0.3
    },
    {
      level: "B2",
      title: "Upper Intermediate",
      desc: "Complex texts, technical discussions, and fluent, spontaneous interactions. You are now highly independent in English.",
      color: "from-indigo-400 to-purple-600",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/30",
      text: "text-indigo-600 dark:text-indigo-400",
      delay: 0.4
    },
    {
      level: "C1",
      title: "Advanced",
      desc: "Implicit meanings, demanding texts, and professional academic language. You can express yourself fluently without searching for words.",
      color: "from-purple-400 to-fuchsia-600",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-600 dark:text-purple-400",
      delay: 0.5
    },
    {
      level: "C2",
      title: "Mastery",
      desc: "Effortless understanding of everything heard or read. Native-level nuance, complex idioms, and absolute language mastery.",
      color: "from-fuchsia-400 to-pink-600",
      bg: "bg-pink-500/10",
      border: "border-pink-500/30",
      text: "text-pink-600 dark:text-pink-400",
      delay: 0.6
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-24 pb-32 overflow-hidden selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10" />

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-secondary/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-border mb-8 shadow-sm">
             <Globe size={18} className="text-primary" />
             <span className="text-sm font-extrabold tracking-widest text-foreground/80 uppercase">Global Standard</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            The CEFR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Framework</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 font-medium leading-relaxed max-w-3xl mx-auto">
            Our curriculum is perfectly mapped to the Common European Framework of Reference for Languages. From absolute beginner to native-like mastery.
          </p>
        </motion.div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {levels.map((l, idx) => (
            <motion.div 
              key={l.level}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: l.delay, ease: "easeOut" }}
              className={`relative bg-background/60 backdrop-blur-xl border border-border/60 ${l.border} hover:border-transparent rounded-[2.5rem] p-8 md:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden flex flex-col`}
            >
              {/* Animated Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${l.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none`}></div>
              
              {/* Corner Glow Effect */}
              <div className={`absolute top-0 right-0 w-40 h-40 ${l.bg} rounded-bl-[100%] -z-10 group-hover:scale-150 transition-transform duration-700 ease-out`} />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br ${l.color} drop-shadow-sm`}>
                  {l.level}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-sm group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500">
                   <Target size={24} className={l.text} />
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-extrabold mb-4 relative z-10">{l.title}</h3>
              <p className="text-foreground/70 font-medium text-lg leading-relaxed flex-1 relative z-10">
                {l.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Assessment CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 relative bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border/60 backdrop-blur-xl rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-xl"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Not sure where you stand?</h2>
          <p className="text-xl text-foreground/70 font-medium mb-12 max-w-2xl mx-auto">
            Take our comprehensive, adaptive placement test and we'll automatically build a custom curriculum starting at your exact CEFR level.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/placement-test" 
              className="bg-primary text-white px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-primary-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center space-x-3 group w-full sm:w-auto"
            >
              <span>Take Placement Test</span>
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
            <div className="flex items-center space-x-2 text-foreground/60 font-bold">
              <CheckCircle2 size={20} className="text-green-500" />
              <span>Takes only 5 minutes</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
