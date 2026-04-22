import { useEffect, useState } from 'react';

export default function GateUnlockOverlay({ active, onDone }: { active: boolean; onDone: () => void }) {
  const [phase, setPhase] = useState(0); // 0=idle, 1=shimmer, 2=burst, 3=fade

  useEffect(() => {
    if (!active) return;
    setPhase(1);
    const t1 = setTimeout(() => setPhase(2), 600);
    const t2 = setTimeout(() => setPhase(3), 1200);
    const t3 = setTimeout(() => { setPhase(0); onDone(); }, 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active, onDone]);

  if (phase === 0) return null;

  return (
    <div className="fixed inset-0 z-[3000] pointer-events-none flex items-center justify-center">
      {/* Golden radial burst */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: phase >= 2
            ? 'radial-gradient(circle at 50% 50%, rgba(196,168,154,0.4) 0%, rgba(196,168,154,0.15) 30%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(196,168,154,0.1) 0%, transparent 50%)',
          opacity: phase === 3 ? 0 : 1,
        }}
      />

      {/* Central shimmer line */}
      <div
        className="absolute left-1/2 -translate-x-1/2 transition-all"
        style={{
          width: phase >= 2 ? '100vw' : '2px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(196,168,154,0.8), rgba(255,255,255,0.9), rgba(196,168,154,0.8), transparent)',
          transitionDuration: phase >= 2 ? '600ms' : '400ms',
          opacity: phase === 3 ? 0 : 1,
        }}
      />

      {/* Vertical door split */}
      <div
        className="absolute left-0 top-0 h-full transition-all duration-700"
        style={{
          width: '50%',
          background: phase >= 2 ? 'rgba(30,15,9,0.85)' : 'transparent',
          transform: phase >= 2 ? 'translateX(-100%)' : 'translateX(0)',
          opacity: phase === 3 ? 0 : 1,
        }}
      />
      <div
        className="absolute right-0 top-0 h-full transition-all duration-700"
        style={{
          width: '50%',
          background: phase >= 2 ? 'rgba(30,15,9,0.85)' : 'transparent',
          transform: phase >= 2 ? 'translateX(100%)' : 'translateX(0)',
          opacity: phase === 3 ? 0 : 1,
        }}
      />

      {/* Golden particles floating up */}
      {phase >= 1 && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
                left: `${10 + Math.random() * 80}%`,
                bottom: phase >= 2 ? `${50 + Math.random() * 60}%` : `${Math.random() * 30}%`,
                background: `rgba(196,168,154,${0.3 + Math.random() * 0.5})`,
                boxShadow: `0 0 ${4 + Math.random() * 8}px rgba(196,168,154,0.4)`,
                transition: `all ${1 + Math.random() * 0.8}s ease-out`,
                opacity: phase === 3 ? 0 : 0.8,
                transitionDelay: `${Math.random() * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
