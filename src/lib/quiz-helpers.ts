import { getBrandIdentity } from './brand-identity';

// ── Sanitize user input ──
export function sanitize(str: string): string {
  if (!str) return '';
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

// ── Safe JSON parsing with repair ──
export function safeJSON(raw: string): any {
  const normalize = (s: string) => s.replace(/[\u0000-\u001F\u007F]/g, (c: string) => c === '\n' ? '\\n' : c === '\r' ? '\\r' : c === '\t' ? '\\t' : '');
  const trimTail = (s: string) => {
    let j = s.trimEnd();
    j = j.replace(/[\\]+$/, '');
    j = j.replace(/,\s*$/, '');
    j = j.replace(/:\s*$/, '');
    j = j.replace(/,\s*"[^"\\]*"?\s*:?\s*$/, '');
    return j;
  };
  const balance = (input: string) => {
    let out = '', inStr = false, escaped = false;
    const stack: string[] = [];
    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      if (inStr) {
        if (escaped) { out += ch; escaped = false; continue; }
        if (ch === '\\') { out += ch; escaped = true; continue; }
        if (ch === '"') { out += ch; inStr = false; continue; }
        if (ch === '\n') { out += '\\n'; continue; }
        if (ch === '\r') { out += '\\r'; continue; }
        if (ch === '\t') { out += '\\t'; continue; }
        out += ch; continue;
      }
      if (ch === '"') { inStr = true; out += ch; continue; }
      if (ch === '{' || ch === '[') { stack.push(ch); out += ch; continue; }
      if (ch === '}') { if (stack[stack.length - 1] === '{') { stack.pop(); out += ch; } continue; }
      if (ch === ']') { if (stack[stack.length - 1] === '[') { stack.pop(); out += ch; } continue; }
      out += ch;
    }
    if (inStr) out += '"';
    out = out.replace(/,\s*$/, '').replace(/:\s*$/, '');
    while (stack.length) { const o = stack.pop(); out += o === '{' ? '}' : ']'; }
    return out;
  };

  let cleaned = normalize(raw);
  const start = cleaned.search(/[\[{]/);
  if (start === -1) throw new Error('No JSON in response');
  cleaned = cleaned.slice(start);
  const rootOpen = cleaned[0], rootClose = rootOpen === '[' ? ']' : '}';
  let depth = 0, end = -1, inStr = false, escaped = false;
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (inStr) { if (escaped) { escaped = false; continue; } if (ch === '\\') { escaped = true; continue; } if (ch === '"') inStr = false; continue; }
    if (ch === '"') { inStr = true; continue; }
    if (ch === rootOpen) depth++;
    if (ch === rootClose) { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end !== -1) cleaned = cleaned.slice(0, end + 1);
  let candidate = balance(trimTail(cleaned));
  for (let attempt = 0; attempt < 8; attempt++) {
    try { return JSON.parse(candidate); } catch (err: any) {
      const msg = err?.message || '';
      const pos = parseInt((msg.match(/position\s+(\d+)/i) || msg.match(/column\s+(\d+)/i) || ['', ''])[1]);
      const cutAt = isNaN(pos) ? Math.max(0, candidate.length - 200) : Math.max(0, pos);
      candidate = balance(trimTail(normalize(candidate.slice(0, cutAt))));
    }
  }
  try { return JSON.parse(candidate); } catch { return {}; }
}

// ── Derive platforms from answers ──
export function derivePlatforms(vibe: string, sellType: string): string[] {
  const platforms: string[] = [];
  if (sellType === 'Online' || sellType === 'Both') {
    if (vibe === 'Handmade / Physical') platforms.push('Etsy', 'Instagram Shop');
    else if (vibe === 'Digital products') platforms.push('Stan Store', 'Gumroad');
    else if (vibe === 'Service / Events') platforms.push('Google Business Profile', 'Bark.com');
    else if (vibe === 'Curated / Resale') platforms.push('Facebook Marketplace', 'Etsy');
    else platforms.push('Etsy', 'Instagram Shop');
  }
  if (sellType === 'In Person' || sellType === 'Both') platforms.push('Local events', 'Farmers markets');
  return [...new Set(platforms)].slice(0, 2);
}

export function deriveSocial(sellType: string, vibe: string): string[] {
  if (sellType === 'In Person') return ['Facebook', 'Instagram'];
  if (vibe === 'Digital products') return ['TikTok', 'Instagram'];
  if (vibe === 'Service / Events') return ['Instagram', 'Facebook'];
  return ['TikTok', 'Instagram'];
}

export function derivePricing(budget: string) {
  const hint = budget === 'Under $50' ? '$18–$35' : budget === '$50–$200' ? '$28–$65' : '$45–$120';
  const entry = budget === 'Under $50' ? '$18–$25' : budget === '$50–$200' ? '$28–$40' : '$45–$65';
  const core = budget === 'Under $50' ? '$35–$55' : budget === '$50–$200' ? '$60–$90' : '$90–$140';
  const premium = budget === 'Under $50' ? '$75–$120' : budget === '$50–$200' ? '$150–$250' : '$250–$500+';
  return { hint, entry, core, premium };
}

// ── Platform reasoning (static fallback) ──
export function platformReason(p: string, product: string): string {
  const reasons: Record<string, string> = {
    'Etsy': `Etsy is purpose-built for handmade and unique products. Buyers are already searching for exactly what you sell — ${product}. Zero marketing budget needed to get your first views.`,
    'Instagram Shop': `Instagram Shop turns your followers into buyers with in-app checkout. For ${product}, visual storytelling is your best sales tool — and Instagram is where it happens.`,
    'Stan Store': `Stan Store is the simplest way to sell digital products with zero monthly fees. One link in your bio, instant delivery, and it handles everything from payment to access.`,
    'Gumroad': `Gumroad handles payment processing, delivery, and even handles EU VAT — so you can focus on creating. Perfect for selling ${product} to a global audience.`,
    'Google Business Profile': `A free Google Business Profile puts you in local search results instantly — when someone nearby searches for ${product}, you show up.`,
    'Bark.com': `Bark.com connects service providers with people actively hiring. Low cost, low risk, and a great source of first clients.`,
    'Facebook Marketplace': `Facebook Marketplace has massive local reach with zero selling fees — perfect for moving physical, curated, or resale products fast.`,
    'Local events': `Local markets and pop-ups put your product directly in front of ready-to-spend buyers and build instant personal trust.`,
    'Farmers markets': `Farmers markets attract buyers who actively value handmade, local, and quality — your ideal customer is already in the room.`,
  };
  return reasons[p] || `${p} is a strong match for your business type and selling style.`;
}

// ── Generate fallback names ──
export function generateNames(prod: string, aes: string, cust: string, displayName: string, aiNames?: string[]): string[] {
  if (aiNames && aiNames.length && aiNames[0] !== 'Name1') return aiNames.slice(0, 5);
  const words = prod.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'from', 'your', 'that', 'this', 'some'].includes(w));
  const w = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Studio';
  const w2 = words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) : '';
  const aestheticNames: Record<string, string[]> = {
    'Soft & feminine': [`The ${w} Edit`, `${w}${w2 ? ' & ' + w2 : ''} Studio`, `By ${displayName}`, `${w} & Bloom`, `The Soft ${w}`],
    'Bold & editorial': [`${w}${w2 || ''} Co`.trim(), `${w.toUpperCase()}`, `The ${w} Agency`, `House of ${w}`, `${w} Collective`],
    'Clean & minimal': [`${w} Studio`, `${w} Objects`, `${w} Space`, `By ${w}`, `${w} Works`],
    'Warm & earthy': [`The ${w} Hearth`, `${w} & Root`, `${w} Made`, `The ${w} Cottage`, `${w} & Earth`],
    'Playful & colourful': [`${w} World`, `${w} Club`, `Happy ${w}`, `${w} Party`, `The ${w} Shop`],
  };
  return aestheticNames[aes] || aestheticNames['Warm & earthy'];
}

