"use client";

import { User, Lock, CheckCircle2, Loader2, Mail, Type, LogOut, Volume2, Bell, Settings as SettingsIcon, AlertTriangle, Moon, Sun, Monitor, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const TABS = [
  { id: 'profile', label: 'Account Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
  { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Theme state
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [initialName, setInitialName] = useState("");
  const [currentName, setCurrentName] = useState("");
  
  // Preferences State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Reset Progress Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setMounted(true);
    // load preferences from local storage
    const prefs = localStorage.getItem('user_prefs');
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        if (parsed.sound !== undefined) setSoundEnabled(parsed.sound);
        if (parsed.reminders !== undefined) setRemindersEnabled(parsed.reminders);
      } catch (e) {}
    }
    
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          setEmail(user.email || "No email found");
          
          const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();
            
          if (error) throw error;
          
          if (profile) {
            setInitialName(profile.full_name || "Learner");
            setCurrentName(profile.full_name || "Learner");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const hasChanges = currentName.trim() !== initialName && currentName.trim() !== "";

  const handleSaveProfile = async () => {
    if (!hasChanges || !userId) return;
    
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("user_profiles")
        .update({ full_name: currentName.trim() })
        .eq("id", userId);
        
      if (error) throw error;
      
      setInitialName(currentName.trim());
      
      toast.success("Profile updated successfully!", {
        icon: <CheckCircle2 className="text-green-500" />,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePreference = async (key: 'sound' | 'reminders') => {
    if (key === 'sound') {
      const newVal = !soundEnabled;
      setSoundEnabled(newVal);
      localStorage.setItem('user_prefs', JSON.stringify({ sound: newVal, reminders: remindersEnabled }));
      toast.success(newVal ? "Sound effects enabled" : "Sound effects disabled");
    } else {
      const newVal = !remindersEnabled;
      setRemindersEnabled(newVal);
      localStorage.setItem('user_prefs', JSON.stringify({ sound: soundEnabled, reminders: newVal }));
      
      if (newVal) {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
              const registration = await navigator.serviceWorker.ready;
              
              // Subscribe to Push
              const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
              });
              
              // Send to backend
              const res = await fetch('/api/push/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: { 'Content-Type': 'application/json' }
              });
              
              if (res.ok) {
                toast.success("Daily reminders enabled!");
              } else {
                throw new Error("Backend failed");
              }
            } else {
              setRemindersEnabled(false);
              localStorage.setItem('user_prefs', JSON.stringify({ sound: soundEnabled, reminders: false }));
              toast.error("Notification permission denied.");
            }
          } catch (err) {
            console.error("Push Error:", err);
            setRemindersEnabled(false);
            localStorage.setItem('user_prefs', JSON.stringify({ sound: soundEnabled, reminders: false }));
            toast.error("Failed to setup push notifications.");
          }
        } else {
          toast.error("Push notifications are not supported in this browser.");
          setRemindersEnabled(false);
          localStorage.setItem('user_prefs', JSON.stringify({ sound: soundEnabled, reminders: false }));
        }
      } else {
        // Unsubscribe
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
              await subscription.unsubscribe();
              await fetch('/api/push/subscribe', {
                method: 'DELETE',
                body: JSON.stringify({ endpoint: subscription.endpoint }),
                headers: { 'Content-Type': 'application/json' }
              });
            }
          } catch(e) { console.error(e); }
        }
        toast.success("Daily reminders disabled");
      }
    }
  };

  const handleResetProgress = async () => {
    if (!userId) return;
    setIsResetting(true);
    try {
       const supabase = createClient();
       
       // Clear completed lessons
       const { error: resetErr } = await supabase.from('user_completed_lessons').delete().eq('user_id', userId);
       if (resetErr) throw resetErr;
       
       // Reset points & streak
       const { error: profileErr } = await supabase.from('user_profiles').update({ points: 0, current_streak: 0 }).eq('id', userId);
       if (profileErr) throw profileErr;
       
       toast.success("Learning progress has been fully reset!");
       setShowResetModal(false);
       
       // reload page after 1.5s to refresh all contexts
       setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
       console.error(e);
       toast.error("Failed to reset progress.");
    } finally {
       setIsResetting(false);
    }
  };

  if (loading || !mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-foreground">
            Settings
          </h1>
          <p className="text-foreground/60 font-medium text-lg">Manage your account preferences and learning experience.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Interactive Sidebar Nav */}
        <div className="w-full lg:w-72 flex-shrink-0 space-y-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl font-bold transition-all relative ${
                  isActive 
                    ? tab.id === 'danger' ? "text-red-500" : "text-primary" 
                    : "text-foreground/60 hover:bg-secondary/50 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className={`absolute inset-0 rounded-2xl z-0 ${tab.id === 'danger' ? 'bg-red-500/10 border border-red-500/20' : 'bg-primary/10 shadow-sm ring-1 ring-primary/20'}`}
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={22} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
                {isActive && tab.id !== 'danger' && (
                  <div className="absolute right-5 w-2 h-2 rounded-full bg-primary animate-pulse z-10"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content Area with AnimatePresence */}
        <div className="flex-1 bg-background border-2 border-border rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden min-h-[500px]">
          
          {/* Decorative background element */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

          <AnimatePresence mode="wait">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 relative z-10"
              >
                <h2 className="text-2xl font-extrabold mb-8 text-foreground flex items-center border-b-2 border-border/50 pb-4">
                  <User className="mr-3 text-primary" size={28} /> Personal Information
                </h2>
                
                <div className="space-y-2">
                  <label className="text-sm font-extrabold text-foreground/70 uppercase tracking-wider flex items-center">
                    <Type size={16} className="mr-2" /> Display Name
                  </label>
                  <input 
                    type="text" 
                    value={currentName}
                    onChange={(e) => setCurrentName(e.target.value)}
                    placeholder="Enter your name..."
                    className="w-full bg-secondary border-2 border-border rounded-2xl px-5 py-4 font-bold text-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all shadow-sm"
                  />
                  <p className="text-xs text-foreground/50 font-medium ml-1">This name will be displayed publicly on the Leaderboard.</p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-extrabold text-foreground/70 uppercase tracking-wider flex items-center">
                    <Mail size={16} className="mr-2" /> Email Address
                  </label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      disabled
                      className="w-full bg-secondary/60 border-2 border-border/50 rounded-2xl px-5 py-4 font-bold text-foreground/60 cursor-not-allowed"
                    />
                    <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-foreground/40">
                      <Lock size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-foreground/50 font-medium ml-1 flex items-center">
                    <Lock size={12} className="mr-1" /> Email is tied to secure authentication and cannot be changed here.
                  </p>
                </div>

                <div className="pt-6 flex justify-end items-center border-t-2 border-border mt-8">
                  {!hasChanges && <span className="text-sm text-foreground/40 font-medium mr-4">No changes made</span>}
                  <button 
                    onClick={handleSaveProfile}
                    disabled={!hasChanges || isSaving}
                    className={`flex items-center justify-center font-extrabold px-8 py-4 rounded-2xl transition-all shadow-md ${
                      hasChanges && !isSaving
                        ? "bg-primary text-white hover:bg-primary-hover hover:-translate-y-1 hover:shadow-lg active:translate-y-0"
                        : "bg-secondary text-foreground/40 cursor-not-allowed border border-border"
                    }`}
                  >
                    {isSaving ? <><Loader2 size={20} className="animate-spin mr-2" /> Saving...</> : "Save Changes"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <motion.div 
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 relative z-10"
              >
                <h2 className="text-2xl font-extrabold mb-8 text-foreground flex items-center border-b-2 border-border/50 pb-4">
                  <SettingsIcon className="mr-3 text-primary" size={28} /> Display & Sound
                </h2>

                {/* Theme Toggle Segmented Control */}
                <div className="space-y-4">
                  <label className="text-sm font-extrabold text-foreground/70 uppercase tracking-wider">App Theme</label>
                  <div className="grid grid-cols-3 gap-2 bg-secondary/50 p-1.5 rounded-2xl border-2 border-border/50">
                    <button 
                      onClick={() => setTheme('light')} 
                      className={`flex flex-col items-center justify-center py-4 rounded-xl font-bold transition-all ${theme === 'light' ? 'bg-background shadow-md text-primary scale-100 ring-2 ring-primary/20' : 'text-foreground/50 hover:text-foreground hover:bg-secondary scale-95'}`}
                    >
                      <Sun size={24} className="mb-2"/><span>Light</span>
                    </button>
                    <button 
                      onClick={() => setTheme('dark')} 
                      className={`flex flex-col items-center justify-center py-4 rounded-xl font-bold transition-all ${theme === 'dark' ? 'bg-background shadow-md text-primary scale-100 ring-2 ring-primary/20' : 'text-foreground/50 hover:text-foreground hover:bg-secondary scale-95'}`}
                    >
                      <Moon size={24} className="mb-2"/><span>Dark</span>
                    </button>
                    <button 
                      onClick={() => setTheme('system')} 
                      className={`flex flex-col items-center justify-center py-4 rounded-xl font-bold transition-all ${theme === 'system' ? 'bg-background shadow-md text-primary scale-100 ring-2 ring-primary/20' : 'text-foreground/50 hover:text-foreground hover:bg-secondary scale-95'}`}
                    >
                      <Monitor size={24} className="mb-2"/><span>System</span>
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-6 pt-6">
                  <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-border bg-background hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${soundEnabled ? 'bg-green-500/10 text-green-500' : 'bg-secondary text-foreground/40'}`}>
                        <Volume2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg">Interactive Sound Effects</h4>
                        <p className="text-sm text-foreground/60 font-medium">Play sounds when answering questions and finishing lessons.</p>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => handleTogglePreference('sound')}
                      className={`relative w-14 h-8 rounded-full flex-shrink-0 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${soundEnabled ? 'bg-green-500' : 'bg-secondary border-2 border-border'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-5 rounded-2xl border-2 border-border bg-background hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${remindersEnabled ? 'bg-blue-500/10 text-blue-500' : 'bg-secondary text-foreground/40'}`}>
                        <Bell size={24} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg">Daily Learning Reminders</h4>
                        <p className="text-sm text-foreground/60 font-medium">Get notifications so you never lose your streak.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleTogglePreference('reminders')}
                      className={`relative w-14 h-8 rounded-full flex-shrink-0 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${remindersEnabled ? 'bg-blue-500' : 'bg-secondary border-2 border-border'}`}
                    >
                      <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md ${remindersEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>

              </motion.div>
            )}

            {/* DANGER ZONE TAB */}
            {activeTab === 'danger' && (
              <motion.div 
                key="danger"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 relative z-10"
              >
                <h2 className="text-2xl font-extrabold mb-8 text-red-500 flex items-center border-b-2 border-red-500/20 pb-4">
                  <ShieldAlert className="mr-3" size={28} /> Danger Zone
                </h2>

                <div className="p-6 rounded-2xl border-2 border-red-500/20 bg-red-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h4 className="font-extrabold text-lg text-foreground">Reset Learning Progress</h4>
                    <p className="text-sm text-foreground/60 font-medium mt-1 max-w-md">Deletes all XP, Streak, and completed chapters history. This action <strong>cannot be undone</strong>.</p>
                  </div>
                  <button 
                    onClick={() => setShowResetModal(true)}
                    className="flex-shrink-0 flex items-center font-bold px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors border border-red-500/30"
                  >
                    <Trash2 size={18} className="mr-2" /> Reset Progress
                  </button>
                </div>

                <div className="p-6 rounded-2xl border-2 border-border bg-secondary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h4 className="font-extrabold text-lg text-foreground">Sign Out</h4>
                    <p className="text-sm text-foreground/60 font-medium mt-1">Your session will be ended on this device.</p>
                  </div>
                  <button 
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      window.location.href = "/";
                    }}
                    className="flex-shrink-0 flex items-center font-bold px-6 py-3 bg-background border-2 border-border text-foreground hover:bg-secondary hover:border-foreground/30 rounded-xl transition-all shadow-sm"
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !isResetting && setShowResetModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-background border-2 border-red-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 text-red-500 border border-red-500/20">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-extrabold mb-2">Are you sure?</h3>
              <p className="text-foreground/70 font-medium mb-8">
                All XP, Streak, and module completions will be returned to zero. You will have to start over.
              </p>
              
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowResetModal(false)}
                  disabled={isResetting}
                  className="flex-1 font-bold px-5 py-4 rounded-xl bg-secondary text-foreground hover:bg-secondary/70 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleResetProgress}
                  disabled={isResetting}
                  className="flex-1 font-extrabold px-5 py-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center shadow-lg shadow-red-500/20"
                >
                  {isResetting ? <Loader2 size={20} className="animate-spin" /> : "Yes, Reset"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
