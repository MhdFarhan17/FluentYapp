"use client";

import { ClipboardCheck, Sparkles, Mic, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="flex flex-col items-center w-full bg-background overflow-hidden">
      
      {/* Header */}
      <section className="w-full pt-24 pb-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            How It <span className="text-primary">Works</span>
          </h1>
          <p className="text-xl text-foreground/70 font-medium max-w-2xl mx-auto leading-relaxed">
            We replaced boring textbooks with an intelligent, adaptive loop that guarantees fluency if you just put in 15 minutes a day.
          </p>
        </div>
      </section>

      {/* Step 1: Placement Test */}
      <section className="w-full py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] bg-secondary/50 rounded-[3rem] border border-border p-8 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-500" />
              <div className="w-[80%] bg-background p-8 rounded-3xl shadow-2xl border border-border transform group-hover:scale-105 transition-transform duration-500 z-10">
                <div className="flex justify-between text-sm font-bold text-foreground/50 mb-6">
                  <span>Question 3 of 15</span>
                  <span className="text-blue-500">14:59</span>
                </div>
                <h3 className="text-xl font-bold mb-6">If I _____ you, I would study harder.</h3>
                <div className="space-y-3">
                  {['am', 'was', 'were', 'been'].map((opt, i) => (
                    <div key={i} className={`p-4 rounded-xl border-2 ${i === 2 ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-border text-foreground/70'} flex items-center`}>
                      <div className={`w-6 h-6 rounded-full border-2 mr-4 ${i === 2 ? 'border-primary bg-primary' : 'border-border'}`} />
                      {opt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex flex-col items-start space-y-6">
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
                <ClipboardCheck size={32} />
              </div>
              <h2 className="text-4xl font-extrabold">1. Diagnostic Test</h2>
              <p className="text-xl text-foreground/70 leading-relaxed font-medium">
                Before we can guide you, we need to know exactly where you stand. Take a 15-minute diagnostic test that accurately measures your CEFR level from A1 to C2. No stress, just data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Smart Curriculum */}
      <section className="w-full py-24 bg-secondary/30 border-y border-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-start space-y-6">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner">
                <Sparkles size={32} />
              </div>
              <h2 className="text-4xl font-extrabold">2. Your Smart Curriculum</h2>
              <p className="text-foreground/70 text-lg leading-relaxed font-medium">
                Our algorithm processes your test results and instantly generates a highly personalized learning path. It targets your exact weaknesses—whether that's past-tense grammar, workplace vocabulary, or listening comprehension.
              </p>
            </div>

            <div className="relative h-[500px] bg-background rounded-[3rem] border border-border p-8 flex items-center justify-center overflow-hidden group shadow-xl">
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
              <div className="w-[80%] space-y-4 z-10">
                {[
                  { title: "Module 1: Workplace Chat", status: "In Progress", color: "bg-yellow-500" },
                  { title: "Module 2: Advanced Grammar", status: "Locked", color: "bg-secondary" },
                  { title: "Module 3: Speaking Practice", status: "Locked", color: "bg-secondary" },
                ].map((mod, i) => (
                  <div key={i} className="bg-background border border-border p-6 rounded-2xl shadow-sm flex items-center justify-between transform group-hover:translate-x-2 transition-transform" style={{ transitionDelay: `${i * 100}ms` }}>
                    <span className="font-bold">{mod.title}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${mod.color}`}>{mod.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Practice & Speak */}
      <section className="w-full py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] bg-secondary/50 rounded-[3rem] border border-border p-8 flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors duration-500" />
              <div className="w-[80%] bg-background p-8 rounded-3xl shadow-2xl border border-border transform group-hover:scale-105 transition-transform duration-500 z-10 text-center">
                <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Mic size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-4">"I would like to order a coffee."</h3>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-accent w-[92%] rounded-full" />
                </div>
                <p className="text-accent font-black text-xl">92% Native Accuracy</p>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex flex-col items-start space-y-6">
              <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shadow-inner">
                <Mic size={32} />
              </div>
              <h2 className="text-4xl font-extrabold">3. Practice & Speak</h2>
              <p className="text-xl text-foreground/70 leading-relaxed font-medium">
                Here's where the magic happens. Engage in interactive modules that force you to speak out loud. Our Web Speech API analyzes your pronunciation in real-time, giving you the confidence to talk without fear of judgment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-24 bg-primary text-white text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to see it in action?</h2>
        <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">Skip the tutorial trap. Start learning English the way it was meant to be learned.</p>
        <Link href="/placement-test" className="bg-white text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:bg-secondary hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2">
          <span>Take the Test</span>
          <ArrowRight size={24} />
        </Link>
      </section>

    </div>
  );
}
