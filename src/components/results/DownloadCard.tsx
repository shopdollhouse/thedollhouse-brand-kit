import { useEffect, useState } from 'react';
import { playClick, playChime } from '@/lib/sounds';
import { toast } from 'sonner';
import { generateBlueprintPDF, generateResultsPagePDF } from '@/lib/pdf-generator';
import { getBrandIdentity } from '@/lib/brand-identity';
import { cleanAnswer, derive } from '@/lib/quiz-helpers';
import GoldConfetti from '../GoldConfetti';
import DollhouseMark from '@/components/DollhouseMark';

interface DownloadCardProps { answers: Record<string, string>; aiResults: any; onDownloadRef?: (fn: () => void) => void; }

export default function DownloadCard({ answers, aiResults, onDownloadRef }: DownloadCardProps) {
  const name = cleanAnswer(answers.firstName, 'You').split(' ')[0] || 'You';
  const brand = cleanAnswer(answers.brandName, aiResults?.businessNames?.[0] || name);

  const [generating, setGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const downloadPDF = async () => {
    playClick('soft');
    setGenerating(true);

    try {
      const d = derive(answers);

      const brandId = getBrandIdentity(answers.aesthetic || '', answers.vibe || '', answers.budget || '', answers.customer || '', answers.product || '');
      const br = aiResults?.branding || {};
      const colours = br.colours?.length ? br.colours : brandId.colours.map((c: any) => ({ name: c.n, hex: c.c, use: c.use }));

      const pdfData = {
        name,
        brand: brand || name,
        product: cleanAnswer(answers.product),
        aesthetic: cleanAnswer(answers.aesthetic),
        mission: aiResults?.businessPlan?.mission || d.mission || brandId.voice || '',
        platforms: aiResults?.recommendedPlatforms || d.topPlatforms || [],
        social: d.social || [],
        priceHint: aiResults?.startingPrice || d.priceHint || '',
        colours,
        aiResults: {
          ...aiResults,
          businessPlan: aiResults?.businessPlan || {
            mission: d.mission,
            ninetyDayGoal: d.monthPlans.scale,
            revenueTarget: 'Track monthly revenue growth from first sale',
            focusOn: ['Get first sale', 'Build email list', 'Create content system'],
            ignoreForNow: ['Advanced analytics', 'Paid advertising', 'Hiring team members'],
            personalNote: d.missionLine,
          },
          firstSale: aiResults?.firstSale || {
            promise: d.promise,
            todayAction: d.todayAction,
            weekOnePlan: d.w1Static,
            weekTwoPlan: d.w2Static,
            firstClientScript: d.staticScript,
            mindsetNote: d.blockerNote,
          },
          marketing: aiResults?.marketing || {
            coreMessage: d.salesScript.value,
            contentPillars: [
              { pillar: 'Show the work', description: 'Behind-the-scenes, process, making-of', examplePosts: [] },
              { pillar: 'Educate', description: d.pillar2, examplePosts: [] },
              { pillar: 'Sell with story', description: 'Results, testimonials, before/after', examplePosts: [] },
            ],
            weeklyRoutine: `Batch content in blocks: ${d.monthPlans.foundation}`,
            emailStrategy: 'Start with a welcome email and send weekly updates when you have news to share',
            freePromotion: ['Email list signup', 'Free sample or trial', 'Behind-the-scenes content', 'Educational guides'],
            quickWins: ['Repost customer testimonials', 'Share relevant industry news', 'Behind-the-scenes updates', 'Seasonal promotions'],
          },
          branding: aiResults?.branding || {
            brandVibe: d.salesScript.hook,
            logoConcepts: [
              { name: 'Concept A', description: brandId.logo },
              { name: 'Concept B', description: brandId.logo2 },
            ],
            fonts: [
              { role: 'Display', name: 'Cormorant Garamond', why: 'Elegant and memorable for brand identity' },
              { role: 'Body', name: 'Inter', why: 'Clean, readable, modern and accessible' },
            ],
            colours: colours,
            designDo: brandId.designDo || ['Keep it simple', 'Be consistent', 'Prioritize readability'],
            designDont: brandId.designDont || ['Don\'t copy competitors', 'Don\'t use too many fonts', 'Don\'t sacrifice clarity for trends'],
          },
          recommendedPlatforms: d.topPlatforms || [],
          platformReasons: {
            [d.topPlatforms[0]]: `Recommended for your ${d.vibe || 'starter'} business selling to ${d.customer}`,
            [d.topPlatforms[1]]: `Secondary platform to expand reach beyond your primary audience`,
          },
          platformSetup: {
            [d.topPlatforms[0]]: '1. Create your account\n2. Complete all profile fields\n3. Upload your first listing\n4. Set up payment method\n5. Share your link',
            [d.topPlatforms[1]]: '1. Create your account\n2. Complete all profile fields\n3. Link to your primary platform\n4. Start building audience',
          },
          productRecommendation: `Focus on selling ${d.product} to ${d.customer}`,
          startingPrice: d.priceHint || 'Starting at $' + (answers.budget === 'Under $50' ? '18-35' : answers.budget === '$50-$200' ? '28-65' : '45-120'),
        },
        answers,
        d,
      };

      const blob = await generateResultsPagePDF({ name, brand: brand || name }).catch(() => {
        return generateBlueprintPDF(pdfData);
      });
      const slug = (brand || name).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}_blueprint.pdf`;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      playChime();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      toast('Blueprint downloaded ✦', { duration: 2500 });
    } catch {
      toast('Download failed — try again', { duration: 3000 });
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    playClick('soft');
    const text = [
      'THE DOLLHOUSE — BRAND BLUEPRINT',
      `Built for ${name}`,
      '',
      `BRAND NAME: ${brand}`,
      `PRODUCT: ${aiResults?.productRecommendation || cleanAnswer(answers.product, '—')}`,
      `STARTING PRICE: ${aiResults?.startingPrice || '—'}`,
      `SELL ON: ${aiResults?.recommendedPlatforms?.join(' + ') || '—'}`,
      `AESTHETIC: ${answers.aesthetic || '—'}`,
      '',
      `MISSION: ${aiResults?.businessPlan?.mission || '—'}`,
      '',
      `Licensed to ${name} · No Resale · © 2026 The Dollhouse`,
      'Visit shopdollhouse.co to take this further.',
    ].join('\n');
    navigator.clipboard?.writeText(text);
    toast('Copied to clipboard ✦', { duration: 2000 });
  };

  useEffect(() => { onDownloadRef?.(downloadPDF); }, [onDownloadRef]);

  return (
    <>
      <GoldConfetti active={showConfetti} />
      <div className="dh-no-print rounded-3xl p-[44px_36px] text-center relative overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.18)] mb-7"
        style={{ background: 'var(--dh-dark-bg)' }}>
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, transparent, var(--dh-accent), transparent)' }} />
        <div className="mb-[18px]"><DollhouseMark size={40} /></div>
        <p className="font-ui text-[10px] tracking-[6px] uppercase mb-3.5 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>Save Your Blueprint</p>
        <p className="font-display italic mb-2" style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: 'rgba(255,255,255,0.92)' }}>Your Blueprint is Ready</p>
        <p className="font-body text-sm font-light mb-6 leading-[1.8]" style={{ color: 'rgba(255,255,255,0.4)' }}>Exports the full premium results page — your rooms, strategy, visuals, and first-sale plan — yours to keep forever.</p>
        <div className="flex flex-col items-center gap-2.5 mb-5">
          <button onClick={downloadPDF} disabled={generating}
            className="dh-download-trigger inline-flex items-center justify-center gap-2.5 py-[17px] px-9 rounded-full font-ui text-[10px] tracking-[4px] uppercase font-medium w-full max-w-[320px] cursor-pointer transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--dh-dark-bg)', border: 'none' }}>
            {generating ? (
              <>
                <span className="inline-block w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--dh-dark-bg)', borderTopColor: 'transparent' }} />
                Exporting PDF…
              </>
            ) : (
              '⬇ Download Blueprint PDF'
            )}
          </button>
          <button onClick={copyToClipboard}
            className="inline-flex items-center justify-center gap-2.5 py-[17px] px-9 rounded-full font-ui text-[10px] tracking-[4px] uppercase cursor-pointer font-medium w-full max-w-[320px] transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
            📋 Copy to Clipboard
          </button>
        </div>
      </div>
    </>
  );
}
