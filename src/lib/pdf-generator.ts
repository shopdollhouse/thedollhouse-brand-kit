import jsPDF from 'jspdf';
import { derive } from './quiz-helpers';

interface PDFData {
  name: string;
  brand: string;
  product: string;
  aesthetic: string;
  mission: string;
  platforms: string[];
  social: string[];
  priceHint: string;
  colours: { name: string; hex: string; use?: string }[];
  aiResults: any;
  answers: Record<string, string>;
  d?: any;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.substring(0, 2), 16) || 0, parseInt(h.substring(2, 4), 16) || 0, parseInt(h.substring(4, 6), 16) || 0];
}

export async function generateBlueprintPDF(data: PDFData): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297;
  const margin = 24;
  const contentW = W - margin * 2;
  let y = 0;

  const brand = data.brand || data.product;
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const accent: [number, number, number] = [196, 168, 154];
  const dark: [number, number, number] = [30, 15, 9];
  const white: [number, number, number] = [255, 255, 255];
  const textDark: [number, number, number] = [45, 30, 22];
  // Cover-specific blush palette (matches reference)
  const blushBg: [number, number, number] = [248, 224, 218];
  const blushBgDeep: [number, number, number] = [240, 206, 200];
  const rose: [number, number, number] = [196, 122, 122];     // brand-name rose
  const roseSoft: [number, number, number] = [173, 110, 110]; // body italic
  const gold: [number, number, number] = [184, 144, 92];      // chip + ornament gold
  const goldSoft: [number, number, number] = [200, 170, 130];

  // Use passed-in derived data or derive fresh
  const d = data.d || derive(data.answers);

  // ─── HELPERS ───
  const addPage = (roomNum: string, roomName: string) => {
    doc.addPage();
    doc.setFillColor(242, 221, 216);
    doc.rect(0, 0, W, H, 'F');
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.3);
    doc.line(margin, 16, W - margin, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...accent);
    if (roomNum) doc.text(`${roomNum} — ${roomName}`, margin, 24);
    doc.setFontSize(6);
    doc.text(brand, W - margin, 24, { align: 'right' });
    y = 36;
  };

  const writeText = (text: string, size: number, style: 'normal' | 'bold' | 'italic' = 'normal', colour: [number, number, number] = textDark) => {
    if (!text) return;
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...colour);
    const lines = doc.splitTextToSize(text, contentW);
    const lineH = size * 0.45;
    if (y + lines.length * lineH > H - 20) addPage('', '');
    doc.text(lines, margin, y);
    y += lines.length * lineH + 3;
  };

  const writeLabel = (label: string) => {
    if (y > H - 40) addPage('', '');
    y += 3;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...accent);
    doc.text(label.toUpperCase(), margin, y);
    y += 6;
  };

  const writeBullet = (text: string) => {
    if (!text) return;
    writeText(`• ${text}`, 9);
  };

  // ═══ COVER PAGE — blush editorial ═══
  // Soft blush background (subtle vertical wash)
  doc.setFillColor(...blushBg);
  doc.rect(0, 0, W, H, 'F');
  // Deeper blush band along the bottom
  doc.setFillColor(...blushBgDeep);
  doc.rect(0, H - 60, W, 60, 'F');
  // Inner rounded "card" frame
  doc.setDrawColor(...goldSoft);
  doc.setLineWidth(0.3);
  doc.roundedRect(10, 10, W - 20, H - 20, 6, 6, 'S');

  // Heart ornament at top center — brand signature
  const heartCx = W / 2;
  const heartTop = 28;
  doc.setFillColor(...gold);
  doc.setLineWidth(0.5);
  doc.setDrawColor(...gold);
  // Draw simple heart shape using circles and lines
  doc.circle(heartCx - 1.5, heartTop - 0.5, 1, 'F');
  doc.circle(heartCx + 1.5, heartTop - 0.5, 1, 'F');
  // Bottom point
  doc.setLineWidth(0.3);
  doc.line(heartCx - 2.5, heartTop, heartCx, heartTop + 2);
  doc.line(heartCx, heartTop + 2, heartCx + 2.5, heartTop);

  // "— THE DOLLHOUSE —" header (spaced caps with side rules)
  y = heartTop + 24;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...gold);
  const headerText = 'T H E   D O L L H O U S E';
  doc.text(headerText, W / 2, y, { align: 'center' });
  // side rules
  const headerWidth = doc.getTextWidth(headerText);
  doc.setDrawColor(...goldSoft);
  doc.setLineWidth(0.3);
  const ruleY = y - 1.2;
  doc.line(W / 2 - headerWidth / 2 - 14, ruleY, W / 2 - headerWidth / 2 - 4, ruleY);
  doc.line(W / 2 + headerWidth / 2 + 4, ruleY, W / 2 + headerWidth / 2 + 14, ruleY);

  // "Your Brand Blueprint" italic kicker
  y += 14;
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(...roseSoft);
  doc.text('Your Brand Blueprint', W / 2, y, { align: 'center' });

  // BIG italic brand name (the "Stickers" of the reference)
  y += 22;
  doc.setFont('times', 'italic');
  doc.setFontSize(56);
  doc.setTextColor(...rose);
  // Auto-shrink to fit
  let displayBrand = brand;
  let bSize = 56;
  while (doc.getTextWidth(displayBrand) > contentW - 20 && bSize > 28) {
    bSize -= 2;
    doc.setFontSize(bSize);
  }
  doc.text(displayBrand, W / 2, y, { align: 'center' });

  // Italic descriptor line
  y += 14;
  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...roseSoft);
  const tagline = `A personalised strategy built entirely around ${data.name}'s vision, aesthetic, and goals.`;
  const taglineLines = doc.splitTextToSize(tagline, contentW - 30);
  doc.text(taglineLines, W / 2, y, { align: 'center' });
  y += taglineLines.length * 5 + 6;

  // Heart ornament divider
  doc.setDrawColor(...goldSoft);
  doc.setLineWidth(0.25);
  doc.line(W * 0.32, y, W * 0.46, y);
  doc.line(W * 0.54, y, W * 0.68, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...gold);
  doc.text('♥', W / 2, y + 1.2, { align: 'center' });

  // Three rounded "pill" metadata chips
  y += 12;
  const chips = [
    (data.aesthetic || 'Editorial').toUpperCase(),
    date.toUpperCase(),
    '12 ROOMS',
  ];
  const chipH = 9;
  const chipPadX = 6;
  const chipGap = 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  const chipWidths = chips.map(t => doc.getTextWidth(t) + chipPadX * 2);
  const totalChipsW = chipWidths.reduce((a, b) => a + b, 0) + chipGap * (chips.length - 1);
  let cx = (W - totalChipsW) / 2;
  chips.forEach((t, i) => {
    const cw = chipWidths[i];
    doc.setDrawColor(...goldSoft);
    doc.setLineWidth(0.4);
    doc.roundedRect(cx, y, cw, chipH, chipH / 2, chipH / 2, 'S');
    doc.setTextColor(...gold);
    doc.text(t, cx + cw / 2, y + 5.8, { align: 'center' });
    cx += cw + chipGap;
  });

  // Circle heart medallion
  y += 22;
  doc.setDrawColor(...goldSoft);
  doc.setLineWidth(0.5);
  doc.circle(W / 2, y, 6, 'S');
  doc.setFontSize(11);
  doc.setTextColor(...gold);
  doc.text('♥', W / 2, y + 2, { align: 'center' });

  // Colour swatches (smaller, beneath the medallion)
  if (data.colours.length > 0) {
    y += 14;
    const swatchSize = 8;
    const sgap = 5;
    const cols = data.colours.slice(0, 6);
    const totalSW = cols.length * swatchSize + (cols.length - 1) * sgap;
    let sx = (W - totalSW) / 2;
    cols.forEach(c => {
      const rgb = hexToRgb(c.hex || '#c4a89a');
      doc.setFillColor(...rgb);
      doc.setDrawColor(...goldSoft);
      doc.setLineWidth(0.2);
      doc.roundedRect(sx, y, swatchSize, swatchSize, 1.4, 1.4, 'FD');
      sx += swatchSize + sgap;
    });
    y += swatchSize + 5;
  }

  // "Personal Use Only" footer (spaced caps)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...gold);
  doc.text('P E R S O N A L   U S E   O N L Y', W / 2, H - 22, { align: 'center' });
  doc.setFontSize(5);
  doc.setTextColor(...goldSoft);
  doc.text(`Licensed to ${data.name} · © 2026 The Dollhouse`, W / 2, H - 16, { align: 'center' });

  // ═══ ROOM 01: THE FRONT DOOR ═══
  addPage('01', 'The Front Door');
  writeText(brand, 24, 'bold');
  y += 6;
  writeLabel('Your Mission');
  writeText(data.aiResults?.businessPlan?.mission || d.mission, 11, 'italic');
  y += 4;

  writeLabel('What This Means');
  writeText(d.executiveSummary, 10, 'italic');
  y += 3;

  writeLabel('Your First Action');
  writeText(d.todayAction, 9, 'bold');
  y += 3;

  writeLabel('Remember');
  writeText('This blueprint is built on your answers. Every recommendation matches your niche, your budget, your time, and your audience. The specificity is your advantage.', 9, 'italic');

  // ═══ ROOM 02: MARKETPLACE ═══
  addPage('02', 'The Marketplace Room');
  writeText(d.marketplaceIntro, 10, 'italic', accent);
  y += 3;
  const platforms = data.aiResults?.recommendedPlatforms || d.topPlatforms || [];
  if (platforms.length === 0) platforms.push(...d.topPlatforms);
  platforms.slice(0, 2).forEach((p: string) => {
    writeLabel(p);
    const reason = data.aiResults?.platformReasons?.[p] || `${p} is the strongest match for your business type.`;
    writeText(reason, 9);
    y += 2;
  });

  writeLabel('Why These Two Platforms?');
  writeText('You\'re starting with these two because they match your niche, time commitment, and budget. Focus here first. Expand later when you have revenue and data.', 9);

  // ═══ ROOM 03: PRODUCT ═══
  addPage('03', 'The Product Room');
  writeText(data.aiResults?.productRecommendation || `Your product is ${data.product}.`, 10, 'italic');
  y += 2;

  writeLabel('Product Strategy');
  writeText(d.productStrategy, 9);
  y += 2;

  if (data.aiResults?.startingPrice) {
    writeLabel('Starting Price');
    writeText(data.aiResults.startingPrice, 10);
    y += 2;
  }

  writeLabel('First Run Plan');
  writeText('For your first batch: quality over quantity. 6–12 pieces allows you to test, iterate, and gather feedback without overcommitting resources.', 9);
  y += 2;

  writeLabel('Expert Note');
  writeText('Your first product should feel intentional. Every detail matters — from packaging to the first message a customer sees. This is your statement piece.', 9, 'italic', accent);

  // ═══ ROOM 04: PRICING ═══
  addPage('04', 'The Money Room');
  writeText(`Three tiers gives ${d.customer} a choice without confusion.`, 10, 'italic', accent);
  y += 3;

  const tierLabels = d.tierLabels || { entry: 'Entry', core: 'Core', premium: 'Premium', entryDesc: '', coreDesc: '', premiumDesc: '' };
  writeLabel(tierLabels.entry);
  writeText(d.priceEntry, 10, 'bold');
  writeText(tierLabels.entryDesc || 'Lowest barrier. Gets them through the door.', 9);
  y += 2;

  writeLabel(tierLabels.core);
  writeText(d.priceCore, 10, 'bold');
  writeText(tierLabels.coreDesc || 'Your flagship. Best margin, best value.', 9);
  y += 2;

  writeLabel(tierLabels.premium);
  writeText(d.pricePrem, 10, 'bold');
  writeText(tierLabels.premiumDesc || 'For buyers who want the best. Always have one.', 9);
  y += 3;

  // Sales Script
  writeLabel('Your High-Conversion Script');
  writeText(`Hook: ${d.salesScript.hook}`, 9, 'italic');
  y += 1;
  writeText(`Value: ${d.salesScript.value}`, 9);
  y += 1;
  writeText(`CTA: ${d.salesScript.cta}`, 9, 'bold');
  y += 2;

  writeLabel('Pricing Psychology');
  writeText('Always show all three tiers. The premium tier makes the core tier look like a bargain. The entry tier captures price-sensitive buyers. Never apologize for your prices.', 9);

  // ═══ ROOM 05: SOCIAL ═══
  addPage('05', 'The Social Room');
  const social = data.aiResults?.socialMedia?.recommended || data.social || d.social || [];
  writeLabel('Primary Platform');
  writeText(social[0] || d.social[0] || '—', 10, 'bold');
  writeLabel('Secondary Platform');
  writeText(social[1] || d.social[1] || '—', 10, 'bold');
  y += 2;

  // Posting strategy
  writeLabel('Posting Frequency');
  const timeFreq = data.answers.time === 'Under 5 hours' ? '3 posts per week — quality over quantity.' : data.answers.time === '5–10 hours' ? '5 posts per week — mix static posts with short-form video.' : 'Post daily with stories. Consistency is your competitive advantage.';
  writeText(timeFreq, 9);
  y += 2;

  // 3-Post Starter
  writeLabel('3-Post Starter Strategy');
  writeText(`Education: ${d.threePostStrategy.education}`, 9);
  y += 1;
  writeText(`Behind-the-Scenes: ${d.threePostStrategy.bts}`, 9);
  y += 1;
  writeText(`Sales: ${d.threePostStrategy.sales}`, 9);
  y += 2;

  // Content calendar starter
  writeLabel('Content Calendar (Week 1)');
  writeText('Day 1: Introduction — Who you are and what you sell', 9);
  writeText('Day 2: Behind-the-scenes of your process', 9);
  writeText('Day 3: Education content — Show your expertise', 9);
  writeText('Day 4: Customer testimonial or social proof', 9);
  writeText('Day 5: Product showcase with clear CTA', 9);
  writeText('Day 6: Story or relatability post', 9);
  writeText('Day 7: Recap and week ahead teaser', 9);

  // ═══ ROOM 06: PLATFORM SETUP ═══
  addPage('06', 'The Foundation Room');
  writeText(`These are the exact steps to get ${d.name} live and ready to sell on ${platforms.slice(0, 2).join(' and ')}.`, 10, 'italic', accent);
  y += 3;

  writeLabel('Critical: Do This First');
  writeText('Profile completeness matters. Buyers judge you in seconds. Every field you leave blank is a barrier to trust.', 9, 'bold');
  y += 2;

  platforms.slice(0, 2).forEach((p: string) => {
    writeLabel(`On ${p}:`);
    const setup = data.aiResults?.platformSetup?.[p] || `1. Create your account\n2. Complete all profile fields — bio, photo, links, everything\n3. Add your first product/service listing with photos\n4. Set up payment processing (connect your bank)\n5. Write a clear description of what you sell and who it's for\n6. Make your link shareable and test it works`;
    writeText(setup, 8);
    y += 3;
  });

  writeLabel('After Setup');
  writeText('Once both are live, test purchasing from each platform. Buy your own product. Review the whole experience. This catches problems before customers do.', 9, 'italic');

  // ═══ ROOM 07: FIRST SALE ═══
  addPage('07', 'First Sale Plan');
  const fs = data.aiResults?.firstSale;
  writeLabel('The Promise');
  writeText(fs?.promise || d.promise, 10, 'italic');
  y += 2;
  writeLabel("Today's Action");
  writeText(fs?.todayAction || d.todayAction, 9);
  y += 2;
  if (fs?.weekOnePlan || d.w1Static) {
    writeLabel('Week One Plan');
    writeText(fs?.weekOnePlan || d.w1Static, 9);
    y += 2;
  }
  if (fs?.weekTwoPlan || d.w2Static) {
    writeLabel('Week Two Plan');
    writeText(fs?.weekTwoPlan || d.w2Static, 9);
    y += 2;
  }
  if (fs?.firstClientScript || d.staticScript) {
    writeLabel('First Client Script');
    writeText(fs?.firstClientScript || d.staticScript, 9, 'italic');
    y += 2;
  }
  if (fs?.mindsetNote || d.blockerNote) {
    writeLabel('Mindset Note');
    writeText(fs?.mindsetNote || d.blockerNote, 9, 'italic');
  }

  // ═══ ROOM 08: CONTENT STUDIO ═══
  addPage('08', 'The Content Studio');
  const mk = data.aiResults?.marketing;
  writeText('Content is how customers find you before they\'re ready to buy.', 10, 'italic', accent);
  y += 3;

  writeLabel('Content Pillars');
  if (mk?.contentPillars?.length) {
    mk.contentPillars.forEach((cp: any) => {
      writeText(cp.pillar, 9, 'bold');
      writeText(cp.description, 9);
      if (cp.examplePosts?.length) {
        cp.examplePosts.forEach((ep: string) => writeText(`Example: "${ep}"`, 8, 'italic'));
      }
      y += 2;
    });
  } else {
    writeText('Pillar 1: Show the work', 9, 'bold');
    writeText('Behind-the-scenes, process, making-of. This builds connection.', 9);
    y += 2;
    writeText('Pillar 2: Educate your buyer', 9, 'bold');
    writeText(d.pillar2, 9);
    y += 2;
    writeText('Pillar 3: Sell with story', 9, 'bold');
    writeText('Results, testimonials, before/after. This proves value.', 9);
    y += 2;
  }

  writeLabel('Your Brand Voice');
  if (mk?.coreMessage) {
    writeText(mk.coreMessage, 10, 'italic');
  } else {
    writeText(d.salesScript.hook, 10, 'italic');
  }
  y += 2;

  writeLabel('Content Batching System');
  writeText('Set one day per week to batch-create content for the next 2 weeks. Spend 3-4 hours filming/writing, then schedule it across your platforms.', 9);
  y += 2;

  writeLabel('What NOT to Post');
  writeText('Unfinished work, depressing news cycles, or complaints about your customers. Your feed is your portfolio — curate it like one.', 9);

  // ═══ ROOM 09: MARKETING ═══
  addPage('09', 'The Marketing Room');
  writeLabel('3-Week Launch Plan');
  writeText(`Week 1: ${d.launchPlan.w1}`, 9);
  y += 2;
  writeText(`Week 2: ${d.launchPlan.w2}`, 9);
  y += 2;
  writeText(`Week 3: ${d.launchPlan.w3}`, 9);
  y += 3;

  writeLabel('Daily Action System');
  writeText(`Batch content on your chosen day, schedule across ${(social[0] || 'your platform')} and email. Consistency beats perfection.`, 9);
  y += 2;

  if (mk?.weeklyRoutine) { writeLabel('Weekly Routine'); writeText(mk.weeklyRoutine, 9); y += 2; }
  if (mk?.emailStrategy) { writeLabel('Email Strategy'); writeText(mk.emailStrategy, 9); y += 2; }
  if (mk?.sellingWithoutBegging) { writeLabel('Selling Without Begging'); writeText(mk.sellingWithoutBegging, 9); y += 2; }

  writeLabel('Free Promotion Ideas');
  if (mk?.freePromotion?.length) {
    mk.freePromotion.forEach((fp: string) => writeBullet(fp));
  } else {
    writeBullet('Email list signup offer');
    writeBullet('Free sample, trial, or consultation');
    writeBullet('Behind-the-scenes content series');
    writeBullet('Educational guides or templates');
    writeBullet('Live Q&A or workshop');
  }
  y += 2;

  writeLabel('Quick Wins');
  if (mk?.quickWins?.length) {
    mk.quickWins.forEach((qw: string) => writeBullet(qw));
  } else {
    writeBullet('Repost customer testimonials and reviews');
    writeBullet('Share relevant industry news with your take');
    writeBullet('Behind-the-scenes updates from your day');
    writeBullet('Seasonal promotions and limited-time offers');
    writeBullet('Partner with complementary creators for shoutouts');
  }

  // ═══ ROOM 10: 90-DAY PLAN ═══
  const bp = data.aiResults?.businessPlan;
  addPage('10', '90-Day Plan');
  if (bp?.ninetyDayGoal) {
    writeLabel('90-Day Goal');
    writeText(bp.ninetyDayGoal, 10, 'italic');
    y += 2;
  }
  if (bp?.revenueTarget) {
    writeLabel('Revenue Target');
    writeText(bp.revenueTarget, 9);
    y += 2;
  }

  if (bp?.focusOn?.length) {
    writeLabel('Focus On');
    bp.focusOn.forEach((f: string) => writeBullet(f));
    y += 1;
  }
  if (bp?.ignoreForNow?.length) {
    writeLabel('Ignore For Now');
    bp.ignoreForNow.forEach((f: string) => writeBullet(f));
    y += 1;
  }

  // Month-by-Month Roadmap using derived data
  writeLabel('Month-by-Month Roadmap');
  writeText(`Month 1 — Foundation`, 9, 'bold');
  writeText(d.monthPlans.foundation, 9);
  y += 2;

  writeText(`Month 2 — Growth`, 9, 'bold');
  writeText(d.monthPlans.traction, 9);
  y += 2;

  writeText(`Month 3 — Scale`, 9, 'bold');
  writeText(d.monthPlans.scale, 9);
  y += 2;

  if (bp?.personalNote) {
    writeLabel('Personal Note');
    writeText(bp.personalNote, 9, 'italic');
  }

  // ═══ ROOM 11: MISSION ═══
  addPage('11', 'The Mission Room');
  writeLabel('Your Mission Statement');
  writeText(bp?.mission || d.missionLine || d.mission, 11, 'italic');
  y += 4;

  writeLabel('Your Starting Point');
  writeText(d.blockerNote, 9);
  y += 2;

  writeLabel('Your Experience Level');
  writeText(d.expNote, 9);
  y += 2;

  writeLabel('Your Timeline');
  writeText(d.urgencyNote, 9);
  y += 2;

  writeLabel('Why This Matters');
  writeText('Your mission is not for Instagram — it\'s for the 3am moment when you doubt yourself. Refer back to this room. It\'s why you started.', 9, 'italic');

  // ═══ ROOM 12: DESIGN STUDIO ═══
  addPage('12', 'The Design Studio');
  const br = data.aiResults?.branding;
  if (br?.brandVibe || d.brandId.voice) {
    writeLabel('Brand Feeling');
    writeText(br?.brandVibe || d.brandId.voice, 10, 'italic');
  }
  if (d.brandId.moodboard) {
    writeLabel('Brand Moodboard');
    writeText(d.brandId.moodboard, 9, 'italic');
  }

  // Colour palette
  if (data.colours.length > 0) {
    writeLabel('Your Colour Palette');
    const swatchH = 18;
    const maxSwatches = Math.min(data.colours.length, 6);
    const swatchW = contentW / maxSwatches - 3;
    let sx = margin;
    if (y + swatchH + 20 > H - 20) addPage('', '');
    data.colours.slice(0, maxSwatches).forEach(c => {
      const rgb = hexToRgb(c.hex || '#c4a89a');
      doc.setFillColor(...rgb);
      doc.roundedRect(sx, y, swatchW, swatchH, 2, 2, 'F');
      doc.setFontSize(6);
      doc.setTextColor(...dark);
      doc.text(c.name || '', sx + swatchW / 2, y + swatchH + 5, { align: 'center' });
      doc.setFontSize(5);
      doc.setTextColor(...accent);
      doc.text(c.hex || '', sx + swatchW / 2, y + swatchH + 9, { align: 'center' });
      sx += swatchW + 3;
    });
    y += swatchH + 16;
    // Write colour uses
    data.colours.forEach(c => {
      if (c.use) writeText(`${c.name}: ${c.use}`, 8, 'normal', accent);
    });
  }

  // Typography
  if (br?.fonts?.length) {
    writeLabel('Typography');
    br.fonts.forEach((f: any) => writeText(`${f.role}: ${f.name} — ${f.why}`, 9));
  } else if (d.brandId.typo) {
    writeLabel('Typography');
    writeText(d.brandId.typo, 10, 'bold');
    if (d.brandId.typoWhy) writeText(d.brandId.typoWhy, 9);
  }

  // Logo
  if (br?.logoConcepts?.length) {
    writeLabel('Logo Concepts');
    br.logoConcepts.forEach((lc: any) => {
      writeText(lc.name, 10, 'bold');
      writeText(lc.description, 9);
      y += 2;
    });
  } else {
    writeLabel('Logo Direction');
    writeText('Concept A — Primary', 9, 'bold');
    writeText(d.brandId.logo, 9);
    y += 2;
    writeText('Concept B — Alternative', 9, 'bold');
    writeText(d.brandId.logo2, 9);
  }

  // Design do/don't
  if (br?.designDo?.length || d.brandId.designDo?.length) {
    writeLabel("Design Do's");
    (br?.designDo || d.brandId.designDo).forEach((item: string) => writeBullet(item));
  }
  if (br?.designDont?.length || d.brandId.designDont?.length) {
    writeLabel("Design Don'ts");
    (br?.designDont || d.brandId.designDont).forEach((item: string) => writeBullet(item));
  }

  // Premium note
  if (d.brandId.premiumNote) {
    writeLabel('Premium Design Note');
    writeText(d.brandId.premiumNote, 9, 'italic');
  }

  // ═══ FINAL PAGE ═══
  doc.addPage();
  doc.setFillColor(...dark);
  doc.rect(0, 0, W, H, 'F');
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.2);
  doc.line(W * 0.3, H / 2 - 30, W * 0.7, H / 2 - 30);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(20);
  doc.setTextColor(...white);
  doc.text('The Dollhouse', W / 2, H / 2 - 14, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...accent);
  doc.text(`Built for ${data.name}`, W / 2, H / 2 + 2, { align: 'center' });
  doc.setFontSize(6);
  doc.text(`Generated ${date} · Personal Use Only · © 2026 The Dollhouse`, W / 2, H / 2 + 16, { align: 'center' });
  doc.line(W * 0.3, H / 2 + 24, W * 0.7, H / 2 + 24);

  return doc.output('blob');
}