// ── Derive all computed values from answers ──
export interface DerivedData {
  topPlatforms: string[];
  social: string[];
  priceHint: string;
  priceEntry: string;
  priceCore: string;
  pricePrem: string;
  mission: string;
  brandId: ReturnType<typeof getBrandIdentity>;
  blockerNote: string;
  expNote: string;
  urgencyNote: string;
  pillar2: string;
  launchPlan: { w1: string; w2: string; w3: string };
  w1Static: string;
  w2Static: string;
  staticScript: string;
  todayAction: string;
  promise: string;
  name: string;
  brand: string | null;
  aesthetic: string;
  customer: string;
  product: string;
  audience: string;
  urgency: string;
  blocker: string;
  vibe: string;
  budget: string;
  salesScript: { hook: string; value: string; cta: string };
  threePostStrategy: { education: string; bts: string; sales: string };
  themePreset: ThemePreset;
  tierLabels: { entry: string; core: string; premium: string; entryDesc: string; coreDesc: string; premiumDesc: string };
  marketplaceIntro: string;
  productStrategy: string;
  monthPlans: { foundation: string; traction: string; scale: string };
  executiveSummary: string;
  missionLine: string;
}

// ── Aesthetic-driven theme preset (subtle accent shifts only) ──
export interface ThemePreset {
  key: string;
  accent: string;
  accentDark: string;
  accentRgb: string; // "r, g, b"
  rose: string;       // for kicker / wordmark color
  fontDisplay?: string;
}

