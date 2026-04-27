/**
 * EXECUTION POWERHOUSE HELPERS
 * Transforms the Business Blueprint from strategy to action
 * ─────────────────────────────────────────────────────────
 * All content stored in local constants — zero-server by design
 */

// ── FIRST 48 HOURS ACTION PLANS (Hour-by-hour) ──
export const FIRST_48_HOURS: Record<string, { day1: string[]; day2: string[] }> = {
  'Handmade / Physical': {
    day1: [
      '9:00 AM – Take 20 professional photos of your products. Ring light + white wall = professional.',
      '10:30 AM – Write down 3 things buyers say they love about your work. These are your hooks.',
      '12:00 PM – Create a simple Google Doc: "Who buys this? What problem does it solve?"',
      '1:00 PM – Lunch break.',
      '2:00 PM – Set up Etsy shop (or Instagram Shop). Use your best 5 photos.',
      '3:30 PM – Write 50-word product description for each item. Use buyer language from step 10:30.',
      '5:00 PM – Create a simple pricing spreadsheet: Cost + 3x margin = your price.',
      '6:00 PM – Email 10 past compliment-givers: "Hey [Name], I\'m launching [product]. First 3 orders get 20% off. Link in next email."',
      '7:00 PM – Schedule 3 Instagram posts with your best photos. Use caption templates from your Room 5.',
    ],
    day2: [
      '8:00 AM – Check Etsy/Shop messages. Respond to every inquiry within 1 hour.',
      '9:00 AM – Film 3 short TikToks: 1) Behind-the-scenes, 2) Product detail close-up, 3) Your origin story.',
      '11:00 AM – Post TikToks to TikTok + Reels. Use hooks from Room 5.',
      '12:00 PM – DM 10 more people: Close friends, colleagues, anyone who\'d actually use this.',
      '1:00 PM – Lunch.',
      '2:00 PM – Reply to all messages again. Check every 30 minutes today.',
      '3:00 PM – Analyze: Which photos get the most saves/comments? Screenshot them.',
      '4:00 PM – Create 1 new post using your top-performing photo style.',
      '5:00 PM – Send a "thank you" email to anyone who asked questions, with a small discount.',
      '6:00 PM – Journal: How many views? Messages? Which posts converted? Plan tomorrow\'s content.',
    ],
  },
  'Digital products': {
    day1: [
      '9:00 AM – Write out your product description in plain English. What does someone GET when they buy this?',
      '10:00 AM – Create a simple landing page in Notion or Canva. No code needed.',
      '11:00 AM – Record a 30-second demo video showing your product in action.',
      '12:00 PM – Write your "First 3 buyers" email: Why you\'re launching, what they get, deadline.',
      '1:00 PM – Lunch.',
      '2:00 PM – Set up payment link (Gumroad, Stan Store, or Stripe + Zapier).',
      '3:00 PM – Create 5 Instagram carousel posts explaining ONE benefit per slide.',
      '4:30 PM – Email list: Send your "First 3 buyers" email to warm audience (past compliment-givers).',
      '5:30 PM – Post carousel #1 to Instagram + LinkedIn. Use caption template from Room 5.',
      '7:00 PM – Email 5 people individually: "I built this for creators like you. First 3 get [discount/bonus]."',
    ],
    day2: [
      '8:00 AM – Check email + messages. Respond to EVERY inquiry within 1 hour.',
      '9:00 AM – Record 3 TikToks: 1) Problem your product solves, 2) Transformation, 3) Origin story.',
      '11:00 AM – Post TikToks to TikTok + Reels. Pin one to your bio.',
      '12:00 PM – Create a simple FAQ doc based on questions you got. Email it to warm list.',
      '1:00 PM – Lunch.',
      '2:00 PM – DM 10 creators/friends in your space. "Made this, thought of you."',
      '3:00 PM – Post carousel #2 to Instagram.',
      '4:00 PM – Check payment link. Email anyone who started but didn\'t complete.',
      '5:00 PM – Reply to all new messages.',
      '6:00 PM – Journal: Sales? Messages? Which content got most saves? Plan pricing adjustment if needed.',
    ],
  },
  'Service / Events': {
    day1: [
      '9:00 AM – Write your service in one sentence: What do you DO and for WHOM?',
      '10:00 AM – List 10 people who\'ve asked for this service. Write their names down.',
      '11:00 AM – Create a simple 1-page service outline: What\'s included, what\'s NOT, timeline, price.',
      '12:00 PM – Take a professional selfie or schedule a photoshoot.',
      '1:00 PM – Lunch.',
      '2:00 PM – Set up Google Business Profile (free, shows up in local search).',
      '3:00 PM – Write email to those 10 people: "I\'m officially doing [service]. First 3 clients get [incentive]. Let\'s talk."',
      '4:30 PM – Create 3 simple Instagram posts: 1) Before/After, 2) Process, 3) Testimonial from past client.',
      '6:00 PM – Set up Calendly or simple booking link.',
      '7:00 PM – Email 5 referral sources: "I\'m launching [service]. Know anyone who needs this? 15% referral bonus."',
    ],
    day2: [
      '8:00 AM – Check emails and Calendly bookings. Respond within 30 minutes.',
      '9:00 AM – Record 3 short videos: 1) Your expertise, 2) Common mistake clients make, 3) First steps for clients.',
      '11:00 AM – Post to TikTok + Reels + Instagram Stories.',
      '12:00 PM – Call or text those 10 people from day 1. "Just checking in, ready to help if you want."',
      '1:00 PM – Lunch.',
      '2:00 PM – Create a simple PDF guide: "5 Things Before Booking [Service]." Email to all inquiries.',
      '3:00 PM – Update Google Business Profile with posts.',
      '4:00 PM – DM 10 past clients: "I\'m offering [service] now. Know anyone?"',
      '5:00 PM – Post carousel to Instagram.',
      '6:00 PM – Journal: Bookings? Inquiries? Which posts convert? Adjust messaging.',
    ],
  },
};

