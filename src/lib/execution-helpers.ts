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
export const REALITY_CHECKS: Record<string, string> = {
  'Handmade / Physical': `
⚠️ YOUR HANDMADE REALITY CHECK

The Trap You'll Face:
You'll get excited about making more products than you can actually handle. You'll see demand and think "I need to make 50 of these!"

The Reality:
- Each product takes time. If it takes 2 hours to make one, and you want to work 8 hours/day, you make 4 per day MAX.
- You'll think: "I'll just stay up late!" (You won't. Your quality drops, you burn out.)
- After fulfilling orders, you have 0 time to market, make content, or find more customers.

What Actually Works:
1. Start with ONE product. Perfect it. Sell 5. Then scale.
2. Your profit margin matters more than volume. A $50 product is better than ten $5 products.
3. Before you make 50 units, pre-sell 10. Get paid BEFORE you make them.
4. Delegate or batching: Make all of one thing on Monday, another product on Tuesday. Stops context switching.

Your First 30 Days Goal:
Sell 5 units. That proves demand. Then scale production.
`,
  'Digital products': {
    trap: `
⚠️ YOUR DIGITAL PRODUCT REALITY CHECK

The Trap You'll Face:
You'll spend 4 weeks perfecting something, launch it, and sell 0 copies. Why? Nobody knew it existed.

The Reality:
- Building a product is 20% of the work. Marketing it is 80%.
- You cannot "if you build it, they will come." They won't.
- Most digital product businesses fail because the creator hates marketing and does it last (or not at all).

What Actually Works:
1. Start marketing BEFORE you finish the product. Sell the future version.
2. Build in public. Share your process on TikTok/Instagram as you build.
3. Your email list or warm audience buys first. Strangers come later.
4. You need SYSTEMS, not just a product: landing page → email list → launch sequence.

Your First 30 Days Goal:
Get 50 emails interested BEFORE launch. Then launch to them. 1-2 sales proves demand.
    `
  },
  'Service / Events': `
⚠️ YOUR SERVICE REALITY CHECK

The Trap You'll Face:
You'll say "yes" to every client who asks, working 60-hour weeks, barely making $15/hour. You'll be exhausted and broke.

The Reality:
- Not all clients are worth your time. A difficult $500 client is worse than an easy $300 client.
- You'll want to "discount for the first client to build trust." Don't. You'll attract discounters forever.
- You can't scale a service business by working more hours. At some point, there's a ceiling.

What Actually Works:
1. Set your rate FIRST. Stick to it. Don't negotiate down.
2. Only take clients who are a good fit (use a screener call).
3. Build a waitlist and raise prices. If you have no waitlist, your price is too low.
4. After 10 clients, create a group program or digital product to scale beyond 1-on-1.

Your First 30 Days Goal:
Book 3 clients at your target rate. Not "whatever they offer," YOUR rate. Proves you have a business, not a hobby.
  `,
};

// ── ROOM SEQUENCE LOGIC (For Navigation) ──
export const ROOM_SEQUENCE: Record<string, { nextRoom: string; nextStepCopy: string }> = {
  'r01': {
    nextRoom: 'r02',
    nextStepCopy: 'Your name is set. Now let\'s pick where you\'ll actually sell.'
  },
  'r02': {
    nextRoom: 'r03',
    nextStepCopy: 'Platform chosen. Now let\'s nail your product positioning.'
  },
  'r03': {
    nextRoom: 'r04',
    nextStepCopy: 'Product clear. Time to price it right.'
  },
  'r04': {
    nextRoom: 'r05',
    nextStepCopy: 'Price locked. Now let\'s make people want it.'
  },
  'r05': {
    nextRoom: 'r05b',
    nextStepCopy: 'Your voice is clear. Time to set up to sell.'
  },
  'r05b': {
    nextRoom: 'r06',
    nextStepCopy: 'Setup complete. Now for your first paying customer.'
  },
  'r06': {
    nextRoom: 'r07',
    nextStepCopy: 'First sale unlocked. Time to multiply it.'
  },
  'r07': {
    nextRoom: 'r08',
    nextStepCopy: 'Content system built. Now scale what\'s working.'
  },
  'r08': {
    nextRoom: 'r09',
    nextStepCopy: 'Growth strategy set. Time to market harder.'
  },
  'r09': {
    nextRoom: 'r10',
    nextStepCopy: 'Marketing rhythm built. Now 90-day sprint.'
  },
  'r10': {
    nextRoom: 'r11',
    nextStepCopy: '90 days planned. Now what\'s your bigger mission?'
  },
  'r11': {
    nextRoom: 'r12',
    nextStepCopy: 'Mission defined. Seal it with your brand.'
  },
  'r12': {
    nextRoom: '',
    nextStepCopy: 'Your blueprint is complete. Now execute. 🏛️'
  },
};

// ── INTEGRATION FUNCTION ──
export interface ExecutionContent {
  first48Hours: { day1: string[]; day2: string[] };
  firstSaleScript: string;
  firstSaleContext: string;
  hooks: string[];
  salesPageOutline: string;
  realityCheck: string;
  nextRoom: string;
  nextStepCopy: string;
}

export function getExecutionContent(
  niche: string,
  vibe: string,
  currentRoom: string
): ExecutionContent {
  const nicheKey = niche === 'Handmade / Physical' ? 'Handmade / Physical' :
                   niche === 'Digital products' ? 'Digital products' : 'Service / Events';

  const vibeHooks = HOOKS_BY_VIBE[vibe] || HOOKS_BY_VIBE['Warm & earthy'];
  const roomSeq = ROOM_SEQUENCE[currentRoom] || { nextRoom: '', nextStepCopy: '' };

  const script = FIRST_SALE_SCRIPTS[nicheKey] || FIRST_SALE_SCRIPTS['Service / Events'];
  const realityCheck = typeof REALITY_CHECKS[nicheKey] === 'string'
    ? REALITY_CHECKS[nicheKey]
    : REALITY_CHECKS[nicheKey].trap || '';

  return {
    first48Hours: FIRST_48_HOURS[nicheKey] || FIRST_48_HOURS['Service / Events'],
    firstSaleScript: script.script,
    firstSaleContext: script.context,
    hooks: vibeHooks,
    salesPageOutline: SALES_PAGE_OUTLINES[nicheKey],
    realityCheck,
    nextRoom: roomSeq.nextRoom,
    nextStepCopy: roomSeq.nextStepCopy,
  };
}
