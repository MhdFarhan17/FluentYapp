"use client";

import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

export default function StartLessonButton() {
  const handleClick = () => {
    toast.success("Lesson starting soon!", {
      description: "Preparing your personalized curriculum...",
      icon: "📚",
    });
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full bg-accent text-white font-bold py-4 rounded-2xl hover:bg-accent-hover transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-1 flex items-center justify-center space-x-2 group"
    >
      <span>Start Lesson</span>
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