const THEME_PRESETS: Record<string, ThemePreset> = {
  // Default — current Soft Editorial / Champagne Gold. Untouched.
  'Soft & feminine': {
    key: 'soft',
    accent: '#c8a877',
    accentDark: '#a3854e',
    accentRgb: '200, 168, 119',
    rose: '#d6a89a',
  },
  // Bold & Editorial — deeper bronze, near-black ink, tighter display.
  'Bold & editorial': {
    key: 'editorial',
    accent: '#b8884a',
    accentDark: '#7a5524',
    accentRgb: '184, 136, 74',
    rose: '#8a5a28',
  },
  // Clean & minimal — restrained warm taupe.
  'Clean & minimal': {
    key: 'minimal',
    accent: '#a89880',
    accentDark: '#766651',
    accentRgb: '168, 152, 128',
    rose: '#c8baa8',
  },
  // Warm & earthy — clay/amber.
  'Warm & earthy': {
    key: 'earthy',
    accent: '#b88654',
    accentDark: '#7a4f28',
    accentRgb: '184, 134, 84',
    rose: '#c4a87a',
  },
  // Playful & colourful — warm coral lift on the gold.
  'Playful & colourful': {
    key: 'playful',
    accent: '#e09a6a',
    accentDark: '#b8704a',
    accentRgb: '224, 154, 106',
    rose: '#ffb8a0',
  },
};

export function getThemePreset(aesthetic: string): ThemePreset {
  return THEME_PRESETS[aesthetic] || THEME_PRESETS['Soft & feminine'];
}

/** Apply preset CSS variables to <html>. Pass null to clear. */
export function applyThemePreset(p: ThemePreset | null) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (!p) {
    ['--dh-accent', '--dh-accent-dark', '--dh-accent-rgb', '--dh-rose-gold'].forEach(k => root.style.removeProperty(k));
    return;
  }
  root.style.setProperty('--dh-accent', p.accent);
  root.style.setProperty('--dh-accent-dark', p.accentDark);
  root.style.setProperty('--dh-accent-rgb', p.accentRgb);
  root.style.setProperty('--dh-rose-gold', p.rose);
}

