import { useEffect, useState } from 'react';
import { playClick, playChime } from '@/lib/sounds';
import { toast } from 'sonner';
import { generateBlueprintPDF } from '@/lib/pdf-generator';
import { getBrandIdentity } from '@/lib/brand-identity';
import GoldConfetti from '../GoldConfetti';

const ArchIcon = () => (
  <svg width="34" height="47" viewBox="0 -8 56 86" fill="none">
    <path d="M10 78 L10 28 Q10 5 28 5 Q46 5 46 28 L46 78" stroke="var(--dh-accent)" strokeWidth="1.3" fill="none" />
    <path d="M17 78 L17 31 Q17 16 28 16 Q39 16 39 31 L39 78" stroke="var(--dh-accent)" strokeWidth="0.6" fill="none" opacity="0.4" />
    <path d="M28 2 L27 0.9 C26.2 0 25 0 24.2 0.9 C23.4 1.8 23.4 3.1 24.2 4 L28 8 L31.8 4 C32.6 3.1 32.6 1.8 31.8 0.9 C31 0 29.8 0 29 0.9 Z" fill="var(--dh-accent)" opacity="0.8" />
  </svg>
);

interface DownloadCardProps { answers: Record<string, string>; aiResults: any; onDownloadRef?: (fn: () => void) => void; }

export default function DownloadCard({ answers, aiResults, onDownloadRef }: DownloadCardProps) {
  const name = (answers.firstName || '').split(' ')[0] || 'You';
  const brand = (answers.brandName && answers.brandName !== '__skip__') ? answers.brandName : aiResults?.businessNames?.[0] || name;

  const [generating, setGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const downloadPDF = async () => {
    playClick('soft');
    setGenerating(true);

    try {
      const brandId = getBrandIdentity(answers.aesthetic || '', answers.vibe || '', answers.budget || '', answers.customer || '', answers.product || '');
      const br = aiResults?.branding || {};
      const colours = br.colours?.length ? br.colours : brandId.colours.map((c: any) => ({ name: c.n, hex: c.c, use: c.use }));

      const pdfData = {
        name,
        brand: brand || name,
        product: answers.product || '',
        aesthetic: answers.aesthetic || '',
        mission: aiResults?.businessPlan?.mission || brandId.voice || '',
        platforms: aiResults?.recommendedPlatforms || [],
        social: [],
        priceHint: aiResults?.startingPrice || '',
        colours,
        aiResults,
        answers,
      };

      const blob = await generateBlueprintPDF(pdfData);
      const slug = (brand || name).replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}_blueprint.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 500);

      playChime();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
      toast('Blueprint downloaded ✦', { duration: 2500 });
    } catch (err) {
      console.error('PDF generation error:', err);
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
      `PRODUCT: ${aiResults?.productRecommendation || answers.product || '—'}`,
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
        <div className="mb-[18px]"><ArchIcon /></div>
        <p className="font-ui text-[10px] tracking-[6px] uppercase mb-3.5 font-medium" style={{ color: 'rgba(255,255,255,0.3)' }}>Save Your Blueprint</p>
        <p className="font-display italic mb-2" style={{ fontSize: 'clamp(20px, 3vw, 28px)', color: 'rgba(255,255,255,0.92)' }}>Your Blueprint is Ready</p>
        <p className="font-body text-sm font-light mb-6 leading-[1.8]" style={{ color: 'rgba(255,255,255,0.4)' }}>Beautifully typeset with your name, brand colours, and strategy — yours to keep forever.</p>
        <div className="flex flex-col items-center gap-2.5 mb-5">
          <button onClick={downloadPDF} disabled={generating}
            className="dh-download-trigger inline-flex items-center justify-center gap-2.5 py-[17px] px-9 rounded-full font-ui text-[10px] tracking-[4px] uppercase font-medium w-full max-w-[320px] cursor-pointer transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.92)', color: 'var(--dh-dark-bg)', border: 'none' }}>
            {generating ? (
              <>
                <span className="inline-block w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--dh-dark-bg)', borderTopColor: 'transparent' }} />
                Generating PDF…
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
