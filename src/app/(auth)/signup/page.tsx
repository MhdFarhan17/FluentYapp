"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles, BrainCircuit, Globe, CheckCircle2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerification, setShowVerification] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    
    // Validate password policy
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const isLengthValid = password.length >= 8;

    if (!isLengthValid || !hasUpperCase || !hasLowerCase || !hasDigits) {
      const errMsg = "Password must be at least 8 characters and contain lowercase, uppercase letters, and digits.";
      setError(errMsg);
      toast.error(errMsg);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      toast.error(error.message);
      setLoading(false);
    } else {
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setError("An account with this email already exists. Please log in instead.");
        toast.error("An account with this email already exists.");
        setLoading(false);
      } else {
        setShowVerification(true);
        toast.success("Verification email sent! Please check your inbox.", {
          duration: 5000,
          position: "top-center"
        });
      }
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
      
      {/* Left Panel: SignUp Branding (Matches Home Page Aesthetic) */}
      <div className="hidden lg:flex w-1/2 bg-secondary/30 border-r border-border p-12 flex-col justify-center relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-lg mx-auto">
          <div className="inline-flex items-center space-x-2 bg-background px-4 py-2 rounded-full border border-border mb-8 shadow-sm">
            <Globe size={16} className="text-accent" />
            <span className="text-sm font-semibold text-foreground/80">Join 10,000+ Learners</span>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Start your journey to <span className="text-accent">Fluency.</span>
          </h1>
          
          <p className="text-lg text-foreground/70 font-medium mb-12">
            Create an account to take your free placement test and unlock your personalized adaptive curriculum.
          </p>

          {/* Home-style Bento Graphic */}
          <div className="bg-background border border-border rounded-3xl p-6 shadow-xl relative transform -rotate-1 hover:rotate-0 transition-transform duration-500">
             <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Adaptive Curriculum Ready</h3>
                  <p className="text-sm text-foreground/60">Tailored to your exact CEFR level</p>
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
          {showVerification ? (
            /* Email Verification Notice */
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-extrabold text-foreground mb-3">Check Your Email!</h2>
              <p className="text-foreground/60 font-medium mb-2">We've sent a verification link to:</p>
              <p className="text-primary font-extrabold text-lg mb-8">{email}</p>
              
              <div className="bg-secondary/50 border border-border rounded-2xl p-5 mb-8 text-left space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail size={18} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-foreground/70">Click the link in the email to verify your account.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-foreground/70">After verification, you can <strong className="text-foreground">log in</strong> to start learning.</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-8">
                <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                  💡 Don't see it? Check your <strong>spam or junk folder</strong>.
                </p>
              </div>

              <Link href="/login" className="inline-flex items-center space-x-2 bg-primary text-white font-bold py-3.5 px-8 rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all duration-300 text-sm">
                <span>Go to Login</span>
              </Link>
              
              <p className="text-center mt-6 text-sm font-medium text-foreground/50">
                Didn't receive it? <button onClick={() => setShowVerification(false)} className="text-primary hover:underline font-bold">Try again</button>
              </p>
            </div>
          ) : (
            /* Signup Form */
            <>
              <div className="flex flex-col items-center lg:items-start mb-8 text-center lg:text-left">
                <Link href="/" className="flex items-center space-x-2 mb-8 lg:hidden">
                  <div className="w-10 h-10 relative">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                  </div>
                  <span className="font-bold text-xl">FluentYapp</span>
                </Link>
                <h2 className="text-3xl font-bold text-foreground">Sign Up</h2>
                <p className="text-foreground/60 mt-2 text-sm font-medium">Create your free account to get started.</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-xl text-center font-medium">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-foreground/80">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>

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
                  <label className="text-sm font-semibold text-foreground/80">Password</label>
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
                  className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 mt-4 text-sm"
                >
                  {loading ? "Creating account..." : "Create Account"}
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
                  <span>Sign up with Google</span>
                </button>
              </form>

              <p className="text-center mt-8 text-sm font-medium text-foreground/60">
                Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">Log in</Link>
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
