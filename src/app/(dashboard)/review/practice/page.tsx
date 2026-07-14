"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, CheckCircle2, AlertTriangle, Loader2, Heart, RefreshCcw, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import confetti from "canvas-confetti";
import { useProgress } from "@/context/ProgressContext";
import Link from "next/link";

export type ExerciseType = 'TRANSLATION' | 'WORD_BANK' | 'MULTIPLE_CHOICE' | 'SPEAKING';

export interface Exercise {
  id: string;
  lesson_id: string;
  type: ExerciseType;
  question: string;
  options: string[] | null;
  correct_answer: string;
}

// Sound synthesizer
const playTone = (frequency: number, type: 'sine' | 'square' | 'triangle' = 'sine', duration: number = 0.1) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch(e) {}
};

const playCorrectSound = () => { 
  playTone(600, 'sine', 0.1); 
  setTimeout(() => playTone(800, 'sine', 0.2), 100); 
};
const playWrongSound = () => { 
  playTone(300, 'square', 0.1); 
  setTimeout(() => playTone(200, 'square', 0.2), 120); 
};
const playFinishSound = () => {
  [400, 500, 600, 800].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'sine', 0.15), i * 150);
  });
};

export default function LessonPage() {
  const router = useRouter();
  const { xp, hearts, refreshProgress, addXpLocally, deductHeartLocally } = useProgress();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [wordBankSelected, setWordBankSelected] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [lessonFinished, setLessonFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const [localHearts, setLocalHearts] = useState(5);
  const [animationKey, setAnimationKey] = useState(0);
  const [countdown, setCountdown] = useState<string>("");
  const [mistakes, setMistakes] = useState(0);
  const [finalXpEarned, setFinalXpEarned] = useState<number | null>(null);
  const [wasReview, setWasReview] = useState(false);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Your browser doesn't support the microphone feature (Use Chrome/Edge)");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsListening(false);
      
      if (event.error === 'network') {
        toast.error("Browser failed to connect to the speech recognition server. Use standard Google Chrome or check your internet connection.");
      } else if (event.error === 'not-allowed') {
        toast.error("Microphone access denied. Please allow microphone access in your browser settings.");
      } else {
        toast.error(`Failed to listen: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition", e);
      setIsListening(false);
    }
  };

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: mistakesData, error: mistakesError } = await supabase
          .from('user_mistakes')
          .select('exercise_id')
          .eq('user_id', user.id)
          .order('mistake_count', { ascending: false })
          .limit(10);
          
        if (mistakesError) throw mistakesError;
        
        if (mistakesData && mistakesData.length > 0) {
          const exerciseIds = mistakesData.map(m => m.exercise_id);
          const { data: exercisesData, error } = await supabase
            .from('exercises')
            .select('*')
            .in('id', exerciseIds);

          if (error) throw error;
          
          if (exercisesData && exercisesData.length > 0) {
             setExercises(exercisesData.sort(() => Math.random() - 0.5));
          } else {
             toast.error("No exercises found for your mistakes!");
          }
        } else {
          toast.success("You have no mistakes to practice! Great job!");
          setTimeout(() => router.push('/review'), 2000);
        }
      } catch (err) {
        toast.error("Failed to load practice session");
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [router]);

  // Sync initial hearts from context
  useEffect(() => {
    if (hearts !== undefined) {
      setLocalHearts(hearts);
    }
  }, [hearts]);

  // Game Over Countdown Timer
  useEffect(() => {
    if (gameOver) {
      const getEmptyAt = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from('user_profiles').select('hearts_empty_at').eq('id', user.id).single();
          if (data && data.hearts_empty_at) {
            const emptyTime = new Date(data.hearts_empty_at).getTime();
            const interval = setInterval(() => {
              const now = new Date().getTime();
              const diff = now - emptyTime;
              const remaining = (30 * 60 * 1000) - diff;
              
              if (remaining <= 0) {
                clearInterval(interval);
                setCountdown("Ready!");
                setLocalHearts(1);
                setGameOver(false);
                refreshProgress(); // Pull updated hearts globally
              } else {
                const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const secs = Math.floor((remaining % (1000 * 60)) / 1000);
                setCountdown(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
              }
            }, 1000);
            return () => clearInterval(interval);
          } else {
            // Fallback if no timestamp yet (just in case)
            setCountdown("30:00");
          }
        }
      };
      getEmptyAt();
    }
  }, [gameOver]);

  const currentExercise = exercises[currentIndex];
  const progress = exercises.length > 0 ? (currentIndex / exercises.length) * 100 : 0;

  const handleWordBankClick = (word: string) => {
    setWordBankSelected([...wordBankSelected, word]);
    playTone(400, 'sine', 0.05);
  };

  const handleWordBankRemove = (index: number) => {
    const newSelected = [...wordBankSelected];
    newSelected.splice(index, 1);
    setWordBankSelected(newSelected);
    playTone(300, 'sine', 0.05);
  };

  const deductHeart = async () => {
    deductHeartLocally(); // Optimistic update immediately
    
    const newHearts = localHearts - 1;
    if (newHearts <= 0) {
      setGameOver(true);
    }
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const updateData: any = { hearts: Math.max(0, newHearts) };
      if (newHearts <= 0) {
        updateData.hearts_empty_at = new Date().toISOString();
      }
      
      supabase.from("user_profiles")
        .update(updateData)
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.error("Failed to deduct heart on server", error);
        });
    }
  };

  const handleCheck = () => {
    if (!currentExercise || localHearts <= 0) return;
    
    setIsChecking(true);
    let isCorrect = false;
    
    if (currentExercise.type === 'MULTIPLE_CHOICE') {
      isCorrect = selectedOption === currentExercise.correct_answer;
    } else if (currentExercise.type === 'WORD_BANK') {
      isCorrect = wordBankSelected.join(" ") === currentExercise.correct_answer;
    } else if (currentExercise.type === 'TRANSLATION') {
      isCorrect = textInput.trim().toLowerCase() === currentExercise.correct_answer.toLowerCase();
    } else if (currentExercise.type === 'SPEAKING') {
      // Remove punctuation and lowercase for flexible comparison
      const cleanTranscript = transcript.replace(/[.,!?]/g, '').trim().toLowerCase();
      const cleanAnswer = currentExercise.correct_answer.replace(/[.,!?]/g, '').trim().toLowerCase();
      // Allow if it contains the answer or is very close
      isCorrect = cleanTranscript === cleanAnswer || cleanTranscript.includes(cleanAnswer);
    }
    
    setCheckResult(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      playCorrectSound();
      // On correct answer during practice, we delete the mistake
      const supabase = createClient();
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (user) {
          await supabase.from('user_mistakes')
            .delete()
            .eq('user_id', user.id)
            .eq('exercise_id', currentExercise.id);
        }
      });
    } else {
      setMistakes(m => m + 1);
      playWrongSound();
      deductHeart();
      
      // Log mistake to DB
      const supabase = createClient();
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        if (user) {
          let wrongAnswerStr = "";
          if (currentExercise.type === 'MULTIPLE_CHOICE') wrongAnswerStr = selectedOption;
          else if (currentExercise.type === 'WORD_BANK') wrongAnswerStr = wordBankSelected.join(" ");
          else if (currentExercise.type === 'TRANSLATION') wrongAnswerStr = textInput.trim();
          else if (currentExercise.type === 'SPEAKING') wrongAnswerStr = transcript;
          
          try {
            // Get current mistake count if exists
            const { data: existing } = await supabase.from('user_mistakes')
              .select('mistake_count')
              .eq('user_id', user.id)
              .eq('question', currentExercise.question)
              .single();
              
            const count = existing ? existing.mistake_count + 1 : 1;
            
            await supabase.from('user_mistakes').upsert({
              user_id: user.id,
              exercise_id: currentExercise.id,
              lesson_id: currentExercise.lesson_id,
              question: currentExercise.question,
              correct_answer: currentExercise.correct_answer,
              wrong_answer: wrongAnswerStr || "N/A",
              mistake_count: count,
              last_mistake_at: new Date().toISOString()
            }, { onConflict: 'user_id,question' });
          } catch (e) {
            console.error("Failed to log mistake:", e);
          }
        }
      });
    }
  };

  const handleNext = async () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnimationKey(prev => prev + 1);
      setSelectedOption("");
      setWordBankSelected([]);
      setTextInput("");
      setTranscript("");
      setCheckResult('idle');
      setIsChecking(false);
    } else {
      setLessonFinished(true);
      playFinishSound();
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ec4899']
      });
      
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Practice session gives a small flat amount of XP based on length
          const maxPossible = exercises.length * 5;
          const penalty = mistakes * 2;
          const xpEarned = Math.max(5, maxPossible - penalty);
          
          setFinalXpEarned(xpEarned);
          
          // Optimistic updates for Instant UI!
          addXpLocally(xpEarned);

          // Update XP and Streak directly in DB from client to avoid API RLS issues
          const { data: profile } = await supabase.from('user_profiles').select('last_activity_date, current_streak, longest_streak').eq('id', user.id).single();
          
          let newStreak = profile?.current_streak || 0;
          let newLongest = profile?.longest_streak || 0;
          
          // Current Date in YYYY-MM-DD
          const todayStr = new Date().toISOString().split('T')[0];
          
          if (profile?.last_activity_date) {
            const lastDate = new Date(profile.last_activity_date);
            const todayDate = new Date(todayStr);
            // Calculate day difference at 00:00:00 UTC
            const diffTime = todayDate.getTime() - new Date(lastDate.toISOString().split('T')[0]).getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays === 1) {
              newStreak += 1;
            } else if (diffDays > 1) {
              newStreak = 1; // Streak broken
            }
          } else {
             newStreak = 1;
          }
          
          if (newStreak > newLongest) newLongest = newStreak;
          
          const { error: updateError } = await supabase
            .from("user_profiles")
            .update({ 
              points: xp + xpEarned,
              last_activity_date: todayStr,
              current_streak: newStreak,
              longest_streak: newLongest
            })
            .eq("id", user.id);
            
          if (updateError) {
            console.error("Failed to save XP & Streak:", updateError);
          }
          
          // Refresh globally in background
          refreshProgress();
        }
        
        setTimeout(() => {
          router.push("/review");
        }, 3000);
        
      } catch (error) {
        router.push("/review");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-32 h-32 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <Heart size={64} className="fill-red-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-foreground">Out of Hearts!</h1>
        <p className="text-xl text-foreground/70 font-medium mb-6 text-center max-w-md">
          You made too many mistakes. Take a break and try again later.
        </p>
        
        <div className="bg-secondary/50 rounded-2xl p-6 mb-12 flex flex-col items-center shadow-inner">
          <span className="text-foreground/60 font-bold uppercase tracking-widest text-sm mb-2">Next heart in</span>
          <span className="text-4xl font-extrabold font-mono text-primary animate-pulse">{countdown || "30:00"}</span>
        </div>

        <Link href="/dashboard" className="w-full max-w-xs px-8 py-4 bg-primary text-white font-extrabold text-xl rounded-2xl border-b-[6px] border-primary-hover active:border-b-0 active:translate-y-[6px] transition-all text-center flex items-center justify-center space-x-2">
          <RefreshCcw size={24} />
          <span>Go to Dashboard</span>
        </Link>
      </div>
    );
  }

  if (lessonFinished) {
    const displayXp = finalXpEarned !== null ? finalXpEarned : Math.max(10, (exercises.length * 10) - (mistakes * 5));
    
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700 p-4">
        <div className="w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-[0_10px_0_0_#15803d] animate-bounce-slow">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-foreground tracking-tight">
          Practice Complete!
        </h1>
        
        <p className="text-2xl text-orange-500 font-extrabold mb-8 text-center flex items-center space-x-2 bg-orange-500/10 px-6 py-3 rounded-full shadow-sm">
          <span>+{displayXp} XP Earned</span>
        </p>
      </div>
    );
  }

  if (!currentExercise) return null;

  const isAnswered = () => {
    if (currentExercise.type === 'MULTIPLE_CHOICE') return selectedOption !== "";
    if (currentExercise.type === 'WORD_BANK') return wordBankSelected.length > 0;
    if (currentExercise.type === 'TRANSLATION') return textInput.trim().length > 0;
    if (currentExercise.type === 'SPEAKING') return transcript.trim().length > 0;
    return false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Bar with Progress */}
      <div className="w-full max-w-4xl mx-auto p-4 md:pt-8 flex items-center space-x-6">
        <button 
          onClick={() => router.push('/dashboard')}
          className="p-2 hover:bg-secondary rounded-full transition-colors text-foreground/50 hover:text-foreground"
        >
          <X size={28} strokeWidth={2.5} />
        </button>
        <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-700 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-red-500 font-bold bg-red-500/10 px-3 py-1.5 rounded-full">
          <Heart size={20} className="fill-red-500" />
          <span className="text-lg">{localHearts}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main key={animationKey} className={`flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col justify-center mb-32 animate-in fade-in slide-in-from-right-8 duration-500 ease-out ${checkResult === 'wrong' ? 'animate-shake' : ''}`}>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 md:mb-8 text-foreground tracking-tight">{currentExercise.question}</h2>

        {/* Dynamic Exercise Area */}
        <div className="w-full">
          
          {currentExercise.type === 'MULTIPLE_CHOICE' && (
            <div className="grid grid-cols-1 gap-4">
              {currentExercise.options?.map((option, idx) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (checkResult === 'idle') {
                        setSelectedOption(option);
                        playTone(400, 'sine', 0.05);
                      }
                    }}
                    disabled={checkResult !== 'idle'}
                    className={`p-4 sm:p-5 rounded-2xl text-lg sm:text-xl font-bold transition-all text-left flex items-center outline-none ${
                      isSelected 
                        ? "border-2 border-primary bg-primary/10 text-primary translate-y-[2px]" 
                        : "border-2 border-b-[6px] border-border hover:bg-secondary hover:translate-y-[2px] hover:border-b-[4px] active:translate-y-[6px] active:border-b-0 text-foreground"
                    } ${checkResult !== 'idle' && !isSelected ? "opacity-50" : ""}`}
                  >
                    <span className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 text-sm sm:text-base rounded-md sm:rounded-lg flex items-center justify-center mr-3 sm:mr-4 border-2 ${isSelected ? "border-primary text-primary" : "border-border text-foreground/40"}`}>
                      {idx + 1}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {currentExercise.type === 'WORD_BANK' && (
            <div className="flex flex-col space-y-12">
              <div className="min-h-[80px] p-2 border-b-[3px] border-border flex flex-wrap gap-2 items-center">
                {wordBankSelected.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => checkResult === 'idle' && handleWordBankRemove(idx)}
                    disabled={checkResult !== 'idle'}
                    className="px-5 py-3 bg-background border-2 border-b-[4px] border-border rounded-2xl font-bold text-lg hover:bg-secondary active:translate-y-[4px] active:border-b-0 transition-all text-foreground shadow-sm animate-in zoom-in duration-200"
                  >
                    {word}
                  </button>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                {currentExercise.options?.map((word, idx) => {
                  const countInOptions = currentExercise.options?.filter(w => w === word).length || 0;
                  const countInSelected = wordBankSelected.filter(w => w === word).length;
                  const disabled = countInSelected >= countInOptions || checkResult !== 'idle';
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => !disabled && handleWordBankClick(word)}
                      disabled={disabled}
                      className={`px-5 py-3 border-2 rounded-2xl font-bold text-lg transition-all ${
                        disabled 
                          ? "bg-secondary text-transparent border-transparent shadow-none" 
                          : "bg-background border-b-[4px] border-border text-foreground hover:bg-secondary active:translate-y-[4px] active:border-b-0 shadow-sm"
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentExercise.type === 'TRANSLATION' && (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              disabled={checkResult !== 'idle'}
              placeholder="Type your translation here..."
              className="w-full h-40 p-5 bg-secondary/30 border-2 border-border rounded-2xl font-medium text-xl resize-none outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-foreground/30 shadow-inner"
            />
          )}

          {currentExercise.type === 'SPEAKING' && (
            <div className="flex flex-col items-center justify-center space-y-8 mt-8">
              <button
                onClick={startListening}
                disabled={isListening || checkResult !== 'idle'}
                className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  isListening 
                    ? "bg-blue-500 text-white animate-pulse shadow-[0_0_0_15px_rgba(59,130,246,0.2)] scale-110" 
                    : transcript 
                      ? "bg-primary text-white border-b-[6px] border-primary-hover active:border-b-0 active:translate-y-[6px]"
                      : "bg-secondary text-foreground/50 border-b-[6px] border-border hover:bg-secondary/80 active:border-b-0 active:translate-y-[6px]"
                }`}
              >
                {isListening ? (
                  <Mic size={48} className="animate-bounce" />
                ) : (
                  <Mic size={48} />
                )}
                {isListening && (
                   <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                )}
              </button>
              
              <div className="text-center min-h-[60px]">
                {isListening ? (
                  <p className="text-lg font-bold text-blue-500 animate-pulse">Listening...</p>
                ) : transcript ? (
                  <div className="bg-secondary/30 p-4 rounded-xl border-2 border-border">
                    <p className="text-xl font-medium text-foreground">"{transcript}"</p>
                  </div>
                ) : (
                  <p className="text-lg text-foreground/50 font-medium">Click the microphone and speak</p>
                )}
              </div>
              
              {/* Dev bypass for restricted browsers */}
              {process.env.NODE_ENV === 'development' && checkResult === 'idle' && (
                <button 
                  onClick={() => setTranscript(currentExercise.correct_answer)}
                  className="mt-8 px-4 py-2 bg-secondary text-foreground/50 font-medium text-sm rounded-lg hover:bg-secondary/80"
                >
                  [Dev] Bypass Mic (Auto-fill Correct)
                </button>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 w-full border-t-2 transition-colors duration-300 z-50 ${
        checkResult === 'correct' ? 'bg-green-100 dark:bg-green-950/90 border-green-200 dark:border-green-900' : 
        checkResult === 'wrong' ? 'bg-red-100 dark:bg-red-950/90 border-red-200 dark:border-red-900' : 
        'bg-background border-border'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex-1">
            {checkResult === 'correct' && (
              <div className="flex items-center space-x-4 animate-in slide-in-from-left-4 zoom-in-95">
                <div className="bg-white dark:bg-green-900 p-2 md:p-3 rounded-full text-green-500 shadow-sm">
                  <CheckCircle2 size={32} strokeWidth={3} className="md:w-[36px] md:h-[36px]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-green-600 dark:text-green-400 tracking-tight">Excellent!</h3>
              </div>
            )}
            
            {checkResult === 'wrong' && (
              <div className="flex items-center space-x-4 animate-in slide-in-from-left-4 zoom-in-95">
                <div className="bg-white dark:bg-red-900 p-2 md:p-3 rounded-full text-red-500 shadow-sm shrink-0">
                  <AlertTriangle size={32} strokeWidth={3} className="md:w-[36px] md:h-[36px]" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-red-600 dark:text-red-400 tracking-tight leading-none">Correct solution:</h3>
                  <p className="text-red-700 dark:text-red-300 font-bold text-base md:text-lg mt-1">{currentExercise.correct_answer}</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={checkResult === 'idle' ? handleCheck : handleNext}
            disabled={checkResult === 'idle' && !isAnswered()}
            className={`w-full md:w-auto px-8 py-3 md:px-12 md:py-4 rounded-2xl font-extrabold text-lg md:text-xl uppercase tracking-wider transition-all outline-none ${
              checkResult === 'idle' 
                ? (isAnswered() 
                    ? "bg-primary text-white border-b-[6px] border-primary-hover active:border-b-0 active:translate-y-[6px]" 
                    : "bg-secondary text-foreground/30 border-b-[6px] border-secondary cursor-not-allowed")
                : checkResult === 'correct'
                  ? "bg-green-500 text-white border-b-[6px] border-green-600 hover:bg-green-400 active:border-b-0 active:translate-y-[6px]"
                  : "bg-red-500 text-white border-b-[6px] border-red-600 hover:bg-red-400 active:border-b-0 active:translate-y-[6px]"
            }`}
          >
            {checkResult === 'idle' ? 'Check' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
