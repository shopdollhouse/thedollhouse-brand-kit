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

    // Respect users who prefer reduced motion — skip animation entirely.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function resize() {
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      canvas!.style.width = window.innerWidth + 'px';
      canvas!.style.height = window.innerHeight + 'px';
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Fewer particles = much less per-frame work.
    const COUNT = 18;
    for (let i = 0; i < COUNT; i++) {
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

    // Cache the accent colour once instead of reading computed style every frame.
    let cachedRgb = '196,168,154';
    const readAccent = () => {
      try {
        const v = getComputedStyle(document.body).getPropertyValue('--dh-accent-rgb').trim();
        if (v) cachedRgb = v;
      } catch {}
    };
    readAccent();
    // Re-read when the theme class changes on <html>/<body>.
    const themeObserver = new MutationObserver(readAccent);
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

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
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(${cachedRgb},1)`;

      for (let i = 0; i < hearts.length; i++) {
        const p = hearts[i];
        ctx.globalAlpha = p.o;
        drawHeart(ctx, p.x, p.y, p.size, p.rot);
        ctx.fill();
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        p.vx += (Math.random() - 0.5) * 0.01;
        if (p.x < -20) p.x = w + 10;
        if (p.x > w + 20) p.x = -10;
        if (p.y < -20) {
          p.y = h + 10;
          p.x = Math.random() * w;
          p.o = Math.random() * 0.45 + 0.15;
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    }

    // Pause animation when the tab isn't visible to save CPU.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      themeObserver.disconnect();
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
