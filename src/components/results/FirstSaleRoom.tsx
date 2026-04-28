import { AIResults } from '@/context/QuizContext';
import { Shield, Lock, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { playClick } from '@/lib/sounds';
import { derive, getPrioritizedQuickWins } from '@/lib/quiz-helpers';

interface FirstSaleRoomProps {
  answers: Record<string, string>;
  aiResults: AIResults | null;
  topPlatforms: string[];
  social: string[];
  displayName: string;
}

export default function FirstSaleRoom({ answers, aiResults, topPlatforms, social, displayName }: FirstSaleRoomProps) {
  const fs = aiResults?.firstSale;
  const product = answers.product || 'your product';
  const vibe = answers.vibe || '';
  const urgency = answers.urgency || '';
  const blocker = answers.blocker || '';
  const d = derive(answers);
  const weekOnePlan = fs?.weekOnePlan || d.w1Static;
  const weekTwoPlan = fs?.weekTwoPlan || d.w2Static;
  const todayAction = fs?.todayAction || d.todayAction;
  const quickWins = getPrioritizedQuickWins(topPlatforms, social, answers.budget || '');

  // ── 4 Distinct Blocker Plans ──
  const blockerPlans: Record<string, { title: string; icon: string; note: string }> = {
    'Not sure what to make or sell': {
      title: 'Clarity Plan',
      icon: '🔍',
      note: `This blueprint has made that decision for you. Based on everything you told us, ${product} is your strongest starting point. You don't need more ideas — you need one clear path, and this is it. Stop researching. Start building.`,
    },
    "Don't know how to market": {
      title: 'Visibility Plan',
      icon: '📣',
      note: `Marketing is just showing up consistently in the right place. Your place is ${social[0]}. Your format is authenticity. This blueprint gives you exactly where, when, and what to post. Follow the 3-post rotation below and you'll never stare at a blank screen again.`,
    },
    'Scared nobody will buy': {
      title: 'Trust Plan',
      icon: '🤝',
      note: `That fear is normal — and it's wrong. Your first sale won't come from strangers. It'll come from someone who already knows and likes you. The script below is designed to convert warm contacts into real buyers. One honest message to one real person. That's all it takes.`,
    },
    'I just need to start': {
      title: 'Action Plan',
      icon: '⚡',
      note: `Then start with the single action below. Not tomorrow — today. The blueprint doesn't work sitting in a tab. It works when you pick one thing and do it. Your only job right now is to open ${topPlatforms[0]} and create your account. Everything else follows.`,
    },
  };

  const chosenPlan = blockerPlans[blocker] || blockerPlans['I just need to start'];

  const promise = fs?.promise || `${displayName}, your first sale is closer than you think — ${urgency === 'This week' ? 'and it can happen this week if you start today' : 'start now and the momentum will build faster than you expect'}.`;

  // ── Personalized First Message by Business Type ──
  const personalizedScript = (() => {
    if (fs?.firstClientScript) return fs.firstClientScript;
    if (vibe === 'Digital products') {
      return `Hey [Name]! I've just launched something I've been working on — ${product}. It's instant access, no shipping, no waiting — you can start using it the moment you grab it. I thought of you because [reason]. Here's the link: [link]. Would love to know what you think! ♥`;
    }
    if (vibe === 'Service / Events') {
      return `Hey [Name]! I've just launched ${product} and I'm taking on a small number of clients to start. Every detail is handled from start to finish — I'd love to work with you. Would you be open to a quick chat this week? No pressure at all. ♥`;
    }
    if (vibe === 'Handmade / Physical') {
      return `Hey [Name]! I've just opened my little shop — I'm selling ${product}, all handmade with real care. Each one is crafted individually, not mass-produced. I thought of you because [reason]. Here's the link: [link]. Even just sharing it would mean the world! ♥`;
    }
    return `Hey [Name]! I've just launched ${product} and would love your support. I hand-pick every item for quality — nothing generic, nothing filler. Here's the link: [link]. ♥`;
  })();

  const objectionReplies = [
    {
      q: 'I need to think about it.',
      a: `Of course. The simplest way to decide is this: if ${product} would save you time, make something easier, or feel genuinely useful right now, it's worth grabbing. If not, no pressure at all.`,
    },
    {
      q: 'How much is it?',
      a: `It starts at [price]. I made it intentionally simple for the first launch, so you can try ${product} without a big commitment.`,
    },
    {
      q: 'What do I get?',
      a: vibe === 'Service / Events'
        ? `You get [deliverable], [timeline], and clear communication from booking to delivery. I handle the details so you are not guessing.`
        : `You get ${product}, clear instructions or care details, and support if you have a question after buying.`,
    },
  ];

  return (
    <div className="rounded-3xl p-[60px_56px] mb-7 relative overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.18)]"
      style={{ background: 'var(--dh-dark-bg)' }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, transparent, var(--dh-accent), transparent)' }} />

      <div className="flex items-start gap-[18px] mb-9 pb-7" style={{ borderBottom: '1px solid rgba(196,168,154,0.12)' }}>
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
          style={{ border: '1px solid rgba(196,168,154,0.18)', background: 'rgba(196,168,154,0.06)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(196,168,154,0.7)" strokeWidth="1.6" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div>
          <p className="font-ui text-[10px] tracking-[4px] uppercase mb-1.5 font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>06</p>
          <p className="font-display italic text-xl" style={{ color: '#F5EAE0' }}>Your First Sale</p>
          <p className="font-body text-[13px] font-light" style={{ color: 'rgba(196,168,154,0.55)' }}>The promise. The plan. The moment.</p>
        </div>
      </div>

      {/* Promise */}
      <div className="p-7 rounded-2xl mb-7" style={{ background: 'rgba(196,168,154,0.07)', border: '1px solid rgba(196,168,154,0.14)' }}>
        <p className="font-display italic text-xl leading-[1.85]" style={{ color: '#F5EAE0' }}>"{promise}"</p>
      </div>

      {/* Blocker Plan — detailed */}
      <div className="p-6 rounded-[14px] mb-7" style={{ background: 'rgba(196,168,154,0.06)', border: '1px solid rgba(196,168,154,0.12)' }}>
        <div className="flex items-center gap-2.5 mb-3">
          <span className="text-base">{chosenPlan.icon}</span>
          <p className="font-ui text-[9px] tracking-[3px] uppercase font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>Your {chosenPlan.title}</p>
        </div>
        <p className="font-body text-sm leading-[1.85] font-light" style={{ color: 'rgba(255,255,255,0.75)' }}>{chosenPlan.note}</p>
      </div>

      {/* Today Action */}
      <div className="mb-7">
        <p className="font-ui text-[10px] tracking-[4px] uppercase mb-4 font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>DO THIS TODAY</p>
        <div className="flex gap-5 items-start p-[18px_20px] rounded-[10px]" style={{ background: 'rgba(196,168,154,0.05)', border: '1px solid rgba(196,168,154,0.1)' }}>
          <span className="font-ui text-[8px] tracking-[3px] uppercase py-[5px] px-2.5 flex-shrink-0 mt-[3px] rounded font-medium"
            style={{ color: 'var(--dh-accent)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>NOW</span>
          <p className="font-body text-[15px] leading-[1.9] font-light" style={{ color: '#F5EAE0' }}>
            {todayAction}
          </p>
        </div>
      </div>

      {/* First sale math */}
      <div className="grid md:grid-cols-3 gap-3 mb-7">
        {[
          ['Warm messages', '5 today', 'Personal notes to people who already trust you.'],
          ['Follow-ups', '2 days later', 'Most beginner sales happen in the follow-up, not the first message.'],
          ['Proof target', '1 review', 'One screenshot or testimonial becomes your first marketing asset.'],
        ].map(([label, value, note]) => (
          <div key={label} className="p-4 rounded-[12px]" style={{ background: 'rgba(196,168,154,0.05)', border: '1px solid rgba(196,168,154,0.1)' }}>
            <p className="font-ui text-[8px] tracking-[3px] uppercase mb-1.5" style={{ color: 'rgba(196,168,154,0.45)' }}>{label}</p>
            <p className="font-display italic text-[20px] mb-1" style={{ color: '#F5EAE0' }}>{value}</p>
            <p className="font-body text-[11px] leading-[1.6] font-light" style={{ color: 'rgba(245,234,224,0.62)' }}>{note}</p>
          </div>
        ))}
      </div>

      {/* Week plans */}
      {['weekOnePlan', 'weekTwoPlan'].map((key, i) => (
        <div key={key} className="mb-6">
          <p className="font-ui text-[10px] tracking-[4px] uppercase mb-3.5 font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>
            {i === 0 ? 'WEEK ONE — DAYS 1–7' : 'WEEK TWO — DAYS 8–14'}
          </p>
          <p className="font-body text-sm leading-8 whitespace-pre-line font-light" style={{ color: 'rgba(245,234,224,0.85)' }}>
            {i === 0 ? weekOnePlan : weekTwoPlan}
          </p>
        </div>
      ))}

      {/* Personalized first message */}
      <div className="h-px mb-6" style={{ background: 'rgba(196,168,154,0.1)' }} />
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="font-ui text-[10px] tracking-[4px] uppercase font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>YOUR FIRST MESSAGE — COPY & USE NOW</p>
          <button onClick={() => { navigator.clipboard?.writeText(personalizedScript); playClick('soft'); toast('Script copied to your brand board!', { duration: 2000 }); }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'rgba(196,168,154,0.1)', border: '1px solid rgba(196,168,154,0.15)' }}>
            <Copy size={11} style={{ color: 'rgba(196,168,154,0.6)' }} />
            <span className="font-ui text-[8px] tracking-[2px] uppercase font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>Copy</span>
          </button>
        </div>
        <div className="p-5 rounded-[10px]" style={{ background: 'rgba(196,168,154,0.06)', border: '1px solid rgba(196,168,154,0.12)' }}>
          <p className="font-body text-[15px] leading-[1.85] font-light" style={{ color: '#F5EAE0' }}>{personalizedScript}</p>
        </div>
        <p className="font-body text-xs italic font-light mt-2.5" style={{ color: 'rgba(196,168,154,0.4)' }}>
          Send this to 5 real people today. Not a broadcast — individual messages.
        </p>
      </div>

      {/* Objection replies */}
      <div className="mb-7">
        <p className="font-ui text-[10px] tracking-[4px] uppercase mb-3 font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>IF THEY REPLY — SAY THIS</p>
        {objectionReplies.map(({ q, a }) => (
          <div key={q} className="p-4 rounded-[10px] mb-2.5" style={{ background: 'rgba(196,168,154,0.045)', border: '1px solid rgba(196,168,154,0.1)' }}>
            <p className="font-ui text-[8px] tracking-[2px] uppercase mb-1.5" style={{ color: 'rgba(196,168,154,0.45)' }}>{q}</p>
            <p className="font-body text-[13px] leading-[1.75] font-light" style={{ color: 'rgba(245,234,224,0.84)' }}>{a}</p>
          </div>
        ))}
      </div>

      {/* Fastest route */}
      <div className="mb-7">
        <p className="font-ui text-[10px] tracking-[4px] uppercase mb-3 font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>FASTEST ROUTE TO CASH</p>
        {quickWins.slice(0, 3).map(win => (
          <div key={win.order} className="flex gap-3 items-start p-3.5 rounded-[10px] mb-2" style={{ background: 'rgba(196,168,154,0.04)', border: '1px solid rgba(196,168,154,0.09)' }}>
            <span className="font-ui text-[8px] tracking-[2px] uppercase py-1 px-2 rounded flex-shrink-0" style={{ color: 'var(--dh-accent)', background: 'rgba(255,255,255,0.06)' }}>#{win.order}</span>
            <div>
              <p className="font-body text-[13px] leading-[1.7] font-light" style={{ color: '#F5EAE0' }}>{win.task}</p>
              <p className="font-body text-[11px] mt-0.5 font-light" style={{ color: 'rgba(196,168,154,0.45)' }}>{win.time} · {win.impact}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Legal disclaimer inside dark room */}
      <div className="mt-8 pt-6" style={{ borderTop: '1px solid rgba(196,168,154,0.1)' }}>
        <div className="flex items-center gap-2.5 mb-3">
          <Lock size={14} className="flex-shrink-0" style={{ color: 'rgba(196,168,154,0.45)' }} />
          <p className="font-ui text-[9px] tracking-[3px] uppercase font-medium" style={{ color: 'rgba(196,168,154,0.45)' }}>Licensed to {displayName}</p>
        </div>
        <div className="flex items-start gap-2.5 p-4 rounded-xl" style={{ background: 'rgba(196,168,154,0.04)', border: '1px solid rgba(196,168,154,0.08)' }}>
          <Shield size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'rgba(196,168,154,0.35)' }} />
          <p className="font-body text-[11px] font-light leading-[1.7]" style={{ color: 'rgba(196,168,154,0.4)' }}>
            This blueprint is a personalised document licensed exclusively to {displayName} for personal use. No resale, redistribution, or reproduction permitted. © 2026 The Dollhouse.
          </p>
        </div>
      </div>
    </div>
  );
}
