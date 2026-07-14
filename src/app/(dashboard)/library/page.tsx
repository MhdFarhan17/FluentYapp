"use client";

import { useEffect, useState } from "react";
import { BookOpen, Loader2, Library, BookText, Lock, ChevronRight, BookmarkCheck, LayoutGrid, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useProgress } from "@/context/ProgressContext";
import { motion, AnimatePresence } from "framer-motion";

interface Material {
  id: string;
  lesson_id: string;
  title: string;
  content_markdown: string;
  order_index: number;
}

// Enhanced markdown parser for a premium reading experience
const renderMarkdown = (text: string) => {
  const lines = text.split('\n');
  
  return lines.map((line, idx) => {
    // Headers
    if (line.startsWith('# ')) {
      return <h1 key={idx} className="text-4xl md:text-5xl font-extrabold mt-8 mb-6 text-foreground font-serif tracking-tight border-b-2 border-primary/20 pb-4">{line.replace('# ', '')}</h1>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={idx} className="text-2xl md:text-3xl font-bold mt-10 mb-4 text-foreground/90 font-serif flex items-center"><div className="w-2 h-8 bg-primary rounded-full mr-3 shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>{line.replace('## ', '')}</h2>;
    }
    
    // Blockquotes / Grammar Rules (starts with >)
    if (line.startsWith('> ')) {
      let parsed = line.replace('> ', '');
      parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return (
        <div key={idx} className="my-8 p-6 bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookText size={64} />
          </div>
          <p className="text-blue-900 dark:text-blue-100 font-medium text-lg italic leading-relaxed relative z-10" dangerouslySetInnerHTML={{ __html: parsed }} />
        </div>
      );
    }
    
    // Lists
    if (line.startsWith('- ')) {
      let parsed = line.replace('- ', '');
      parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>');
      parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return (
        <li key={idx} className="flex items-start mb-4 ml-2 group">
          <span className="mr-4 text-primary/60 mt-1.5 transition-transform group-hover:scale-125 group-hover:text-primary group-hover:rotate-12 duration-300">✦</span>
          <span className="text-foreground/80 font-medium text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: parsed }} />
        </li>
      );
    }
    
    // Normal paragraph with bold parsing
    if (line.trim() !== '') {
      let parsed = line;
      parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-extrabold">$1</strong>');
      parsed = parsed.replace(/\*(.*?)\*/g, '<em class="text-foreground/70 font-medium">$1</em>');
      return <p key={idx} className="mb-6 text-foreground/80 font-medium text-lg leading-relaxed font-serif tracking-wide" dangerouslySetInnerHTML={{ __html: parsed }} />;
    }
    
    return <div key={idx} className="h-4"></div>;
  });
};