// ── FIRST SALE EMAIL/DM SCRIPTS ──
export const FIRST_SALE_SCRIPTS: Record<string, Record<string, string>> = {
  'Handmade / Physical': {
    script: `Hey [Name]!

I've been making [product name] for a while, and you've always been so supportive. I'm officially launching this week, and I wanted YOU to be one of the first to get it.

Here's the deal:
• You get [specific benefit of product]
• First 3 orders get 20% off (code: FIRST20)
• Ships in [X days]

Link: [your link]

I'd love to know what you think!

[Your name]`,
    context: 'Send to people who\'ve complimented your work, past customers, or close friends. Use their name and reference something specific they said about your work.'
  },
  'Digital products': {
    script: `Hey [Name]!

I built [product name] because I kept running into the same problem you mentioned: [their specific problem].

It's basically [simple explanation of what it does].

I'm offering first 3 buyers [discount/bonus], and the link is here: [link]

It's [specific value: saves 5 hours/costs way less than alternatives/includes X].

Worth a look?

[Your name]`,
    context: 'Send to people who\'ve mentioned they struggle with this problem. Reference their specific pain point.'
  },
  'Service / Events': {
    script: `Hey [Name]!

I'm now booking [service name] for [specific use case they need].

I know you\'ve been looking for someone who [specific thing about your service], and this is exactly what I specialize in.

I'm keeping my first 3 clients to [specific number] per month, so availability is limited.

Let's chat? I\'m available [specific times] this week.

[Calendar link or phone number]

[Your name]`,
    context: 'Send to people who\'ve mentioned they need this service. Make it personal — mention why you\'d be a good fit for THEM specifically.'
  },
};

// ── TIKTOK/REELS HOOKS BY AESTHETIC ──
export const HOOKS_BY_VIBE: Record<string, string[]> = {
  'Soft & feminine': [
    '"This is how I started my [product] business from scratch (and made $X in week 1)"',
    '"If you\'ve been thinking about starting [product], watch this first"',
    '"The thing nobody tells you about selling [product]"',
    '"3 reasons I stopped selling [old thing] and started [product instead]"',
    '"I wasted $X trying to sell [product]... until I did this"',
  ],
  'Bold & editorial': [
    '"Stop doing [common mistake] if you want to sell [product]"',
    '"Here\'s exactly how much you can make selling [product]"',
    '"The one thing every [product] seller gets wrong"',
    '"I tested 5 ways to sell [product]... here\'s what actually works"',
    '"Your [product] business is failing because of this"',
  ],
  'Clean & minimal': [
    '"Starting a [product] business? This is your checklist."',
    '"The exact steps I took to sell my first [product]"',
    '"How to price your [product] (and actually make money)"',
    '"What [product] sellers don\'t tell you"',
    '"Building [product] business this year? Here\'s how."',
  ],
  'Warm & earthy': [
    '"Making [product] is easier than you think. Here\'s how."',
    '"I felt like I had to be perfect to sell [product]... I was wrong"',
    '"How my [product] business went from idea to first sale in 48 hours"',
    '"The real reason your [product] isn\'t selling (and how to fix it)"',
    '"Starting [product]? Start here, not where everyone tells you to."',
  ],
  'Playful & colourful': [
    '"POV: You started selling [product] but nobody knows about it yet 😅"',
    '"Honest: Here\'s what nobody tells you about [product] businesses"',
    '"I\'m going to save you $X and 20 hours with this [product] hack"',
    '"The [product] business launch nobody\'s talking about"',
    '"Your first [product] sale is one message away. Here\'s how."',
  ],
};

