import { useEffect, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { QuizProvider, useQuiz } from './context/QuizContext';
import ParticleCanvas from './components/ParticleCanvas';
import GateScreen from './components/screens/GateScreen';
import WelcomeScreen from './components/screens/WelcomeScreen';
import QuizScreen from './components/screens/QuizScreen';
import LoadingScreen from './components/screens/LoadingScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import SuccessScreen from './components/SuccessScreen';
import DollhouseMark from './components/DollhouseMark';
import { Toaster } from 'sonner';
import { playClick, toggleAmbientTrack, setAmbientVolume, pauseAmbient } from '@/lib/sounds';
import { useState, useRef } from 'react';
import passwordBg from '@/assets/password-bg.jpg';
import { cleanAnswer, isBlankAnswer } from '@/lib/quiz-helpers';

function Sidebar() {
  const { theme, toggleTheme, showStats, setShowStats } = useQuiz();
  const [soundOpen, setSoundOpen] = useState(false);
  const [track, setTrack] = useState(-1);
  const [vol, setVol] = useState(0.45);
  const [paused, setPaused] = useState(false);
  const [hint, setHint] = useState(false);
  const tracks = ['Soft Pink Noise', 'Fireplace & Rain', 'Gentle Waves', 'Café Murmur', 'Forest Rain'];

  // Show a one-time hint that sound is available
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('dh-sound-hint-seen')) return;
    const t = setTimeout(() => {
      setHint(true);
      localStorage.setItem('dh-sound-hint-seen', '1');
      setTimeout(() => setHint(false), 5000);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const handleTrack = (i: number) => {
    const newTrack = toggleAmbientTrack(i, track, vol);
    setTrack(newTrack);
  };

  const bb = 'group relative flex flex-col items-center gap-1.5 py-3 px-3.5 cursor-pointer rounded-[12px] mx-1 font-ui text-[8.5px] tracking-[2px] uppercase font-semibold text-dh-text-light transition-colors hover:text-dh-accent-dark min-w-[54px] overflow-hidden';

  return (
    <>
      <div className="dh-sidebar-shell fixed right-5 z-[600]" style={{ width: 76, top: '50%', transform: 'translateY(calc(-50% + 26px))' }}>
        <div className="dh-utility-rail flex flex-col gap-0.5 rounded-2xl py-2 px-0 shadow-[0_4px_32px_rgba(0,0,0,0.08)]"
          style={{ width: '100%', background: 'var(--dh-sidebar-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--dh-glass-border)' }}>
          <button onClick={() => setShowStats(!showStats)} className={bb} style={{ background: 'none', border: 'none', color: showStats ? 'var(--dh-accent-dark)' : undefined }}>
            <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
            <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
            Stats
          </button>
          <button onClick={() => { playClick('soft'); toggleTheme(); }} className={bb} style={{ background: 'none', border: 'none' }}>
            <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
            <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
            {theme === 'blush' ? 'Dark' : 'Light'}
            <span className="font-ui text-[8px] tracking-[1.8px] uppercase opacity-85 leading-[1.05] text-dh-accent-dark font-semibold">
              {theme === 'blush' ? 'Blush mode' : 'Dark mode'}
            </span>
          </button>
          <button onClick={() => { playClick('soft'); setSoundOpen(o => !o); }} className={bb} style={{ background: 'none', border: 'none', color: track >= 0 ? 'var(--dh-accent-dark)' : undefined }}>
            <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
            <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            Sound
          </button>

        </div>
      </div>
      {soundOpen && (
        <div className="dh-sound-popover fixed right-5 bottom-[90px] z-[610] rounded-[20px] p-5 w-[250px] max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain shadow-[0_18px_54px_rgba(0,0,0,0.14)] animate-fade-in"
          style={{ background: 'var(--dh-sidebar-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--dh-glass-border)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="flex items-center justify-between gap-3 mb-3.5">
              <div>
                <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark font-medium">Ambience</p>
              </div>
              <button onClick={() => setSoundOpen(false)} className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-dh-text-light cursor-pointer transition-all hover:text-dh-accent-dark" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>✕</button>
            </div>
            {tracks.map((t, i) => (
              <button key={i} onClick={() => { handleTrack(i); setPaused(false); }}
                className="group flex w-full items-center gap-3 py-[9px] px-3 mb-1 rounded-lg font-body text-xs text-left cursor-pointer transition-all"
                style={{ background: track === i ? 'rgba(var(--dh-accent-rgb), 0.12)' : 'transparent', border: `1px solid ${track === i ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb), 0.25)'}`, color: 'var(--dh-text)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center font-ui text-[8px]" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', color: 'var(--dh-accent-dark)' }}>{track === i ? '♪' : i + 1}</span>
                <span className="flex-1">{t}</span>
              </button>
            ))}
            {track >= 0 && (
              <button onClick={() => { playClick('soft'); const p = pauseAmbient(); setPaused(p); }}
                className="block w-full py-[9px] px-3 mb-1 rounded-lg font-body text-xs text-center cursor-pointer transition-all"
                style={{ background: paused ? 'rgba(var(--dh-accent-rgb), 0.18)' : 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.35)', color: 'var(--dh-accent-dark)' }}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}
            <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(var(--dh-accent-rgb), 0.18)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-ui text-[8px] tracking-[2px] uppercase text-dh-text-light">Volume</span>
                <span className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark">{Math.round(vol * 100)}%</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" defaultValue="0.45" onChange={e => { setVol(+e.target.value); setAmbientVolume(+e.target.value); }} className="w-full" />
            </div>
          </div>
        )}
      {hint && !soundOpen && (
        <div className="fixed right-[88px] z-[600] px-4 py-2.5 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] animate-fade-in pointer-events-none"
          style={{ top: '50%', transform: 'translateY(calc(-50% + 56px))', background: 'var(--dh-sidebar-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--dh-glass-border)' }}>
          <p className="font-ui text-[10px] tracking-[2px] uppercase text-dh-accent-dark font-medium whitespace-nowrap">♪ Tap to enable sound</p>
          <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45" style={{ background: 'var(--dh-sidebar-bg)', borderRight: '1px solid var(--dh-glass-border)', borderTop: '1px solid var(--dh-glass-border)' }} />
        </div>
      )}
    </>
  );
}

function AppContent() {
  const { currentScreen, theme, toggleTheme, showStats, setShowStats, answers, questions, resetAll } = useQuiz();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const scrollEl = document.getElementById('dh-scroll-container');
    if (!scrollEl) return;
    const h = () => setScrolled(scrollEl.scrollTop > 10);
    scrollEl.addEventListener('scroll', h, { passive: true });
    return () => scrollEl.removeEventListener('scroll', h);
  }, [currentScreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'm') toggleTheme();
      if (e.key.toLowerCase() === 's') setShowStats(!showStats);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [showStats, toggleTheme, setShowStats]);

  const answered = Object.keys(answers).filter(k => !isBlankAnswer(answers[k])).length;

  return (
    <div
      className="relative h-screen overflow-hidden flex flex-col"
      style={
        currentScreen === 'gate'
          ? {
              backgroundImage: `url(${passwordBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      <ParticleCanvas />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-[600]" style={{ background: 'rgba(var(--dh-accent-rgb), 0.15)' }}>
        <div className="h-full transition-all duration-600" style={{
          background: 'linear-gradient(90deg, var(--dh-accent), var(--dh-accent-dark))',
          width: currentScreen === 'gate' ? '0%' : currentScreen === 'welcome' ? '10%' : currentScreen === 'questions' ? '40%' : currentScreen === 'loading' ? '75%' : '100%',
        }} />
      </div>

      {/* Header nav */}
      {currentScreen !== 'gate' && (
        <header className="fixed top-0 left-0 right-0 z-[500]" style={{ pointerEvents: 'none' }}>
          <div className="flex items-center justify-between px-6 h-[58px] transition-all" style={{
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            background: scrolled ? (theme === 'dark' ? 'rgba(19,15,18,0.86)' : 'rgba(255,247,242,0.78)') : (theme === 'dark' ? 'rgba(19,15,18,0.50)' : 'rgba(255,247,242,0.42)'),
            borderBottom: `1px solid ${scrolled ? 'rgba(var(--dh-accent-rgb),0.2)' : 'rgba(var(--dh-accent-rgb),0.08)'}`,
            boxShadow: scrolled ? '0 10px 34px rgba(107,82,64,0.08)' : 'none',
            pointerEvents: 'all',
          }}>
            <div className="flex items-center gap-3.5 cursor-default select-none">
              <DollhouseMark size={28} />
              <div className="flex flex-col gap-0">
                <span className="dh-wordmark-kicker" style={{ fontSize: '20px', opacity: 0.98, color: 'rgba(173, 96, 91, 0.86)' }}>the</span>
                <span className="dh-wordmark" style={{ fontSize: '24px', letterSpacing: '0.045em', lineHeight: '0.92', color: 'rgba(166, 91, 86, 0.92)', textShadow: '0 5px 18px rgba(166,91,86,0.12)' }}>DOLLHOUSE</span>
              </div>
            </div>
            <nav className="absolute left-1/2 -translate-x-1/2 flex gap-1 rounded-full p-1" style={{ background: 'rgba(255,255,255,0.34)', border: '1px solid rgba(var(--dh-accent-rgb),0.16)' }}>
              {[['welcome', 'Welcome'], ['questions', 'Quiz'], ['results', 'Results']].map(([s, l]) => (
                <button key={s}
                  className="group relative py-[6px] px-4 rounded-full font-ui text-[9px] tracking-[2.5px] uppercase font-medium transition-all overflow-hidden"
                  style={{
                    background: currentScreen === s ? 'var(--dh-btn-bg)' : 'none',
                    color: currentScreen === s ? 'var(--dh-btn-text)' : 'var(--dh-text-light)',
                    border: 'none', cursor: 'default',
                  }}>
                  <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
                  <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
                  {l}
                </button>
              ))}
            </nav>
            <div className="flex items-center gap-[7px] py-[6px] px-3.5 pl-2.5 rounded-full" style={{ background: 'rgba(var(--dh-accent-rgb), 0.10)', border: '1px solid rgba(var(--dh-accent-rgb), 0.22)' }}>
              <span className="block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--dh-accent-dark)', boxShadow: '0 0 5px rgba(var(--dh-accent-rgb), 0.7)' }} />
              <span className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-semibold">Blueprint</span>
            </div>
          </div>
        </header>
      )}

      {/* Sidebar */}
      {currentScreen !== 'gate' && <Sidebar />}

      {/* Stats panel */}
      {showStats && <StatsPanel onClose={() => setShowStats(false)} />}

      {/* Screens with transitions */}
      <div
        key={currentScreen}
        id="dh-scroll-container"
        className="animate-screen-transition flex-1 overflow-y-auto"
      >
        {currentScreen === 'gate' && <GateScreen />}
        {currentScreen === 'welcome' && <WelcomeScreen />}
        {currentScreen === 'questions' && <QuizScreen />}
        {currentScreen === 'loading' && <LoadingScreen />}
        {currentScreen === 'results' && <ResultsScreen />}
        {currentScreen === 'success' && <SuccessScreen />}
      </div>
    </div>
  );
}

function StatsPanel({ onClose }: { onClose: () => void }) {
  const { answers, questions, currentQuestion, currentScreen, theme } = useQuiz();
  const answered = Object.keys(answers).filter(k => !isBlankAnswer(answers[k])).length;
  const product = cleanAnswer(answers.product, '—');
  const aesthetic = cleanAnswer(answers.aesthetic, '—');
  const customer = cleanAnswer(answers.customer, '—');
  const vibe = cleanAnswer(answers.vibe, '—');
  const budget = cleanAnswer(answers.budget, '—');
  const time = cleanAnswer(answers.time, '—');
  const status = cleanAnswer(answers.currentStatus, '—');
  const goal = cleanAnswer(answers.successGoal, 'Start with clarity');
  const completion = Math.round((answered / questions.length) * 100);
  const brandReadiness = currentScreen === 'results' ? 100 : Math.min(96, completion + (answers.product ? 12 : 0) + (answers.customer ? 8 : 0));

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center p-5 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="rounded-3xl p-9 w-full max-w-[520px] shadow-[0_8px_48px_rgba(0,0,0,0.2)] animate-glass-slide relative dh-premium-panel"
        style={{ background: 'hsl(var(--background))', border: '1px solid var(--dh-glass-border)' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm text-dh-text-light cursor-pointer transition-all hover:text-dh-accent-dark"
          style={{ border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', background: 'transparent' }}>✕</button>
        <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-2 font-medium">Brand Studio Metrics</p>
        <p className="font-display italic text-2xl text-dh-accent-dark mb-6">Your Blueprint Signal</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            [`${completion}%`, 'Quiz Signal'],
            [`${brandReadiness}%`, 'Readiness'],
            [currentScreen === 'results' ? '17' : '—', 'Rooms'],
          ].map(([v, l], i) => (
            <div key={i} className="p-4 rounded-[14px] text-center" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)' }}>
              <div className="font-display text-3xl text-dh-accent-dark leading-none mb-1.5">{v}</div>
              <div className="font-ui text-[8px] tracking-[3px] uppercase text-dh-text-light font-medium">{l}</div>
            </div>
          ))}
        </div>
        <div className="mb-5 space-y-3">
          {[
            ['Personalization Depth', completion],
            ['Launch Readiness', brandReadiness],
          ].map(([label, val]) => (
            <div key={label as string}>
              <div className="flex justify-between mb-1">
                <span className="font-ui text-[8px] tracking-[2px] uppercase text-dh-text-light">{label as string}</span>
                <span className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark">{val as number}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(var(--dh-accent-rgb), 0.12)' }}>
                <div className="h-full rounded-full" style={{ width: `${val}%`, background: 'linear-gradient(90deg, var(--dh-accent), var(--dh-accent-dark))' }} />
              </div>
            </div>
          ))}
        </div>
        <div className="h-px mb-4" style={{ background: 'rgba(var(--dh-accent-rgb), 0.2)' }} />
        <p className="font-ui text-[8px] tracking-[4px] uppercase text-dh-accent-dark mb-3 font-medium">Your Blueprint Profile</p>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {[
            ['Product', product],
            ['Aesthetic', aesthetic],
            ['Customer', customer?.split(' ')[0] + (customer?.includes('&') ? ' & ' + customer.split('&')[1]?.trim().split(' ')[0] : '')],
            ['Type', vibe],
            ['Budget', budget],
            ['Time', time],
            ['Stage', status],
            ['Goal', goal],
          ].map(([label, val], i) => (
            <div key={i} className="py-3 px-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.15)' }}>
              <p className="font-ui text-[7px] tracking-[3px] uppercase text-dh-accent-dark mb-1 font-medium">{label}</p>
              <p className="font-body text-[12px] leading-[1.4] font-light" style={{ color: 'var(--dh-text)' }}>{val}</p>
            </div>
          ))}
        </div>
        <div className="h-px mb-4" style={{ background: 'rgba(var(--dh-accent-rgb), 0.2)' }} />
        <p className="font-display italic text-[14px] text-dh-text-light text-center leading-[1.7]">
          {currentScreen === 'results' 
            ? `${answers.firstName?.split(' ')[0] || 'Your'}'s blueprint — 17 rooms, fully personalised ♥`
            : 'Your blueprint is being built room by room ♥'}
        </p>
      </div>
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <QuizProvider>
      <Toaster />
      <AppContent />
    </QuizProvider>
  </ErrorBoundary>
);

export default App;
