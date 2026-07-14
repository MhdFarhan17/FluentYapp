"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { KeyRound, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setIsSent(true);
      toast.success("Recovery email sent! Please check your inbox.");
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full min-h-screen flex-col bg-background relative overflow-hidden selection:bg-primary/30">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] -z-10" />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>
      
      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {!isSent ? (
            <div className="bg-background/60 backdrop-blur-xl border border-border/60 p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-bl-[80px] -z-10" />
              
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <KeyRound size={36} />
                </div>
                <h2 className="text-4xl font-black text-foreground mb-3 tracking-tight">Forgot Password?</h2>
                <p className="text-foreground/60 font-medium leading-relaxed">
                  No worries! Enter your email address and we'll send you a secure link to reset your password.
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all font-medium shadow-sm"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white font-extrabold text-lg py-5 rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center space-x-3 group"
                >
                  <span>{loading ? "Sending..." : "Send Reset Link"}</span>
                  {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link href="/login" className="text-primary font-bold hover:underline text-sm">
                  ← Back to Login
                </Link>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="bg-background/60 backdrop-blur-xl border border-border/60 p-10 md:p-12 rounded-[2.5rem] shadow-2xl text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-green-500/10 rounded-bl-[80px] -z-10" />
              
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              
              <h2 className="text-4xl font-black text-foreground mb-3 tracking-tight">Check Your Email!</h2>
              <p className="text-foreground/60 font-medium leading-relaxed mb-3">
                We've sent a password reset link to:
              </p>
              <p className="text-primary font-extrabold text-lg mb-8">{email}</p>
              
              <div className="bg-secondary/50 border border-border rounded-2xl p-5 mb-8">
                <p className="text-sm font-medium text-foreground/60">
                  💡 Didn't receive it? Check your <strong className="text-foreground">spam folder</strong>, or try again below.
                </p>
              </div>

              <button 
                onClick={() => setIsSent(false)}
                className="text-primary hover:underline font-extrabold"
              >
                ← Try another email
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
