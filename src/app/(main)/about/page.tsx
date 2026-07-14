"use client";

import Image from "next/image";
import { Target, Heart, Globe2, Users2, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex flex-col w-full selection:bg-primary/30 overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-28 pb-32 bg-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-secondary/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-border mb-8 shadow-sm"
          >
            <Sparkles size={18} className="text-primary" />
            <span className="text-sm font-extrabold tracking-widest text-foreground/80 uppercase">Our Story</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1]"
          >
            We are redefining how the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-blue-500">world learns English.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-foreground/70 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            Language is the ultimate bridge between cultures. We built FluentYapp to ensure everyone has the confidence to cross it.
          </motion.p>
        </div>
      </section>

      {/* The Problem & Solution (Bento Box Style) */}
      <section className="w-full py-24 bg-secondary/20 border-y border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Problem Card */}
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="bg-background/80 backdrop-blur-xl border border-border/80 p-10 md:p-14 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700" />
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                <Target size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight">The "Tutorial Trap"</h2>
              <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                For decades, language learning has been stuck in classrooms and flashcard apps. Millions of students can read and write perfectly, but freeze entirely when asked to speak. The traditional method teaches you the rules, but not how to play the game.
              </p>
            </motion.div>

            {/* Solution Card */}
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="bg-gradient-to-br from-primary to-blue-600 text-white p-10 md:p-14 rounded-[3rem] shadow-xl relative overflow-hidden group"
            >
              <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 group-hover:scale-150 transition-all duration-700 pointer-events-none" />
              <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Globe2 size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight">Active Immersion</h2>
              <p className="text-lg text-white/90 leading-relaxed font-medium">
                FluentYapp was engineered to force you out of your comfort zone safely. By utilizing dynamic conversations and smart speech analysis, we simulate real-world scenarios so you can practice speaking without the fear of judgment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-32 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border/60">
            {[
              { label: "Sentences Spoken", value: "15m+", color: "text-primary", delay: 0.1 },
              { label: "Countries Reached", value: "120", color: "text-accent", delay: 0.3 },
              { label: "Success Rate", value: "98%", color: "text-foreground", delay: 0.5 }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: stat.delay }}
                className="pt-8 md:pt-0 flex flex-col items-center justify-center"
              >
                <div className={`text-6xl md:text-7xl font-black ${stat.color} mb-4 tracking-tighter drop-shadow-sm`}>
                  {stat.value}
                </div>
                <p className="text-xl text-foreground/70 font-bold uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Mascot */}
      <section className="w-full py-32 bg-gradient-to-b from-secondary/40 to-background border-t border-border/60 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50, rotate: -10 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-full md:w-1/2 relative h-[400px] lg:h-[500px]"
          >
            <Image 
              src="/logo.png" 
              alt="FluentYapp Owl" 
              fill 
              className="object-contain drop-shadow-2xl hover:scale-110 hover:-rotate-6 transition-transform duration-700 ease-out" 
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 text-left"
          >
            <div className="w-14 h-14 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <Heart size={28} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Meet Professor Yapp</h2>
            <p className="text-xl text-foreground/70 leading-relaxed font-medium mb-10">
              Learning a language can be intimidating. That's why we created a companion that's incredibly patient, always encouraging, and just a little bit sassy. Professor Yapp is here to guide your curriculum, correct your pronunciation, and celebrate your milestones.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center space-x-4 bg-background/80 backdrop-blur-md border border-border/80 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shadow-inner">
                   <Users2 size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-foreground/50 font-bold uppercase tracking-wider">Your Personal</p>
                  <p className="text-xl font-black text-foreground">Interactive Guide</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 bg-background/80 backdrop-blur-md border border-border/80 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center shadow-inner">
                   <BookOpen size={24} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-foreground/50 font-bold uppercase tracking-wider">Available</p>
                  <p className="text-xl font-black text-foreground">24/7 Any Time</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
