import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { derive, generateNames, applyThemePreset } from '@/lib/quiz-helpers';
import RoomCard from '../results/RoomCard';
import SummaryCard from '../results/SummaryCard';
import FirstSaleRoom from '../results/FirstSaleRoom';
import BrandingRoom from '../results/BrandingRoom';
import MarketingRoom from '../results/MarketingRoom';
import DownloadCard from '../results/DownloadCard';
import BusinessPlanRoom from '../results/BusinessPlanRoom';
import { playClick, playRoomUnlock, toggleAmbientTrack, setAmbientVolume } from '@/lib/sounds';
import { Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import GoldConfetti from '../GoldConfetti';
import dollhouseCoverBg from '@/assets/dollhouse-cover-bg.jpg';
import DollhouseMark from '@/components/DollhouseMark';
import CreatorNote from '../CreatorNote';
import ResetConfirmDialog from '../ResetConfirmDialog';

const ROOMS = [
  ['r01', '01 Name'], ['r02', '02 Platforms'], ['r03', '03 Product'],
  ['r04', '04 Pricing'], ['r05', '05 Social'], ['r05b', '06 Setup'],
  ['r06', '07 First Sale'], ['r07', '08 Content'], ['r09', '09 Marketing'],
  ['r10', '10 90-Day'], ['r11', '11 Mission'], ['r12', '12 Design'],
];

function StickyNav({ onReset, onDownload }: { onReset: () => void; onDownload: () => void }) {
  const [active, setActive] = useState('r01');
  useEffect(() => {
    const handler = () => {
      const threshold = window.innerHeight * 0.45;
      let best: string | null = null, bestTop = Infinity;
      document.querySelectorAll('[data-room-id]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom > 0) {
          const dist = Math.abs(rect.top);
          if (dist < bestTop) { bestTop = dist; best = (el as HTMLElement).dataset.roomId || null; }
        }
      });
      if (best && best !== active) setActive(best);
    };
    const scrollEl = document.getElementById('dh-scroll-container') || window;
    scrollEl.addEventListener('scroll', handler, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handler);
  }, [active]);

  const scrollTo = (id: string) => {
    const container = document.getElementById('dh-scroll-container');
    const el = document.querySelector(`[data-room-id="${id}"]`);
    if (el && container) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };

  return (
    <div className="sticky top-[52px] z-[100]" style={{ background: 'var(--dh-glass-bg)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', borderBottom: '1px solid var(--dh-glass-border)' }}>
      <div className="flex items-center justify-between px-5 py-2" style={{ borderBottom: '1px solid var(--dh-glass-border)' }}>
        <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium">THE DOLLHOUSE</p>
        <div className="flex items-center gap-2">
          <button onClick={() => { playClick('soft'); document.querySelector('.dh-download-trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true })); }}
            className="font-ui text-[9px] tracking-[2px] uppercase rounded-full py-1 px-3 cursor-pointer transition-all hover:opacity-80"
            style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', border: 'none' }}>
            ⬇ Download
          </button>
          <button onClick={() => { playClick('back'); onReset(); }}
            className="font-ui text-[9px] tracking-[2px] uppercase text-dh-text-light rounded-full py-1 px-3 cursor-pointer"
            style={{ background: 'none', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
            ← Start Over
          </button>
        </div>
      </div>
      <div className="flex gap-1 items-center px-4 py-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {ROOMS.map(([id, lbl]) => (
          <button key={id} onClick={() => scrollTo(id)}
            className="flex-shrink-0 py-[5px] px-3 rounded-full font-ui text-[9px] tracking-[2px] uppercase cursor-pointer transition-all whitespace-nowrap"
            style={{
              background: active === id ? 'var(--dh-btn-bg)' : 'none',
              color: active === id ? 'var(--dh-btn-text)' : 'var(--dh-text-light)',
              border: `1px solid ${active === id ? 'var(--dh-btn-bg)' : 'rgba(var(--dh-accent-rgb), 0.25)'}`,
            }}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

function Acc({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden mb-2" style={{ border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', background: 'rgba(var(--dh-accent-rgb), 0.03)' }}>
      <button onClick={() => { playClick('soft'); setOpen(o => !o); }}
        className="dh-no-print w-full flex justify-between items-center text-left cursor-pointer gap-3"
        style={{ padding: '16px 20px', background: 'none', border: 'none', fontFamily: 'var(--font-display)', fontSize: 16, fontStyle: 'italic', color: 'var(--dh-text)' }}>
        <span>{title}</span>
        <span className="font-body text-[11px] not-italic py-[3px] px-3 rounded-full flex-shrink-0" style={{ color: 'var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
          {open ? 'Close' : 'Read'}
        </span>
      </button>
      {/* Always render in DOM for export; toggle visibility for UX */}
      <div className={`font-body text-[13px] leading-8 text-dh-text-mid font-light whitespace-pre-line dh-acc-body ${open ? '' : 'dh-acc-closed'}`} style={{ padding: '4px 20px 20px' }}>
        <p className="dh-no-print font-display italic text-[15px] mb-2" style={{ color: 'var(--dh-text)' }}>{title}</p>
        {children}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden mb-2" style={{ border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', background: 'rgba(var(--dh-accent-rgb), 0.03)' }}>
      <button onClick={() => { playClick('soft'); setOpen(o => !o); }}
        className="w-full flex items-center justify-between text-left cursor-pointer gap-4"
        style={{ padding: '14px 18px', background: 'none', border: 'none' }}>
        <p className="font-body text-[13px] font-normal leading-[1.5]" style={{ color: 'var(--dh-text)', margin: 0 }}>{q}</p>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.6" strokeLinecap="round" className="flex-shrink-0 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && (
        <div style={{ padding: '0 18px 14px' }}>
          <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8]">{a}</p>
        </div>
      )}
    </div>
  );
}

// ShortcutBar removed — was overlapping content and felt dev-facing

function LeftSidebar({ activeRoom, onDownload }: { activeRoom: string; onDownload: () => void }) {
  const scrollTo = (id: string) => {
    const el = document.querySelector(`[data-room-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bb = 'group relative flex flex-col items-center gap-1 py-2.5 px-3.5 cursor-pointer rounded-[10px] mx-1 font-ui text-[8px] tracking-[2px] uppercase font-medium text-dh-text-light transition-colors hover:text-dh-accent-dark min-w-[52px] overflow-hidden';

  return (
    <div className="dh-no-print fixed left-5 z-[550] hidden md:flex flex-col gap-0.5 rounded-2xl py-2 px-0 shadow-[0_4px_32px_rgba(0,0,0,0.08)]"
      style={{ top: '50%', transform: 'translateY(-50%)', marginTop: '26px', background: 'var(--dh-sidebar-bg)', backdropFilter: 'blur(16px)', border: '1px solid var(--dh-glass-border)' }}>
      {ROOMS.map(([id, lbl]) => {
        const num = lbl.split(' ')[0];
        const label = lbl.split(' ').slice(1).join(' ');
        return (
          <button key={id} onClick={() => { playClick('soft'); scrollTo(id); }}
            className={bb}
            style={{
              background: activeRoom === id ? 'rgba(var(--dh-accent-rgb), 0.12)' : 'none',
              color: activeRoom === id ? 'var(--dh-accent-dark)' : undefined,
              border: 'none',
            }}>
            {/* Hover shimmer lines */}
            <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
            <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
            <span className="font-display text-[11px] leading-none">{num}</span>
            {label}
          </button>
        );
      })}
      <div className="h-px mx-2" style={{ background: 'rgba(var(--dh-accent-rgb), 0.15)' }} />
      <button onClick={(e) => { e.preventDefault(); playClick('soft'); document.getElementById('dh-about')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
        className={bb} style={{ background: 'none', border: 'none' }}>
        <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
        <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        About
      </button>
      <button onClick={(e) => { e.preventDefault(); playClick('soft'); document.getElementById('dh-boutique')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
        className={bb} style={{ background: 'none', border: 'none' }}>
        <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
        <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
        <span className="text-[11px] leading-none">♥</span>
        Shop
      </button>
      <button onClick={() => { playClick('soft'); document.querySelector('.dh-download-trigger')?.dispatchEvent(new MouseEvent('click', { bubbles: true })); }}
        className={bb}
        style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', border: 'none', borderRadius: '10px' }}>
        <span className="text-[11px] leading-none">⬇</span>
        Save
      </button>
    </div>
  );
}

export default function ResultsScreen() {
  const { answers, aiResults, resetAll, setScreen, toggleTheme } = useQuiz();
  const d = derive(answers);
  const { topPlatforms, social, priceHint, priceEntry, priceCore, pricePrem, mission, brandId, blockerNote, pillar2, launchPlan, w1Static, w2Static, staticScript, todayAction, promise, name, brand, aesthetic, customer, product, audience, urgency, vibe, themePreset, tierLabels, marketplaceIntro, productStrategy, monthPlans, executiveSummary, missionLine } = d;

  // Apply aesthetic-driven CSS-variable shifts (subtle, only on Results screen)
  useEffect(() => {
    applyThemePreset(themePreset);
    return () => applyThemePreset(null);
  }, [themePreset]);

  const [glanceOpen, setGlanceOpen] = useState(true);
  const [faqOpen, setFaqOpen] = useState(true);
  const [copiedHex, setCopiedHex] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [emailFb, setEmailFb] = useState('');
  const [activeRoom, setActiveRoom] = useState('r01');
  const [soundTrack, setSoundTrack] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const downloadRef = useRef<(() => void) | null>(null);
  const [showReadyPopup, setShowReadyPopup] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const unlockedRooms = useRef<Set<string>>(new Set());

  const copyScript = (text: string) => {
    navigator.clipboard?.writeText(text);
    playClick('soft');
    toast('Script copied to your brand board!', { duration: 2000 });
  };

  const fs = aiResults?.firstSale;
  const bp = aiResults?.businessPlan;
  const br = aiResults?.branding;
  const mk = aiResults?.marketing;

  const displayName = name || 'You';
  const names = generateNames(product, aesthetic, customer, displayName, aiResults?.businessNames);
  const coverTitle = (brand || product || '').toString().trim();
  const coverWords = coverTitle.split(/\s+/).filter(Boolean);
  const longestCoverWord = coverWords.reduce((longest, word) => Math.max(longest, word.length), 0);
  const coverTitleFont =
    longestCoverWord >= 16
      ? 'clamp(28px, 3.4vw, 40px)'
      : longestCoverWord >= 13
        ? 'clamp(34px, 4.2vw, 52px)'
        : longestCoverWord >= 10
          ? 'clamp(40px, 5vw, 64px)'
          : 'clamp(46px, 6vw, 80px)';

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const handleReset = () => { setShowResetConfirm(true); };
  const confirmReset = () => { resetAll(); setScreen('gate'); };
  const scrollToTop = () => {
    const scrollEl = document.getElementById('dh-scroll-container');
    if (scrollEl) {
      scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
      playClick('soft');
    }
  };

  // Track active room + scroll progress
  useEffect(() => {
    const scrollEl = document.getElementById('dh-scroll-container');
    if (!scrollEl) return;
    const handler = () => {
      const threshold = window.innerHeight * 0.45;
      let best: string | null = null, bestTop = Infinity;
      document.querySelectorAll('[data-room-id]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom > 0) {
          const dist = Math.abs(rect.top);
          if (dist < bestTop) { bestTop = dist; best = (el as HTMLElement).dataset.roomId || null; }
        }
      });
      if (best) {
        setActiveRoom(best);
        // Scroll milestone reward
        if (best !== 'r00' && !unlockedRooms.current.has(best)) {
          unlockedRooms.current.add(best);
          const roomLabel = ROOMS.find(([id]) => id === best)?.[1];
          if (roomLabel) {
            playRoomUnlock();
            toast(`✦ ${roomLabel} unlocked`, {
              duration: 1800,
              style: {
                background: 'linear-gradient(135deg, #1e0f09, #2d1810)',
                color: 'rgba(196,168,154,0.85)',
                border: '1px solid rgba(196,168,154,0.2)',
                fontSize: '11px',
                letterSpacing: '2px',
                textTransform: 'uppercase' as const,
                fontFamily: 'var(--font-ui)',
              },
            });
          }
        }
      }
      const scrollTop = scrollEl.scrollTop;
      const docHeight = scrollEl.scrollHeight - scrollEl.clientHeight;
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
      setShowBackToTop(scrollTop > 300);
    };
    scrollEl.addEventListener('scroll', handler, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handler);
  }, []);

  // Scroll reveal — fade-in-up rooms as they enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('dh-visible'); observer.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.dh-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Auto-dismiss confetti
  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showConfetti]);

  // Keyboard shortcuts: M = mode, S = sound, D = download
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'm') { playClick('soft'); toggleTheme(); }
      if (key === 's') {
        playClick('soft');
        const newTrack = toggleAmbientTrack(0, soundTrack, 0.45);
        setSoundTrack(newTrack);
      }
      if (key === 'd') { downloadRef.current?.(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTheme, soundTrack]);

  // Email capture — save to localStorage leads array + show success
  const handleEmailSubmit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setEmailFb('Please enter a valid email address.'); return; }
    playClick('success');
    try {
      const leads = JSON.parse(localStorage.getItem('dh_leads') || '[]');
      leads.push({ email: emailVal, name: name, brand: brand || '', product: product || '', date: new Date().toISOString() });
      localStorage.setItem('dh_leads', JSON.stringify(leads));
    } catch {}
    setEmailFb('joined');
  };

  // Download leads as CSV
  const downloadLeadsCSV = () => {
    try {
      const leads = JSON.parse(localStorage.getItem('dh_leads') || '[]');
      if (!leads.length) { toast('No leads collected yet.', { duration: 2000 }); return; }
      const header = 'Email,Name,Brand,Product,Date';
      const rows = leads.map((l: any) => `"${l.email || ''}","${l.name || ''}","${l.brand || ''}","${l.product || ''}","${l.date || ''}"`);
      const csv = [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'dollhouse_leads.csv'; a.click();
      URL.revokeObjectURL(url);
      playClick('success');
    } catch { toast('Error downloading leads.', { duration: 2000 }); }
  };

  const faqItems = [
    ['Can I retake the quiz?', 'Yes — hit Start Over at the top of this page to reset everything and begin again.'],
    ['Is this actually personalised to me?', 'Yes. Every room — your platforms, product recommendation, pricing logic, first sale plan, brand colours, marketing strategy — is generated using your 16 answers. No two blueprints are the same.'],
    ['What if the AI sections did not load?', 'Some rooms use AI to go deeper. If the connection was slow, those rooms show a personalised static version instead. Your blueprint is still fully built from your answers.'],
    ['How do I save my blueprint?', 'Use the Save Your Blueprint section below to download it as an HTML file, or copy it as text notes.'],
    ['I have a question — who do I contact?', 'Head to shopdollhouse.co and reach out from there. We read everything.'],
  ];

  return (
    <div className="w-full">
      {/* Gold confetti celebration */}
      <GoldConfetti active={showConfetti} />
      {showReadyPopup && (
        <div className="fixed bottom-6 right-6 z-[900] w-[360px] max-w-[calc(100vw-48px)] animate-glass-slide" style={{ animationDuration: '0.35s' }}>
          <div className="rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.25)]" style={{ border: '1px solid var(--dh-glass-border)' }}>
            {/* Dark header strip */}
            <div className="relative px-5 pt-5 pb-4" style={{ background: 'linear-gradient(160deg, #1e0f09 0%, #2d1810 50%, #1a0e08 100%)' }}>
              <button onClick={() => setShowReadyPopup(false)} className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] cursor-pointer transition-all hover:opacity-80" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'rgba(255,255,255,0.5)' }}>✕</button>
              <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(196,168,154,0.4), transparent)' }} />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(196,168,154,0.12)', border: '1px solid rgba(196,168,154,0.2)' }}>
                  <DollhouseMark size={20} />
                </div>
                <div>
                  <p className="font-ui text-[8px] tracking-[3px] uppercase font-medium mb-0.5" style={{ color: 'rgba(196,168,154,0.5)' }}>Blueprint Complete</p>
                  <p className="font-display italic text-[17px] leading-[1.3]" style={{ color: 'rgba(255,255,255,0.9)' }}>{displayName}'s Dollhouse is ready</p>
                </div>
              </div>
            </div>
            {/* Light body */}
            <div className="px-5 py-4" style={{ background: 'hsl(var(--background))' }}>
              <p className="font-body text-[12px] text-dh-text-mid font-light leading-[1.7] mb-3">
                <strong className="font-medium" style={{ color: 'var(--dh-text)' }}>12 personalised rooms</strong> built from your answers — brand, platforms, pricing, marketing, and more.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Brand Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[200]" style={{ background: 'rgba(var(--dh-accent-rgb), 0.1)' }}>
        <div className="h-full transition-all duration-150" style={{ width: `${scrollProgress * 100}%`, background: 'linear-gradient(90deg, var(--dh-accent), var(--dh-accent-dark))' }} />
      </div>
      <LeftSidebar activeRoom={activeRoom} onDownload={() => downloadRef.current?.()} />
      <div id="dh-results-inner" className="w-full max-w-[800px] mx-auto px-5 animate-cinematic-reveal" style={{ padding: '80px 20px 120px' }}>

        {/* ══ ROOM 00: THE COVER — Dollhouse Blush Edition ══ */}
        <div
          data-room-id="r00"
          className="relative rounded-3xl overflow-hidden mb-12"
          style={{
            backgroundColor: '#f5dcd3',
            backgroundImage: `url(${dollhouseCoverBg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'left bottom',
            backgroundRepeat: 'no-repeat',
            minHeight: '760px',
            boxShadow: '0 30px 100px rgba(196,168,154,0.25), 0 0 0 1px rgba(196,168,154,0.18)',
          }}
        >
          {/* Outer subtle frame line */}
          <div
            className="absolute inset-6 rounded-[18px] pointer-events-none"
            style={{ border: '1px solid rgba(156, 123, 110, 0.12)' }}
          />

          {/* Right-side content column */}
          <div className="relative z-[2] grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] min-h-[760px]">
            <div className="hidden md:block" />

            <div className="flex flex-col items-center justify-center text-center px-6 md:px-10 py-12 min-w-0 overflow-hidden">
              {/* Tiny gold arch glyph */}
              <div className="mb-3" style={{ color: '#b8956a' }}>
                <svg width="34" height="44" viewBox="0 -4 56 80" fill="none">
                  <path d="M10 74 L10 28 Q10 5 28 5 Q46 5 46 28 L46 74" stroke="currentColor" strokeWidth="1.4" fill="none" />
                  <path d="M17 74 L17 31 Q17 16 28 16 Q39 16 39 31 L39 74" stroke="currentColor" strokeWidth="0.7" fill="none" opacity="0.55" />
                  <circle cx="28" cy="3" r="1.6" fill="currentColor" />
                </svg>
              </div>

              {/* THE DOLLHOUSE wordmark with gold rules */}
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, #c9a577)' }} />
                <p
                  className="font-ui font-medium uppercase"
                  style={{ fontSize: '10px', letterSpacing: '6px', color: '#a07a4f' }}
                >
                  The Dollhouse
                </p>
                <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, #c9a577)' }} />
              </div>

              {/* Italic eyebrow */}
              <p
                className="font-display italic mb-3"
                style={{ fontSize: '20px', color: '#c08a82', letterSpacing: '1px' }}
              >
                Your Brand Blueprint
              </p>

              <h1
                className="font-display italic leading-[0.94] mb-6 mx-auto text-center text-balance"
                style={{
                  fontSize: coverTitleFont,
                  color: '#b8716a',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  maxWidth: 'min(100%, 500px)',
                  overflowWrap: 'normal',
                  wordBreak: 'normal',
                  hyphens: 'none',
                }}
              >
                {coverTitle}
              </h1>

              {/* Tagline */}
              <p
                className="font-display italic mx-auto mb-7"
                style={{
                  fontSize: '17px',
                  lineHeight: 1.7,
                  color: '#b08580',
                  maxWidth: '420px',
                }}
              >
                A personalised strategy built entirely around {name}'s vision, aesthetic, and goals.
              </p>

              {/* Gold dot divider with heart */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-14" style={{ background: '#c9a577', opacity: 0.6 }} />
                <span style={{ color: '#b8956a', fontSize: '12px' }}>♥</span>
                <div className="h-px w-14" style={{ background: '#c9a577', opacity: 0.6 }} />
              </div>

              {/* Pill tags */}
              <div className="flex items-center gap-3 mb-10 flex-wrap justify-center">
                {[
                  aesthetic,
                  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                  '12 Rooms',
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="font-ui uppercase font-medium"
                    style={{
                      fontSize: '8px',
                      letterSpacing: '3px',
                      color: '#a07a4f',
                      border: '1px solid #c9a577',
                      borderRadius: '9999px',
                      padding: '8px 16px',
                      background: 'transparent',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Gold seal */}
              <div className="flex flex-col items-center">
                <div
                  className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-3 relative"
                  style={{ border: '1px solid #c9a577' }}
                >
                  <div
                    className="absolute inset-[4px] rounded-full"
                    style={{ border: '1px solid rgba(201,165,119,0.35)' }}
                  />
                  <span style={{ color: '#b8956a', fontSize: '18px' }}>♥</span>
                </div>
                <p
                  className="font-ui uppercase font-medium"
                  style={{ fontSize: '8px', letterSpacing: '4px', color: '#a07a4f' }}
                >
                  Personal Use Only
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* At a Glance Drawer */}
        <div className="mb-6 rounded-[20px] overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(var(--dh-accent-rgb), 0.13) 0%, hsl(var(--card)) 60%)', border: '1.5px solid var(--dh-accent)', boxShadow: '0 4px 32px rgba(var(--dh-accent-rgb), 0.18)' }}>
          <div onClick={() => { playClick('soft'); setGlanceOpen(o => !o); }} className="flex items-center justify-between cursor-pointer" style={{ padding: '22px 28px', background: 'rgba(var(--dh-accent-rgb), 0.07)' }}>
            <div>
              <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-1 font-semibold">Your Blueprint at a Glance</p>
              <p className="font-display italic text-[17px]" style={{ color: 'var(--dh-text)' }}>Your mission, your market, your plan — at a glance</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.6" strokeLinecap="round" className="flex-shrink-0 ml-4 transition-transform" style={{ transform: glanceOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          {glanceOpen && (
            <div style={{ padding: '0 28px 28px' }}>
              <p className="font-display italic leading-[1.75] my-5" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', color: 'var(--dh-text)' }}>{aiResults?.businessPlan?.mission || mission}</p>
              <div className="h-px mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
              <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium">At a Glance</p>
              <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                {[
                  ['Sell on', (aiResults?.recommendedPlatforms || topPlatforms).join(' + ')],
                  ['Price range', aiResults?.startingPrice ? aiResults.startingPrice.split('—')[0].split('(')[0].trim() : priceHint],
                  ['Grow on', social.join(' + ')],
                  ['Aesthetic', aesthetic],
                  ['Timeline', urgency === 'This week' ? 'Start today' : urgency === 'This month' ? 'This month' : 'Your pace'],
                ].map(([label, val]) => (
                  <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.07)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                    <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">{label}</p>
                    <p className="font-display text-[16px] leading-[1.4]" style={{ color: 'var(--dh-text)' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rooms divider */}
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
          <p className="font-ui text-[9px] tracking-[5px] uppercase text-dh-text-light font-medium whitespace-nowrap">Your 12 Rooms</p>
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
        </div>

        {/* Room 01 - Front Door */}
        <div data-room-id="r01" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">01 — The Front Door<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          {brand ? (
            <p className="font-display italic text-center tracking-[6px] my-4" style={{ fontSize: 'clamp(26px, 5vw, 50px)', color: 'var(--dh-text)' }}>{brand}</p>
          ) : (
            <>
              <p className="font-body text-sm text-dh-text-light italic font-light mb-5">Based on your product, customer, and <em>{aesthetic.toLowerCase()}</em> aesthetic — here are names built for you:</p>
              <div className="grid gap-2.5 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                {names.map((n, i) => (
                  <div key={i} className="p-3.5 rounded-xl font-display text-sm italic text-center" style={{ border: '1.5px solid rgba(var(--dh-accent-rgb), 0.25)', color: 'var(--dh-text)' }}>{n}</div>
                ))}
              </div>
            </>
          )}
          <div className="p-5 rounded-xl mt-1" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
            <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-2 font-medium flex items-center gap-3">Your Mission<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
            <p className="font-display italic text-[16px] leading-[1.9]" style={{ color: 'var(--dh-text)' }}>{missionLine}</p>
          </div>
          {/* Expert Strategy Note */}
          <div className="p-4 rounded-xl mt-3 flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <AlertCircle size={15} className="text-dh-accent-dark flex-shrink-0 mt-0.5" />
            <p className="font-display italic text-[13px] leading-[1.85] text-dh-text-light">
              Expert Note: We chose the <em>{aesthetic.toLowerCase()}</em> direction because it naturally resonates with {customer}. Combined with {product}, this creates a brand identity that feels intentional — not accidental. Every name, font, and colour in this blueprint stems from this foundation.
            </p>
          </div>
        </div>

        {/* Room 02 - Marketplace */}
        <div data-room-id="r02" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">02 — The Marketplace Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">{marketplaceIntro}</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {(aiResults?.recommendedPlatforms || topPlatforms).map((p, i) => (
              <span key={i} className="inline-flex items-center gap-2 py-2 px-[18px] rounded-full font-body text-[13px]" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', color: 'var(--dh-text)' }}>◆ {p}</span>
            ))}
          </div>
          {(aiResults?.recommendedPlatforms || topPlatforms).map((p, i, arr) => (
            <div key={i} className={i < arr.length - 1 ? 'mb-4 pb-4' : ''} style={{ borderBottom: i < arr.length - 1 ? '1px solid rgba(var(--dh-accent-rgb), 0.25)' : 'none' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Why {p}</p>
              <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light">{aiResults?.platformReasons?.[p] || `${p} is the strongest match for your business type, budget, and the way you want to sell.`}</p>
            </div>
          ))}
          {/* Expert Strategy Note */}
          <div className="p-4 rounded-xl mt-4 flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <AlertCircle size={15} className="text-dh-accent-dark flex-shrink-0 mt-0.5" />
            <p className="font-display italic text-[13px] leading-[1.85] text-dh-text-light">
              Expert Note: These platforms were selected because {customer} already shop there. We matched your selling style ({answers.sellType || 'Online'}), your budget ({answers.budget || 'flexible'}), and your product type to find where you'll get the fastest traction with the least friction.
            </p>
          </div>
        </div>

        {/* Room 03 - Product */}
        <div data-room-id="r03" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">03 — The Product Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-4">
            {aiResults?.productRecommendation || `Your product is ${product}. Based on your answers — your budget, your audience, your time — this is the right thing to build first.`}
          </p>
          <div className="p-4 rounded-xl mb-3" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Strategy for your niche</p>
            <p className="font-body text-[13px] leading-[1.85] text-dh-text-mid font-light">{productStrategy}</p>
          </div>
          {aiResults?.startingPrice && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Starting Price</p>
              <p className="font-body text-sm leading-[1.9] text-dh-text-mid font-light">{aiResults.startingPrice}</p>
            </div>
          )}
        </div>

        {/* Room 04 - Money */}
        <div data-room-id="r04" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">04 — The Money Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">Three tiers gives {customer} a choice without confusion. Most first-time buyers pick the middle tier — so price it to be your most profitable.</p>
          <div className="grid gap-3.5 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
            {[
              { label: tierLabels.entry, price: priceEntry, desc: tierLabels.entryDesc, hi: false },
              { label: tierLabels.core, price: priceCore, desc: tierLabels.coreDesc, hi: true },
              { label: tierLabels.premium, price: pricePrem, desc: tierLabels.premiumDesc, hi: false },
            ].map(tier => (
              <div key={tier.label} className="p-6 rounded-[18px] text-center relative" style={{ background: tier.hi ? 'rgba(var(--dh-accent-rgb), 0.1)' : 'rgba(var(--dh-accent-rgb), 0.04)', border: tier.hi ? '1.5px solid var(--dh-accent-dark)' : '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                {tier.hi && <p className="absolute -top-[11px] left-1/2 -translate-x-1/2 font-ui text-[8px] tracking-[3px] uppercase py-1 px-3 rounded-full whitespace-nowrap font-medium" style={{ background: 'var(--dh-accent-dark)', color: 'var(--dh-btn-text)' }}>Start Here ✦</p>}
                <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2.5 font-medium">{tier.label}</p>
                <p className="font-display text-[28px] mb-1.5" style={{ color: 'var(--dh-text)' }}>{tier.price}</p>
                <p className="font-body text-xs text-dh-text-light font-light leading-[1.5]">{tier.desc}</p>
              </div>
            ))}
          </div>
          <div className="p-[18px_22px] rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">The Rule of Three</p>
            <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light">When given one price, buyers decide whether to buy. When given three, they decide <em>which</em> to buy. The middle tier anchors the decision — most people feel it's the safe, sensible choice.</p>
          </div>

          {/* Sales Script — Hook / Value / CTA */}
          <div className="mt-6">
            <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-4 font-medium flex items-center gap-3">Your High-Conversion Script<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
            <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] mb-4">Use this Hook → Value → CTA formula every time you sell. It works in captions, DMs, product descriptions — everywhere.</p>
            {[
              { label: 'Hook', icon: '🪝', text: d.salesScript.hook },
              { label: 'Value', icon: '💎', text: d.salesScript.value },
              { label: 'CTA', icon: '🎯', text: d.salesScript.cta },
            ].map(({ label, icon, text }) => (
              <div key={label} className="flex gap-3.5 items-start p-[18px_20px] rounded-xl mb-2.5 group relative" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                <span className="font-ui text-[8px] tracking-[2px] uppercase py-1.5 px-3 flex-shrink-0 mt-[2px] rounded font-medium whitespace-nowrap" style={{ color: 'var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>{icon} {label}</span>
                <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light flex-1">{text}</p>
                <button onClick={() => copyScript(text)} className="flex-shrink-0 mt-1 p-1.5 rounded-lg cursor-pointer opacity-40 hover:opacity-100 transition-opacity" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.15)' }} title="Copy to clipboard">
                  <Copy size={13} style={{ color: 'var(--dh-accent-dark)' }} />
                </button>
              </div>
            ))}
            {/* Full script copy */}
            <button onClick={() => copyScript(`HOOK: ${d.salesScript.hook}\n\nVALUE: ${d.salesScript.value}\n\nCTA: ${d.salesScript.cta}`)}
              className="mt-2 inline-flex items-center gap-2 py-2 px-4 rounded-full font-ui text-[9px] tracking-[2px] uppercase cursor-pointer transition-all hover:opacity-80"
              style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', color: 'var(--dh-accent-dark)' }}>
              <Copy size={12} /> Copy Full Script
            </button>
          </div>
        </div>

        {/* Room 05 - Social */}
        <div data-room-id="r05" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">05 — The Social Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-4">
            {vibe === 'Digital products'
              ? `${customer} discover digital products through social proof and content. Your focus: high-conversion landing pages, lead magnets, and content that builds trust before the click.`
              : vibe === 'Handmade / Physical'
              ? `${customer} buy handmade when they feel connected to the maker. Your focus: packaging storytelling, craft-process content, and imagery that shows the hands behind the product.`
              : vibe === 'Service / Events'
              ? `${customer} choose services based on trust and expertise. Your focus: case studies, testimonials, and content that positions you as the obvious choice.`
              : `${customer} are most likely to discover you on ${social[0]}. Here's exactly how to show up there.`}
          </p>
          <div className="grid grid-cols-2 gap-3.5 mb-5">
            {['Primary', 'Secondary'].map((label, i) => (
              <div key={label} className="p-5 rounded-2xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">{label}</p>
                <p className="font-display text-[22px]" style={{ color: 'var(--dh-text)' }}>{(aiResults?.socialMedia?.recommended || social)[i] || social[0]}</p>
              </div>
            ))}
          </div>
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">Your Posting Strategy<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          {[
            { label: 'Frequency', text: answers.time === 'Under 5 hours' ? '3 posts per week — quality over quantity. Batch create on one day and schedule ahead.' : answers.time === '5–10 hours' ? '5 posts per week — mix static posts with short-form video for reach.' : 'Post daily with stories. Consistency is your competitive advantage and the algorithm rewards it.' },
            { label: `Format for ${aesthetic}`, text: aesthetic === 'Soft & feminine' ? 'Soft-lit flat lays, gentle reels with ambient audio, carousel posts with hand-lettered overlays.' : aesthetic === 'Bold & editorial' ? 'High-contrast imagery, bold text overlays, talking-to-camera reels.' : aesthetic === 'Clean & minimal' ? 'White backgrounds, single subject, lots of breathing room. Your restraint is your signature.' : aesthetic === 'Warm & earthy' ? `Golden-hour tones, textured surfaces, slow-paced reels. Make ${customer} feel like they're stepping into a cosy space.` : 'Bright colours, fun transitions, upbeat audio. Your content should make people smile.' },
          ].map(({ label, text }, i) => (
            <div key={i} className="p-[18px_22px] mb-2.5 rounded-r-[10px]" style={{ borderLeft: '2px solid var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.04)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">{label}</p>
              <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light">{text}</p>
            </div>
          ))}

          {/* 3-Post Starter Strategy */}
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mt-6 mb-3.5 font-medium flex items-center gap-3">Your 3-Post Starter Strategy<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] mb-4">Post these three in your first week on {social[0]}. One educates, one connects, one sells. Repeat this rotation forever.</p>
          {[
            { label: '📚 Education', text: d.threePostStrategy.education },
            { label: '🎬 Behind-the-Scenes', text: d.threePostStrategy.bts },
            { label: '💰 Sales', text: d.threePostStrategy.sales },
          ].map(({ label, text }) => (
            <div key={label} className="p-[18px_22px] mb-2.5 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">{label}</p>
              <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light">{text}</p>
            </div>
          ))}
        </div>

        {/* Room 05b - Foundation (Platform Setup) */}
        <div data-room-id="r05b" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">05b — The Foundation Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-4">These are the exact steps to get {name} live on {topPlatforms.join(' and ')}. Do one platform fully before touching the second.</p>
          {(aiResults?.recommendedPlatforms || topPlatforms).map((p, i) => (
            <Acc key={i} title={`${p} — Step-by-Step Setup`}>
              {aiResults?.platformSetup?.[p] || `1. Create your account on ${p} with an email you check daily.\n2. Complete every field of your profile before going live.\n3. Add your first product or service listing with strong photos.\n4. Set up payment processing so you can receive money.\n5. Copy your profile link and put it in every social bio today.\n6. Post at least 3 pieces of content in your first week.\n7. Ask someone you trust for your first review or testimonial.`}
            </Acc>
          ))}
        </div>

        {/* Room 06 - First Sale */}
        <div data-room-id="r06" className="dh-reveal">
          <FirstSaleRoom answers={answers} aiResults={aiResults} topPlatforms={aiResults?.recommendedPlatforms || topPlatforms} social={social} displayName={displayName} />
        </div>

        {/* Room 07 - Content Studio */}
        <div data-room-id="r07" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">07 — The Content Studio<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">Content is how {customer} find you before they're ready to buy. These pillars give you an endless rotation — you'll never stare at a blank screen again.</p>
          {(mk?.contentPillars?.length ? mk.contentPillars : [
            { pillar: 'Pillar 01 — Show the work', description: `Behind-the-scenes, process, making-of. For a ${aesthetic.toLowerCase()} brand, this is especially powerful — ${customer} want to feel connected to the maker, not just the product.`, examplePosts: [] },
            { pillar: 'Pillar 02 — Educate your buyer', description: pillar2, examplePosts: [] },
            { pillar: 'Pillar 03 — Sell with story', description: `Results, testimonials, before/after. Collect feedback from your very first buyer and use it immediately. ${customer} trust other ${customer}.`, examplePosts: [] },
          ]).map((cp: any, i: number) => (
            <div key={i} className="p-[22px_26px] mb-3 rounded-r-xl" style={{ borderLeft: '2px solid var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.05)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">{cp.pillar}</p>
              <p className="font-body text-sm leading-[1.9] text-dh-text-mid font-light mb-1">{cp.description}</p>
              {cp.examplePosts?.map((ep: string, j: number) => <p key={j} className="font-body text-[13px] text-dh-text-mid italic font-light mb-1">→ "{ep}"</p>)}
            </div>
          ))}
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mt-5 mb-2.5 font-medium">Your Brand Voice</p>
          <div className="p-[22px_26px] rounded-[14px]" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
            <p className="font-display italic text-[16px] leading-[1.9]" style={{ color: 'var(--dh-text)' }}>{mk?.coreMessage || brandId.voice}</p>
          </div>
        </div>

        {/* Room 09 - Marketing */}
        <div data-room-id="r09" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">09 — The Marketing Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">This plan is built for someone {audience.toLowerCase()} — not a generic launch checklist. Every step is calibrated to your actual starting point.</p>
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">Your 3-Week Launch</p>
          {[['WEEK 1', launchPlan.w1], ['WEEK 2', launchPlan.w2], ['WEEK 3', launchPlan.w3]].map(([wk, txt], i) => (
            <div key={i} className="flex gap-3.5 items-start p-[18px_20px] rounded-xl mb-2.5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <span className="font-ui text-[7px] tracking-[2px] uppercase py-1 px-2.5 flex-shrink-0 mt-[3px] rounded font-medium" style={{ color: 'var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>{wk}</span>
              <p className="font-body text-sm leading-[1.9] text-dh-text-mid font-light">{txt}</p>
            </div>
          ))}
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mt-5 mb-2.5 font-medium">Quick Wins — Do These First</p>
          <div className="flex flex-wrap gap-2">
            {(mk?.quickWins || [`List on ${topPlatforms[0]}`, `Post 3x this week on ${social[0]}`, 'DM 5 warm leads', 'Ask for your first review', 'Add a link in bio']).map((w: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 py-2.5 px-[18px] rounded-full font-body text-[13px] font-light" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', color: 'var(--dh-text)' }}>◆ {w}</span>
            ))}
          </div>
        </div>

        {/* Room 10 - 90-Day */}
        <div data-room-id="r10" className="dh-reveal glass rounded-3xl p-[52px_56px] mb-7 shadow-[0_4px_32px_rgba(0,0,0,0.04)]">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">10 — The 90-Day Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">Three months. That's all it takes to go from zero to a real, running business — if you focus on the right things at the right time.</p>
          {[
            ['MONTH 1 — Foundation', monthPlans.foundation],
            ['MONTH 2 — Traction', monthPlans.traction],
            ['MONTH 3 — Scale', monthPlans.scale],
          ].map(([phase, text], i) => (
            <div key={i} className="flex gap-3.5 items-start p-[18px_20px] rounded-xl mb-2.5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <span className="font-ui text-[7px] tracking-[2px] uppercase py-1 px-2.5 flex-shrink-0 mt-[3px] rounded font-medium whitespace-nowrap" style={{ color: 'var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>{phase}</span>
              <p className="font-body text-sm leading-[1.9] text-dh-text-mid font-light">{text}</p>
            </div>
          ))}
          {bp?.ninetyDayGoal && (
            <div className="mt-4 p-5 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', borderLeft: '3px solid var(--dh-accent)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Your 90-Day Goal</p>
              <p className="font-body text-sm text-dh-text-mid font-light leading-7">{bp.ninetyDayGoal}</p>
            </div>
          )}
        </div>

        {/* Room 11 - Business Plan */}
        <div data-room-id="r11" className="dh-reveal">
          <BusinessPlanRoom aiResults={aiResults} displayName={displayName} mission={mission} />
        </div>

        {/* Room 12 - Branding */}
        <div data-room-id="r12" className="dh-reveal">
          <BrandingRoom aiResults={aiResults} brandId={brandId} product={product} customer={customer} aesthetic={aesthetic} />
        </div>

        {/* ══ BRAND SUMMARY — The "Screenshot" Card ══ */}
        <div className="dh-reveal relative rounded-3xl overflow-hidden mb-7 shadow-[0_16px_60px_rgba(0,0,0,0.12)]" style={{ background: 'linear-gradient(160deg, #1e0f09 0%, #2d1810 40%, #3d2218 80%, #1a0e08 100%)', border: '1px solid rgba(196,168,154,0.15)' }}>
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, transparent, rgba(196,168,154,0.6), transparent)' }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(196,168,154,0.3) 30px, rgba(196,168,154,0.3) 31px)' }} />
          <div className="relative z-[1] p-[52px_44px] text-center">
            <p className="font-ui text-[8px] tracking-[6px] uppercase mb-6 font-medium" style={{ color: 'rgba(196,168,154,0.35)' }}>Executive Summary</p>
            <h2 className="font-display italic leading-[1.1] mb-4" style={{ fontSize: 'clamp(32px, 6vw, 56px)', color: 'rgba(255,255,255,0.95)', letterSpacing: '2px', fontWeight: 600 }}>
              {brand || product}
            </h2>
            <p className="font-display italic text-[16px] mb-8 max-w-[560px] mx-auto leading-[1.8]" style={{ color: 'rgba(196,168,154,0.68)' }}>
              {executiveSummary}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex-1 h-px max-w-[50px]" style={{ background: 'rgba(196,168,154,0.2)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(196,168,154,0.25)' }}>♥</span>
              <div className="flex-1 h-px max-w-[50px]" style={{ background: 'rgba(196,168,154,0.2)' }} />
            </div>
            <p className="font-ui text-[7px] tracking-[4px] uppercase" style={{ color: 'rgba(196,168,154,0.3)' }}>Built by The Dollhouse · {aesthetic} · {new Date().getFullYear()}</p>
          </div>
        </div>

        {/* ── Performance Header + House Archives ── */}
        <div className="dh-upsell dh-no-print mb-7">
          {/* Performance Stats Bar */}
          <div className="flex items-center justify-center gap-0 mb-10 py-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)', border: '1px solid rgba(196,168,154,0.15)' }}>
            {[
              { val: '4.9 ★', label: 'Average Rating' },
              { val: '1,200+', label: 'Blueprints Built' },
              { val: '4 Days', label: 'Avg. First Sale' },
            ].map((s, i) => (
              <div key={i} className="flex-1 text-center" style={ i > 0 ? { borderLeft: '1px solid rgba(196,168,154,0.2)' } : {}}>
                <p className="font-display italic text-[24px] mb-1" style={{ color: 'var(--dh-text)' }}>{s.val}</p>
                <p className="font-ui text-[8px] tracking-[4px] uppercase text-dh-text-light font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* House Archives Header */}
          <div className="relative mb-8">
            <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.2)' }} />
            <div className="relative z-[1] flex items-center justify-center">
              <span className="font-ui text-[9px] tracking-[7px] uppercase text-dh-accent-dark font-medium px-5" style={{ background: 'hsl(var(--background))' }}>✦ THE HOUSE ARCHIVES ✦</span>
            </div>
          </div>
          <p className="font-display italic text-[22px] text-center mb-8 leading-[1.6]" style={{ color: 'var(--dh-text)' }}>
            Stories from Inside the House
          </p>

          {/* 3 Editorial Spotlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { brand: 'Content Creator', milestone: 'Built 3 months of content in one afternoon', story: "I sat down with the prompt kit and honestly couldn't believe it. I had 90 days of posts mapped out before dinner. No more staring at a blank screen wondering what to say.", initials: 'P.N.' },
              { brand: 'Vintage Boutique', milestone: 'Made my first sale on day 4', story: "I listed my stuff on day one, shared it with a few people, and by day four someone actually bought something. I almost cried. The roadmap just told me exactly what to do each day.", initials: 'L.B.' },
              { brand: 'Wellness Brand', milestone: 'Finally stopped overthinking everything', story: "I'd been going back and forth on pricing and platforms for months. This laid it all out so clearly that I just... started. Launched the next week and it felt right for the first time.", initials: 'S.R.' },
            ].map((m, i) => (
              <div key={i} className="rounded-2xl p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(196,168,154,0.2)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-ui text-[11px] tracking-[1px] font-medium" style={{ background: 'rgba(var(--dh-accent-rgb), 0.1)', color: 'var(--dh-accent-dark)' }}>{m.initials}</div>
                    <div>
                      <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium">{m.brand}</p>
                      <p className="font-body text-[11px] text-dh-text-light font-light mt-0.5">{m.milestone}</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.4" strokeLinecap="round" className="opacity-40"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <p className="font-display italic text-[14px] leading-[1.75]" style={{ color: 'var(--dh-text)' }}>"{m.story}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Drawer */}
        <div id="dh-about" className="dh-no-print mb-7 rounded-[20px] overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(var(--dh-accent-rgb), 0.13) 0%, hsl(var(--card)) 60%)', border: '1.5px solid var(--dh-accent)', boxShadow: '0 4px 32px rgba(var(--dh-accent-rgb), 0.18)' }}>
          <div onClick={() => { playClick('soft'); setFaqOpen(o => !o); }} className="flex items-center justify-between cursor-pointer" style={{ padding: '22px 28px', background: 'rgba(var(--dh-accent-rgb), 0.07)' }}>
            <div>
              <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-1 font-semibold">About This Blueprint</p>
              <p className="font-display italic text-[17px]" style={{ color: 'var(--dh-text)' }}>How was this made — and common questions</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.6" strokeLinecap="round" className="flex-shrink-0 ml-4 transition-transform" style={{ transform: faqOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          {faqOpen && (
            <div style={{ padding: '0 28px 28px' }}>
              <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] mt-5 mb-3.5">Your answers to 16 questions were processed to generate a personalised business blueprint across 12 rooms — your platforms, product, pricing, social strategy, first sale plan, branding, marketing, and 90-day roadmap.</p>
              <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] mb-5">Everything here is built specifically for <em>{name}</em> — your aesthetic, your time, your budget, your customer. No two blueprints are the same.</p>
              <div className="h-px mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
              <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium">Common Questions</p>
              {faqItems.map(([q, a], i) => <FaqItem key={i} q={q} a={a} />)}
              <div className="h-px my-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
              <div className="p-5 rounded-[14px] mb-3.5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Want to retake it?</p>
                <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.7] mb-3">You can start a fresh blueprint any time — your answers will be reset and you'll begin from the welcome screen.</p>
                <button onClick={() => { playClick('soft'); handleReset(); }} className="font-ui text-[9px] tracking-[3px] uppercase py-2.5 px-5 rounded-full text-dh-text-light cursor-pointer" style={{ background: 'none', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>← Start Over</button>
              </div>
              <div className="p-[18px_20px] rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium">Personal Use Only</p>
                </div>
                <p className="font-body text-[12px] text-dh-text-light font-light leading-[1.7]">This blueprint is licensed for personal use only and may not be resold, redistributed, or reproduced without prior written permission from The Dollhouse.</p>
              </div>
            </div>
          )}
        </div>

        {/* ══ THE BOUTIQUE — Premium Gallery ══ */}
        <div id="dh-boutique" className="dh-upsell">
        <div className="relative my-14">
          <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
          <div className="relative z-[1] flex items-center justify-center">
            <span className="font-ui text-[9px] tracking-[7px] uppercase text-dh-accent-dark font-medium px-5" style={{ background: 'hsl(var(--background))' }}>✦ THE DOLLHOUSE BOUTIQUE ✦</span>
          </div>
        </div>

        {/* ── Boutique divider ── */}
        <p className="font-body text-[12px] text-dh-text-light font-light text-center mb-3 opacity-60">Everything below is optional — your complete blueprint is above.</p>
        <p className="font-display italic text-[22px] text-center mb-10 leading-[1.6]" style={{ color: 'var(--dh-text)' }}>
          Shop the Collection
        </p>

        {/* Boutique Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {[
            { name: 'Brand Workbook', tag: 'Build It Yourself', desc: 'An interactive web app walking you through every foundational business decision.', price: '$47', was: '$261', href: 'https://stan.store/shopdollhouse/p/-build-a-real-brand-from-scratch', icon: 'book' },
            { name: 'AI Prompt Kit', tag: '50+ Prompts', desc: 'Copy, content, strategy — prompts across 8 rooms, ready to customise and use instantly.', price: '$17', was: '', href: 'https://stan.store/shopdollhouse/p/the-dollhouse-prompt-kit', icon: 'layers' },
          ].map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noreferrer"
              className="no-underline rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_56px_rgba(0,0,0,0.14)] flex flex-col group"
              style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(196,168,154,0.2)' }}>
              <div className="p-8 flex flex-col items-center text-center flex-1">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(196,168,154,0.2)' }}>
                  {item.icon === 'book' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.4" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
                  {item.icon === 'layers' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.4" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
                  {item.icon === 'calendar' && <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.4" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                </div>
                <p className="font-ui text-[8px] tracking-[4px] uppercase text-dh-accent-dark mb-2 font-medium">{item.tag}</p>
                <p className="font-display italic text-[20px] mb-2" style={{ color: 'var(--dh-text)' }}>{item.name}</p>
                <p className="font-body text-[12px] text-dh-text-light font-light leading-[1.7] mb-5 flex-1">{item.desc}</p>
                <div className="flex items-baseline gap-2 mb-5">
                  {item.was && <span className="font-body text-[11px] text-dh-text-light line-through font-light">{item.was}</span>}
                  <span className="font-display text-[24px] font-normal" style={{ color: 'var(--dh-text)' }}>{item.price}</span>
                </div>
                <span className="inline-flex items-center gap-2 py-3 px-7 rounded-full font-ui text-[9px] tracking-[3px] uppercase font-medium transition-all duration-300 group-hover:shadow-[0_4px_24px_rgba(var(--dh-accent-rgb),0.25)]"
                  style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', border: '1px solid rgba(196,168,154,0.2)' }}>
                  Explore →
                </span>
              </div>
            </a>
          ))
          }</div>

        {/* Premium Done-For-You */}
        <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {[
            { name: 'The Starter Suite', tag: 'Done For You · Premium', desc: `Your complete ${aesthetic.toLowerCase()} brand identity — strategy, visuals, voice — delivered ready to launch.`, price: '$497', was: '$540', href: 'https://stan.store/shopdollhouse/p/the-dollhouse-brand-suite' },
            { name: 'The Full House', tag: 'Done For You · Everything', desc: 'The ultimate done-for-you package — your brand, built for every platform you sell on.', price: '$997', was: '$1,530', href: 'https://stan.store/shopdollhouse/p/the-dollhouse-full-house' },
          ].map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noreferrer"
              className="no-underline rounded-3xl overflow-hidden relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(0,0,0,0.22)]"
              style={{ background: 'linear-gradient(160deg, #1e0f09 0%, #2d1810 40%, #3d2218 100%)', border: '1px solid rgba(196,168,154,0.18)' }}>
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, transparent, rgba(196,168,154,0.6), transparent)' }} />
              <div className="p-[36px_40px] text-center relative z-[1]">
                <p className="font-ui text-[8px] tracking-[4px] uppercase mb-3 font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>{item.tag}</p>
                <p className="font-display italic mb-3 leading-[1.2]" style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', color: 'rgba(255,255,255,0.94)' }}>{item.name}</p>
                <p className="font-body text-[13px] font-light leading-[1.7] mb-5 max-w-[380px] mx-auto" style={{ color: 'rgba(196,168,154,0.6)' }}>{item.desc}</p>
                <div className="flex items-baseline justify-center gap-2 mb-5">
                  <span className="font-body text-xs font-light line-through" style={{ color: 'rgba(196,168,154,0.4)' }}>{item.was}</span>
                  <span className="font-display text-[32px] leading-none" style={{ color: 'rgba(255,255,255,0.95)' }}>{item.price}</span>
                </div>
                <span className="inline-flex items-center gap-2 py-3 px-7 rounded-full font-ui text-[10px] tracking-[3px] uppercase font-medium"
                  style={{ background: 'rgba(196,168,154,0.15)', border: '1px solid rgba(196,168,154,0.28)', color: 'rgba(255,255,255,0.85)' }}>
                  Shop the Collection →
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Download */}
        <DownloadCard answers={answers} aiResults={aiResults} onDownloadRef={(fn: () => void) => { downloadRef.current = fn; }} />

        {/* Email Capture — "Join the House" */}
        <div className="dh-no-print glass rounded-3xl p-[40px_44px] mb-7 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, transparent, var(--dh-accent), transparent)' }} />
          {emailFb === 'joined' ? (
            <div className="py-8 animate-rise-in">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.2" strokeLinecap="round" className="mx-auto mb-4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <p className="font-display italic text-[24px] mb-2" style={{ color: 'var(--dh-text)' }}>Welcome to the Family, {name}!</p>
              <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.7]">You're officially in. Check your inbox soon — insider updates, tools, and exclusive drops are on their way.</p>
            </div>
          ) : (
            <>
              <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-2.5 font-medium">Join the House</p>
              <p className="font-display italic text-[21px] mb-1.5" style={{ color: 'var(--dh-text)' }}>Stay in the Loop</p>
              <p className="font-body text-[13px] text-dh-text-light font-light mb-6 leading-[1.7]">Get insider updates, exclusive drops, and founder tools — direct to your inbox.</p>
              <div className="max-w-[400px] mx-auto flex flex-col gap-2.5">
                <input type="email" value={emailVal} onChange={e => setEmailVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()} placeholder="your@email.com"
                  className="w-full py-[13px] px-4 rounded-xl font-body text-[15px] outline-none transition-all focus:ring-2 focus:ring-[var(--dh-accent)]"
                  style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1.5px solid rgba(var(--dh-accent-rgb), 0.25)', color: 'var(--dh-text)' }} />
                <button onClick={handleEmailSubmit} className="w-full py-[15px] px-8 rounded-[14px] font-ui text-[11px] tracking-[3px] uppercase font-medium cursor-pointer transition-all hover:opacity-90"
                  style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', boxShadow: '0 0 24px rgba(var(--dh-accent-rgb), 0.35), 0 0 56px rgba(var(--dh-accent-rgb), 0.15)' }}>
                  ♥ JOIN THE HOUSE
                </button>
                <p className="font-body text-[11px] text-dh-text-light font-light opacity-60">No spam, ever. Just beautiful business tools.</p>
                {emailFb && emailFb !== 'joined' && <p className="font-ui text-[10px] tracking-[2px] text-center" style={{ color: '#c4604a' }}>{emailFb}</p>}
              </div>
            </>
          )}
        </div>
        </div>{/* end dh-upsell */}

        {/* ══ CREATOR'S NOTE ══ */}
        <CreatorNote />

      </div>

      {/* Footer */}
      <footer className="w-full py-[60px_20px] text-center mt-8" style={{ borderTop: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
        <div className="max-w-[600px] mx-auto px-5">
          <p className="font-display italic text-[14px] text-dh-text-light mb-6">Find us everywhere</p>
          <div className="animate-float-arch inline-block mb-12 block mx-auto"><DollhouseMark size={40} /></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Official Website Card */}
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(243, 220, 205, 0.12)', border: '1px solid rgba(243, 220, 205, 0.25)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(243, 220, 205, 0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(243, 220, 205)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3 className="font-display text-[16px] text-dh-text mb-1">Official Website</h3>
              <p className="font-body text-[12px] text-dh-text-light mb-4">Explore the full brand</p>
              <p className="font-body text-[12px] text-dh-text-mid leading-[1.6] mb-4">Discover all Dollhouse products & digital tools</p>
              <a href="https://shopdollhouse.co" target="_blank" rel="noreferrer" className="font-ui text-[10px] tracking-[2px] uppercase text-dh-accent-dark no-underline font-medium inline-flex items-center gap-1.5">Learn more <span>→</span></a>
            </div>

            {/* Etsy Shop Card */}
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(200, 168, 119, 0.12)', border: '1px solid rgba(200, 168, 119, 0.25)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(200, 168, 119, 0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(200, 168, 119)" strokeWidth="2" strokeLinecap="round"><path d="M6 9h12M6 9v8c0 1 .5 2 1.5 2h7c1 0 1.5-1 1.5-2V9M9 5h6v4H9z"/></svg>
              </div>
              <h3 className="font-display text-[16px] text-dh-text mb-1">Etsy Shop</h3>
              <p className="font-body text-[12px] text-dh-text-light mb-4">Interactive apps & resources</p>
              <p className="font-body text-[12px] text-dh-text-mid leading-[1.6] mb-4">Digital templates, checklists & planning tools</p>
              <a href="https://www.etsy.com/shop/herDOLLHOUSE" target="_blank" rel="noreferrer" className="font-ui text-[10px] tracking-[2px] uppercase text-dh-accent-dark no-underline font-medium inline-flex items-center gap-1.5">Learn more <span>→</span></a>
            </div>

            {/* Stan Store Card */}
            <div className="p-6 rounded-2xl" style={{ background: 'rgba(196, 168, 154, 0.12)', border: '1px solid rgba(196, 168, 154, 0.25)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(196, 168, 154, 0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(196, 168, 154)" strokeWidth="2" strokeLinecap="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/><path d="M9 13h6M9 17h3"/></svg>
              </div>
              <h3 className="font-display text-[16px] text-dh-text mb-1">Stan Store</h3>
              <p className="font-body text-[12px] text-dh-text-light mb-4">Business & course tools</p>
              <p className="font-body text-[12px] text-dh-text-mid leading-[1.6] mb-4">Courses, coaching & business resources</p>
              <a href="https://stan.store/shopdollhouse" target="_blank" rel="noreferrer" className="font-ui text-[10px] tracking-[2px] uppercase text-dh-accent-dark no-underline font-medium inline-flex items-center gap-1.5">Learn more <span>→</span></a>
            </div>
          </div>

          <div className="p-[22px_26px] rounded-2xl text-left max-w-[560px] mx-auto mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
            <div className="flex items-center gap-2.5 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium">Terms & Conditions — Personal Use Only</p>
            </div>
            <p className="font-body text-[12px] text-dh-text-light font-light leading-[1.8]">This blueprint is licensed for personal use only. <strong className="font-medium" style={{ color: 'var(--dh-accent-dark)' }}>It may not be resold, redistributed, shared, or reproduced in any form</strong> without prior written permission from The Dollhouse. © 2026 The Dollhouse.</p>
          </div>

          <p className="font-body text-[11px] text-dh-text-light font-light opacity-45 cursor-default select-none" onDoubleClick={downloadLeadsCSV}>© 2026 The Dollhouse · <a href="https://shopdollhouse.co" target="_blank" rel="noreferrer" className="text-dh-accent-dark no-underline">shopdollhouse.co</a></p>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="dh-no-print fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center z-[400] transition-all hover:brightness-110"
          style={{
            background: 'var(--dh-btn-bg)',
            color: 'var(--dh-btn-text)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--dh-shadow-lift)',
            animation: 'fadeIn 0.3s ease both',
          }}
          aria-label="Back to top">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
      )}

      {/* Reset Confirmation Dialog */}
      <ResetConfirmDialog
        isOpen={showResetConfirm}
        onConfirm={confirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />
      {/* ShortcutBar removed */}
    </div>
  );
}
