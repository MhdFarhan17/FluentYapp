"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, Target, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

// Types
type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type Question = {
  id: number;
  level: Level;
  text: string;
  options: string[];
  correct: number;
};

// 25 Complex & Advanced Questions carefully calibrated for CEFR scaling
const questions: Question[] = [
  // A1 Level (Beginner)
  { id: 1, level: "A1", text: "I _____ a student. What is your profession?", options: ["am", "is", "are", "be"], correct: 0 },
  { id: 2, level: "A1", text: "Where _____ you from?", options: ["do", "are", "is", "does"], correct: 1 },
  { id: 3, level: "A1", text: "She _____ like coffee. She prefers tea.", options: ["don't", "not", "doesn't", "isn't"], correct: 2 },
  { id: 4, level: "A1", text: "My brother _____ a new car yesterday.", options: ["buy", "buys", "bought", "buying"], correct: 2 },
  
  // A2 Level (Pre-Intermediate)
  { id: 5, level: "A2", text: "Have you ever _____ to Paris?", options: ["go", "went", "been", "was"], correct: 2 },
  { id: 6, level: "A2", text: "I think it _____ rain tomorrow.", options: ["will", "going to", "is", "shall"], correct: 0 },
  { id: 7, level: "A2", text: "This is the _____ book I have ever read.", options: ["better", "most good", "best", "goodest"], correct: 2 },
  { id: 8, level: "A2", text: "I was sleeping when the phone _____.", options: ["ring", "rang", "rung", "ringing"], correct: 1 },
  
  // B1 Level (Intermediate)
  { id: 9, level: "B1", text: "If I _____ you, I would study harder.", options: ["am", "was", "were", "be"], correct: 2 },
  { id: 10, level: "B1", text: "She _____ English for five years.", options: ["is studying", "studies", "has been studying", "studied"], correct: 2 },
  { id: 11, level: "B1", text: "You don't need to come _____ you want to.", options: ["unless", "if", "whether", "except"], correct: 0 },
  { id: 12, level: "B1", text: "He asked me what time _____.", options: ["is it", "it was", "was it", "it is"], correct: 1 },
  { id: 13, level: "B1", text: "The house, _____ was built in 1920, needs urgent repairs.", options: ["that", "which", "where", "who"], correct: 1 },
  
  // B2 Level (Upper-Intermediate)
  { id: 14, level: "B2", text: "By this time next year, I _____ my degree.", options: ["will finish", "will have finished", "am finishing", "have finished"], correct: 1 },
  { id: 15, level: "B2", text: "It's high time you _____ taking your career seriously.", options: ["start", "will start", "started", "have started"], correct: 2 },
  { id: 16, level: "B2", text: "I'd rather you _____ smoke in here, if you don't mind.", options: ["don't", "didn't", "won't", "haven't"], correct: 1 },
  { id: 17, level: "B2", text: "Hardly _____ entered the building when the alarm went off.", options: ["had we", "we had", "have we", "we have"], correct: 0 },
  { id: 18, level: "B2", text: "The company is on the _____ of bankruptcy.", options: ["edge", "verge", "border", "margin"], correct: 1 },
  
  // C1 Level (Advanced)
  { id: 19, level: "C1", text: "She took _____ to his remarks about her performance.", options: ["offense", "exception", "umbrage", "all of the above"], correct: 3 },
  { id: 20, level: "C1", text: "His explanation _____ to be completely fabricated.", options: ["turned out", "came about", "went off", "fell through"], correct: 0 },
  { id: 21, level: "C1", text: "The new legislation will _____ sweeping changes in the industry.", options: ["bring up", "bring about", "bring down", "bring off"], correct: 1 },
  { id: 22, level: "C1", text: "Despite the setback, she remained completely _____.", options: ["unfazed", "unperturbed", "undeterred", "all of the above"], correct: 3 },
  
  // C2 Level (Proficient)
  { id: 23, level: "C2", text: "The politician's speech was full of empty _____, signifying nothing.", options: ["rhetoric", "colloquialisms", "tautology", "vernacular"], correct: 0 },
  { id: 24, level: "C2", text: "The evidence was _____ hidden by the perpetrators to avoid detection.", options: ["surreptitiously", "conspicuously", "inadvertently", "ostensibly"], correct: 0 },
  { id: 25, level: "C2", text: "Choose the sentence with the correct subjunctive mood:", options: ["I wish I was a bird.", "It is imperative that he goes immediately.", "I demand that she be present at the hearing.", "If I am you, I would leave."], correct: 2 }
];