export default function LibraryPage() {
  const { completedLessons, isLoading: isContextLoading } = useProgress();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("lesson_materials")
          .select("*")
          .order("order_index", { ascending: true });
          
        if (error) throw error;
        if (data) {
          setMaterials(data);
          // Auto-select first unlocked
          if (data.length > 0) {
             setActiveMaterial(data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch materials", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMaterials();
  }, []);

  if (loading || isContextLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevMaterial = materials[index - 1];
    return completedLessons.includes(prevMaterial.lesson_id);
  };
  
  const unlockedCount = materials.filter((_, idx) => isUnlocked(idx)).length;
  const progressPercent = materials.length > 0 ? Math.round((unlockedCount / materials.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-6 md:p-10 mb-8 md:mb-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between border-b-[6px] border-blue-900"
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:space-x-6 mb-6 md:mb-0 text-center sm:text-left">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border-2 border-white/30 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] mb-4 sm:mb-0 cursor-pointer transition-transform"
          >
            <BookOpen className="text-white drop-shadow-lg" size={36} />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">The Grand Library</h1>
            <p className="text-white/90 font-bold mt-1 sm:mt-2 text-sm sm:text-lg">Master the rules of English grammar.</p>
          </div>
        </div>
        
        <div className="relative z-10 bg-black/25 backdrop-blur-md px-6 py-4 rounded-2xl border-2 border-white/10 text-center min-w-[200px] w-full md:w-auto shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center"><Library size={16} className="mr-2"/> Progress</span>
            <span className="text-white font-extrabold text-lg">{unlockedCount}/{materials.length}</span>
          </div>
          <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-black/20">
             <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 to-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
             ></motion.div>
          </div>
        </div>
        
        {/* Floating Decorative Elements */}
        <motion.div 
          animate={{ y: [0, -10, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, 20, 0], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 left-1/4 w-80 h-80 bg-indigo-400 rounded-full blur-3xl"
        ></motion.div>
      </motion.div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 md:gap-10 relative">
        
        {/* Left Sidebar: Interactive Chapter Cards */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="lg:col-span-4"
        >
          <div className="lg:sticky lg:top-28 space-y-4">
            <div className="flex items-center space-x-3 mb-4 md:mb-6 px-2">
               <div className="p-2 bg-primary/10 rounded-lg"><LayoutGrid className="text-primary" size={20} /></div>
               <h3 className="font-extrabold text-xl md:text-2xl text-foreground">Table of Contents</h3>
            </div>
            
            <div className="space-y-3 max-h-[40vh] lg:max-h-[65vh] overflow-y-auto pr-2 pb-10 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {materials.map((mat, index) => {
                const unlocked = isUnlocked(index);
                const isActive = activeMaterial?.id === mat.id;
                
                return (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={mat.id}
                    onClick={() => unlocked && setActiveMaterial(mat)}
                    disabled={!unlocked}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden ${
                      isActive 
                        ? "bg-primary text-white border-primary-hover shadow-[0_10px_20px_-10px_rgba(var(--primary),0.5)] translate-x-2" 
                        : unlocked
                          ? "bg-background border-border hover:border-primary/50 text-foreground hover:shadow-md hover:bg-secondary/30"
                          : "bg-secondary/30 border-dashed border-border/50 text-foreground/40 cursor-not-allowed opacity-70"
                    }`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeChapter" className="absolute inset-0 bg-primary/10" />
                    )}
                    <div className="flex items-center space-x-4 relative z-10">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? "bg-white/20 text-white shadow-inner" : unlocked ? "bg-secondary text-primary group-hover:bg-primary/10 group-hover:scale-110 duration-300" : "bg-secondary/50 text-foreground/30"
                      }`}>
                        {unlocked ? <BookmarkCheck size={24} /> : <Lock size={24} />}
                      </div>
                      <div>
                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isActive ? "text-white/80" : "text-foreground/50"}`}>Chapter {index + 1}</div>
                        <div className={`font-extrabold text-lg line-clamp-1 ${isActive ? "text-white" : "text-foreground group-hover:text-primary transition-colors"}`}>{mat.title}</div>
                      </div>
                    </div>
                    {unlocked && (
                      <ChevronRight size={20} className={`relative z-10 transition-transform ${isActive ? "text-white translate-x-1" : "text-foreground/30 group-hover:text-primary group-hover:translate-x-1"}`} />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Content Area: Premium Notebook Viewer */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, type: "spring", bounce: 0.2 }}
          className="lg:col-span-8"
        >
          <div className="bg-background rounded-3xl p-8 md:p-14 border-2 border-border shadow-[0_20px_50px_rgba(0,0,0,0.08)] min-h-[700px] relative overflow-hidden bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
            
            {/* Book Spine Shadow Effect */}
            <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-black/10 via-black/5 to-transparent pointer-events-none border-l-[6px] border-black/5"></div>
            
            <AnimatePresence mode="wait">
              {activeMaterial ? (
                <motion.div 
                  key={activeMaterial.id} 
                  initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="pl-6 md:pl-10 relative z-10"
                >
                  {renderMarkdown(activeMaterial.content_markdown)}
                  
                  <div className="mt-20 pt-8 border-t-2 border-dashed border-border flex items-center justify-center text-foreground/30 opacity-70 hover:opacity-100 transition-opacity">
                    <Sparkles size={16} className="mr-3" />
                    <span className="font-bold tracking-[0.2em] uppercase text-sm">End of Chapter</span>
                    <Sparkles size={16} className="ml-3" />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-foreground/40 mt-32 relative z-10"
                >
                  <div className="relative mb-8">
                    <motion.div 
                      animate={{ y: [-10, 10, -10] }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <BookOpen size={100} className="text-primary/30 drop-shadow-xl" />
                    </motion.div>
                    <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
                  </div>
                  <h3 className="font-extrabold text-3xl mb-3 text-foreground/70 tracking-tight">No Chapter Selected</h3>
                  <p className="font-medium text-xl text-center max-w-md text-foreground/50">Unlock premium grammar chapters by completing lessons in your learning path.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>

    </div>
  );
}