// ── SALES PAGE OUTLINES BY NICHE ──
export const SALES_PAGE_OUTLINES: Record<string, string> = {
  'Handmade / Physical': `
# YOUR [PRODUCT] SALES PAGE OUTLINE

## Hero Section
- Headline: "[Specific benefit] Without [common pain point]"
- Subheadline: Show the transformation (before/after or problem/solution)
- Hero Image: Best product photo (clean, well-lit, styled)

## Social Proof (3-4 sentences)
- Quote from past buyer (name + photo if possible)
- "Trusted by [X customers] across [locations]"

## The Problem Section
- What problem does your customer have RIGHT NOW?
- Why haven't they solved it yet? (missing time, money, knowledge, access)

## Your Solution (The Product)
- What exactly do they get?
- List 3-5 specific features
- How is yours different?

## Transformation
- Show before/after or use case
- "Customers go from [problem] to [result] in [X days/weeks]"

## Social Proof #2
- 2-3 short testimonials (one sentence each)

## FAQ Section
- "What's included?"
- "How soon will I get it?"
- "What if I don't love it?"
- "Is this for me?" (help them self-select)

## Final CTA
- Button: "Yes, I want [product]"
- Countdown if limited (first 5, this week only, etc.)
- Money-back guarantee or trial period

## Footer
- Your name, face, link to DMs
  `,
  'Digital products': `
# YOUR DIGITAL PRODUCT SALES PAGE OUTLINE

## Hero Section
- Headline: "[Specific transformation] in [timeframe]"
- Subheadline: Who this is for + what they'll get
- Screenshot or demo video

## The Pain Point
- "You're struggling with [specific problem]"
- Why your solution is different from free options

## What You Get
- List every single thing they receive (template, guide, video, checklist, etc.)
- Be specific: "30-page guide" not "guide"
- Include file types: PDF, video, Excel, etc.

## Use Case / Transformation
- Example: "A manager saved 15 hours per month using this system"
- Show the before/after state

## Social Proof
- Testimonials from early users
- Results they got
- Best if they mention the specific product by name

## FAQ
- "Will I understand this?" (explain the learning curve)
- "How long does it take to set up?"
- "Can I get refund?"
- "What if I'm not technical?"

## Limited Offer
- Bonus if they buy in first X hours (extra template, group call, etc.)
- Countdown timer (creates urgency)

## Final CTA
- Clear button with price and benefit
- One-click checkout

## Social Proof #2
- 2-3 more testimonials
  `,
  'Service / Events': `
# YOUR SERVICE SALES PAGE OUTLINE

## Hero Section
- Your photo + headline: "[Specific result] for [specific type of client]"
- Subheadline: What working with you looks like
- Video of you (30-60 seconds) explaining what you do

## About You
- Who are you?
- Why are you the right person for this?
- (Credentials + past results)

## What You Offer (Package)
- Service name
- Exactly what's included (don't be vague: "3 sessions" not "support")
- Timeline (how long it takes)
- Deliverables (what they walk away with)

## The Process
- Step 1: Initial call/assessment
- Step 2: Execution/teaching/delivery
- Step 3: Results/feedback/follow-up
- Use a visual timeline if possible

## Results / Transformation
- What can they expect? (Be specific)
- Timeline: "Results in [X weeks]"
- Real example: "Jane went from [problem] to [result]"

## Testimonials
- Client quote + name + photo (if possible)
- What changed for them?
- Would they recommend?

## FAQ
- "What if I'm not sure if I need this?"
- "How long does each session take?"
- "Do I get follow-up?"
- "What's your cancellation policy?"

## Limited Availability
- "Booking 3 clients per month to maintain quality"
- "Next availability: [date]"

## Final CTA
- "Book Your [Service] Session Now"
- Link to Calendly or booking page
  `,
};

