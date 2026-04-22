import { AIResults } from '@/context/QuizContext';
import { safeJSON } from './quiz-helpers';

async function callAI(prompt: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(`API ${resp.status}: ${t}`);
      }
      const data = await resp.json();
      return (data.content || []).filter((b: any) => b.type === 'text').map((b: any) => b.text).join('');
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 800));
    }
  }
  return '';
}

export async function generateBlueprint(
  answers: Record<string, string>,
  onPartialResults: (results: AIResults) => void,
): Promise<AIResults> {
  const a = answers;
  const hasBrand = a.brandName && a.brandName !== '__skip__';
  const firstName = (a.firstName || '').split(' ')[0] || 'her';

  const ctx = `Name: ${a.firstName || 'unknown'}. Product/offer: ${a.product || 'unknown'}. Business type: ${a.vibe || 'unknown'}. Aesthetic: ${a.aesthetic || 'unknown'}. Sells: ${a.sellType || 'unknown'}. Time/week: ${a.time || 'unknown'}. Budget: ${a.budget || 'unknown'}. Urgency: ${a.urgency || 'unknown'}. Experience: ${a.experience || 'unknown'}. Shipping: ${a.shipping || 'unknown'}. Face-to-face: ${a.faceToFace || 'unknown'}. Inventory: ${a.inventory || 'unknown'}. Customer: ${a.customer || 'unknown'}. Audience: ${a.audience || 'Starting from zero'}. Blocker: ${a.blocker || 'unknown'}.`;

  const namesSchema = hasBrand ? `"businessNames":["${a.brandName}"]` : `"businessNames":["Name1","Name2","Name3","Name4","Name5"]`;

  const isService = a.vibe === 'Service / Events';
  const isDigital = a.vibe === 'Digital products';
  const isCurated = a.vibe === 'Curated / Resale';
  const isHandmade = a.vibe === 'Handmade / Physical';

  const nicheExtra = isService
    ? `,"servicesBusiness":{"intro":"1 sentence why profitable.","packages":[{"name":"Starter","description":"Included.","price":"$X","duration":"X hrs"},{"name":"Standard","description":"Included.","price":"$X","duration":"X hrs"},{"name":"Premium","description":"Included.","price":"$X","duration":"X hrs"}],"bookingProcess":"4 steps.","equipmentList":["Item 1","Item 2","Item 3"],"contractTips":"Key essentials.","upsells":["Upsell 1","Upsell 2"],"localMarketing":"3 moves."}`
    : isDigital
    ? `,"digitalProducts":{"intro":"1 sentence why digital suits ${firstName}.","productIdeas":[{"type":"Type","description":"What it is.","exampleTitles":["T1","T2"],"startingPrice":"$X-$Y"},{"type":"Type","description":"What it is.","exampleTitles":["T1","T2"],"startingPrice":"$X-$Y"}],"funnelStrategy":"Freebie to paid funnel.","launchPlan":"30-day plan.","pricingTiers":"3 tiers."}`
    : isCurated
    ? `,"curatedBusiness":{"intro":"1 sentence.","sourcingGuide":"Where to source.","marginAdvice":"Pricing strategy.","standoutTips":["Tip 1","Tip 2"],"platformFit":"Best platforms."}`
    : isHandmade
    ? `,"handmadeBusiness":{"intro":"1 sentence.","productionTips":"Batch tips.","pricingFormula":"Formula.","photographyTips":"Photo tips.","scalingPath":"Scale path."}`
    : '';

  // Call A: Core business
  const pA = `Dollhouse Business Advisor. Sharp, warm, specific. Real numbers only. No generic advice.\nPROFILE: ${ctx}\nOUTPUT: ONLY raw JSON.\n{${namesSchema},"recommendedPlatforms":["P1","P2"],"platformReasons":{"P1":"2 sentences why","P2":"2 sentences why"},"productRecommendation":"specific product + 1 sentence why","startingPrice":"$XX — brief margin logic"}`;

  // Call B: First sale plan
  const pB = `Dollhouse Business Advisor. Specific daily actions. Use ${firstName}'s name.\nPROFILE: ${ctx}\nOUTPUT: ONLY raw JSON.\n{"firstSale":{"promise":"Bold promise using ${firstName}'s name.","todayAction":"1 action under 60 mins, exact tool.","weekOnePlan":"Day 1: action — Xm. Day 2: action — Xm. Day 3: action. Day 4: action. Day 5: action. Day 6: action. Day 7: action.","weekTwoPlan":"Day 8: action. Day 9: action. Day 10: action. Day 11: action. Day 12: action. Day 13: action. Day 14: action.","firstClientScript":"Exact warm copy-paste message.","mindsetNote":"2 warm sentences."},"businessPlan":{"mission":"1 powerful sentence.","ninetyDayGoal":"Specific goal with numbers.","revenueTarget":"Month 1: $X. 90 days: $Y.","focusOn":["3 actions"],"ignoreForNow":["3 distractions"],"personalNote":"3 warm sentences for ${firstName}."}${nicheExtra}}`;

  // Call D: Branding + marketing
  const pD = `Dollhouse Business Advisor. Specific branding for ${firstName}'s ${a.product || 'product'}. Real Google Fonts. Real hex codes.\nPROFILE: ${ctx}\nOUTPUT: ONLY raw JSON.\n{"branding":{"brandVibe":"2 vivid sensory sentences.","logoConcepts":[{"name":"Name","description":"Designer brief."},{"name":"Name","description":"Different approach."}],"fonts":[{"role":"Display","name":"Google Font","why":"Why it fits."},{"role":"Body","name":"Google Font","why":"Why it pairs."}],"colours":[{"name":"Name","hex":"#XXXXXX","use":"Use"},{"name":"Name","hex":"#XXXXXX","use":"Use"},{"name":"Name","hex":"#XXXXXX","use":"Use"},{"name":"Name","hex":"#XXXXXX","use":"Use"}],"designDo":["Rule 1","Rule 2","Rule 3"],"designDont":["Avoid 1","Avoid 2","Avoid 3"]},"marketing":{"coreMessage":"1-2 sentence tagline/bio.","contentPillars":[{"pillar":"Name","description":"What this covers.","examplePosts":["Post 1","Post 2","Post 3"]},{"pillar":"Name","description":"Desc.","examplePosts":["Post 1","Post 2","Post 3"]},{"pillar":"Name","description":"Desc.","examplePosts":["Post 1","Post 2","Post 3"]},{"pillar":"Name","description":"Desc.","examplePosts":["Post 1","Post 2","Post 3"]}],"emailStrategy":"Tool + frequency + first email.","weeklyRoutine":"Mon-Sun schedule.","freePromotion":["Tactic 1","Tactic 2","Tactic 3","Tactic 4"],"sellingWithoutBegging":"3-4 sentences.","quickWins":["Action 1","Action 2","Action 3"]}}`;

  // Step 1: Get core data fast
  const textA = await callAI(pA);
  const dA = safeJSON(textA);
  
  // Show partial results
  onPartialResults(dA);

  // Fill in platform names for Call C
  const p1 = dA.recommendedPlatforms?.[0] || 'P1';
  const p2 = dA.recommendedPlatforms?.[1] || 'P2';

  const pC = `Dollhouse Business Advisor. Specific setup steps. Button names. Real platforms.\nPROFILE: ${ctx}\nOUTPUT: ONLY raw JSON.\n{"platformSetup":{"${p1}":"Step 1. Step 2. Step 3. Step 4. Step 5.","${p2}":"Step 1. Step 2. Step 3. Step 4. Step 5."},"firstSaleRoadmap":{"${p1}":"Day 1: action — Xm. Day 2-7: daily actions.","${p2}":"Day 1: action — Xm. Day 2-7: daily actions."},"socialMedia":{"recommended":["S1","S2"],"platforms":{"S1":{"setup":"4 steps.","strategy":"4 weekly tasks.","contentIdeas":"3 post ideas."},"S2":{"setup":"3 steps.","strategy":"4 weekly tasks.","contentIdeas":"3 post ideas."}}}}`;

  // Step 2: Fire B, C, D in parallel
  const [textB, textC, textD] = await Promise.all([
    callAI(pB),
    callAI(pC),
    callAI(pD),
  ]);

  const dB = safeJSON(textB);
  const dC = safeJSON(textC);
  const dD = safeJSON(textD);

  const merged = { ...dA, ...dB, ...dC, ...dD } as AIResults;
  
  if (JSON.stringify(merged).length < 400) {
    throw new Error('Merged results too short');
  }

  return merged;
}
