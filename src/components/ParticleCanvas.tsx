import { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const hearts: Array<{
      x: number; y: number; size: number;
      vx: number; vy: number; o: number;
      rot: number; rotV: number;
    }> = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 35; i++) {
      hearts.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 10 + 6,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.3 + 0.15),
        o: Math.random() * 0.45 + 0.15,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.015,
      });
    }

    function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(size, size);
      ctx.beginPath();
      ctx.moveTo(0, -0.5);
      ctx.bezierCurveTo(0.5, -1, 1, -0.2, 0, 0.6);
      ctx.bezierCurveTo(-1, -0.2, -0.5, -1, 0, -0.5);
      ctx.closePath();
      ctx.restore();
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const style = getComputedStyle(document.body);
      const rgb = style.getPropertyValue('--dh-accent-rgb').trim() || '196,168,154';
      
      hearts.forEach(h => {
        ctx.save();
        ctx.globalAlpha = h.o;
        ctx.fillStyle = `rgba(${rgb},1)`;
        drawHeart(ctx, h.x, h.y, h.size, h.rot);
        ctx.fill();
        ctx.restore();
        h.x += h.vx; h.y += h.vy; h.rot += h.rotV;
        // Gentle horizontal drift
        h.vx += (Math.random() - 0.5) * 0.01;
        if (h.x < -20) h.x = canvas.width + 10;
        if (h.x > canvas.width + 20) h.x = -10;
        // Float upward and reset when off top
        if (h.y < -20) {
          h.y = canvas.height + 10;
          h.x = Math.random() * canvas.width;
          h.o = Math.random() * 0.45 + 0.15;
        }
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ willChange: 'transform', transform: 'translateZ(0)' }}
    />
  );
}