// ── REALITY CHECKS (Niche-Specific Traps) ──
export interface RealityCheck {
  trapName: string;
  trapEmoji: string;
  content: string;
}

export const REALITY_CHECKS: Record<string, RealityCheck> = {
  'Handmade / Physical': {
    trapName: 'The Hobbyist Trap',
    trapEmoji: '🪡',
    content: `
High Labor, Low Margin. You'll love making products more than selling them.

The Trap:
You're excited, making 50 units, staying up late, burning out. Meanwhile, your profit margin is $2 per item because you underpriced.

Reality Check:
• Handmade only wins at premium prices. A $50 item is better than 10 × $5 items.
• You can't scale by working harder — only by raising prices and automating production.
• Your first 30 days: Sell 5 units at FULL price, not discounted. Prove demand exists before scaling.

What Actually Works:
1. Start with ONE product. Make 10. Sell 5 at full price.
2. Price based on your hourly rate + materials, not "what feels reasonable."
3. Before scaling production, pre-sell. Get paid before making.
4. Batch your work: Make all of Product A on Monday, Product B on Tuesday. No context switching.

Your Mantra:
"Profit margin matters more than volume."
    `,
  },
  'Digital products': {
    trapName: 'The Ghost Town Trap',
    trapEmoji: '👻',
    content: `
High Competition, Low Touch. You'll build a great product in silence and wonder why nobody buys.

The Trap:
You spend 4 weeks perfecting your digital product. Launch it. Zero sales. Why? Nobody knows it exists.

Reality Check:
• Building is 20% of the work. Marketing is 80%.
• Digital products are commoditized. Your edge is YOUR story, not the product itself.
• If you hate marketing, this model is not for you. Period.
• Your first 30 days: Get 50 warm leads BEFORE launch. Then launch to them.

What Actually Works:
1. Start marketing BEFORE the product is done. Build in public.
2. Post your progress on TikTok/Instagram as you build. People buy YOU, not the thing.
3. Email list > everything. Collect 50 emails before launch.
4. First sales come from warm audience (past customers, followers). Strangers come later.

Your Mantra:
"If nobody's watching you build it, nobody will buy it."
    `,
  },
  'Service / Events': {
    trapName: 'The Burnout Trap',
    trapEmoji: '🔥',
    content: `
Trading Time for Dollars. You'll say "yes" to everyone and work 60-hour weeks making $15/hour.

The Trap:
You're eager to please. First client asks you to discount? Sure. Next client asks for extras? Sure. Before month one ends: exhausted and underpaid.

Reality Check:
• Not all clients are worth your time. A "difficult $500 client" is worse than an "easy $300 client."
• If you discount for the first client, you'll attract discounters forever.
• You can't scale a service business by working more hours. Ceiling hits at ~$5-10K/month unless you delegate.
• Your first 30 days: Book 3 clients at FULL price, not discounted. This proves you have a business.

What Actually Works:
1. Set your rate FIRST. Stick to it. Don't negotiate down.
2. Use a screening call to filter clients. Some aren't worth the effort.
3. Build a waitlist. If you have no waitlist, your price is too low.
4. After 10 clients, productize (group program) or delegate. 1-on-1 only works so far.

Your Mantra:
"Your time is your only asset. Protect it like your life depends on it."
    `,
  },
};

