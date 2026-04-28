import { AIResults } from '@/context/QuizContext';
import { derive, generateNames, platformReason } from './quiz-helpers';

function splitPlan(plan: string) {
  return plan
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join(' ');
}

export async function generateBlueprint(
  answers: Record<string, string>,
  onPartialResults: (results: AIResults) => void,
): Promise<AIResults> {
  const d = derive(answers);
  const name = d.name;
  const brand = d.brand || generateNames(d.product, d.aesthetic, d.customer, name)[0];
  const platforms = d.topPlatforms.slice(0, 2);
  const social = d.social.slice(0, 2);
  const [displayFont = 'Cormorant Garamond', bodyFont = 'DM Sans'] = d.brandId.typo.split('+').map(font => font.trim());

  const productDetails = d.productDetails ? ` Specifically: ${d.productDetails}.` : '';
  const stage = d.currentStatus || 'Just an idea';
  const goal = d.successGoal || 'get clear enough to start';

  const localResults: AIResults = {
    businessNames: d.brand ? [d.brand] : generateNames(d.product, d.aesthetic, d.customer, name),
    recommendedPlatforms: platforms,
    platformReasons: platforms.reduce<Record<string, string>>((acc, platform) => {
      acc[platform] = `${platformReason(platform, d.product)} This matches your current stage: ${stage}.`;
      return acc;
    }, {}),
    productRecommendation: `${name}, start with one clear version of ${d.product} for ${d.customer}.${productDetails} Package it around this win: ${goal}.`,
    startingPrice: `${d.priceHint} — use this as your first-test range, then move buyers toward ${d.priceCore} once you have proof.`,
    firstSale: {
      promise: d.promise,
      todayAction: d.todayAction,
      weekOnePlan: splitPlan(d.w1Static),
      weekTwoPlan: splitPlan(d.w2Static),
      firstClientScript: d.staticScript,
      mindsetNote: `${d.setupStageNote} ${d.successGoalNote}`,
    },
    businessPlan: {
      mission: d.mission,
      ninetyDayGoal: `In 90 days, validate ${d.product} with a simple offer, a repeatable weekly content rhythm, and a first revenue target tied to "${goal}".`,
      revenueTarget: `First target: ${d.priceEntry} from 1-3 buyers. Next target: ${d.priceCore} from repeatable weekly sales. Premium target: ${d.pricePrem}.`,
      focusOn: [
        `Turn ${d.product} into one sellable starter offer.`,
        `Use ${platforms[0] || 'your main platform'} as the primary checkout path.`,
        `Post proof, process, and sales content on ${social[0] || 'your main social channel'} every week.`,
      ],
      ignoreForNow: [
        'A huge product catalog before the first buyer responds.',
        'A perfect logo before the offer is listed.',
        'Paid ads before the message and photos convert organically.',
      ],
      personalNote: `${name}, the premium move is focus. Build one offer, send real invitations, then improve from buyer feedback.`,
    },
    platformSetup: platforms.reduce<Record<string, string>>((acc, platform) => {
      acc[platform] = `1. Create or audit your ${platform} profile today.\n2. Use a clear headline: ${d.product} for ${d.customer}.\n3. Add the starter offer, price, delivery details, and one direct CTA.\n4. Include 3-5 photos, screenshots, examples, or proof points.\n5. Put this link in every bio and message you use this week.\n6. Track views, clicks, saves, DMs, and buyer questions.`;
      return acc;
    }, {}),
    firstSaleRoadmap: platforms.reduce<Record<string, string>>((acc, platform) => {
      acc[platform] = `Day 1: publish or improve your ${platform} listing. Day 2: send 5 personal invites. Day 3: post the problem your offer solves. Day 4: share proof or process. Day 5: answer objections publicly. Day 6: follow up. Day 7: make one clear sale post.`;
      return acc;
    }, {}),
    socialMedia: {
      recommended: social,
      platforms: social.reduce<Record<string, { setup: string; strategy: string; contentIdeas: string }>>((acc, channel) => {
        acc[channel] = {
          setup: `Bio says who you help, what you sell, and where to buy ${d.product}. Pin one intro, one proof/process post, and one offer post.`,
          strategy: `Use a weekly rhythm: 1 education post, 1 behind-the-scenes post, 1 proof post, and 1 direct sales post.`,
          contentIdeas: `1. Why ${d.customer} need ${d.product}. 2. How your offer works. 3. What changes after someone buys.`,
        };
        return acc;
      }, {}),
    },
    branding: {
      brandVibe: d.brandId.voice,
      logoConcepts: [
        { name: `${brand} Wordmark`, description: d.brandId.logo },
        { name: `${brand} House Mark`, description: d.brandId.logo2 },
      ],
      fonts: [
        { role: 'Display', name: displayFont, why: 'Sets the first impression and makes the brand feel intentional.' },
        { role: 'Body', name: bodyFont, why: 'Keeps product pages, captions, and emails easy to read.' },
      ],
      colours: d.brandId.colours.map(c => ({
        name: c.n,
        hex: c.c,
        use: c.use,
      })),
      designDo: d.brandId.designDo,
      designDont: d.brandId.designDont,
    },
    marketing: {
      coreMessage: `${brand} helps ${d.customer} get ${d.product} with a ${d.aesthetic.toLowerCase()} experience that feels clear, useful, and worth buying.`,
      contentPillars: [
        { pillar: 'Proof', description: `Show why ${d.product} works for ${d.customer}.`, examplePosts: ['Before/after or result', 'Review or reaction', 'Common objection answered'] },
        { pillar: 'Process', description: 'Show the making, delivery, setup, or thinking behind the offer.', examplePosts: ['Behind the scenes', 'Tools you use', 'How an order works'] },
        { pillar: 'Education', description: d.pillar2, examplePosts: ['Quick tip', 'Mistake to avoid', 'Mini tutorial'] },
        { pillar: 'Offer', description: 'Invite people to buy with clarity and confidence.', examplePosts: ['What is included', 'Who it is for', 'Limited first-buyer bonus'] },
      ],
      emailStrategy: `Send one short weekly note: useful tip, product story, direct CTA to buy ${d.product}.`,
      weeklyRoutine: d.threePostStrategy.education + ' ' + d.threePostStrategy.bts + ' ' + d.threePostStrategy.sales,
      freePromotion: [
        `Post on ${social[0] || 'your main social channel'} three times this week.`,
        'Message 5 warm contacts with a personal note.',
        'Share one useful tip in a relevant community.',
        'Ask one early buyer or friend for honest feedback.',
      ],
      sellingWithoutBegging: `Selling is service when the offer is specific. Tell ${d.customer} what ${d.product} helps them do, who it is for, and exactly how to buy.`,
      quickWins: [
        'Add the shop link to every bio.',
        'Write one pinned intro post.',
        'Make one clear sale post today.',
      ],
    },
  };

  onPartialResults(localResults);
  return localResults;
}
