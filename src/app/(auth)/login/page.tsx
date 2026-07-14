"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, BrainCircuit, Target } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show messages from URL params (e.g., after email verification or auth errors)
  const urlError = searchParams.get('error');
  const verified = searchParams.get('verified');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Welcome back! Loading your dashboard...");
      router.push("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    });
  };

  return (
    <div className="flex w-full min-h-screen flex-col lg:flex-row">
      
      {/* Left Panel: Login Branding (Matches Home Page Aesthetic) */}
      <div className="hidden lg:flex w-1/2 bg-secondary/30 border-r border-border p-12 flex-col justify-center relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-2 bg-background px-4 py-2 rounded-full border border-border mb-8 shadow-sm">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground/80">Welcome back</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Pick up right where you <span className="text-primary">left off.</span>
          </h1>
          
          <p className="text-lg text-foreground/70 font-medium mb-12">
            Log in to continue your personalized curriculum and maintain your daily speaking streak.
          </p>

          {/* Home-style Bento Graphic */}
          <div className="bg-background border border-border rounded-3xl p-6 shadow-xl relative transform rotate-1 hover:rotate-0 transition-transform duration-500">
             <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-secondary p-4 rounded-2xl">
                   <div className="w-10 h-10 bg-accent/20 text-accent rounded-xl flex items-center justify-center">
                     <Target size={20} />
                   </div>
                   <div className="flex-1">
                     <p className="text-sm font-bold">Accuracy Goal</p>
                     <div className="h-1.5 w-full bg-background rounded-full mt-2">
                       <div className="h-full bg-accent w-[85%] rounded-full" />
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-6 right-6 md:top-8 md:right-8">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center lg:items-start mb-8 text-center lg:text-left">
            <Link href="/" className="flex items-center space-x-2 mb-8 lg:hidden">
              <div className="w-10 h-10 relative">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-bold text-xl">FluentYapp</span>
            </Link>
            <h2 className="text-3xl font-bold text-foreground">Log In</h2>
            <p className="text-foreground/60 mt-2 text-sm font-medium">Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {urlError && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center font-medium">
                Authentication failed. Please try again.
              </div>
            )}
            {verified && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-600 dark:text-green-400 text-sm p-3 rounded-xl text-center font-medium">
                ✅ Email verified successfully! You can now log in.
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-foreground/80">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot?</Link>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 mt-2 text-sm"
            >
              {loading ? "Authenticating..." : "Log In"}
            </button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink-0 mx-4 text-foreground/40 text-xs font-bold uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-background border-2 border-border text-foreground font-bold py-3 rounded-xl hover:bg-secondary transition-all duration-300 flex items-center justify-center space-x-3 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <p className="text-center mt-8 text-sm font-medium text-foreground/60">
            Don't have an account? <Link href="/signup" className="text-primary hover:underline font-bold">Sign up</Link>
          </p>
        </div>
      </div>

    </div>
  );
}

export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
