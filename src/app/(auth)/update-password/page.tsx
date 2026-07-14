"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LockKeyhole } from "lucide-react";
import { toast } from "sonner";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    // Basic check to see if we have a session. Supabase handles the token automatically in the URL hash.
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Invalid or expired recovery link.");
        router.push("/login");
      }
    });
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password policy
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigits = /\d/.test(password);
    const isLengthValid = password.length >= 8;

    if (!isLengthValid || !hasUpperCase || !hasLowerCase || !hasDigits) {
      toast.error("Password must be at least 8 characters and contain lowercase, uppercase letters, and digits.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully! You can now access your dashboard.");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full min-h-screen flex-col lg:flex-row bg-background">
      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-6 right-6 md:top-8 md:right-8">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md bg-secondary/10 border border-border p-8 md:p-10 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <LockKeyhole size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-2">Set New Password</h2>
            <p className="text-foreground/60 text-sm font-medium">
              Please enter your new strong password below.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80">New Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-foreground/50 pt-1">
                Must be at least 8 characters long, containing uppercase, lowercase, and numbers.
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent text-white font-bold py-3.5 rounded-xl hover:bg-accent-hover shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 text-sm"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
