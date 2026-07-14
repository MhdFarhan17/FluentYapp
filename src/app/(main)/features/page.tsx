"use client";

import { ShieldCheck, Globe, MessageSquare, Headphones, Award, BrainCircuit, Download, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: <BrainCircuit size={32} />,
      title: "Adaptive Curriculum",
      description: "Our smart algorithm adjusts the difficulty of each lesson in real-time based on your previous answers. You're never bored, never overwhelmed.",
      colSpan: "lg:col-span-2",
      color: "text-primary",
      bg: "bg-primary/10",
      border: "hover:border-primary/50",
      delay: 0.1,
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Speech Analysis",
      description: "Practice pronunciation with instant, accurate feedback using our advanced Web Speech API.",
      colSpan: "lg:col-span-1",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-500/50",
      delay: 0.2,
    },
    {
      icon: <Globe size={32} />,
      title: "CEFR Alignment",
      description: "Curriculum strictly mapped to European standards (A1-C2). Know exactly where you stand globally.",
      colSpan: "lg:col-span-1",
      color: "text-accent",
      bg: "bg-accent/10",
      border: "hover:border-accent/50",
      delay: 0.3,
    },
    {
      icon: <Headphones size={32} />,
      title: "Immersive Audio",
      description: "Listen to native speakers in varying accents (US, UK, AUS) to train your ear for real-world conversations.",
      colSpan: "lg:col-span-1",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "hover:border-purple-500/50",
      delay: 0.4,
    },
    {
      icon: <Award size={32} />,
      title: "Gamified Progression",
      description: "Earn points, level up, and maintain streaks. Learning a language should feel as engaging as playing your favorite game.",
      colSpan: "lg:col-span-1",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "hover:border-orange-500/50",
      delay: 0.5,
    },
    {
      icon: <Clock size={32} />,
      title: "Bite-Sized Lessons",
      description: "Only have 5 minutes? That's enough. Our micro-learning approach ensures you make progress every single day, no matter how busy you are.",
      colSpan: "lg:col-span-2",
      color: "text-green-500",
      bg: "bg-green-500/10",
      border: "hover:border-green-500/50",
      delay: 0.6,
    },
    {
      icon: <Download size={32} />,
      title: "Progressive Web App",
      description: "Install FluentYapp directly on your device. Enjoy a seamless, fullscreen native experience without bloated app stores.",
      colSpan: "lg:col-span-3",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
      border: "hover:border-pink-500/50",
      delay: 0.7,
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-24 pb-32 overflow-hidden selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-10" />

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-secondary/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-border mb-8 shadow-sm">
             <ShieldCheck size={18} className="text-primary" />
             <span className="text-sm font-extrabold tracking-widest text-foreground/80 uppercase">Enterprise-Grade Learning</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            Powerful Features. <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-blue-500">Simple Interface.</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 font-medium leading-relaxed max-w-3xl mx-auto">
            Everything you need to master English, packaged into an incredibly sleek and intuitive platform designed to keep you addicted to learning.
          </p>
        </motion.div>

        {/* Asymmetric Feature Grid (Bento Box Design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[auto] md:auto-rows-[320px]">
          {features.map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: feat.delay, ease: "easeOut" }}
              className={`${feat.colSpan} bg-background/60 backdrop-blur-xl border border-border/60 rounded-[2rem] p-8 md:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 ${feat.border} transition-all duration-500 flex flex-col justify-between group overflow-hidden relative`}
            >
              {/* Background Animated Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${feat.color.split('-')[1]}-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>
              
              {/* Background Icon Watermark */}
              <div className={`absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 ${feat.color} pointer-events-none`}>
                <div className="transform scale-[5] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  {feat.icon}
                </div>
              </div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 ${feat.bg} ${feat.color} rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                  {feat.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">{feat.title}</h3>
                <p className="text-foreground/70 font-medium text-lg max-w-xl leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 relative bg-secondary/30 border border-border rounded-[3rem] p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to experience the difference?</h2>
          <p className="text-xl text-foreground/70 font-medium mb-12 max-w-2xl mx-auto">
            Join thousands of learners who have transformed their English skills with FluentYapp's smart curriculum.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/signup" 
              className="bg-primary text-white px-10 py-5 rounded-2xl font-extrabold text-lg hover:bg-primary-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center space-x-3 group w-full sm:w-auto"
            >
              <span>Create Free Account</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <div className="flex items-center space-x-2 text-foreground/60 font-bold">
              <CheckCircle2 size={20} className="text-green-500" />
              <span>100% Free Forever</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
