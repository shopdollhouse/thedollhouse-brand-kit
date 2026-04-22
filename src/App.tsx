import { useEffect, useCallback } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { QuizProvider, useQuiz } from './context/QuizContext';
import ParticleCanvas from './components/ParticleCanvas';
import GateScreen from './components/screens/GateScreen';
import WelcomeScreen from './components/screens/WelcomeScreen';
import QuizScreen from './components/screens/QuizScreen';
import LoadingScreen from './components/screens/LoadingScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import { Toaster } from 'sonner';
import { playClick, toggleAmbientTrack, setAmbientVolume, pauseAmbient, isAmbientPaused } from '@/lib/sounds';
import { useState, useRef } from 'react';
import gateBg from '@/assets/gate-bg.jpg';

function Sidebar() {
  const { theme, toggleTheme, showStats, setShowStats } = useQuiz();
  const [soundOpen, setSoundOpen] = useState(false);
  const [track, setTrack] = useState(-1);
  const [vol, setVol] = useState(0.45);
  const [paused, setPaused] = useState(false);
  const tracks = ['Soft Pink Noise', 'Fireplace & Rain', 'Gentle Waves', 'Café Murmur', 'Forest Rain'];

  const handleTrack = (i: number) => {
    const newTrack = toggleAmbientTrack(i, track, vol);
    setTrack(newTrack);
  };

  const bb = 'group relative flex flex-col items-center gap-1 py-2.5 px-3.5 cursor-pointer rounded-[10px] mx-1 font-ui text-[8px] tracking-[2px] uppercase font-medium text-dh-text-light transition-colors hover:text-dh-accent-dark min-w-[52px] overflow-hidden';

  return (
    <>
      <div className="fixed right-5 z-[550] flex flex-col gap-0.5 rounded-2xl py-2 px-0 shadow-[0_4px_32px_rgba(0,0,0,0.08)]"
        style={{ top: '50%', transform: 'translateY(-50%)', marginTop: '26px', background: 'var(--dh-sidebar-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--dh-glass-border)' }}>
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
        </button>
        <button onClick={() => { playClick('soft'); setSoundOpen(o => !o); }} className={bb} style={{ background: 'none', border: 'none', color: track >= 0 ? 'var(--dh-accent-dark)' : undefined }}>
          <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
          <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
          {track >= 0 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
          )}
          Sound
        </button>
      </div>
      {soundOpen && (
        <div className="fixed right-5 bottom-[90px] z-[600] rounded-[20px] p-5 w-[220px] shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
          style={{ background: 'var(--dh-sidebar-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--dh-glass-border)' }}>
          <div className="flex items-center justify-between mb-3.5">
            <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark font-medium">Ambience</p>
            <button onClick={() => setSoundOpen(false)} className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] text-dh-text-light cursor-pointer transition-all hover:text-dh-accent-dark" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>✕</button>
          </div>
          {tracks.map((t, i) => (
            <button key={i} onClick={() => { handleTrack(i); setPaused(false); }}
              className="block w-full py-[9px] px-3 mb-1 rounded-lg font-body text-xs text-left cursor-pointer transition-all"
              style={{ background: track === i ? 'rgba(var(--dh-accent-rgb), 0.12)' : 'transparent', border: `1px solid ${track === i ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb), 0.25)'}`, color: 'var(--dh-text)' }}>
              {t}
            </button>
          ))}
          {track >= 0 && (
            <button onClick={() => { playClick('soft'); const p = pauseAmbient(); setPaused(p); }}
              className="block w-full py-[9px] px-3 mb-1 rounded-lg font-body text-xs text-center cursor-pointer transition-all"
              style={{ background: paused ? 'rgba(var(--dh-accent-rgb), 0.18)' : 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.35)', color: 'var(--dh-accent-dark)' }}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}
          <div className="mt-2.5">
            <input type="range" min="0" max="1" step="0.05" defaultValue="0.45" onChange={e => { setVol(+e.target.value); setAmbientVolume(+e.target.value); }} className="w-full" />
          </div>
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

  const answered = Object.keys(answers).filter(k => answers[k] && answers[k] !== '__skip__').length;

  return (
    <div
      suppressHydrationWarning
      className="relative h-screen overflow-hidden flex flex-col"
      style={
        currentScreen === 'gate'
          ? {
              backgroundImage: `url(${gateBg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
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
          <div className="flex items-center justify-between px-6 h-[52px] transition-all" style={{
            backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)',
            background: scrolled ? (theme === 'dark' ? 'rgba(19,15,18,0.85)' : 'rgba(242,221,216,0.85)') : (theme === 'dark' ? 'rgba(19,15,18,0.55)' : 'rgba(242,221,216,0.55)'),
            borderBottom: `1px solid ${scrolled ? 'var(--dh-glass-border)' : 'transparent'}`,
            boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.07)' : 'none',
            pointerEvents: 'all',
          }}>
            <div className="flex items-baseline gap-[5px] cursor-default select-none">
              <span className="font-display italic text-[11px] text-dh-accent-dark tracking-[3px] opacity-70 uppercase">THE</span>
              <span className="font-display italic text-[17px] tracking-[4px] uppercase" style={{ color: 'var(--dh-text)' }}>DOLLHOUSE</span>
            </div>
            <nav className="absolute left-1/2 -translate-x-1/2 flex gap-0.5">
              {[['welcome', 'Welcome'], ['questions', 'Quiz'], ['results', 'Results']].map(([s, l]) => (
                <button key={s}
                  className="group relative py-[5px] px-3.5 rounded-full font-ui text-[9px] tracking-[2.5px] uppercase font-medium transition-all overflow-hidden"
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
            <div className="flex items-center gap-[7px] py-[5px] px-3 pl-2 rounded-full" style={{ background: 'rgba(var(--dh-accent-rgb), 0.12)', border: '1px solid rgba(var(--dh-accent-rgb), 0.28)' }}>
              <span className="block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--dh-accent-dark)', boxShadow: '0 0 5px rgba(var(--dh-accent-rgb), 0.7)' }} />
              <span className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-semibold">Blueprint</span>
            </div>
          </div>
        </header>
      )}

      {/* Sidebar */}
      {currentScreen !== 'gate' && <Sidebar />}

      {/* Mode label */}
      {currentScreen !== 'gate' && (
        <div className="fixed bottom-12 left-6 z-[490] font-ui text-[10px] tracking-[4px] uppercase font-medium text-dh-text-light opacity-60">
          {theme === 'blush' ? 'Blush' : 'Dark'} Mode
        </div>
      )}

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
      </div>
    </div>
  );
}

function StatsPanel({ onClose }: { onClose: () => void }) {
  const { answers, questions, currentQuestion, currentScreen, theme } = useQuiz();
  const answered = Object.keys(answers).filter(k => answers[k] && answers[k] !== '__skip__').length;
  const product = answers.product || '—';
  const aesthetic = answers.aesthetic || '—';
  const customer = answers.customer || '—';
  const vibe = answers.vibe || '—';
  const budget = answers.budget || '—';
  const time = answers.time || '—';

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center p-5 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="rounded-3xl p-9 w-full max-w-[440px] shadow-[0_8px_48px_rgba(0,0,0,0.2)] animate-glass-slide relative"
        style={{ background: 'hsl(var(--background))', border: '1px solid var(--dh-glass-border)' }}
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm text-dh-text-light cursor-pointer transition-all hover:text-dh-accent-dark"
          style={{ border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', background: 'transparent' }}>✕</button>
        <p className="font-display italic text-2xl text-dh-accent-dark mb-6">Your Journey</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            [answered, 'Answered'],
            [`${Math.round((answered / questions.length) * 100)}%`, 'Complete'],
            [currentScreen === 'results' ? '12' : '—', 'Rooms'],
          ].map(([v, l], i) => (
            <div key={i} className="p-4 rounded-[14px] text-center" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)' }}>
              <div className="font-display text-3xl text-dh-accent-dark leading-none mb-1.5">{v}</div>
              <div className="font-ui text-[8px] tracking-[3px] uppercase text-dh-text-light font-medium">{l}</div>
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
            ? `${answers.firstName?.split(' ')[0] || 'Your'}'s blueprint — 12 rooms, fully personalised ♥`
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