export function derive(a: Record<string, string>): DerivedData {
  const vibe = a.vibe || '', sell = a.sellType || '', budget = a.budget || '';
  const aesthetic = a.aesthetic || 'Warm & earthy';
  const customer = a.customer || 'people who love quality';
  const product = a.product || 'your product';
  const audience = a.audience || 'Starting from zero';
  const urgency = a.urgency || '';
  const blocker = a.blocker || '';
  const name = (a.firstName || '').split(' ')[0] || 'You';
  const brand = a.brandName && a.brandName !== '__skip__' ? a.brandName : null;

  const topPlatforms = derivePlatforms(vibe, sell);
  const social = deriveSocial(sell, vibe);
  const pricing = derivePricing(budget);
  const brandId = getBrandIdentity(aesthetic, vibe, budget, customer, product);

  const mission = brand
    ? `${brand} exists to bring ${product} to ${customer} — with intention, quality, and a brand they'll remember.`
    : `Your business exists to bring ${product} to ${customer} — built with intention and a brand they'll remember.`;

  const blockerNote: Record<string, string> = {
    'Not sure what to make or sell': `This blueprint has made that decision for you. Based on everything you told us, ${product} is your strongest starting point.`,
    "Don't know how to market": 'Marketing is just showing up consistently in the right place. This blueprint gives you exactly where, when, and what.',
    'Scared nobody will buy': "That fear is normal. Your first sale won't come from strangers — it'll come from someone who already knows and likes you.",
    'I just need to start': "Then start with the action below. One action today. The blueprint doesn't work sitting in a tab — it works when you pick one thing and do it.",
  };

  const expNote = a.experience === 'Never'
    ? "You're starting fresh — which is actually an advantage. No bad habits to unlearn."
    : a.experience === "I've tried but didn't get far"
    ? "You've tried before — this time the plan is specific enough to follow."
    : "You have experience — use it to move faster through the early setup.";

  const urgencyNote = urgency === 'This week'
    ? "You need money this week — so we skip the theory and go straight to action."
    : urgency === 'This month'
    ? "This month is your window — everything here is calibrated for a 30-day launch."
    : "No rush means you can build properly — but don't let 'no rush' become 'never'.";

  const pillar2 = vibe === 'Service / Events'
    ? `Teach your audience something small that ${customer} can use. This builds authority and makes them think: "If the free advice is this good, the paid service must be incredible."`
    : vibe === 'Digital products'
    ? `Give away one insight from your ${product} for free. When ${customer} get value before paying, they trust the paid version will be worth it.`
    : `Teach ${customer} something about ${product} they didn't know. "How it's made", "what to look for", "why this matters" — content that makes them smarter buyers.`;

  const launchPlan = audience !== 'Starting from zero'
    ? {
        w1: `Start with your existing audience. Post on ${social[0]} introducing what you're building — not selling yet, just showing up. Behind-the-scenes content outperforms polished ads every single time.`,
        w2: `Reach out personally to 10 people in your following who fit your ideal customer. Not a mass DM — a real message. Tell them what you're building and ask if they'd be interested.`,
        w3: `Launch your first listing. Even if it's not perfect. A real product in a real store beats a perfect product that doesn't exist yet. Post about it at least 3 times in different formats.`,
      }
    : {
        w1: `Start with your platforms first. Set up your storefront on ${topPlatforms[0] || 'your chosen platform'} — it costs nothing and takes under an hour. Done is better than perfect on day one.`,
        w2: `Create content that introduces who you are and what you offer. Post on ${social[0]} every day this week. Don't pitch yet — just show up.`,
        w3: `List your first product and tell people about it. Post it, share it in relevant groups, and send it to anyone who might know someone. Your first sale will almost always come from your own network.`,
      };

  const actionPlans: Record<string, { w1: string; w2: string }> = {
    'Not sure what to make or sell': {
      w1: `Day 1: Write down the 3 things people most often ask you for help with.\nDay 2: Pick the one with the lowest start-up cost and clearest buyer.\nDay 3: Create your account on ${topPlatforms[0] || 'your platform'} — it costs nothing.\nDay 4: Upload your first listing with a clear title: what it is, who it's for, what problem it solves.\nDay 5: Post one piece of content introducing yourself and your ${product} on ${social[0]}.\nDay 6: DM 3–5 people you know who would genuinely benefit from what you sell.\nDay 7: Collect any feedback and adjust your listing description.`,
      w2: `Day 8: Post a behind-the-scenes of how you make or deliver your ${product}.\nDay 9: Add a second photo or variation to your listing.\nDay 10: Follow up personally with anyone who showed interest last week.\nDay 11: Post a "why I created this" story — your reason is your differentiator.\nDay 12: Ask your first buyer for honest feedback in writing.\nDay 13: Update your listing with that feedback.\nDay 14: Write down your top 3 engagement moments this week.`,
    },
    "Don't know how to market": {
      w1: `Day 1: Set up your ${social[0]} profile completely — bio, link, profile photo done today.\nDay 2: Post your first introduction — who you are, what you sell, and who it's for.\nDay 3: Post a behind-the-scenes of your process or product being made.\nDay 4: Engage with 10 accounts in your niche — genuine comments, not just likes.\nDay 5: Post your product clearly: what it is, what it costs, and how to buy it.\nDay 6: Share a specific problem your product solves for ${customer}.\nDay 7: Look at your 3 best-performing posts and plan to do more of that format.`,
      w2: `Day 8: Post a FAQ about your product — answer the 3 most common hesitations.\nDay 9: Share any positive feedback or reaction you've received so far.\nDay 10: Go live on ${social[0]} for 10 minutes — even just to say hello.\nDay 11: Pin your best-performing post to the top of your profile.\nDay 12: Add your shop link to every bio you have across platforms.\nDay 13: Send a "last chance this week" post or story with a clear call to action.\nDay 14: Write down your 3 best-performing content formats.`,
    },
    'Scared nobody will buy': {
      w1: `Day 1: Message 3 people you actually know who would benefit from your ${product}. Not a broadcast — individual messages.\nDay 2: Offer one of them a founder's discount in exchange for honest feedback.\nDay 3: Deliver it and ask for a testimonial or honest review.\nDay 4: Post that testimonial (with permission). One real review beats 20 polished photos.\nDay 5: Share your story — why you started and specifically who you built this for.\nDay 6: Post a day-in-the-life or behind-the-scenes that shows the human behind the brand.\nDay 7: Add a no-questions-asked return policy or guarantee to your listing.`,
      w2: `Day 8: Post 3 pieces of social proof across different formats — post, story, reel.\nDay 9: Create a simple FAQ that pre-answers the 5 most common "but what if" objections.\nDay 10: Find one person who matches your ideal customer and send them a personal message.\nDay 11: Post a transformation story — what life looks like before and after your ${product}.\nDay 12: Ask an existing customer what would make them recommend you to a friend.\nDay 13: Add 3 new product photos that build confidence — lifestyle, close-up, in-use.\nDay 14: Write down your 3 most compelling proof points.`,
    },
    'I just need to start': {
      w1: `Day 1: Create your ${topPlatforms[0] || 'platform'} account today. Nothing else. Done.\nDay 2: Upload your first listing. Not perfect — real. Photos, price, description. Live.\nDay 3: Post on ${social[0]}. Who you are and what you're selling. One post.\nDay 4: Message 5 people personally. Not a broadcast — 5 individual messages.\nDay 5: Post your launch. Share it everywhere you can today.\nDay 6: Reply to every comment and DM within 2 hours.\nDay 7: Review what happened. Count what worked. Do more of that.`,
      w2: `Day 8: Post a behind-the-scenes of your making or delivery process.\nDay 9: Join one relevant community — a Facebook group, Reddit thread, or Discord.\nDay 10: Follow up personally with anyone who showed interest last week.\nDay 11: Post a "why I started this" story. Your reason connects people.\nDay 12: List a second variation, bundle, or add-on.\nDay 13: Ask your first buyer for a review. A screenshot is enough to start.\nDay 14: Celebrate this week. Write down what worked. Plan next week.`,
    },
  };
  const chosenPlan = actionPlans[blocker] || actionPlans['I just need to start'];
  const w1Static = chosenPlan.w1;
  const w2Static = chosenPlan.w2;

  const staticScript = vibe === 'Service / Events'
    ? `Hey [Name]! I've just launched ${product} and I'm taking on a small number of clients to start. I'd love to work with you — would you be open to a quick chat this week? No pressure at all, just wanted to reach out to people I actually know first. ♥`
    : vibe === 'Digital products'
    ? `Hey [Name]! I've just launched something I've been working on — ${product}. I thought of you straight away because [reason]. It's available now at [link]. Would love to know what you think if you grab it! ♥`
    : `Hey [Name]! I've just opened my little shop — I'm selling ${product} and would love your support. I thought of you because [reason]. Here's the link: [link]. Even just sharing it with one person would mean the world! ♥`;

  const todayAction = `Open ${topPlatforms[0] || 'your platform'} right now and create your account. It takes under 30 minutes and costs nothing. You cannot make your first sale until the door is open — this is the only action that matters today.`;

  const promise = `${name}, your first sale is closer than you think${urgency === 'This week' ? ' — and it can happen this week if you start today' : ' — start now and the momentum will build faster than you expect'}.`;

  // Sales script: Hook / Value / CTA
  const salesScript = {
    hook: vibe === 'Digital products'
      ? `Since your customers are ${customer}, use this hook: "${product} is the shortcut to finally getting it done — without the overwhelm."`
      : vibe === 'Service / Events'
      ? `Since your customers are ${customer}, use this hook: "What if ${product} was handled for you — by someone who actually gets it?"`
      : vibe === 'Handmade / Physical'
      ? `Since your customers are ${customer}, use this hook: "You can feel the difference when ${product} is made with real care."`
      : `Since your customers are ${customer}, use this hook: "I found the best ${product} — and you need to see this."`,
    value: vibe === 'Digital products'
      ? `Instant access. No shipping, no waiting. ${product} is ready the moment you are — download it, open it, start using it today.`
      : vibe === 'Service / Events'
      ? `Every detail handled. From start to finish, ${product} is designed so ${customer} can relax and trust the process.`
      : vibe === 'Handmade / Physical'
      ? `Craftsmanship you can feel. Every ${product} is made with intention — not mass-produced, not rushed, not generic.`
      : `Hand-picked quality. Every ${product} is selected because it meets a standard — not just because it's available.`,
    cta: vibe === 'Digital products'
      ? `Ready? Grab ${product} now — instant access, no risk. Link in bio. ♥`
      : vibe === 'Service / Events'
      ? `Spots are limited. DM me "ready" and I'll send you everything you need to book.`
      : `Shop ${product} now — link in bio. First orders ship with a little extra something. ♥`,
  };

  // 3-Post Starter Strategy
  const primarySocial = social[0] || 'Instagram';
  const threePostStrategy = {
    education: vibe === 'Digital products'
      ? `Education Post (${primarySocial}): "3 things I wish I knew before starting [topic related to ${product}]." Share a quick tip that shows your expertise — ${customer} will save and share this.`
      : vibe === 'Service / Events'
      ? `Education Post (${primarySocial}): "The #1 mistake ${customer} make when looking for ${product}." Position yourself as the expert who saves them time and money.`
      : `Education Post (${primarySocial}): "How to tell if ${product} is actually well-made." Teach ${customer} to recognise quality — and they'll recognise yours.`,
    bts: `Behind-the-Scenes (${primarySocial}): Show the making, the process, the real person behind ${product}. ${customer} buy from people they feel connected to. Film 30 seconds of your workspace, your hands at work, or your planning process.`,
    sales: vibe === 'Digital products'
      ? `Sales Post (${primarySocial}): "${product} is live. Instant access. Here's what's inside..." — list 3 benefits, show a screenshot or preview, and end with your link. No apology, no "sorry for selling." You made something valuable.`
      : `Sales Post (${primarySocial}): "This ${product} is now available. Here's why I made it..." — tell the story, show the product clearly, include the price, and make it easy to buy. ${customer} respect directness.`,
  };

  // ── Theme preset (subtle, default leaves Champagne Gold untouched) ──
  const themePreset = getThemePreset(aesthetic);

  // ── Vibe-aware tier labels & descriptions ──
  const tierLabels = vibe === 'Service / Events'
    ? {
        entry: 'Starter Session', core: 'Signature Package', premium: 'White-Glove',
        entryDesc: `Lowest commitment. Lets ${customer} test the relationship before booking the full thing.`,
        coreDesc: `Your flagship offer — best margin, complete experience. Most ${customer} pick this.`,
        premiumDesc: `Done-with-you or done-for-you premium. For ${customer} who want the result, not the lesson.`,
      }
    : vibe === 'Digital products'
    ? {
        entry: 'Tripwire', core: 'Core Product', premium: 'Bundle',
        entryDesc: `Tiny price, instant value. The ${customer} you'd never reach otherwise become buyers here.`,
        coreDesc: `The product you want most ${customer} to buy. Price it for the long-term, not the launch.`,
        premiumDesc: `Bundle the core with templates, calls, or extras. Anchors the value of the core tier.`,
      }
    : vibe === 'Curated / Resale'
    ? {
        entry: 'Everyday Pieces', core: 'The Edit', premium: 'One-of-One',
        entryDesc: `Accessible price points that move quickly and bring ${customer} back regularly.`,
        coreDesc: `Your curated highlights — the pieces that define your eye. Your most profitable bracket.`,
        premiumDesc: `Rare, statement-only pieces. One per drop is enough to lift the perception of the whole shop.`,
      }
    : {
        entry: 'Entry', core: 'Signature', premium: 'Heirloom',
        entryDesc: `Lowest barrier. Smaller-scale ${product} that still feels handmade and considered.`,
        coreDesc: `Your flagship piece. Best margin, best storytelling, the photo that ends up on the homepage.`,
        premiumDesc: `Limited or made-to-order ${product}. Always have one — it lifts the perceived value of the others.`,
      };

  // ── Vibe-aware marketplace intro ──
  const marketplaceIntro = vibe === 'Service / Events'
    ? `Service brands win on trust signals, not catalog size. These two platforms put ${name}'s ${product} in front of ${customer} who are already actively looking — not just browsing.`
    : vibe === 'Digital products'
    ? `Digital products live or die on the buying experience — instant delivery, zero friction. These two platforms handle that for you so you can focus on building, not plumbing.`
    : vibe === 'Curated / Resale'
    ? `Curated and resale wins on speed and visual storytelling. These platforms reward fast listings, strong photos, and the kind of "had to share this find" energy your ${customer} respond to.`
    : `Handmade is bought on story and craft. These two platforms put ${product} in front of ${customer} who already value the maker behind the work — start here, ignore the rest.`;

  // ── Niche + audience + budget aware product strategy ──
  const isStartingZero = audience === 'Starting from zero';
  const productStrategy = vibe === 'Service / Events'
    ? `Lead with one signature offer — ${product} — and resist the urge to launch a menu on day one. ${isStartingZero ? `Without an audience, ${customer} need clarity more than choice.` : `Your existing audience already trusts you; one focused offer converts faster than three competing ones.`}`
    : vibe === 'Digital products'
    ? `Build one core ${product} and one tiny entry-priced version. ${budget === 'Under $50' ? 'Both can launch on free tools — no design budget required.' : 'Reinvest the early sales into better cover art and a short video walkthrough.'}`
    : vibe === 'Curated / Resale'
    ? `Source small batches of ${product} that all share one through-line — colour, era, or story. ${customer} buy a curator's eye, not random inventory.`
    : `Make a small first run of ${product} — six to twelve pieces is plenty. ${budget === 'Under $50' ? 'Materials should be sourced locally and photographed against your real workspace, not a backdrop.' : 'Put a third of your budget into materials and packaging — first impressions on unboxing drive repeat orders.'}`;

  // ── Audience + urgency-shaped 90-day phases ──
  const monthPlans = (() => {
    const fast = urgency === 'This week' || urgency === 'This month';
    const hasAudience = !isStartingZero;
    return {
      foundation: hasAudience
        ? `Tell your existing audience what you're building before it's perfect. Set up ${topPlatforms.join(' and ')}. List your first ${vibe === 'Service / Events' ? 'service' : 'product'}. Send 5 personal messages — not a broadcast — to people who already know you.${fast ? ' Aim for first sale or enquiry within 7 days.' : ''}`
        : `Build the door before you knock on it. Open ${topPlatforms.join(' and ')}, list your first ${vibe === 'Service / Events' ? 'service' : 'product'}, and post on ${social[0]} 3x this week. ${fast ? 'You need momentum — message 5 people you know personally before week one ends.' : 'Your first sale almost always comes from your own network.'}`,
      traction: vibe === 'Service / Events'
        ? `Deliver your first booking like it's a portfolio piece. Ask the client for a written testimonial and one piece of social content you can repost. Add a second package tier and start collecting an email list — even 10 people counts.`
        : vibe === 'Digital products'
        ? `Double posting frequency on ${social[0]}. Add one bonus or expansion to your ${product}. Collect 3 customer screenshots / reviews and pin them. Set up a one-email welcome flow — that's the whole funnel for now.`
        : vibe === 'Curated / Resale'
        ? `Drop your second curated batch. Repost every customer photo. Introduce a "first dibs" list for your most engaged followers. Test one paid promo on ${social[0]} only after organic posts have already converted.`
        : `List a second variation or smaller-priced version of ${product}. Photograph in golden hour for cohesion. Collect 3 reviews and turn them into static posts. Start an email list for restock notifications.`,
      scale: `Introduce your premium tier (${tierLabels.premium === 'Bundle' ? 'bundled' : tierLabels.premium.toLowerCase()}). Build a weekly content system you can repeat without thinking. Run one focused promotion — not a permanent discount. Set a revenue target for month 4 and reverse-engineer the actions that get you there.${fast ? ` Because you're moving fast, plan month 4 in week 11, not week 13.` : ''}`,
    };
  })();

  // ── Executive summary line — aesthetic + vibe + customer aware ──
  const aestheticAdj: Record<string, string> = {
    'Soft & feminine': 'intentional, soft, and easy to trust',
    'Bold & editorial': 'sharp, confident, and unmistakably its own thing',
    'Clean & minimal': 'precise, calm, and effortlessly considered',
    'Warm & earthy': 'rooted, slow-made, and quietly premium',
    'Playful & colourful': 'joyful, bright, and impossible to scroll past',
  };
  const vibeFrame: Record<string, string> = {
    'Service / Events': 'a service that handles the whole thing',
    'Digital products': 'a digital product they can use the moment they buy',
    'Curated / Resale': 'a curated edit they couldn\'t find anywhere else',
    'Handmade / Physical': 'something handmade with real care',
  };
  const adj = aestheticAdj[aesthetic] || aestheticAdj['Soft & feminine'];
  const frame = vibeFrame[vibe] || `${product}`;
  const executiveSummary = brand
    ? `${brand} is built for ${customer.toLowerCase()} who want ${frame} — and want it to feel ${adj} from the very first look.`
    : `Your business is built for ${customer.toLowerCase()} who want ${frame} — and want it to feel ${adj} from the very first look.`;

  // ── Mission line nudged by blocker ──
  const missionLine = blocker === 'Scared nobody will buy'
    ? `${mission} The proof you need will come from your first real customer — not from research.`
    : blocker === 'Not sure what to make or sell'
    ? `${mission} Stop collecting ideas. ${product} is the one to ship.`
    : blocker === 'I just need to start'
    ? `${mission} Today is the start line.`
    : mission;

  return {
    topPlatforms, social, priceHint: pricing.hint, priceEntry: pricing.entry,
    priceCore: pricing.core, pricePrem: pricing.premium, mission, brandId,
    blockerNote: blockerNote[blocker] || 'You have everything you need to start.',
    expNote, urgencyNote, pillar2, launchPlan, w1Static, w2Static,
    staticScript, todayAction, promise, name, brand, aesthetic, customer, product,
    audience, urgency, blocker, vibe, budget, salesScript, threePostStrategy,
    themePreset, tierLabels, marketplaceIntro, productStrategy, monthPlans,
    executiveSummary, missionLine,
  };
}
