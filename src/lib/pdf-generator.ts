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

  // Derive all quiz data
  const d = derive(data.answers);

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

  // Tiny doorway/arch mark at top center
  const archCx = W / 2;
  const archTop = 30;
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.5);
  // arch body
  doc.line(archCx - 5, archTop + 14, archCx - 5, archTop + 4);
  doc.line(archCx + 5, archTop + 14, archCx + 5, archTop + 4);
  // arch curve (approx with two short lines)
  doc.line(archCx - 5, archTop + 4, archCx, archTop);
  doc.line(archCx, archTop, archCx + 5, archTop + 4);
  // little finial dot
  doc.setFillColor(...gold);
  doc.circle(archCx, archTop - 2, 0.7, 'F');

  // "— THE DOLLHOUSE —" header (spaced caps with side rules)
  y = archTop + 24;
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
  y += 18;
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(...roseSoft);
  doc.text('Your Brand Blueprint', W / 2, y, { align: 'center' });

  // BIG italic brand name (the "Stickers" of the reference)
  y += 26;
  doc.setFont('times', 'italic');
  doc.setFontSize(64);
  doc.setTextColor(...rose);
  // Auto-shrink to fit
  let displayBrand = brand;
  let bSize = 64;
  while (doc.getTextWidth(displayBrand) > contentW - 20 && bSize > 28) {
    bSize -= 2;
    doc.setFontSize(bSize);
  }
  doc.text(displayBrand, W / 2, y, { align: 'center' });

  // Italic descriptor line
  y += 18;
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
  y += 16;
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
  y += 28;
  doc.setDrawColor(...goldSoft);
  doc.setLineWidth(0.5);
  doc.circle(W / 2, y, 6, 'S');
  doc.setFontSize(11);
  doc.setTextColor(...gold);
  doc.text('♥', W / 2, y + 2, { align: 'center' });

  // Colour swatches (smaller, beneath the medallion)
  if (data.colours.length > 0) {
    y += 18;
    const swatchSize = 10;
    const sgap = 5;
    const totalSW = data.colours.length * swatchSize + (data.colours.length - 1) * sgap;
    let sx = (W - totalSW) / 2;
    data.colours.forEach(c => {
      const rgb = hexToRgb(c.hex || '#c4a89a');
      doc.setFillColor(...rgb);
      doc.setDrawColor(...goldSoft);
      doc.setLineWidth(0.2);
      doc.roundedRect(sx, y, swatchSize, swatchSize, 1.6, 1.6, 'FD');
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
  y += 4;
  writeLabel('Your Mission');
  writeText(data.aiResults?.businessPlan?.mission || d.mission, 11, 'italic');

  // ═══ ROOM 02: MARKETPLACE ═══
  addPage('02', 'The Marketplace Room');
  writeText('Based on what you sell, your budget, and how you want to work — these are your platforms.', 10, 'italic', accent);
  y += 2;
  const platforms = data.aiResults?.recommendedPlatforms || d.topPlatforms;
  platforms.forEach((p: string) => {
    writeLabel(p);
    const reason = data.aiResults?.platformReasons?.[p] || `${p} is the strongest match for your business type.`;
    writeText(reason, 9);
    y += 2;
  });

  // ═══ ROOM 03: PRODUCT ═══
  addPage('03', 'The Product Room');
  writeText(data.aiResults?.productRecommendation || `Your product is ${data.product}.`, 10, 'italic');
  if (data.aiResults?.startingPrice) {
    writeLabel('Starting Price');
    writeText(data.aiResults.startingPrice, 10);
  }

  // ═══ ROOM 04: PRICING ═══
  addPage('04', 'The Money Room');
  writeText(`Three tiers gives ${d.customer} a choice without confusion.`, 10, 'italic', accent);
  y += 2;
  writeLabel('Entry Tier');
  writeText(d.priceEntry, 10, 'bold');
  writeText('Lowest barrier. Gets them through the door.', 9);
  writeLabel('Core Tier (Start Here)');
  writeText(d.priceCore, 10, 'bold');
  writeText('Your flagship. Best margin, best value.', 9);
  writeLabel('Premium Tier');
  writeText(d.pricePrem, 10, 'bold');
  writeText('For buyers who want the best. Always have one.', 9);

  // Sales Script
  writeLabel('Your High-Conversion Script');
  writeText(`Hook: ${d.salesScript.hook}`, 9, 'italic');
  writeText(`Value: ${d.salesScript.value}`, 9);
  writeText(`CTA: ${d.salesScript.cta}`, 9, 'bold');

  // ═══ ROOM 05: SOCIAL ═══
  addPage('05', 'The Social Room');
  const social = d.social;
  writeLabel('Primary Platform');
  writeText(social[0] || '—', 10, 'bold');
  writeLabel('Secondary Platform');
  writeText(social[1] || '—', 10, 'bold');
  y += 2;

  // Posting strategy
  writeLabel('Posting Frequency');
  const timeFreq = data.answers.time === 'Under 5 hours' ? '3 posts per week — quality over quantity.' : data.answers.time === '5–10 hours' ? '5 posts per week — mix static posts with short-form video.' : 'Post daily with stories. Consistency is your competitive advantage.';
  writeText(timeFreq, 9);

  // 3-Post Starter
  writeLabel('3-Post Starter Strategy');
  writeText(`Education: ${d.threePostStrategy.education}`, 9);
  writeText(`Behind-the-Scenes: ${d.threePostStrategy.bts}`, 9);
  writeText(`Sales: ${d.threePostStrategy.sales}`, 9);

  // ═══ ROOM 06: PLATFORM SETUP ═══
  addPage('06', 'The Foundation Room');
  writeText(`These are the exact steps to get ${d.name} live on ${platforms.join(' and ')}.`, 10, 'italic', accent);
  y += 2;
  platforms.forEach((p: string) => {
    writeLabel(`${p} — Setup Steps`);
    const setup = data.aiResults?.platformSetup?.[p] || `1. Create your account on ${p}.\n2. Complete every profile field.\n3. Add your first listing.\n4. Set up payments.\n5. Share your link everywhere.`;
    writeText(setup, 9);
    y += 2;
  });

  // ═══ ROOM 07: FIRST SALE ═══
  addPage('07', 'First Sale Plan');
  const fs = data.aiResults?.firstSale;
  writeLabel('The Promise');
  writeText(fs?.promise || d.promise, 10, 'italic');
  writeLabel("Today's Action");
  writeText(fs?.todayAction || d.todayAction, 9);
  if (fs?.weekOnePlan) { writeLabel('Week One'); writeText(fs.weekOnePlan, 9); }
  if (fs?.weekTwoPlan) { writeLabel('Week Two'); writeText(fs.weekTwoPlan, 9); }
  if (fs?.firstClientScript) { writeLabel('First Client Script'); writeText(fs.firstClientScript, 9); }
  if (fs?.mindsetNote) { writeLabel('Mindset Note'); writeText(fs.mindsetNote, 9, 'italic'); }

  // ═══ ROOM 08: CONTENT STUDIO ═══
  addPage('08', 'The Content Studio');
  const mk = data.aiResults?.marketing;
  writeText('Content is how customers find you before they\'re ready to buy.', 10, 'italic', accent);
  y += 2;
  if (mk?.contentPillars?.length) {
    writeLabel('Content Pillars');
    mk.contentPillars.forEach((cp: any) => {
      writeText(cp.pillar, 9, 'bold');
      writeText(cp.description, 9);
      if (cp.examplePosts?.length) {
        cp.examplePosts.forEach((ep: string) => writeText(`→ "${ep}"`, 9, 'italic'));
      }
      y += 2;
    });
  } else {
    writeLabel('Content Pillars');
    writeText('Pillar 1 — Show the work: Behind-the-scenes, process, making-of.', 9);
    writeText(`Pillar 2 — Educate your buyer: ${d.pillar2}`, 9);
    writeText(`Pillar 3 — Sell with story: Results, testimonials, before/after.`, 9);
  }
  if (mk?.coreMessage || d.brandId.voice) {
    writeLabel('Your Brand Voice');
    writeText(mk?.coreMessage || d.brandId.voice, 10, 'italic');
  }

  // ═══ ROOM 09: MARKETING ═══
  addPage('09', 'The Marketing Room');
  writeLabel('3-Week Launch Plan');
  writeText(`Week 1: ${d.launchPlan.w1}`, 9);
  y += 1;
  writeText(`Week 2: ${d.launchPlan.w2}`, 9);
  y += 1;
  writeText(`Week 3: ${d.launchPlan.w3}`, 9);
  y += 2;

  if (mk?.weeklyRoutine) { writeLabel('Weekly Routine'); writeText(mk.weeklyRoutine, 9); }
  if (mk?.emailStrategy) { writeLabel('Email Strategy'); writeText(mk.emailStrategy, 9); }
  if (mk?.sellingWithoutBegging) { writeLabel('Selling Without Begging'); writeText(mk.sellingWithoutBegging, 9); }
  if (mk?.freePromotion?.length) {
    writeLabel('Free Promotion Ideas');
    mk.freePromotion.forEach((fp: string) => writeBullet(fp));
  }
  if (mk?.quickWins?.length) {
    writeLabel('Quick Wins');
    mk.quickWins.forEach((qw: string) => writeBullet(qw));
  }

  // ═══ ROOM 10: 90-DAY PLAN ═══
  const bp = data.aiResults?.businessPlan;
  addPage('10', '90-Day Plan');
  if (bp?.ninetyDayGoal) { writeLabel('90-Day Goal'); writeText(bp.ninetyDayGoal, 10, 'italic'); }
  if (bp?.revenueTarget) { writeLabel('Revenue Target'); writeText(bp.revenueTarget, 9); }
  if (bp?.focusOn?.length) { writeLabel('Focus On'); bp.focusOn.forEach((f: string) => writeBullet(f)); }
  if (bp?.ignoreForNow?.length) { writeLabel('Ignore For Now'); bp.ignoreForNow.forEach((f: string) => writeBullet(f)); }
  if (bp?.personalNote) { writeLabel('Personal Note'); writeText(bp.personalNote, 9, 'italic'); }

  // Static 90-day roadmap
  writeLabel('Month-by-Month Roadmap');
  writeText(`Month 1 — Foundation: Set up ${platforms.join(' and ')}. List your first product. Post on ${social[0]} at least 3x/week. Get your first sale or enquiry.`, 9);
  writeText(`Month 2 — Growth: Double down on what got traction. Add a second product or variation. Collect testimonials. Start email list.`, 9);
  writeText(`Month 3 — Scale: Raise prices on your best seller. Launch premium tier. Explore paid promotion. Build repeatable systems.`, 9);

  // ═══ ROOM 11: MISSION ═══
  addPage('11', 'The Mission Room');
  writeLabel('Your Mission Statement');
  writeText(bp?.mission || d.mission, 11, 'italic');
  y += 4;
  writeLabel('Your Blocker');
  writeText(d.blockerNote, 9);
  writeLabel('Your Experience Level');
  writeText(d.expNote, 9);
  writeLabel('Your Timeline');
  writeText(d.urgencyNote, 9);

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