// ── ROOM SEQUENCE LOGIC (For Navigation) ──
// Action-oriented CTAs keep users focused on execution, not room numbers
export const ROOM_SEQUENCE: Record<string, {
  nextRoom: string;
  nextStepCopy: string;
  roomTitle: string;
  action: string;
}> = {
  'r00': {
    nextRoom: 'r01',
    nextStepCopy: 'Go to Name Room: Pick Your Brand',
    roomTitle: 'The Reality Check',
    action: 'Understand your niche trap',
  },
  'r01': {
    nextRoom: 'r02',
    nextStepCopy: 'Go to Platforms Room: Choose Where to Sell',
    roomTitle: 'Name Your Business',
    action: 'Lock in your brand name',
  },
  'r02': {
    nextRoom: 'r03',
    nextStepCopy: 'Go to Product Room: Define Your Offer',
    roomTitle: 'Pick Your Platforms',
    action: 'Choose 2 sales channels',
  },
  'r03': {
    nextRoom: 'r04',
    nextStepCopy: 'Go to Pricing Room: Set Your Tiers',
    roomTitle: 'Position Your Product',
    action: 'Lock your positioning',
  },
  'r04': {
    nextRoom: 'r05',
    nextStepCopy: 'Go to Social Room: Create Your Voice',
    roomTitle: 'Price It Right',
    action: 'Lock your pricing tiers',
  },
  'r05': {
    nextRoom: 'r05b',
    nextStepCopy: 'Go to Setup Room: Build Your Storefront',
    roomTitle: 'Your Social Voice',
    action: 'Find your authentic voice',
  },
  'r05b': {
    nextRoom: 'r06',
    nextStepCopy: 'Go to First Sale Room: Land Your First Customer',
    roomTitle: 'Technical Setup',
    action: 'Go live and take payment',
  },
  'r06': {
    nextRoom: 'r07',
    nextStepCopy: 'Go to Content Room: Build Your System',
    roomTitle: 'Your First Sale',
    action: 'Get your first paying customer',
  },
  'r07': {
    nextRoom: 'r08',
    nextStepCopy: 'Go to Marketing Room: Scale What Works',
    roomTitle: 'Content Strategy',
    action: 'Build your repeatable system',
  },
  'r08': {
    nextRoom: 'r09',
    nextStepCopy: 'Go to Growth Room: Multiply Your Audience',
    roomTitle: 'Marketing Multiplication',
    action: 'Scale your best content',
  },
  'r09': {
    nextRoom: 'r10',
    nextStepCopy: 'Go to 90-Day Room: Your Launch Sprint',
    roomTitle: 'Growth Acceleration',
    action: 'Go from 0 to 10 sales',
  },
  'r10': {
    nextRoom: 'r11',
    nextStepCopy: 'Go to Mission Room: Define Your Why',
    roomTitle: 'Your 90-Day Launch',
    action: 'Execute your launch plan',
  },
  'r11': {
    nextRoom: 'r12',
    nextStepCopy: 'Go to Design Room: Lock Your Brand',
    roomTitle: 'Your Bigger Mission',
    action: 'Define why you do this',
  },
  'r12': {
    nextRoom: '',
    nextStepCopy: 'Download Your Complete Blueprint',
    roomTitle: 'Design & Brand Identity',
    action: 'Complete your visual identity',
  },
};

// ── INTEGRATION FUNCTION ──
export interface ExecutionContent {
  first48Hours: { day1: string[]; day2: string[] };
  firstSaleScript: string;
  firstSaleContext: string;
  hooks: string[];
  salesPageOutline: string;
  realityCheck: RealityCheck;
  nextRoom: string;
  nextStepCopy: string;
  roomTitle: string;
  action: string;
}

export function getExecutionContent(
  niche: string,
  vibe: string,
  currentRoom: string
): ExecutionContent {
  const nicheKey = niche === 'Handmade / Physical' ? 'Handmade / Physical' :
                   niche === 'Digital products' ? 'Digital products' : 'Service / Events';

  const vibeHooks = HOOKS_BY_VIBE[vibe] || HOOKS_BY_VIBE['Warm & earthy'];
  const roomSeq = ROOM_SEQUENCE[currentRoom] || {
    nextRoom: '',
    nextStepCopy: 'Continue Your Journey',
    roomTitle: 'Blueprint Room',
    action: 'Take the next step',
  };

  const script = FIRST_SALE_SCRIPTS[nicheKey] || FIRST_SALE_SCRIPTS['Service / Events'];
  const realityCheck = REALITY_CHECKS[nicheKey] || REALITY_CHECKS['Service / Events'];

  return {
    first48Hours: FIRST_48_HOURS[nicheKey] || FIRST_48_HOURS['Service / Events'],
    firstSaleScript: script.script,
    firstSaleContext: script.context,
    hooks: vibeHooks,
    salesPageOutline: SALES_PAGE_OUTLINES[nicheKey],
    realityCheck,
    nextRoom: roomSeq.nextRoom,
    nextStepCopy: roomSeq.nextStepCopy,
    roomTitle: roomSeq.roomTitle,
    action: roomSeq.action,
  };
}
