"use client";

import { CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  return (
    <div className="bg-background min-h-screen pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 mb-8">
            <Sparkles size={16} className="text-green-500" />
            <span className="text-sm font-bold tracking-wide text-green-600 dark:text-green-400">EARLY ACCESS PERIOD</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Priceless Learning. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-green-400">Literally $0.</span>
          </h1>
          <p className="text-xl text-foreground/70 font-medium">
            While we refine our AI engine, FluentYapp is currently 100% free for all early adopters. No credit card required. No hidden fees. Just pure language mastery.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Pro Tier (Crossed out) */}
          <div className="bg-secondary/30 rounded-[3rem] p-10 border border-border flex flex-col opacity-60 relative overflow-hidden">
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="bg-background px-6 py-3 rounded-xl border border-border shadow-xl font-bold flex items-center space-x-2 rotate-12">
                <AlertCircle size={20} className="text-orange-500" />
                <span>Coming Soon</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-2">Pro Subscription</h3>
            <p className="text-foreground/70 font-medium mb-6">The ultimate package for serious learners.</p>
            <div className="mb-8">
              <span className="text-5xl font-black line-through text-foreground/40">$19</span>
              <span className="text-xl font-medium text-foreground/50">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-foreground/50">
              {['Unlimited AI Speaking Practice', 'Advanced Grammar Analysis', 'Priority Support', 'Offline Mode'].map((feat, i) => (
                <li key={i} className="flex items-center font-medium">
                  <CheckCircle2 size={20} className="mr-3" /> {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Free Tier (Active) */}
          <div className="bg-background rounded-[3rem] p-10 border-2 border-primary shadow-2xl flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full font-bold shadow-lg">
              CURRENT PLAN
            </div>
            <h3 className="text-2xl font-bold mb-2">Early Adopter</h3>
            <p className="text-foreground/70 font-medium mb-6">Full access while we're in Beta. Grab it now!</p>
            <div className="mb-8 flex items-baseline">
              <span className="text-6xl font-black text-primary">$0</span>
              <span className="text-xl font-bold text-foreground/50 ml-2">forever*</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {[
                'Full CEFR Diagnostic Test',
                'AI-Personalized Curriculum',
                'Real-time Speech Recognition',
                'Unlimited Vocabulary Modules',
                'Keep features free forever if you join now'
              ].map((feat, i) => (
                <li key={i} className="flex items-start font-medium text-lg">
                  <div className="bg-primary/10 rounded-full p-0.5 mr-3 mt-0.5">
                    <CheckCircle2 size={20} className="text-primary" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup" className="w-full bg-primary text-white font-bold py-5 rounded-2xl hover:bg-primary-hover hover:shadow-xl hover:-translate-y-1 transition-all text-center text-lg">
              Start Learning for Free
            </Link>
            <p className="text-center text-xs text-foreground/50 mt-4 font-medium">
              *Early adopters will retain access to core features even after our official launch.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
