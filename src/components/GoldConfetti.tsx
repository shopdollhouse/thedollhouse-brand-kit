import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; rotation: number; rotSpeed: number;
  color: string; opacity: number; life: number;
}

export default function GoldConfetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#c4a89a', '#d4b8a8', '#e8d5c4', '#b89888', '#f0e0d0', '#a08070', '#c8b090'];
    const particles: Particle[] = [];

    // Create burst of particles
    for (let i = 0; i < 120; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: canvas.height * 0.35 + (Math.random() - 0.5) * 100,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 3 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.8 + Math.random() * 0.2,
        life: 1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.life -= 0.008;
        if (p.life <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.12; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotSpeed;
        p.opacity = p.life * 0.9;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        // Draw diamond/rhombus shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.6, 0);
        ctx.moveTo(0, p.size);
        ctx.lineTo(-p.size * 0.6, 0);
        ctx.closePath();
        ctx.fill();
        // Also a small rect for variety
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      if (alive) animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animId);
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[2000] pointer-events-none"
      style={{ opacity: 1 }}
    />
  );
}
