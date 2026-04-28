import { useEffect, useMemo, useState } from 'react';

export default function GateUnlockOverlay({ active, onDone }: { active: boolean; onDone: () => void }) {
  const [phase, setPhase] = useState(0); // 0=idle, 1=closed (doors visible), 2=opening, 3=fade
  const particles = useMemo(() => Array.from({ length: 26 }).map((_, i) => ({
    id: i,
    side: i % 2 === 0 ? -1 : 1,
    size: 2 + ((i * 7) % 4),
    x: 6 + ((i * 13) % 42),
    y: 16 + ((i * 11) % 66),
    drift: 44 + ((i * 17) % 88),
    rise: 18 + ((i * 19) % 62),
    delay: (i % 7) * 0.06,
    alpha: 0.48 + ((i % 5) * 0.08),
  })), []);

  useEffect(() => {
    if (!active) return;
    setPhase(1);
    const t1 = setTimeout(() => setPhase(2), 220);
    const t2 = setTimeout(() => setPhase(3), 1680);
    const t3 = setTimeout(() => { setPhase(0); onDone(); }, 2180);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [active, onDone]);

  if (phase === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[3000] pointer-events-none overflow-hidden"
      style={{ perspective: '1600px', perspectiveOrigin: '50% 50%' }}
    >
      {/* Warm glow behind the doors that brightens as they open */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255,248,231,1) 0%, rgba(244,210,178,0.74) 26%, rgba(200,168,119,0.34) 54%, rgba(30,15,9,0.08) 100%)',
          opacity: phase === 1 ? 0.15 : phase === 2 ? 1 : 0,
          transition: 'opacity 1300ms cubic-bezier(0.19,1,0.22,1)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: phase === 1 ? 'rgba(17,8,4,0.98)' : 'rgba(17,8,4,0)',
          transition: 'background 1300ms cubic-bezier(0.19,1,0.22,1)',
        }}
      />

      {/* Door panels container preserves 3D for hinge rotation */}
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {/* LEFT DOOR */}
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width: '50%',
            transformOrigin: 'left center',
            transform:
              phase === 1
                ? 'rotateY(0deg) translateX(0) scaleX(1)'
                : phase === 2
                  ? 'rotateY(-84deg) translateX(-4%) scaleX(0.98)'
                  : 'rotateY(-98deg) translateX(-13%) scaleX(0.96)',
            transition: 'transform 1550ms cubic-bezier(0.19, 1, 0.22, 1), opacity 520ms ease-out',
            opacity: phase === 3 ? 0 : 1,
            background:
              'linear-gradient(90deg, #1a0d07 0%, #2d1810 35%, #3d2418 70%, #1e0f09 100%)',
            boxShadow:
              'inset -24px 0 60px rgba(0,0,0,0.65), inset 8px 0 24px rgba(0,0,0,0.4), 0 0 80px rgba(0,0,0,0.5)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Door panel inset frame */}
          <div
            className="absolute inset-[8%] rounded-sm"
            style={{
              border: '1px solid rgba(196,168,154,0.18)',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
            }}
          />
          {/* Brass handle */}
          <div
            className="absolute rounded-full"
            style={{
              right: '8%',
              top: '50%',
              width: 10,
              height: 10,
              background: 'radial-gradient(circle at 30% 30%, #f0d4a8, #b8956a 60%, #6b4a2a)',
              boxShadow: '0 0 8px rgba(240,212,168,0.6)',
              transform: 'translateY(-50%)',
            }}
          />
          {/* Vertical seam highlight on the inside edge */}
          <div
            className="absolute right-0 top-0 h-full"
            style={{
              width: 2,
              background:
                'linear-gradient(180deg, transparent, rgba(196,168,154,0.5), rgba(255,236,210,0.7), rgba(196,168,154,0.5), transparent)',
            }}
          />
        </div>

        {/* RIGHT DOOR */}
        <div
          className="absolute right-0 top-0 h-full"
          style={{
            width: '50%',
            transformOrigin: 'right center',
            transform:
              phase === 1
                ? 'rotateY(0deg) translateX(0) scaleX(1)'
                : phase === 2
                  ? 'rotateY(84deg) translateX(4%) scaleX(0.98)'
                  : 'rotateY(98deg) translateX(13%) scaleX(0.96)',
            transition: 'transform 1550ms cubic-bezier(0.19, 1, 0.22, 1), opacity 520ms ease-out',
            opacity: phase === 3 ? 0 : 1,
            background:
              'linear-gradient(270deg, #1a0d07 0%, #2d1810 35%, #3d2418 70%, #1e0f09 100%)',
            boxShadow:
              'inset 24px 0 60px rgba(0,0,0,0.65), inset -8px 0 24px rgba(0,0,0,0.4), 0 0 80px rgba(0,0,0,0.5)',
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            className="absolute inset-[8%] rounded-sm"
            style={{
              border: '1px solid rgba(196,168,154,0.18)',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              left: '8%',
              top: '50%',
              width: 10,
              height: 10,
              background: 'radial-gradient(circle at 30% 30%, #f0d4a8, #b8956a 60%, #6b4a2a)',
              boxShadow: '0 0 8px rgba(240,212,168,0.6)',
              transform: 'translateY(-50%)',
            }}
          />
          <div
            className="absolute left-0 top-0 h-full"
            style={{
              width: 2,
              background:
                'linear-gradient(180deg, transparent, rgba(196,168,154,0.5), rgba(255,236,210,0.7), rgba(196,168,154,0.5), transparent)',
            }}
          />
        </div>
      </div>

      {/* Bright golden seam that flares as the doors part */}
      <div
        className="absolute left-1/2 top-0 h-full -translate-x-1/2 transition-all ease-out"
        style={{
          width: phase === 1 ? 2 : phase === 2 ? 110 : 240,
          background:
            'linear-gradient(90deg, transparent, rgba(255,236,210,0.95), #fff5e0, rgba(255,236,210,0.95), transparent)',
          filter: 'blur(2px)',
          opacity: phase === 3 ? 0 : 1,
          boxShadow: '0 0 60px rgba(255,236,210,0.8)',
          transition: 'width 1200ms cubic-bezier(0.19,1,0.22,1), opacity 500ms ease-out',
        }}
      />

      {/* Golden dust drifting outward from the seam */}
      {phase >= 1 && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p) => {
            return (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  width: p.size,
                  height: p.size,
                  left: `calc(50% + ${p.side * p.x}%)`,
                  top: `${p.y}%`,
                  background: `rgba(255,232,190,${p.alpha})`,
                  boxShadow: '0 0 12px rgba(255,220,170,0.62)',
                  transition: 'transform 1500ms cubic-bezier(0.19,1,0.22,1), opacity 700ms ease-out',
                  transform: phase >= 2 ? `translate3d(${p.side * p.drift}px, ${-p.rise}px, 0)` : 'translate3d(0,0,0)',
                  opacity: phase === 3 ? 0 : phase === 2 ? 0.9 : 0,
                  transitionDelay: `${p.delay}s`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
