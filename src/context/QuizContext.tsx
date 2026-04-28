import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ── Types ──
export type ScreenId = 'gate' | 'welcome' | 'questions' | 'loading' | 'results' | 'success';
export type ThemeMode = 'blush' | 'dark';

export interface Question {
  id: string;
  type: 'text' | 'text-optional' | 'choice';
  text: string;
  placeholder?: string;
  skipLabel?: string;
  options?: string[];
  allowOther?: boolean;
  otherPlaceholder?: string;
}

export interface AIResults {
  businessNames?: string[];
  recommendedPlatforms?: string[];
  platformReasons?: Record<string, string>;
  productRecommendation?: string;
  startingPrice?: string;
  firstSale?: {
    promise?: string;
    todayAction?: string;
    weekOnePlan?: string;
    weekTwoPlan?: string;
    firstClientScript?: string;
    mindsetNote?: string;
  };
  businessPlan?: {
    mission?: string;
    ninetyDayGoal?: string;
    revenueTarget?: string;
    focusOn?: string[];
    ignoreForNow?: string[];
    personalNote?: string;
  };
  platformSetup?: Record<string, string>;
  firstSaleRoadmap?: Record<string, string>;
  socialMedia?: {
    recommended?: string[];
    platforms?: Record<string, {
      setup?: string;
      strategy?: string;
      contentIdeas?: string;
    }>;
  };
  branding?: {
    brandVibe?: string;
    logoConcepts?: { name: string; description: string }[];
    fonts?: { role: string; name: string; why: string }[];
    colours?: { name: string; hex: string; use: string }[];
    designDo?: string[];
    designDont?: string[];
  };
  marketing?: {
    coreMessage?: string;
    contentPillars?: { pillar: string; description: string; examplePosts?: string[] }[];
    emailStrategy?: string;
    weeklyRoutine?: string;
    freePromotion?: string[];
    sellingWithoutBegging?: string;
    quickWins?: string[];
  };
  servicesBusiness?: any;
  digitalProducts?: any;
  curatedBusiness?: any;
  handmadeBusiness?: any;
}

interface QuizContextType {
  currentScreen: ScreenId;
  setScreen: (id: ScreenId) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  questions: Question[];
  currentQuestion: number;
  setCurrentQuestion: (idx: number) => void;
  answers: Record<string, string>;
  setAnswer: (id: string, value: string) => void;
  aiResults: AIResults | null;
  setAiResults: (results: AIResults | null) => void;
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  showSoundPanel: boolean;
  setShowSoundPanel: (show: boolean) => void;
  resetAll: () => void;
}

const QUESTIONS: Question[] = [
  { id: "firstName", type: "text", text: "First, what's your name?", placeholder: "e.g. Jasmine" },
  { id: "brandName", type: "text-optional", text: "Do you have a brand name in mind?", placeholder: "e.g. The Wild Bloom Co.", skipLabel: "I don't have one yet" },
  { id: "product", type: "text", text: "What do you make, sell, or offer?", placeholder: "e.g. handmade candles, face painting, digital planners..." },
  { id: "productDetails", type: "text-optional", text: "What should we know about this offer so the blueprint feels specific?", placeholder: "e.g. low-ticket sticker packs for craft fair girls, luxury bridal face painting, Canva templates for salon owners...", skipLabel: "Nothing else yet" },
  { id: "customer", type: "choice", text: "Who is your ideal customer?", options: ["Busy mums & women juggling everything", "Young women building their first brand", "Creative women who value aesthetics", "Men growing a side business or brand", "Small business owners & entrepreneurs", "People who love quality & beautiful things"], allowOther: true, otherPlaceholder: "e.g. lash techs who want prettier client forms" },
  { id: "vibe", type: "choice", text: "What best describes your business type?", options: ["Handmade / Physical", "Digital products", "Service / Events", "Curated / Resale"], allowOther: true, otherPlaceholder: "e.g. coaching, rentals, subscription box, local classes" },
  { id: "aesthetic", type: "choice", text: "What's the feeling you want your brand to give off?", options: ["Soft & feminine", "Bold & editorial", "Clean & minimal", "Warm & earthy", "Playful & colourful"], allowOther: true, otherPlaceholder: "e.g. luxury goth, Y2K glam, cozy maximalist" },
  { id: "sellType", type: "choice", text: "Do you prefer selling online, in person, or both?", options: ["Online", "In Person", "Both"] },
  { id: "audience", type: "choice", text: "Do you already have an audience or following?", options: ["Starting from zero", "A small following (under 1k)", "A decent audience (1k+)"] },
  { id: "currentStatus", type: "choice", text: "Where are you right now?", options: ["Just an idea", "I have something made but not listed", "I listed it but have no sales yet", "I made a few sales and want consistency", "I'm rebranding or starting over"] },
  { id: "time", type: "choice", text: "How much time per week can you commit?", options: ["Under 5 hours", "5–10 hours", "10+ hours"] },
  { id: "budget", type: "choice", text: "What is your starting budget?", options: ["Under $50", "$50–$200", "$200+"] },
  { id: "blocker", type: "choice", text: "What's your biggest blocker right now?", options: ["Not sure what to make or sell", "Don't know how to market", "Scared nobody will buy", "I just need to start"] },
  { id: "successGoal", type: "text-optional", text: "What would make this blueprint a win for you?", placeholder: "e.g. my first sale this week, a better Stan Store page, knowing what to post, pricing my offer...", skipLabel: "Just help me start" },
  { id: "urgency", type: "choice", text: "How quickly do you need to make money?", options: ["This week", "This month", "No rush"] },
  { id: "experience", type: "choice", text: "Have you sold anything before?", options: ["Never", "I've tried but didn't get far", "Yes, some experience"] },
  { id: "shipping", type: "choice", text: "Are you comfortable with shipping products?", options: ["Yes", "No", "Maybe — I'd like to learn"] },
  { id: "faceToFace", type: "choice", text: "Do you enjoy talking to customers face to face?", options: ["Yes, I love it", "Not really", "I'm open to it"] },
  { id: "inventory", type: "choice", text: "Do you want to hold physical stock or sell without it?", options: ["I'll hold inventory", "Sell without stock", "Not sure"] },
];

