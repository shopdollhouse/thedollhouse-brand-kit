import { useState, useEffect, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { generateBlueprint } from '@/lib/ai-generation';
import { BadgeCheck, FileText, Sparkles } from 'lucide-react';

const loadingMessages = [
  ['Choosing your platforms…', 'Matched to your product, budget & time'],
  ['Building your product plan…', 'Your specific recommendation is being made'],
  ['Writing your first sale plan…', 'Day by day, exactly what to do'],
  ['Setting up your platforms…', 'Step-by-step guides for each one'],
  ['Crafting your marketing…', 'Content, social, email — all of it'],
  ['Designing your brand…', 'Colours, fonts, and the feeling of it all'],
  ['Almost ready…', 'Putting the finishing touches on your blueprint'],
  ['Just a moment…', 'Making sure everything is right for you ♥'],
];

export default function LoadingScreen() {
  const { answers, setAiResults, setScreen } = useQuiz();
  const [msgIdx, setMsgIdx] = useState(0);
  const [pct, setPct] = useState(5);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Rotate messages
    const msgInterval = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % loadingMessages.length);
      setPct(prev => Math.min(prev + 9, 90));
    }, 1800);

    // Timeout fallback
    const timeout = setTimeout(() => {
      clearInterval(msgInterval);
      setPct(100);
      setScreen('results');
    }, 32000);

    // Generate
    generateBlueprint(
      answers,
      (partial) => {
        setAiResults(partial);
        setPct(60);
        // Show results immediately with partial data
        clearInterval(msgInterval);
        clearTimeout(timeout);
        setScreen('results');
      }
    ).then((merged) => {
      setAiResults(merged);
      setPct(100);
      // Results screen is already showing from partial callback
    }).catch((err) => {
      console.warn('Blueprint generation error:', err.message);
      clearInterval(msgInterval);
      clearTimeout(timeout);
      setPct(100);
      setScreen('results');
    });

    return () => {
      clearInterval(msgInterval);
      clearTimeout(timeout);
    };
  }, []);

  const firstName = answers.firstName ? answers.firstName.split(' ')[0] : '';
  const aesthetic = answers.aesthetic || '';
  const vibe = answers.vibe || '';
  const parts = [firstName, aesthetic, vibe].filter(Boolean);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-10 animate-rise-in relative z-[1]">
      {/* Decorative loading lines */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px"
            style={{
              width: `${120 + i * 40}px`,
              top: `${30 + i * 10}%`,
              left: '50%',
              transform: 'translateX(-50%)',
              background: `linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), ${0.12 + i * 0.04}), transparent)`,
              animation: `loadingLine ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        {/* Vertical shimmer lines */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`v${i}`}
            className="absolute w-px"
            style={{
              height: `${60 + i * 30}px`,
              left: `${35 + i * 15}%`,
              top: '50%',
              transform: 'translateY(-50%)',
              background: `linear-gradient(180deg, transparent, rgba(var(--dh-accent-rgb), ${0.08 + i * 0.03}), transparent)`,
              animation: `loadingLineV ${2.5 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="glass dh-premium-panel rounded-[28px] p-10 w-full max-w-[460px] text-center relative z-[2]">
        <div className="dh-premium-chip mb-6 mx-auto">
          <Sparkles />
          Assembling Your Rooms
        </div>
        <p className="font-ui text-[11px] tracking-[5px] uppercase text-dh-accent-dark text-center font-medium">
          {loadingMessages[msgIdx][0]}
        </p>
        <p className="font-display text-[17px] italic text-dh-text-mid mt-2.5 text-center">
          {loadingMessages[msgIdx][1]}
        </p>

        {/* Dots */}
        <div className="flex gap-2 mt-7 justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{
                background: 'var(--dh-accent)',
                animation: `dotPulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full mt-8 mx-auto overflow-hidden" style={{ background: 'rgba(var(--dh-accent-rgb), 0.18)' }}>
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(to right, var(--dh-accent), var(--dh-accent-dark))',
            }}
          />
        </div>
        <p className="font-ui text-[8px] tracking-[4px] uppercase text-dh-accent text-center mt-3 opacity-70 font-medium">
          {pct}%
        </p>

        <div className="grid grid-cols-2 gap-2.5 mt-6 text-left">
          {[
            [BadgeCheck, 'Offer'],
            [FileText, 'Roadmap'],
            [Sparkles, 'Brand'],
            [BadgeCheck, 'First sale'],
          ].map(([Icon, label]) => {
            const TileIcon = Icon as typeof BadgeCheck;
            return (
              <div key={label as string} className="dh-value-tile rounded-xl p-3">
                <TileIcon size={14} className="text-dh-accent-dark mb-1.5" />
                <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{label as string}</p>
              </div>
            );
          })}
        </div>

        <p className="font-body text-[12px] text-dh-text-light font-light text-center mt-6 max-w-[320px] mx-auto">
          {parts.length ? parts.join(' · ') : 'Your blueprint'} — your blueprint appears quickly, then enriches automatically.
        </p>
      </div>
    </div>
  );
}