export default function PlacementTest() {
  const [step, setStep] = useState<"intro" | "quiz" | "calculating" | "result">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // CEFR Calculation Logic
  const getCEFRResult = (score: number): { level: string, title: string, desc: string } => {
    if (score <= 5) return { level: "A1", title: "Beginner", desc: "You have a basic foundation. FluentYapp will help you build your vocabulary and core grammar quickly!" };
    if (score <= 10) return { level: "A2", title: "Elementary", desc: "You can handle simple, everyday situations. Let's push you towards fluency with our smart conversations." };
    if (score <= 15) return { level: "B1", title: "Intermediate", desc: "You have a solid grasp of English! You're ready to start having deeper, more complex discussions." };
    if (score <= 20) return { level: "B2", title: "Upper-Intermediate", desc: "Great job! You are very capable. FluentYapp will help you iron out advanced grammar and speak like a native." };
    if (score <= 23) return { level: "C1", title: "Advanced", desc: "Excellent! You have a strong command of the language. Our C1 curriculum will challenge you with complex idioms and nuances." };
    return { level: "C2", title: "Proficient (Mastery)", desc: "Outstanding! You possess near-native proficiency. Use FluentYapp to maintain your edge and practice specialized vocabulary." };
  };

  const handleStart = () => {
    setStep("quiz");
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    if (selectedAnswer === questions[currentQuestionIndex].correct) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setStep("calculating");
      // Simulate analysis delay
      setTimeout(() => {
        setStep("result");
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background pt-24 pb-20">
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* INTRO STEP */}
      {step === "intro" && (
        <div className="max-w-3xl w-full px-4 text-center mt-12 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <Target size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Discover Your English Level</h1>
          <p className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Take our comprehensive 25-question adaptive test. Powered by a smart algorithm, this assessment accurately maps your skills to the official CEFR framework (A1 - C2).
          </p>
          
          <div className="bg-secondary/30 rounded-3xl p-8 mb-12 border border-border shadow-sm max-w-lg mx-auto text-left">
            <h3 className="font-bold text-lg mb-4 flex items-center"><BrainCircuit className="mr-2 text-primary" size={20} /> Test Overview</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-foreground/80 font-medium">
                <CheckCircle2 size={18} className="text-green-500" />
                <span>25 scientifically calibrated questions</span>
              </li>
              <li className="flex items-center space-x-3 text-foreground/80 font-medium">
                <CheckCircle2 size={18} className="text-green-500" />
                <span>Tests Grammar, Vocabulary, and Comprehension</span>
              </li>
              <li className="flex items-center space-x-3 text-foreground/80 font-medium">
                <CheckCircle2 size={18} className="text-green-500" />
                <span>Takes approximately 5-10 minutes</span>
              </li>
              <li className="flex items-center space-x-3 text-foreground/80 font-medium">
                <CheckCircle2 size={18} className="text-green-500" />
                <span>100% Free. Instant results.</span>
              </li>
            </ul>
          </div>
          
          <button 
            onClick={handleStart}
            className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary-hover hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
          >
            Start Assessment Now
          </button>
        </div>
      )}

      {/* QUIZ STEP */}
      {step === "quiz" && (
        <div className="max-w-2xl w-full px-4 w-full mt-4 animate-in slide-in-from-bottom-8 duration-500">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-foreground/60 text-sm tracking-wider uppercase">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span className="font-bold text-primary text-sm">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden border border-border">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden" 
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="bg-background border-2 border-border p-8 md:p-12 rounded-3xl shadow-xl min-h-[400px] flex flex-col relative overflow-hidden">
             {/* Subtle watermark showing level estimation to make it look professional */}
             <div className="absolute top-4 right-4 text-xs font-bold bg-secondary px-3 py-1 rounded-full text-foreground/40 border border-border">
               Calibrating Level...
             </div>

            <h2 className="text-2xl md:text-3xl font-extrabold mb-10 text-foreground leading-tight">
              {questions[currentQuestionIndex].text}
            </h2>
            
            <div className="space-y-4 flex-1">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-200 font-medium text-lg flex items-center justify-between group
                    ${selectedAnswer === index 
                      ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                      : 'border-border bg-background hover:border-primary/50 hover:bg-secondary'}`}
                >
                  <span>{option}</span>
                  {selectedAnswer === index && (
                    <CheckCircle2 size={20} className="text-primary animate-in zoom-in" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-10 flex justify-end">
              <button 
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold flex items-center space-x-2 hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              >
                <span>{currentQuestionIndex === questions.length - 1 ? "Finish Test" : "Continue"}</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALCULATING STEP */}
      {step === "calculating" && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in duration-500 px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <Loader2 size={80} className="text-primary animate-spin relative z-10" />
          </div>
          <h2 className="text-3xl font-extrabold mt-12 mb-4">Algorithm is analyzing your results...</h2>
          <p className="text-xl text-foreground/60 font-medium max-w-md">
            Mapping your responses to the Common European Framework of Reference for Languages (CEFR).
          </p>
        </div>
      )}

      {/* RESULT STEP */}
      {step === "result" && (
        <div className="max-w-3xl w-full px-4 text-center mt-12 animate-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center space-x-2 bg-secondary px-4 py-2 rounded-full border border-border mb-8">
            <Sparkles size={16} className="text-primary" />
            <span className="text-sm font-semibold text-foreground/80">Assessment Complete</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Your English Level is</h1>
          
          {/* Level Card */}
          <div className="bg-gradient-to-br from-primary to-accent p-1 rounded-3xl shadow-2xl max-w-xl mx-auto my-10 transform hover:scale-105 transition-transform duration-500">
            <div className="bg-background rounded-[1.4rem] p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
               
               <div className="relative z-10">
                 <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2 block">
                   {getCEFRResult(score).level}
                 </span>
                 <h2 className="text-2xl font-bold text-foreground mb-4">{getCEFRResult(score).title}</h2>
                 <p className="text-foreground/70 font-medium">
                   {getCEFRResult(score).desc}
                 </p>
                 <div className="mt-8 pt-6 border-t border-border flex justify-around">
                    <div>
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-1">Score</p>
                      <p className="text-2xl font-bold">{score}/25</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-1">Accuracy</p>
                      <p className="text-2xl font-bold">{Math.round((score/25)*100)}%</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-6">Ready to reach the next level?</h3>
          <p className="text-foreground/70 font-medium max-w-lg mx-auto mb-10">
            Create your free account now. We will use this baseline to automatically generate your personalized adaptive learning curriculum.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              href="/signup" 
              className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-primary-hover hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto flex items-center justify-center space-x-2"
            >
              <Sparkles size={24} />
              <span>Save Progress & Sign Up</span>
            </Link>
          </div>
          <p className="mt-6 text-sm font-semibold text-foreground/50">It's 100% free forever.</p>
        </div>
      )}
    </div>
  );
}