// ── localStorage keys ──
const LS_UNLOCKED = 'dh_unlocked';
const LS_ANSWERS = 'dh_answers';
const LS_QUESTION = 'dh_question';
const LS_SCREEN = 'dh_screen';
const LS_THEME = 'dh_theme';

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: React.ReactNode }) {
  // Restore from localStorage
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    try {
      const unlocked = sessionStorage.getItem('dh_access_verified');
      if (!unlocked) return 'gate';
      const saved = localStorage.getItem(LS_SCREEN) as ScreenId | null;
      // Don't restore loading screen — go to results or questions
      if (saved === 'loading') return 'questions';
      return saved || 'welcome';
    } catch { return 'gate'; }
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try { return (localStorage.getItem(LS_THEME) as ThemeMode) || 'blush'; }
    catch { return 'blush'; }
  });

  const [currentQuestion, setCurrentQuestionState] = useState(() => {
    try { return parseInt(localStorage.getItem(LS_QUESTION) || '0') || 0; }
    catch { return 0; }
  });

  const [answers, setAnswersState] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(LS_ANSWERS);
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const [aiResults, setAiResults] = useState<AIResults | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showSoundPanel, setShowSoundPanel] = useState(false);

  // Persist answers
  useEffect(() => {
    try { localStorage.setItem(LS_ANSWERS, JSON.stringify(answers)); } catch {}
  }, [answers]);

  // Persist screen
  useEffect(() => {
    try {
      localStorage.setItem(LS_SCREEN, currentScreen);
    } catch {}
  }, [currentScreen]);

  // Persist question index
  useEffect(() => {
    try { localStorage.setItem(LS_QUESTION, String(currentQuestion)); } catch {}
  }, [currentQuestion]);

  // Persist theme
  useEffect(() => {
    try { localStorage.setItem(LS_THEME, theme); } catch {}
  }, [theme]);

  // Apply theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'blush' ? 'dark' : 'blush');
  }, []);

  const setAnswer = useCallback((id: string, value: string) => {
    setAnswersState(prev => ({ ...prev, [id]: value }));
  }, []);

  const setCurrentQuestion = useCallback((idx: number) => {
    setCurrentQuestionState(idx);
  }, []);

  const setScreen = useCallback((id: ScreenId) => {
    setCurrentScreen(id);
    window.scrollTo(0, 0);
  }, []);

  const resetAll = useCallback(() => {
    setAnswersState({});
    setCurrentQuestionState(0);
    setAiResults(null);
    setCurrentScreen('gate');
    try {
      localStorage.removeItem(LS_UNLOCKED);
      localStorage.removeItem(LS_ANSWERS);
      localStorage.removeItem(LS_QUESTION);
      localStorage.removeItem(LS_SCREEN);
      sessionStorage.removeItem('dh_access_verified');
    } catch {}
  }, []);

  return (
    <QuizContext.Provider value={{
      currentScreen, setScreen,
      theme, toggleTheme,
      questions: QUESTIONS,
      currentQuestion, setCurrentQuestion,
      answers, setAnswer,
      aiResults, setAiResults,
      showStats, setShowStats,
      showSoundPanel, setShowSoundPanel,
      resetAll,
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('useQuiz must be used within QuizProvider');
  return ctx;
}
