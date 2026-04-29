import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { cleanAnswer, derive, generateNames, applyThemePreset, getPricingStrategy, type PricingStrategy, getMonthlyRevenueTargets, getWeeklyContentCalendar, getMonthlyDecisionTree, getProductExplanation, getPlatformContext, getBlockerAdaptedRotation, getPrioritizedQuickWins, strategicPlaceholder } from '@/lib/quiz-helpers';
import { saveLead } from '@/lib/lead-storage';
import RoomCard from '../results/RoomCard';
import SummaryCard from '../results/SummaryCard';
import FirstSaleRoom from '../results/FirstSaleRoom';
import BrandingRoom from '../results/BrandingRoom';
import MarketingRoom from '../results/MarketingRoom';
import BusinessPlanRoom from '../results/BusinessPlanRoom';
import { playClick, playRoomUnlock, toggleAmbientTrack, setAmbientVolume } from '@/lib/sounds';
import { BadgeCheck, CheckCircle2, Clock3, Copy, AlertCircle, Download, FileText, ListChecks, Search, Target, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import GoldConfetti from '../GoldConfetti';
import dollhouseCoverBg from '@/assets/password-bg.jpg';
import DollhouseMark from '@/components/DollhouseMark';
import CreatorNote from '../CreatorNote';
import ResetConfirmDialog from '../ResetConfirmDialog';
import SuccessScreen from '../SuccessScreen';

const ROOMS = [
  ['r01', '01 Name'], ['r02', '02 Platforms'], ['r03', '03 Product'],
  ['r04', '04 Pricing'], ['r05', '05 Social'], ['r05b', '06 Setup'],
  ['r06', '07 Sale'], ['r07', '08 Content'], ['r09', '09 Marketing'],
  ['r10', '10 90-Day'], ['r11', '11 Mission'], ['r12', '12 Design'],
  ['r13', '13 Sprint'], ['r14', '14 Page'], ['r15', '15 Assets'],
  ['r16', '16 Tracker'], ['r17', '17 Fixes'],
];

function StickyNav({ onReset, onDownload, onCelebrate }: { onReset: () => void; onDownload: () => void; onCelebrate: () => void }) {
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
          <button onClick={() => { playClick('soft'); onCelebrate(); }}
            className="font-ui text-[9px] tracking-[2px] uppercase rounded-full py-1 px-3 cursor-pointer transition-all hover:opacity-80"
            style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', border: 'none' }}>
            ✨ Celebrate
          </button>
          <button onClick={onDownload} title="Download your PDF blueprint"
            className="font-ui text-[9px] tracking-[2px] uppercase rounded-full py-1 px-3 cursor-pointer transition-all hover:opacity-80"
            style={{ background: 'none', color: 'var(--dh-text-light)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
            ⬇ PDF
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

function LeftSidebar({ activeRoom, onDownload, onCelebrate }: { activeRoom: string; onDownload: () => void; onCelebrate: () => void }) {
  const scrollTo = (id: string) => {
    const el = document.querySelector(`[data-room-id="${id}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bb = 'group relative flex items-center gap-2 cursor-pointer rounded-xl mx-1.5 font-ui text-[8px] tracking-[1.6px] uppercase font-medium text-dh-text-light transition-colors hover:text-dh-accent-dark overflow-hidden';

  return (
    <div className="dh-left-results-rail dh-no-print fixed left-5 top-[76px] z-[550] hidden md:flex flex-col gap-1 rounded-[22px] py-3 px-1.5 shadow-[0_10px_42px_rgba(107,82,64,0.10)] overflow-y-auto overscroll-contain"
      style={{ width: 142, maxHeight: 'calc(100vh - 104px)', background: 'rgba(255,250,244,0.76)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: '1px solid rgba(var(--dh-accent-rgb),0.18)', scrollbarWidth: 'none' }}>
      <div className="px-3 pt-1 pb-2">
        <p className="font-ui text-[7px] tracking-[3px] uppercase text-dh-accent-dark font-medium">Rooms</p>
        <div className="h-px mt-2" style={{ background: 'rgba(var(--dh-accent-rgb),0.18)' }} />
      </div>
      {ROOMS.map(([id, lbl]) => {
        const num = lbl.split(' ')[0];
        const label = lbl.split(' ').slice(1).join(' ');
        return (
          <button key={id} onClick={() => { playClick('soft'); scrollTo(id); }}
            className={bb}
            style={{
              padding: '7px 9px',
              background: activeRoom === id ? 'rgba(var(--dh-accent-rgb), 0.12)' : 'none',
              color: activeRoom === id ? 'var(--dh-accent-dark)' : undefined,
              border: `1px solid ${activeRoom === id ? 'rgba(var(--dh-accent-rgb),0.24)' : 'transparent'}`,
            }}>
            {/* Hover shimmer lines */}
            <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
            <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
            <span className="font-display text-[12px] leading-none min-w-[18px] text-center">{num}</span>
            <span className="text-left whitespace-nowrap">{label}</span>
          </button>
        );
      })}
      <div className="h-px mx-2" style={{ background: 'rgba(var(--dh-accent-rgb), 0.15)' }} />
      <button onClick={(e) => { e.preventDefault(); playClick('soft'); document.getElementById('dh-about')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
        className={bb} style={{ padding: '7px 9px', background: 'none', border: '1px solid transparent' }}>
        <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
        <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        About
      </button>
      <button onClick={(e) => { e.preventDefault(); playClick('soft'); document.getElementById('dh-boutique')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
        className={bb} style={{ padding: '7px 9px', background: 'none', border: '1px solid transparent' }}>
        <span className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.35), transparent)', animation: 'loadingLine 2s ease-in-out infinite' }} />
        <span className="absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(90deg, transparent, rgba(var(--dh-accent-rgb), 0.25), transparent)', animation: 'loadingLine 2.3s ease-in-out infinite', animationDelay: '0.4s' }} />
        <span className="text-[11px] leading-none">♥</span>
        Shop
      </button>
      <div className="h-px mx-2" style={{ background: 'rgba(var(--dh-accent-rgb), 0.15)' }} />
      <button onClick={() => { playClick('soft'); onCelebrate(); }}
        className={bb}
        style={{ padding: '8px 9px', background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', border: 'none', borderRadius: '12px' }}>
        <span className="text-[11px] leading-none">✨</span>
        Celebrate
      </button>
      <button onClick={onDownload} title="Download your PDF blueprint"
        className={bb}
        style={{ padding: '7px 9px', background: 'none', color: 'var(--dh-text-light)', border: '1px solid transparent' }}>
        <span className="text-[11px] leading-none">⬇</span>
        Save
      </button>
    </div>
  );
}

function ReasonTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="dh-no-print mb-3 inline-flex max-w-full items-start gap-2 rounded-full px-4 py-2 font-body text-[11px] leading-[1.5] text-dh-text-light" style={{ background: 'rgba(var(--dh-accent-rgb),0.07)', border: '1px solid rgba(var(--dh-accent-rgb),0.18)' }}>
      <span className="font-ui text-[7px] tracking-[2px] uppercase text-dh-accent-dark font-medium whitespace-nowrap">Because you said</span>
      <span>{children}</span>
    </div>
  );
}

export default function ResultsScreen() {
  const { answers, aiResults, resetAll, setScreen, toggleTheme, questions } = useQuiz();
  const d = derive(answers);
  const { topPlatforms, social, priceHint, priceEntry, priceCore, pricePrem, mission, brandId, blockerNote, pillar2, launchPlan, w1Static, w2Static, staticScript, todayAction, promise, name, brand, aesthetic, customer, product, productDetails, audience, currentStatus, successGoal, urgency, vibe, themePreset, tierLabels, marketplaceIntro, productStrategy, monthPlans, executiveSummary, missionLine, setupStageNote, successGoalNote, blocker, budget, executionContent } = d;

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
  const [showConfetti, setShowConfetti] = useState(true);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [checkedLaunchSteps, setCheckedLaunchSteps] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('dh_first_sale_action_desk') || '{}'); }
    catch { return {}; }
  });
  const unlockedRooms = useRef<Set<string>>(new Set());

  const copyScript = (text: string) => {
    navigator.clipboard?.writeText(text);
    playClick('soft');
    toast('Script copied to your brand board!', { duration: 2000 });
  };
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
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
  const firstPlatform = (aiResults?.recommendedPlatforms || topPlatforms)[0] || 'your platform';
  const firstSocial = (aiResults?.socialMedia?.recommended || social)[0] || social[0] || 'Instagram';
  const beginnerOffer = vibe === 'Service / Events'
    ? {
        title: `${product} Starter Booking`,
        deliverable: `One clear service package for ${customer}: what happens, how long it takes, what they receive, and how to book.${productDetails ? ` Build around this detail: ${productDetails}.` : ''}`,
        proof: 'Use one before/after, one client-style example, or one story that proves you can deliver.',
        guarantee: 'Promise clear communication, simple next steps, and a defined delivery window.',
      }
    : vibe === 'Digital products'
    ? {
        title: `${product} Quick-Start Version`,
        deliverable: `One instantly downloadable version of ${product} that solves one specific problem for ${customer}.${productDetails ? ` Use this angle: ${productDetails}.` : ''}`,
        proof: 'Show screenshots, a page preview, or a tiny free sample so buyers know exactly what they get.',
        guarantee: 'Promise instant access, simple instructions, and no complicated setup.',
      }
    : vibe === 'Curated / Resale'
    ? {
        title: `${product} First Drop`,
        deliverable: `A small curated drop with 5-10 pieces that all share one style, use case, or story for ${customer}.${productDetails ? ` Curate around: ${productDetails}.` : ''}`,
        proof: 'Show close-ups, condition notes, styling ideas, and why each item made the edit.',
        guarantee: 'Promise accurate descriptions, clear photos, and simple pickup or shipping details.',
      }
    : {
        title: `${product} First Batch`,
        deliverable: `A small first run of 6-12 ${product} pieces so ${customer} can buy without waiting for a huge launch.${productDetails ? ` Make the first batch feel specific to: ${productDetails}.` : ''}`,
        proof: 'Show the making process, materials, scale, packaging, and one in-use photo.',
        guarantee: 'Promise handmade care, clear delivery timing, and what happens if there is an issue.',
      };
  const firstSaleTarget = answers.budget === '$200+' ? '$250' : answers.budget === '$50–$200' ? '$150' : '$75';
  const profileBio = `${product} for ${customer} | ${productDetails ? productDetails.slice(0, 42) : `${aesthetic.toLowerCase()} ${vibe.toLowerCase()}`} | Shop/Book: [link]`;
  const firstCaption = `I made ${product} for ${customer.toLowerCase()} who want ${productDetails || `something that feels ${aesthetic.toLowerCase()} without overthinking it`}. My first ${vibe === 'Service / Events' ? 'booking spots' : 'drop'} is live now on ${firstPlatform}. Comment "INFO" or tap the link to see it.`;
  const first48 = executionContent.first48Hours;
  const salesPageOutline = executionContent.salesPageOutline
    .replaceAll('[PRODUCT]', product)
    .replaceAll('[product]', product)
    .replaceAll('[Service]', product)
    .replaceAll('[service]', product)
    .replaceAll('[specific type of client]', customer.toLowerCase())
    .replaceAll('[specific benefit]', d.salesScript.value)
    .replaceAll('[common pain point]', blocker.toLowerCase() || 'overwhelm')
    .trim();
  const launchAssets = [
    {
      title: 'Launch Caption 01',
      body: firstCaption,
    },
    {
      title: 'Launch Caption 02',
      body: `I built ${product} for ${customer.toLowerCase()} who want something that feels ${aesthetic.toLowerCase()}, useful, and easy to buy. This is the first version, and I would love for you to see it before I build the next drop. Link: [link]`,
    },
    {
      title: 'Story Prompt',
      body: `Post a 3-frame story: 1) "I finally made ${product}" 2) show the product/process 3) "Want the link? Reply INFO."`,
    },
    {
      title: 'Warm DM',
      body: executionContent.firstSaleScript.replaceAll('[product name]', product).replaceAll('[service name]', product).replaceAll('[Name]', '[Name]'),
    },
    {
      title: 'Follow-Up Message',
      body: `Hey [Name], just checking back in about ${product}. No pressure at all — I wanted to make sure you saw it because I genuinely thought of you for this. Here's the link again: [link]`,
    },
    {
      title: 'Proof Request',
      body: `Thank you so much for being one of my first buyers. If you have 30 seconds, could you send me one honest sentence about what made you buy or what you liked? It would help me so much as I build this. ♥`,
    },
  ];
  const launchHooks = executionContent.hooks.slice(0, 5).map(hook => hook.replaceAll('[product]', product));
  const progressItems = [
    `Create your ${firstPlatform} account`,
    'Add payment processing or checkout link',
    `Publish one clear ${vibe === 'Service / Events' ? 'service package' : 'product listing'}`,
    `Update your ${firstSocial} bio with what you sell and who it is for`,
    'Post your first launch caption',
    'Send 5 warm DMs',
    'Follow up with every interested person within 24 hours',
    'Collect one proof point, review, screenshot, or piece of feedback',
  ];
  const completedLaunchSteps = progressItems.filter(item => checkedLaunchSteps[item]).length;
  const actionDeskItems = [
    { id: 'price', title: 'Set your starter price', detail: `Use ${priceCore} as the first core offer anchor, then keep one lower entry option for hesitant buyers.` },
    { id: 'platform', title: `Open ${firstPlatform}`, detail: `Create or clean up the storefront where ${customer.toLowerCase()} can buy without asking extra questions.` },
    { id: 'title', title: 'Name the first offer', detail: beginnerOffer.title },
    { id: 'page', title: 'Publish the sales page', detail: 'Use the Sales Page Builder room. Do not wait for perfect photos if the buying path is clear.' },
    { id: 'post', title: `Post on ${firstSocial}`, detail: firstCaption },
    { id: 'dm', title: 'Send 5 warm DMs', detail: staticScript },
    { id: 'followup', title: 'Follow up once', detail: `Send the follow-up message within 24-48 hours to anyone who clicks, comments, replies, or says "maybe."` },
    { id: 'proof', title: 'Collect one proof point', detail: 'Ask your first buyer for one sentence, screenshot, reaction, photo, or result you can reuse.' },
  ];
  const completedActionDesk = actionDeskItems.filter(item => checkedLaunchSteps[item.id]).length;
  const noSalesDiagnostics = [
    ['Views but no clicks', 'Your photo, headline, or first line is not creating curiosity. Make the benefit clearer and show the product in use.'],
    ['Clicks but no sales', 'Your offer page is not building enough trust. Add what is included, who it is for, delivery timing, FAQ, and one proof point.'],
    ['Messages but no payment', 'People are interested but uncertain. Send the follow-up script, answer the objection directly, and make checkout one click.'],
    ['No views or engagement', `Your audience has not seen enough repetition yet. Post ${answers.time === 'Under 5 hours' ? '3' : '5'} times this week and DM warm leads instead of waiting for strangers.`],
    ['Sales then silence', 'Document why the buyer said yes, turn that proof into 3 posts, and make the same offer to 10 similar people.'],
  ];

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
  const triggerDownload = () => {
    downloadPDF();
  };
  const buildPortableBlueprint = useCallback(() => {
    const answeredList = questions.map((q, index) => {
      const value = cleanAnswer(answers[q.id], q.type === 'text-optional' ? 'Strategic placeholder selected' : 'Not answered yet');
      return `${String(index + 1).padStart(2, '0')}. ${q.text}\n${value}`;
    });

    return [
      'THE DOLLHOUSE BRAND BLUEPRINT',
      'Portable Notes Version',
      '',
      `Founder: ${displayName}`,
      `Brand: ${brand || strategicPlaceholder('brand')}`,
      `Offer: ${product}`,
      `Aesthetic: ${aesthetic}`,
      `Primary customer: ${customer}`,
      `Best platform: ${firstPlatform}`,
      `Best social channel: ${firstSocial}`,
      `Starting price direction: ${aiResults?.startingPrice || priceHint}`,
      '',
      'MISSION',
      aiResults?.businessPlan?.mission || missionLine || strategicPlaceholder('mission'),
      '',
      'FIRST 24 HOURS',
      `1. ${todayAction}`,
      '2. Publish one clear listing or booking page.',
      '3. Send five personal messages using your First Sale script.',
      '',
      'FIRST SALE SCRIPT',
      staticScript,
      '',
      'YOUR 19 QUIZ SIGNALS',
      ...answeredList,
      '',
      'Built with The Dollhouse Brand Studio',
      'shopdollhouse.co | @thedollhouse_studio',
    ].join('\n\n');
  }, [aesthetic, aiResults?.businessPlan?.mission, aiResults?.startingPrice, answers, brand, customer, displayName, firstPlatform, firstSocial, missionLine, priceHint, product, questions, staticScript, todayAction]);
  const filenameBase = (brand || product || displayName || 'dollhouse_blueprint').toString().replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase() || 'dollhouse_blueprint';
  const copyPortableBlueprint = useCallback(async () => {
    playClick('soft');
    try {
      await navigator.clipboard.writeText(buildPortableBlueprint());
      toast('Blueprint copied to your clipboard.', {
        description: 'Paste it into Notes, Google Docs, Notion, or your launch planner.',
        duration: 3600,
      });
    } catch {
      toast('Copy was blocked by your browser.', {
        description: 'Try selecting the room text manually, or enable clipboard permissions.',
        duration: 4200,
      });
    }
  }, [buildPortableBlueprint]);
  const downloadMarkdown = useCallback(() => {
    playClick('soft');
    const markdown = buildPortableBlueprint()
      .split('\n\n')
      .map((block, index) => index === 0 ? `# ${block}` : block)
      .join('\n\n');
    downloadBlob(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }), `${filenameBase}_brand_blueprint.md`);
    toast('Markdown blueprint downloaded.', { description: 'You can open it in Notes, Notion, Google Docs, or any text editor.', duration: 2800 });
  }, [buildPortableBlueprint, filenameBase]);
  const downloadPDF = useCallback(async () => {
    playClick('soft');
    toast('Preparing your PDF...', { duration: 1800 });
    try {
      const { generateBlueprintPDF, generateResultsPagePDF } = await import('@/lib/pdf-generator');
      const pdfData = {
        name: displayName,
        brand: brand || strategicPlaceholder('brand'),
        product,
        aesthetic,
        mission: aiResults?.businessPlan?.mission || missionLine,
        platforms: aiResults?.recommendedPlatforms || topPlatforms,
        social,
        priceHint: aiResults?.startingPrice || priceHint,
        colours: (br?.colours?.length ? br.colours : brandId.colours).map((c: any) => ({ name: c.name || c.n, hex: c.hex || c.c, use: c.use })),
        aiResults,
        answers,
        d,
      };
      const blob = await generateResultsPagePDF({ name: displayName, brand: brand || product }).catch(() => generateBlueprintPDF(pdfData));
      downloadBlob(blob, `${filenameBase}_brand_blueprint.pdf`);
      toast('PDF downloaded.', { description: 'Your complete blueprint is ready to keep.', duration: 2800 });
    } catch {
      toast('PDF export needs one more try.', { description: 'Use Markdown or Copy Blueprint while the browser catches up.', duration: 4200 });
    }
  }, [aesthetic, aiResults, answers, br?.colours, brand, brandId.colours, d, displayName, filenameBase, missionLine, priceHint, product, social, topPlatforms]);
  const downloadCertificatePNG = useCallback(async () => {
    playClick('soft');
    try {
      const { default: html2canvas } = await import('html2canvas');
      await document.fonts?.ready;
      const node = document.getElementById('dh-certificate-png-source');
      if (!node) throw new Error('Certificate source missing');
      const canvas = await html2canvas(node, { backgroundColor: '#f4d7ce', scale: 2, useCORS: true, logging: false });
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG failed')), 'image/png'));
      downloadBlob(blob, `${filenameBase}_completion_certificate.png`);
      toast('Certificate PNG downloaded.', { description: 'Perfect for sharing your completion moment.', duration: 3000 });
    } catch {
      toast('Certificate image could not export.', { description: 'Open Celebrate and use Share My Achievement as a backup.', duration: 4200 });
    }
  }, [filenameBase]);

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

  useEffect(() => {
    try { localStorage.setItem('dh_first_sale_action_desk', JSON.stringify(checkedLaunchSteps)); } catch {}
  }, [checkedLaunchSteps]);

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
      if (key === 'd') { downloadPDF(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTheme, soundTrack, downloadPDF]);

  // Email capture — local-only save for the zero-server build.
  const handleEmailSubmit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setEmailFb('Please enter a valid email address.'); return; }
    playClick('success');
    const result = await saveLead(emailVal, name, brand || '', product || '');
    if (result.success) {
      setEmailFb('joined');
      setEmailVal('');
    } else {
      setEmailFb('Error saving email. Please try again.');
    }
  };


  const faqItems = [
    ['Can I retake the quiz?', 'Yes — hit Start Over at the top of this page to reset everything and begin again.'],
    ['Is this actually personalised to me?', 'Yes. The blueprint uses your 19 answers, including custom offer details, current stage, success goal, customer, budget, time, and selling style. The launch kit then adapts those details into actions, scripts, pricing, and troubleshooting.'],
    ['What changed in this version?', 'The blueprint now includes 17 rooms: core strategy rooms plus a first-48-hours plan, sales page builder, launch asset pack, beginner tracker, and no-sales troubleshooter.'],
    ['Does this need a server or login?', 'No. The app is designed as a zero-server brand studio: access key entry, quiz answers, blueprint state, saved email leads, and portable save tools all run in the browser.'],
    ['How do I save my blueprint?', 'Use Copy Blueprint to Notes for a clean portable version you can paste into Notes, Google Docs, Notion, or your launch planner. The polished PDF export is being refined and will return soon.'],
    ['I have a question — who do I contact?', 'Head to shopdollhouse.co and reach out from there. We read everything.'],
  ];

  return (
    <div className="w-full">
      {/* Gold confetti celebration */}
      <GoldConfetti active={showConfetti && scrollProgress > 0.18} />
      {/* Brand Progress Line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[200]" style={{ background: 'rgba(var(--dh-accent-rgb), 0.1)' }}>
        <div className="h-full transition-all duration-150" style={{ width: `${scrollProgress * 100}%`, background: 'linear-gradient(90deg, var(--dh-accent), var(--dh-accent-dark))' }} />
      </div>
      <LeftSidebar activeRoom={activeRoom} onDownload={triggerDownload} onCelebrate={() => setShowSuccessScreen(true)} />
      <div id="dh-results-inner" className="w-full max-w-[800px] mx-auto px-5 animate-cinematic-reveal" style={{ padding: '80px 20px 120px' }}>

        {/* ══ ROOM 00: THE COVER — Dollhouse Blush Edition ══ */}
        <div
          data-room-id="r00"
          className="dh-certificate-cover relative overflow-hidden mb-12"
          style={{
            backgroundColor: '#f8e3dc',
            backgroundImage: `url(${dollhouseCoverBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            borderRadius: '34px',
            border: '1px solid rgba(196, 151, 91, 0.28)',
            boxShadow: '0 34px 110px rgba(83,48,35,0.18), 0 0 0 1px rgba(255,255,255,0.62) inset',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(255,248,244,0.10)' }} />
          {/* Outer subtle frame line */}
          <div
            className="absolute inset-6 rounded-[28px] pointer-events-none"
            style={{ border: '1px solid rgba(196, 151, 91, 0.22)' }}
          />
          <div
            className="absolute inset-10 rounded-[22px] pointer-events-none"
            style={{ border: '1px solid rgba(196, 151, 91, 0.10)' }}
          />

          {/* Right-side content column */}
          <div className="relative z-[2] grid h-full grid-cols-1 md:grid-cols-[46%_54%]">
            <div className="hidden md:block" />

            <div
              className="flex flex-col items-center justify-center text-center px-6 py-10 md:px-10 min-w-0 overflow-hidden"
              style={{
                paddingTop: 'clamp(36px, 5vw, 58px)',
                background: 'radial-gradient(ellipse at center, rgba(255,250,246,0.86) 0%, rgba(255,250,246,0.62) 48%, rgba(255,250,246,0) 76%)',
              }}
            >
              <div className="mb-4" style={{ color: '#b8956a' }}>
                <DollhouseMark size={34} />
              </div>

              <div className="dh-premium-chip mb-6" style={{ background: 'rgba(255,255,255,0.62)', borderColor: 'rgba(184,138,82,0.66)', color: '#8f623d', padding: '9px 22px', fontSize: '8px' }}>
                Private Strategy File
              </div>

              {/* THE DOLLHOUSE wordmark with gold rules */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8" style={{ background: 'linear-gradient(to right, transparent, #c9a577)' }} />
                <p
                  className="font-ui font-medium uppercase"
                  style={{ fontSize: '9px', letterSpacing: '5px', color: '#91633e' }}
                >
                  The Dollhouse
                </p>
                <div className="h-px w-8" style={{ background: 'linear-gradient(to left, transparent, #c9a577)' }} />
              </div>

              {/* Italic eyebrow */}
              <p
                className="font-display italic mb-3"
                style={{ fontSize: 'clamp(20px, 2.2vw, 26px)', color: '#ad6f69', letterSpacing: '1px' }}
              >
                Your Brand Blueprint
              </p>

              <h1
                className="font-display italic leading-[0.94] mb-6 mx-auto text-center text-balance"
                style={{
                  fontSize: coverTitleFont,
                  color: '#9f5b57',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  maxWidth: 'min(100%, 380px)',
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
                  fontSize: 'clamp(15px, 1.8vw, 19px)',
                  lineHeight: 1.6,
                  color: '#94615d',
                  maxWidth: '340px',
                }}
              >
                A personalised strategy built entirely around {name}'s vision, aesthetic, and goals.
              </p>

              {/* Gold dot divider with heart */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12" style={{ background: '#c9a577', opacity: 0.6 }} />
                <span style={{ color: '#b8956a', fontSize: '12px' }}>♥</span>
                <div className="h-px w-12" style={{ background: '#c9a577', opacity: 0.6 }} />
              </div>

              {/* Pill tags */}
              <div className="flex items-center gap-2.5 mb-6 flex-wrap justify-center">
                {[
                  aesthetic,
                  new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                  '17 Rooms',
                  'First Sale Sprint',
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="font-ui uppercase font-medium"
                    style={{
                      fontSize: '8px',
                      letterSpacing: '3px',
                      color: '#9a7048',
                      border: '1.5px solid rgba(184,138,82,0.78)',
                      borderRadius: '9999px',
                      padding: '7px 14px',
                      background: 'rgba(255,250,246,0.32)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Gold seal */}
              <div className="flex flex-col items-center">
                <div
                  className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-3 relative"
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
        <div className="mb-6 rounded-[20px] overflow-hidden dh-premium-panel" style={{ background: 'linear-gradient(135deg, rgba(var(--dh-accent-rgb), 0.13) 0%, hsl(var(--card)) 60%)', border: '1.5px solid var(--dh-accent)' }}>
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
                  ['Stage', currentStatus],
                  ['Win', successGoal],
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

        {/* Premium action dossier */}
        <div className="dh-no-print grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-4 mb-7">
          <div className="dh-premium-panel rounded-3xl p-7">
            <div className="flex items-center gap-2.5 mb-3">
              <Target size={15} className="text-dh-accent-dark" />
              <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark font-medium">Start Here</p>
            </div>
            <p className="font-display italic text-[24px] leading-[1.35] mb-3" style={{ color: 'var(--dh-text)' }}>Your first 24 hours are already chosen.</p>
            <p className="font-body text-[13px] leading-[1.85] text-dh-text-mid font-light mb-5">
              Open {firstPlatform}, publish the first sellable version of {product}, then send 5 personal messages using the script in the First Sale room.
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                [Clock3, 'Today', 'Set up'],
                [Copy, '5 DMs', 'Send'],
                [BadgeCheck, '1 proof', 'Collect'],
              ].map(([Icon, label, action]) => {
                const TileIcon = Icon as typeof Clock3;
                return (
                  <div key={label as string} className="dh-value-tile rounded-xl p-3">
                    <TileIcon size={14} className="text-dh-accent-dark mb-1.5" />
                    <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{label as string}</p>
                    <p className="font-body text-[11px] text-dh-text-light font-light">{action as string}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-3xl p-7 text-center relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1e0f09 0%, #2d1810 52%, #1a0e08 100%)', border: '1px solid rgba(196,168,154,0.18)' }}>
            <div className="absolute top-0 left-[12%] right-[12%] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(196,168,154,0.45), transparent)' }} />
            <Download size={22} className="mx-auto mb-4" style={{ color: 'rgba(196,168,154,0.75)' }} />
            <p className="font-ui text-[8px] tracking-[4px] uppercase mb-2 font-medium" style={{ color: 'rgba(196,168,154,0.48)' }}>Export Suite</p>
            <p className="font-display italic text-[21px] leading-[1.35] mb-4" style={{ color: 'rgba(255,255,255,0.92)' }}>Keep it, paste it, share it.</p>
            <div className="grid gap-2">
              <button onClick={downloadPDF} className="dh-snappy rounded-full py-3 px-5 font-ui text-[8px] tracking-[2px] uppercase cursor-pointer" style={{ background: 'rgba(255,255,255,0.9)', color: '#1e0f09', border: 'none' }}>
                Download PDF
              </button>
              <button onClick={downloadMarkdown} className="dh-snappy rounded-full py-3 px-5 font-ui text-[8px] tracking-[2px] uppercase cursor-pointer" style={{ background: 'rgba(196,168,154,0.14)', color: 'rgba(255,255,255,0.86)', border: '1px solid rgba(196,168,154,0.28)' }}>
                Markdown File
              </button>
              <button onClick={downloadCertificatePNG} className="dh-snappy rounded-full py-3 px-5 font-ui text-[8px] tracking-[2px] uppercase cursor-pointer" style={{ background: 'rgba(196,168,154,0.08)', color: 'rgba(255,255,255,0.78)', border: '1px solid rgba(196,168,154,0.22)' }}>
                Certificate PNG
              </button>
            </div>
          </div>
        </div>

        {/* First-Sale Action Desk */}
        <div className="dh-no-print mb-9 rounded-[28px] overflow-hidden dh-premium-panel" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.42), rgba(var(--dh-accent-rgb),0.10))', border: '1px solid rgba(var(--dh-accent-rgb),0.26)' }}>
          <div className="p-7" style={{ borderBottom: '1px solid rgba(var(--dh-accent-rgb),0.18)' }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-2 font-medium">First-Sale Action Desk</p>
                <p className="font-display italic text-[26px] leading-[1.15]" style={{ color: 'var(--dh-text)' }}>Your launch tasks are saved in this browser.</p>
              </div>
              <div className="rounded-full px-5 py-2 font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium" style={{ background: 'rgba(var(--dh-accent-rgb),0.09)', border: '1px solid rgba(var(--dh-accent-rgb),0.22)' }}>
                {completedActionDesk}/{actionDeskItems.length} Complete
              </div>
            </div>
            <div className="mt-5 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(var(--dh-accent-rgb),0.13)' }}>
              <div className="h-full transition-all duration-500" style={{ width: `${(completedActionDesk / actionDeskItems.length) * 100}%`, background: 'linear-gradient(90deg, var(--dh-accent), var(--dh-accent-dark))' }} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3 p-5">
            {actionDeskItems.map((item, i) => {
              const checked = Boolean(checkedLaunchSteps[item.id]);
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playClick('soft');
                    setCheckedLaunchSteps(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                  }}
                  className="text-left rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-0.5"
                  style={{ background: checked ? 'rgba(var(--dh-accent-rgb),0.13)' : 'rgba(255,255,255,0.26)', border: `1px solid ${checked ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb),0.20)'}` }}
                >
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0" style={{ color: checked ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb),0.34)' }} />
                    <div>
                      <p className="font-ui text-[7px] tracking-[2px] uppercase text-dh-accent-dark mb-1 font-medium">Task {String(i + 1).padStart(2, '0')}</p>
                      <p className="font-display italic text-[17px] leading-[1.25] mb-1" style={{ color: 'var(--dh-text)' }}>{item.title}</p>
                      <p className="font-body text-[12px] leading-[1.6] text-dh-text-mid font-light">{item.detail}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rooms divider */}
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
          <p className="font-ui text-[9px] tracking-[5px] uppercase text-dh-text-light font-medium whitespace-nowrap">Your Strategy Rooms</p>
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
        </div>

        {/* Room 01 - Front Door */}
        <div data-room-id="r01" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">01 — The Front Door<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <ReasonTag>{brand ? `you already had a brand name, we treated ${brand} like the front door.` : `you skipped the brand name, we created working titles instead of leaving this blank.`}</ReasonTag>
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

          <div className="grid md:grid-cols-2 gap-3 mt-3">
            {[
              ['Where you are now', setupStageNote],
              ['What success means here', successGoalNote],
            ].map(([label, text]) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.045)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
                <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark mb-1.5 font-medium">{label}</p>
                <p className="font-body text-[12px] leading-[1.75] text-dh-text-mid font-light">{text}</p>
              </div>
            ))}
          </div>

          {/* Blocker-Specific Mission Context */}
          <div className="p-4 rounded-xl mt-3 flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.03)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <AlertCircle size={15} className="text-dh-accent-dark flex-shrink-0 mt-0.5" />
            <p className="font-body text-[12px] leading-[1.85] text-dh-text-light font-light">
              {blocker === 'Not sure what to make or sell' ? `Your blocker was indecision. This blueprint makes the decision for you — stick to ${product} for the next 90 days.` :
               blocker === "Don't know how to market" ? `Your blocker was marketing anxiety. We've built everything else here; now you just need to show up consistently.` :
               blocker === 'Scared nobody will buy' ? `Your blocker was confidence. The fact is: your people are out there. The question is: will they find you? This blueprint gets you in front of them.` :
               `Your blocker was getting started. Stop planning. This blueprint is your permission to begin.`}
            </p>
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
        <div data-room-id="r02" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">02 — The Marketplace Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <ReasonTag>you chose {answers.sellType || 'a flexible selling style'} with a {budget || 'lean'} budget, so we prioritized low-friction places to get visible fast.</ReasonTag>
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
          {/* Expert Strategy Note with Platform Context */}
          <div className="p-4 rounded-xl mt-4 flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <AlertCircle size={15} className="text-dh-accent-dark flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-display italic text-[13px] leading-[1.85] text-dh-text-light mb-2">
                Expert Note: These platforms were selected because {customer} already shop there. We matched your selling style ({answers.sellType || 'Online'}), your budget ({answers.budget || 'flexible'}), and your product type to find where you'll get the fastest traction with the least friction.
              </p>
              {(() => {
                const contextNotes: string[] = [];
                if (urgency === 'This week') contextNotes.push(`⏰ Your urgent timeline means you need the FASTEST platform to launch — prioritize ${topPlatforms[0] || 'your chosen platform'}.`);
                if (answers.experience === 'Never') contextNotes.push(`You're completely new, so we picked the simplest platforms to master first.`);
                if (answers.budget === 'Higher') contextNotes.push(`Your budget allows for paid tools — consider Shopify if you want advanced features.`);
                return contextNotes.length > 0 && (
                  <p className="font-body text-[12px] leading-[1.6] text-dh-text-light font-light" style={{ borderTop: '1px solid rgba(var(--dh-accent-rgb), 0.2)', paddingTop: '8px' }}>
                    {contextNotes.join(' ')}
                  </p>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Room 03 - Product */}
        <div data-room-id="r03" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">03 — The Product Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <ReasonTag>you told us you sell {product}, so this room turns it into one beginner-safe offer instead of a vague idea.</ReasonTag>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-4">
            {aiResults?.productRecommendation || `Your product is ${product}. Based on your answers — your budget, your audience, your time — this is the right thing to build first.`}
          </p>

          {/* WHY THIS PRODUCT — Expert explanation */}
          <div className="p-5 rounded-xl mb-4" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Why This Product</p>
            <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light whitespace-pre-line">{getProductExplanation(product, vibe, customer, answers.budget || '', blocker)}</p>
          </div>

          <div className="p-4 rounded-xl mb-3" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Strategy for your niche</p>
            <p className="font-body text-[13px] leading-[1.85] text-dh-text-mid font-light">{productStrategy}</p>
          </div>
          {productDetails && (
            <div className="p-4 rounded-xl mb-3" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Your Custom Detail</p>
              <p className="font-body text-[13px] leading-[1.85] text-dh-text-mid font-light">{productDetails}</p>
            </div>
          )}
          {aiResults?.startingPrice && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Starting Price</p>
              <p className="font-body text-sm leading-[1.9] text-dh-text-mid font-light">{aiResults.startingPrice}</p>
            </div>
          )}

          {/* Beginner Minimum Viable Offer */}
          <div className="mt-5 p-5 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1.5px solid rgba(var(--dh-accent-rgb), 0.32)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Your First Sellable Offer</p>
            <p className="font-display italic text-[18px] mb-3" style={{ color: 'var(--dh-text)' }}>{beginnerOffer.title}</p>
            {[
              ['What to sell first', beginnerOffer.deliverable],
              ['What proves it is worth buying', beginnerOffer.proof],
              ['What makes buyers feel safe', beginnerOffer.guarantee],
            ].map(([label, text]) => (
              <div key={label} className="mb-3 pb-3 last:mb-0 last:pb-0" style={{ borderBottom: '1px solid rgba(var(--dh-accent-rgb), 0.18)' }}>
                <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark mb-1 font-medium">{label}</p>
                <p className="font-body text-[13px] leading-[1.8] text-dh-text-mid font-light">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Room 04 - Money */}
        <div data-room-id="r04" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">04 — The Money Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <ReasonTag>your budget was {budget || 'not locked yet'}, so pricing starts with a realistic first-sale target before scaling.</ReasonTag>
          {/* Dynamic Pricing Strategy */}
          {(() => {
            const pricingStrategy = getPricingStrategy(vibe, answers.budget || '', product, customer);
            return (
              <>
                <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">{pricingStrategy.description}</p>
                <div className="grid gap-3.5 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                  {[
                    { label: 'Entry', price: pricingStrategy.entry.split(' ')[0], desc: pricingStrategy.entry.split('(')[1]?.replace(')', '') || '', hi: false },
                    { label: pricingStrategy.type === 'digital' ? 'Core Product' : pricingStrategy.type === 'service' ? 'Signature Package' : pricingStrategy.type === 'curated' ? 'The Edit' : pricingStrategy.type === 'lowcost-bundling' ? 'Core' : 'Signature', price: pricingStrategy.core.split(' ')[0], desc: pricingStrategy.core.split('(')[1]?.replace(')', '') || '', hi: true },
                    { label: pricingStrategy.type === 'digital' ? 'Bundle' : pricingStrategy.type === 'service' ? 'White-Glove' : pricingStrategy.type === 'curated' ? 'One-of-One' : pricingStrategy.type === 'lowcost-bundling' ? 'Deluxe' : 'Premium', price: pricingStrategy.premium.split(' ')[0], desc: pricingStrategy.premium.split('(')[1]?.replace(')', '') || '', hi: false },
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
                  <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">{pricingStrategy.type === 'lowcost-bundling' ? 'Bundle Strategy' : 'Pricing Strategy'}</p>
                  <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light">{pricingStrategy.strategy}</p>
                </div>
                <div className="mt-4 p-[18px_22px] rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
                  <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">First Sale Math</p>
                  <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light">
                    Your first money target is <strong>{firstSaleTarget}</strong>, not a perfect full-time business. Start with the core offer, then ask: "How many buyers do I need to hit {firstSaleTarget}?" That number is your first campaign goal. For most beginners, 1-5 buyers is enough proof to keep going.
                  </p>
                </div>
              </>
            );
          })()}


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
        <div data-room-id="r05" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">05 — The Social Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <ReasonTag>your audience is {audience.toLowerCase()}, so the social plan starts with trust-building before heavy selling.</ReasonTag>
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

          {/* Weekly Content Calendar */}
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mt-6 mb-3.5 font-medium flex items-center gap-3">Your Weekly Content Calendar<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <p className="font-body text-[13px] text-dh-text-mid font-light leading-[1.8] whitespace-pre-line">{getWeeklyContentCalendar(answers.time || '', blocker)}</p>
          </div>

          {/* Launch-ready profile assets */}
          <div className="grid md:grid-cols-2 gap-3.5 mb-5">
            {[
              ['Profile Bio', profileBio],
              ['First Launch Caption', firstCaption],
            ].map(([label, text]) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.055)', border: '1px solid rgba(var(--dh-accent-rgb), 0.24)' }}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{label}</p>
                  <button onClick={() => copyScript(text)} className="p-1.5 rounded-lg cursor-pointer" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.18)' }} title="Copy">
                    <Copy size={12} style={{ color: 'var(--dh-accent-dark)' }} />
                  </button>
                </div>
                <p className="font-body text-[13px] leading-[1.75] text-dh-text-mid font-light">{text}</p>
              </div>
            ))}
          </div>

          {/* Blocker-Adapted Content Rotation */}
          {(() => {
            const adapted = getBlockerAdaptedRotation(blocker);
            return (
              <div className="p-4 rounded-xl mb-4 flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
                <AlertCircle size={15} className="text-dh-accent-dark flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Adapted for Your Situation ({adapted.pillar})</p>
                  <p className="font-body text-[13px] leading-[1.8] text-dh-text-light font-light">{adapted.focus}</p>
                </div>
              </div>
            );
          })()}

          {/* 3-Post Starter Strategy */}
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mt-4 mb-3.5 font-medium flex items-center gap-3">Your 3-Post Content Pillars<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] mb-4">Rotate these three types of content. Post one type per week, repeat infinitely.</p>
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
        <div data-room-id="r05b" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">05b — The Foundation Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <ReasonTag>you need a checkout path before you need a perfect brand, so setup is intentionally simple.</ReasonTag>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-4">These are the exact steps to get {name} live on {topPlatforms.join(' and ')}. Do one platform fully before touching the second.</p>

          {/* Time expectation + budget note */}
          <div className="p-4 rounded-xl mb-5 flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <AlertCircle size={15} className="text-dh-accent-dark flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body text-[13px] leading-[1.8] text-dh-text-light font-light">
                {answers.budget === 'Higher' ? 'You have budget for paid tools (Shopify, premium plugins). Skip the free DIY approach and invest in a platform that scales.' : 'Stick to free or low-cost platforms. Every feature you add later will still be available — start simple.'}
              </p>
              <p className="font-body text-[13px] leading-[1.8] text-dh-text-light font-light mt-2">
                Platform setup should take 1-2 hours for the first platform, 30 min for the second. Don't overthink it.
              </p>
            </div>
          </div>

          {(aiResults?.recommendedPlatforms || topPlatforms).map((p, i) => (
            <Acc key={i} title={`${p} — Step-by-Step Setup`}>
              {aiResults?.platformSetup?.[p] || `1. Create your account on ${p} with an email you check daily.\n2. Complete every field of your profile before going live.\n3. Add your first product or service listing with strong photos.\n4. Set up payment processing so you can receive money.\n5. Copy your profile link and put it in every social bio today.\n6. Post at least 3 pieces of content in your first week.\n7. Ask someone you trust for your first review or testimonial.`}
            </Acc>
          ))}

          {/* Common Setup Mistakes */}
          <div className="p-4 rounded-xl mt-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.03)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Avoid These Setup Mistakes</p>
            <ul className="font-body text-[12px] leading-[1.8] text-dh-text-light font-light space-y-1">
              <li>❌ Waiting for perfect photos before going live</li>
              <li>❌ Setting up both platforms simultaneously (you'll finish neither)</li>
              <li>❌ Forgetting to test the buying process yourself first</li>
              <li>❌ Not adding payment processing (your #1 revenue blocker)</li>
              <li>❌ Writing long product descriptions instead of short, punchy ones</li>
            </ul>
          </div>
        </div>

        {/* Room 06 - First Sale */}
        <div data-room-id="r06" className="dh-reveal">
          <FirstSaleRoom answers={answers} aiResults={aiResults} topPlatforms={aiResults?.recommendedPlatforms || topPlatforms} social={social} displayName={displayName} />
        </div>

        {/* Room 07 - Content Studio */}
        <div data-room-id="r07" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">07 — The Content Studio<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <ReasonTag>you can commit {answers.time || 'a realistic amount of'} time weekly, so the content plan matches your actual capacity.</ReasonTag>
          {answers.time === 'Under 5 hours' ? (
            <>
              <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">With limited time, focus on ONE pillar that works for your situation. Rotate it weekly and repeat.</p>
              {(() => {
                const adapted = getBlockerAdaptedRotation(blocker);
                return (
                  <div className="p-5 rounded-xl mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.1)', border: '2px solid var(--dh-accent-dark)' }}>
                    <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Your Weekly Content Focus — {adapted.pillar}</p>
                    <p className="font-body text-[13px] leading-[1.9] text-dh-text-mid font-light">{adapted.focus}</p>
                    <p className="font-body text-[12px] text-dh-text-light italic mt-3 border-t border-dh-accent-dark border-opacity-20 pt-3">Post once on your chosen platform every week. Batch-create on Sunday, schedule for Mon/Wed/Fri, and you're done.</p>
                  </div>
                );
              })()}
            </>
          ) : (
            <>
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
            </>
          )}
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mt-5 mb-2.5 font-medium">Your Brand Voice</p>
          <div className="p-[22px_26px] rounded-[14px]" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
            <p className="font-display italic text-[16px] leading-[1.9]" style={{ color: 'var(--dh-text)' }}>{mk?.coreMessage || brandId.voice}</p>
          </div>
        </div>

        {/* Room 09 - Marketing */}
        <div data-room-id="r09" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">09 — The Marketing Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">This plan is built for someone {audience.toLowerCase()} — not a generic launch checklist. Every step is calibrated to your actual starting point.</p>

          {/* WEEK 0 — Pre-Launch Prep */}
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">Week 0 — Before Launch</p>
          <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <p className="font-body text-[13px] leading-[1.8] text-dh-text-mid font-light">Before you launch, do these once. This takes 1-2 hours and removes friction from your entire launch:</p>
            <ul className="font-body text-[13px] text-dh-text-mid font-light leading-[1.8] mt-3 space-y-1">
              <li>• Set up your primary platform ({topPlatforms[0]}) and add payment processing</li>
              <li>• Write a 30-second pitch for your DMs and product descriptions</li>
              <li>• Create 3-5 launch graphics or write launch captions ahead of time</li>
              <li>• Identify 10 warm leads (past clients, friends, community members)</li>
              <li>• Test your buying process as a customer to catch issues</li>
            </ul>
          </div>

          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">Your 3-Week Launch</p>
          {[['WEEK 1', launchPlan.w1], ['WEEK 2', launchPlan.w2], ['WEEK 3', launchPlan.w3]].map(([wk, txt], i) => (
            <div key={i} className="flex gap-3.5 items-start p-[18px_20px] rounded-xl mb-2.5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <span className="font-ui text-[7px] tracking-[2px] uppercase py-1 px-2.5 flex-shrink-0 mt-[3px] rounded font-medium" style={{ color: 'var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>{wk}</span>
              <p className="font-body text-sm leading-[1.9] text-dh-text-mid font-light">{txt}</p>
            </div>
          ))}

          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mt-5 mb-3 font-medium">Prioritized Quick Wins — Start Here</p>
          <div className="space-y-2">
            {getPrioritizedQuickWins(topPlatforms, social, answers.budget || '').map((win: any) => (
              <div key={win.order} className="p-3.5 rounded-xl flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                <span className="font-ui text-[7px] tracking-[2px] uppercase py-1 px-2 flex-shrink-0 rounded font-medium" style={{ color: 'var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.1)' }}>#{win.order}</span>
                <div className="flex-1">
                  <p className="font-body text-[13px] text-dh-text-mid font-light">{win.task}</p>
                  <p className="font-body text-[11px] text-dh-text-light font-light mt-1">{win.time} • {win.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room 10 - 90-Day */}
        <div data-room-id="r10" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">10 — The 90-Day Room<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">Three months. That's all it takes to go from zero to a real, running business — if you focus on the right things at the right time.</p>
          {(() => {
            const targets = getMonthlyRevenueTargets(answers.budget || '', product);
            return [
              ['MONTH 1 — Foundation', monthPlans.foundation, targets.month1, 1],
              ['MONTH 2 — Traction', monthPlans.traction, targets.month2, 2],
              ['MONTH 3 — Scale', monthPlans.scale, targets.month3, 3],
            ].map(([phase, text, revenue, month]: any) => (
              <div key={month} className="mb-5">
                <div className="flex gap-3.5 items-start p-[18px_20px] rounded-xl mb-2.5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                  <span className="font-ui text-[7px] tracking-[2px] uppercase py-1 px-2.5 flex-shrink-0 mt-[3px] rounded font-medium whitespace-nowrap" style={{ color: 'var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>{phase}</span>
                  <div className="flex-1">
                    <p className="font-body text-sm leading-[1.9] text-dh-text-mid font-light">{text}</p>
                    <p className="font-ui text-[9px] tracking-[2px] uppercase mt-2 font-medium" style={{ color: 'var(--dh-accent)' }}>Revenue Target: {revenue}</p>
                  </div>
                </div>
                {/* Month-specific decision tree */}
                <div className="p-3.5 rounded-xl ml-0 flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.03)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
                  <span className="font-ui text-[7px] tracking-[2px] uppercase py-1 px-2 flex-shrink-0 rounded font-medium" style={{ color: 'var(--dh-accent-dark)', background: 'rgba(var(--dh-accent-rgb), 0.08)' }}>CHECK-IN</span>
                  <p className="font-body text-[12px] leading-[1.7] text-dh-text-light font-light whitespace-pre-line">{getMonthlyDecisionTree(month)}</p>
                </div>
              </div>
            ));
          })()}
          {(bp?.ninetyDayGoal || monthPlans.scale) && (
            <div className="mt-6 p-5 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', borderLeft: '3px solid var(--dh-accent)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Your 90-Day Goal</p>
              <p className="font-body text-sm text-dh-text-mid font-light leading-7">{bp?.ninetyDayGoal || `By the end of month 3, your goal is: ${monthPlans.scale.split(' ').slice(0, 15).join(' ')}...`}</p>
            </div>
          )}
          <div className="mt-5 p-5 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">Weekly Scoreboard</p>
            <div className="grid gap-2.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
              {[
                ['Offers sent', '5+ / week'],
                ['Posts published', answers.time === 'Under 5 hours' ? '3 / week' : '5+ / week'],
                ['Conversations started', '10 / week'],
                ['Proof collected', '1 / week'],
              ].map(([label, target]) => (
                <div key={label} className="p-3.5 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.18)' }}>
                  <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark mb-1 font-medium">{label}</p>
                  <p className="font-display italic text-[17px]" style={{ color: 'var(--dh-text)' }}>{target}</p>
                </div>
              ))}
            </div>
            <p className="font-body text-[12px] leading-[1.8] text-dh-text-light font-light mt-3">Track actions before emotions. If these numbers are happening every week, the business is moving even before the sales feel consistent.</p>
          </div>
        </div>

        {/* Room 11 - Business Plan */}
        <div data-room-id="r11" className="dh-reveal">
          <BusinessPlanRoom aiResults={aiResults} displayName={displayName} mission={mission} answers={answers} />
        </div>

        {/* Room 12 - Branding */}
        <div data-room-id="r12" className="dh-reveal">
          <BrandingRoom aiResults={aiResults} brandId={brandId} product={product} customer={customer} aesthetic={aesthetic} brand={brand} priceHint={aiResults?.startingPrice || priceHint} firstPlatform={firstPlatform} />
        </div>

        {/* Execution Kit divider */}
        <div className="flex items-center gap-4 my-10">
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
          <p className="font-ui text-[9px] tracking-[5px] uppercase text-dh-text-light font-medium whitespace-nowrap">Your Launch Kit</p>
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
        </div>

        {/* Room 13 - First 48 Hours */}
        <div data-room-id="r13" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">13 — The First 48 Hours<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">This is the shortest path from "I have a plan" to "I am open for sales." Follow the schedule in order before adding anything new.</p>
          <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.055)', borderLeft: '3px solid var(--dh-accent)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">Customized Starting Point</p>
            <p className="font-body text-[13px] leading-[1.8] text-dh-text-mid font-light">{setupStageNote}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ['Day 1 — Open The Door', first48.day1],
              ['Day 2 — Ask For The Sale', first48.day2],
            ].map(([title, tasks]) => (
              <div key={title as string} className="p-5 rounded-2xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.055)', border: '1px solid rgba(var(--dh-accent-rgb), 0.24)' }}>
                <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">{title as string}</p>
                <div className="space-y-2.5">
                  {(tasks as string[]).map((task, i) => (
                    <div key={i} className="flex gap-3 items-start pb-2.5 last:pb-0" style={{ borderBottom: i < (tasks as string[]).length - 1 ? '1px solid rgba(var(--dh-accent-rgb), 0.14)' : 'none' }}>
                      <span className="font-ui text-[8px] tracking-[2px] uppercase py-1 px-2 rounded-md flex-shrink-0" style={{ background: 'rgba(var(--dh-accent-rgb), 0.09)', color: 'var(--dh-accent-dark)' }}>{String(i + 1).padStart(2, '0')}</span>
                      <p className="font-body text-[12px] leading-[1.75] text-dh-text-mid font-light">{task.replaceAll('[product]', product).replaceAll('[product name]', product)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room 14 - Sales Page Builder */}
        <div data-room-id="r14" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <FileText size={18} className="text-dh-accent-dark" />
            </div>
            <div>
              <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-1.5 font-medium">14 — Sales Page Builder</p>
              <p className="font-display italic text-[17px] leading-[1.75] text-dh-text-mid">Copy this into Stan Store, Etsy, Gumroad, Shopify, or your booking page. It gives buyers enough clarity to trust the checkout button.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3.5 mb-5">
            {[
              ['Hero headline', `${product} for ${customer.toLowerCase()} who want ${aesthetic.toLowerCase()} results without overthinking the next step.`],
              ['Short description', `${product} helps ${customer.toLowerCase()} get a clear, useful result with a buying experience that feels simple, trustworthy, and worth paying for.`],
              ['What they get', beginnerOffer.deliverable],
              ['Buyer reassurance', beginnerOffer.guarantee],
            ].map(([label, text]) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.22)' }}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{label}</p>
                  <button onClick={() => copyScript(text)} className="p-1.5 rounded-lg cursor-pointer" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.18)' }} title="Copy">
                    <Copy size={12} style={{ color: 'var(--dh-accent-dark)' }} />
                  </button>
                </div>
                <p className="font-body text-[13px] leading-[1.75] text-dh-text-mid font-light">{text}</p>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.045)', borderLeft: '3px solid var(--dh-accent)' }}>
            <div className="flex items-center justify-between gap-4 mb-3">
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium">Full Sales Page Outline</p>
              <button onClick={() => copyScript(salesPageOutline)} className="inline-flex items-center gap-2 py-2 px-3 rounded-full font-ui text-[8px] tracking-[2px] uppercase cursor-pointer" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.24)', color: 'var(--dh-accent-dark)' }}>
                <Copy size={12} /> Copy
              </button>
            </div>
            <p className="font-body text-[12px] leading-[1.85] text-dh-text-mid font-light whitespace-pre-line">{salesPageOutline}</p>
          </div>
        </div>

        {/* Room 15 - Launch Asset Pack */}
        <div data-room-id="r15" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-3.5 font-medium flex items-center gap-3">15 — Launch Asset Pack<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} /></p>
          <p className="font-display italic text-[17px] leading-[1.85] text-dh-text-mid mb-5">Use these when you are too tired to write from scratch. Your job is to customize the brackets, post, and send.</p>
          <div className="grid md:grid-cols-2 gap-3.5 mb-5">
            {launchAssets.map(asset => (
              <div key={asset.title} className="p-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.055)', border: '1px solid rgba(var(--dh-accent-rgb), 0.24)' }}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{asset.title}</p>
                  <button onClick={() => copyScript(asset.body)} className="p-1.5 rounded-lg cursor-pointer" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.18)' }} title="Copy">
                    <Copy size={12} style={{ color: 'var(--dh-accent-dark)' }} />
                  </button>
                </div>
                <p className="font-body text-[12px] leading-[1.75] text-dh-text-mid font-light whitespace-pre-line">{asset.body}</p>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.045)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">5 Short-Form Hooks</p>
            <div className="space-y-2">
              {launchHooks.map((hook, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="font-ui text-[8px] tracking-[2px] uppercase py-1 px-2 rounded-md flex-shrink-0" style={{ background: 'rgba(var(--dh-accent-rgb), 0.09)', color: 'var(--dh-accent-dark)' }}>{i + 1}</span>
                  <p className="font-body text-[13px] leading-[1.7] text-dh-text-mid font-light">{hook}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room 16 - Launch Tracker */}
        <div data-room-id="r16" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <ListChecks size={19} className="text-dh-accent-dark" />
            </div>
            <div>
              <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-1.5 font-medium">16 — Beginner Launch Tracker</p>
              <p className="font-display italic text-[17px] leading-[1.75] text-dh-text-mid">{completedLaunchSteps} of {progressItems.length} launch actions complete. Track actions before emotions.</p>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.12)' }}>
            <div className="h-full transition-all duration-500" style={{ width: `${(completedLaunchSteps / progressItems.length) * 100}%`, background: 'var(--dh-accent-dark)' }} />
          </div>
          <div className="grid md:grid-cols-2 gap-2.5">
            {progressItems.map((item, i) => {
              const checked = Boolean(checkedLaunchSteps[item]);
              return (
                <div
                  key={item}
                  onClick={() => {
                    playClick('soft');
                    setCheckedLaunchSteps(prev => ({ ...prev, [item]: !prev[item] }));
                  }}
                  className="p-4 rounded-xl cursor-pointer transition-all"
                  style={{ background: checked ? 'rgba(var(--dh-accent-rgb), 0.12)' : 'rgba(var(--dh-accent-rgb), 0.045)', border: `1px solid ${checked ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb), 0.22)'}` }}
                >
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 size={17} className="flex-shrink-0 mt-0.5" style={{ color: checked ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb), 0.35)' }} />
                    <div>
                      <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark mb-1 font-medium">Step {String(i + 1).padStart(2, '0')}</p>
                      <p className="font-body text-[13px] leading-[1.65] text-dh-text-mid font-light">{item}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room 17 - No Sales Troubleshooter */}
        <div data-room-id="r17" className="dh-reveal glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <Search size={18} className="text-dh-accent-dark" />
            </div>
            <div>
              <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-1.5 font-medium">17 — If Sales Do Not Come Yet</p>
              <p className="font-display italic text-[17px] leading-[1.75] text-dh-text-mid">No sales is not a verdict. It is feedback. Use this room to diagnose the bottleneck and fix the next smallest thing.</p>
            </div>
          </div>
          <div className="p-5 rounded-2xl mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', borderLeft: '3px solid var(--dh-accent)' }}>
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Your Reality Check — {executionContent.realityCheck.trapName}</p>
            <p className="font-body text-[12px] leading-[1.85] text-dh-text-mid font-light whitespace-pre-line">{executionContent.realityCheck.content.replaceAll('[product]', product)}</p>
          </div>
          <div className="space-y-3">
            {noSalesDiagnostics.map(([symptom, fix]) => (
              <div key={symptom} className="p-4 rounded-xl flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.045)', border: '1px solid rgba(var(--dh-accent-rgb), 0.22)' }}>
                <AlertCircle size={15} className="text-dh-accent-dark flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark mb-1 font-medium">{symptom}</p>
                  <p className="font-body text-[13px] leading-[1.75] text-dh-text-mid font-light">{fix}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-5 rounded-2xl text-center" style={{ background: 'linear-gradient(160deg, #1e0f09 0%, #2d1810 52%, #1a0e08 100%)', border: '1px solid rgba(196,168,154,0.18)' }}>
            <p className="font-ui text-[8px] tracking-[4px] uppercase mb-2 font-medium" style={{ color: 'rgba(196,168,154,0.48)' }}>Your Next Move</p>
            <p className="font-display italic text-[20px] leading-[1.45]" style={{ color: 'rgba(255,255,255,0.92)' }}>Do not rebuild the whole business. Fix one bottleneck, then ask for the sale again.</p>
          </div>
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
          {/* Blueprint value bar */}
          <div className="flex items-center justify-center gap-0 mb-10 py-5 rounded-2xl dh-premium-panel">
            {[
              { val: '17', label: 'Blueprint Rooms' },
              { val: '19', label: 'Quiz Signals' },
              { val: 'Copy', label: 'Portable File' },
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
              <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] mt-5 mb-3.5">Your answers to 19 questions were processed to generate a personalised business blueprint across 17 rooms — your platforms, product, pricing, social strategy, first sale plan, branding, marketing, 90-day roadmap, and execution kit.</p>
              <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] mb-5">Everything here is built specifically for <em>{name}</em> — your offer details, current stage, success goal, aesthetic, time, budget, customer, and selling style. No two blueprints are the same.</p>
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
        <div className="relative rounded-3xl overflow-hidden mb-7 dh-premium-panel" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.44), rgba(var(--dh-accent-rgb),0.08))', border: '1px solid rgba(var(--dh-accent-rgb), 0.24)' }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(var(--dh-accent-rgb),0.55), transparent)' }} />
          <div className="p-[44px_36px] text-center">
            <p className="font-ui text-[8px] tracking-[6px] uppercase text-dh-accent-dark mb-3 font-medium">Founder Next Steps</p>
            <p className="font-display italic text-[30px] text-center mb-3 leading-[1.15]" style={{ color: 'var(--dh-text)' }}>
              Shop the Collection
            </p>
            <p className="font-body text-[13px] text-dh-text-light font-light text-center max-w-[560px] mx-auto leading-[1.9]">
              Your blueprint is complete. These are optional upgrades for founders who want templates, prompts, or done-for-you polish after they choose their first move.
            </p>
          </div>
        </div>

        {/* Boutique Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          {[
            { name: 'Brand Workbook', tag: 'Build It Yourself', desc: 'An interactive web app walking you through every foundational business decision.', price: '$47', was: '$261', href: 'https://stan.store/shopdollhouse/p/-build-a-real-brand-from-scratch', icon: 'book' },
            { name: 'AI Prompt Kit', tag: '50+ Prompts', desc: 'Copy, content, strategy — prompts across 8 rooms, ready to customise and use instantly.', price: '$17', was: '', href: 'https://stan.store/shopdollhouse/p/the-dollhouse-prompt-kit', icon: 'layers' },
          ].map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noreferrer"
              className="no-underline rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_56px_rgba(0,0,0,0.14)] flex flex-col group dh-premium-panel"
              style={{ background: i === 0 ? 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(243,220,205,0.2))' : 'linear-gradient(145deg, rgba(255,255,255,0.42), rgba(200,168,119,0.12))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(196,168,154,0.24)' }}>
              <div className="p-7 flex flex-col items-start text-left flex-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)', border: '1px solid rgba(196,168,154,0.2)' }}>
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
                <span className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full font-ui text-[8px] tracking-[3px] uppercase font-medium transition-all duration-300 group-hover:shadow-[0_4px_24px_rgba(var(--dh-accent-rgb),0.25)]"
                  style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', border: '1px solid rgba(196,168,154,0.2)' }}>
                  Explore →
                </span>
              </div>
            </a>
          ))
          }</div>

        {/* Premium Done-For-You */}
        <div className="grid gap-5 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
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
        <div id="dh-download-section">
          <div className="dh-no-print rounded-3xl p-9 text-center mb-7 glass relative overflow-hidden">
            <div className="absolute top-0 left-[14%] right-[14%] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(var(--dh-accent-rgb),0.42), transparent)' }} />
            <Download size={22} className="mx-auto mb-4 text-dh-accent-dark" />
            <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-2 font-semibold">Export Suite</p>
            <p className="font-display italic text-[22px] text-dh mb-3">Download the whole blueprint, your notes file, or your certificate.</p>
            <p className="font-body text-[13px] leading-[1.8] text-dh-text-light max-w-[520px] mx-auto">
              Your work should never live only in a browser tab. Save the polished PDF, keep a Markdown backup, copy the portable version, or download a share-ready completion certificate.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                [Download, 'Download PDF', 'Complete visual blueprint', downloadPDF],
                [FileText, 'Markdown File', 'Portable editable backup', downloadMarkdown],
                [Copy, 'Copy to Notes', 'Paste anywhere instantly', copyPortableBlueprint],
                [ImageIcon, 'Certificate PNG', 'Share your completion', downloadCertificatePNG],
              ].map(([Icon, title, desc, action]) => {
                const TileIcon = Icon as typeof Download;
                return (
                  <button key={title as string} onClick={action as () => void} className="rounded-2xl p-4 text-left cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: 'rgba(var(--dh-accent-rgb),0.07)', border: '1px solid rgba(var(--dh-accent-rgb),0.23)' }}>
                    <TileIcon size={16} className="text-dh-accent-dark mb-3" />
                    <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{title as string}</p>
                    <p className="font-body text-[11px] text-dh-text-light mt-1">{desc as string}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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
      <footer className="w-full py-[72px_20px] text-center mt-8" style={{ borderTop: '1px solid rgba(var(--dh-accent-rgb), 0.25)', background: 'linear-gradient(180deg, transparent, rgba(var(--dh-accent-rgb), 0.07))' }}>
        <div className="max-w-[820px] mx-auto px-5">
          <div className="rounded-3xl p-[44px_36px] mb-6 dh-premium-panel" style={{ background: 'rgba(255,255,255,0.28)', border: '1px solid rgba(var(--dh-accent-rgb),0.22)' }}>
            <div className="animate-float-arch inline-block mb-4 mx-auto"><DollhouseMark size={42} /></div>
            <p className="font-ui text-[8px] tracking-[5px] uppercase text-dh-accent-dark mb-2 font-medium">The Dollhouse</p>
            <p className="font-display italic text-[28px] leading-[1.15] mb-3" style={{ color: 'var(--dh-text)' }}>Business tools for beautiful brands.</p>
            <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] max-w-[540px] mx-auto">Apps, templates, and brand systems for founders who want their business to feel intentional from the first sale.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* Official Website Card */}
            <div className="p-6 rounded-2xl text-left dh-premium-panel transition-transform hover:-translate-y-1" style={{ background: 'rgba(243, 220, 205, 0.12)', border: '1px solid rgba(243, 220, 205, 0.25)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0" style={{ background: 'rgba(243, 220, 205, 0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(243, 220, 205)" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3 className="font-display text-[16px] text-dh-text mb-1">Official Website</h3>
              <p className="font-body text-[12px] text-dh-text-light mb-4">Explore the full brand</p>
              <p className="font-body text-[12px] text-dh-text-mid leading-[1.6] mb-4">Discover all Dollhouse products & digital tools</p>
              <a href="https://shopdollhouse.co" target="_blank" rel="noreferrer" className="font-ui text-[10px] tracking-[2px] uppercase text-dh-accent-dark no-underline font-medium inline-flex items-center gap-1.5">Learn more <span>→</span></a>
            </div>

            {/* Etsy Shop Card */}
            <div className="p-6 rounded-2xl text-left dh-premium-panel transition-transform hover:-translate-y-1" style={{ background: 'rgba(200, 168, 119, 0.12)', border: '1px solid rgba(200, 168, 119, 0.25)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0" style={{ background: 'rgba(200, 168, 119, 0.3)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(200, 168, 119)" strokeWidth="2" strokeLinecap="round"><path d="M6 9h12M6 9v8c0 1 .5 2 1.5 2h7c1 0 1.5-1 1.5-2V9M9 5h6v4H9z"/></svg>
              </div>
              <h3 className="font-display text-[16px] text-dh-text mb-1">Etsy Shop</h3>
              <p className="font-body text-[12px] text-dh-text-light mb-4">Interactive apps & resources</p>
              <p className="font-body text-[12px] text-dh-text-mid leading-[1.6] mb-4">Digital templates, checklists & planning tools</p>
              <a href="https://www.etsy.com/shop/herDOLLHOUSE" target="_blank" rel="noreferrer" className="font-ui text-[10px] tracking-[2px] uppercase text-dh-accent-dark no-underline font-medium inline-flex items-center gap-1.5">Learn more <span>→</span></a>
            </div>

            {/* Stan Store Card */}
            <div className="p-6 rounded-2xl text-left dh-premium-panel transition-transform hover:-translate-y-1" style={{ background: 'rgba(196, 168, 154, 0.12)', border: '1px solid rgba(196, 168, 154, 0.25)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto md:mx-0" style={{ background: 'rgba(196, 168, 154, 0.3)' }}>
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

          <p className="font-body text-[11px] text-dh-text-light font-light opacity-45 cursor-default select-none">© 2026 The Dollhouse · <a href="https://shopdollhouse.co" target="_blank" rel="noreferrer" className="text-dh-accent-dark no-underline">shopdollhouse.co</a></p>
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

      <div className="fixed left-[-9999px] top-0 pointer-events-none" aria-hidden="true">
        <div
          id="dh-certificate-png-source"
          className="relative overflow-hidden"
          style={{
            width: 1400,
            height: 1000,
            backgroundColor: '#f8e3dc',
            backgroundImage: `url(${dollhouseCoverBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            borderRadius: 34,
            border: '1px solid rgba(195,153,98,0.42)',
            color: '#9c6b3d',
          }}
        >
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(255,246,240,0.02) 0%, rgba(255,246,240,0.10) 42%, rgba(255,246,240,0.68) 66%, rgba(255,246,240,0.92) 100%)' }} />
          <div className="absolute inset-8 rounded-[28px]" style={{ border: '1px solid rgba(196,151,91,0.38)' }} />
          <div className="absolute right-[90px] top-[90px] w-[560px] text-center">
            <div className="mb-8 flex justify-center"><DollhouseMark size={54} /></div>
            <p className="font-ui text-[14px] tracking-[8px] uppercase font-semibold mb-8">The Dollhouse</p>
            <p className="font-ui text-[12px] tracking-[5px] uppercase font-semibold mb-5">Certificate of Completion</p>
            <p className="font-display italic text-[34px] leading-none mb-4" style={{ color: '#ba7d78' }}>awarded to</p>
            <p className="font-display italic leading-none mb-8" style={{ color: '#b96d67', fontSize: 92 }}>{displayName}</p>
            <p className="font-display italic text-[30px] leading-[1.5] mb-8" style={{ color: 'rgba(156,95,88,0.82)' }}>for completing a private 19-question brand blueprint for {brand || strategicPlaceholder('brand')}.</p>
            <div className="grid grid-cols-2 gap-4 mb-10">
              {[aesthetic, product, '17 Rooms Complete', new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })].map(item => (
                <div key={item} className="rounded-full px-5 py-4 font-ui text-[11px] tracking-[4px] uppercase font-semibold" style={{ border: '2px solid rgba(190,145,88,0.62)' }}>{item}</div>
              ))}
            </div>
            <p className="font-ui text-[12px] tracking-[5px] uppercase font-semibold">Built With The Dollhouse Brand Studio</p>
            <p className="font-ui text-[11px] tracking-[3px] uppercase font-semibold mt-4">@thedollhouse_studio | shopdollhouse.co</p>
          </div>
        </div>
      </div>

      {/* Success Screen Overlay */}
      {showSuccessScreen && (
        <>
          <div className="fixed inset-0 z-[999] bg-black/40" onClick={() => setShowSuccessScreen(false)} />
          <div className="fixed inset-0 z-[1000] pointer-events-none">
            <div className="pointer-events-auto" onClick={e => e.stopPropagation()}>
              <SuccessScreen onClose={() => setShowSuccessScreen(false)} />
            </div>
          </div>
        </>
      )}
      {/* ShortcutBar removed */}
    </div>
  );
}
