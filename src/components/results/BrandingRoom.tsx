import { useState } from 'react';
import { Check, X, Palette, Type, Sparkles, Eye, AlertCircle, Copy, Store, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { playClick } from '@/lib/sounds';
import RoomCard from './RoomCard';

interface BrandingRoomProps { aiResults: any; brandId: any; product: string; customer?: string; aesthetic?: string; brand?: string | null; priceHint?: string; firstPlatform?: string; }

export default function BrandingRoom({ aiResults, brandId, product, customer, aesthetic, brand, priceHint, firstPlatform }: BrandingRoomProps) {
  const br = aiResults?.branding || {};
  const colours = br.colours?.length ? br.colours : brandId.colours;
  const fonts = br.fonts || [];
  const logoConcepts = br.logoConcepts || [];

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const brandTitle = brand || 'Working Title';
  const displayFont = fonts[0]?.name || brandId.typo?.split('—')[0]?.trim() || 'Cormorant Garamond';
  const bodyFont = fonts[1]?.name || 'Outfit';
  const getReadableInk = (hex?: string) => {
    if (!hex || !hex.startsWith('#')) return '#2a1812';
    const raw = hex.replace('#', '');
    const r = parseInt(raw.slice(0, 2), 16) || 255;
    const g = parseInt(raw.slice(2, 4), 16) || 255;
    const b = parseInt(raw.slice(4, 6), 16) || 255;
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.62 ? '#2a1812' : '#fff8f4';
  };
  const socialCardBg = colours[0]?.hex || colours[0]?.c || '#f4dfd8';
  const socialCardInk = getReadableInk(socialCardBg);

  const copyHex = (hex: string, idx: number) => {
    navigator.clipboard?.writeText(hex);
    playClick('soft');
    setCopiedIdx(idx);
    toast('Saved to Brand Board!', { duration: 2000 });
    setTimeout(() => setCopiedIdx(null), 1500);
  };
  const copyBrandBoard = () => {
    const text = [
      `${brandTitle} Brand Board`,
      `Aesthetic: ${aesthetic || 'Soft & feminine'}`,
      `Offer: ${product}`,
      `Customer: ${customer || 'your best-fit buyer'}`,
      '',
      'Palette:',
      ...colours.map((c: any) => `${c.name || c.n}: ${c.hex || c.c} — ${c.use || 'Use intentionally across your brand system'}`),
      '',
      `Font Pairing: ${displayFont} + ${bodyFont}`,
      `Logo Direction: ${logoConcepts[0]?.description || brandId.logo}`,
      `Voice: ${br.brandVibe || brandId.voice}`,
    ].join('\n');
    navigator.clipboard?.writeText(text);
    playClick('soft');
    toast('Brand board copied!', { duration: 2200 });
  };

  return (
    <RoomCard num="12" name="The Design Studio" tagline="Your brand identity — colours, fonts, logo direction"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent)" strokeWidth="1.6" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}>
      
      {/* Brand Vibe */}
      {(br.brandVibe || brandId.voice) && (
        <div className="p-6 rounded-2xl mb-8" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
          <div className="flex items-center gap-2.5 mb-2">
            <Eye size={14} className="text-dh-accent-dark" />
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium">Your Brand Feeling</p>
          </div>
          <p className="font-display italic text-[19px] leading-[1.85] text-dh-text-mid">{br.brandVibe || brandId.voice}</p>
        </div>
      )}

      {/* Moodboard */}
      {brandId.moodboard && (
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-3">
            <Sparkles size={14} className="text-dh-accent-dark" />
            <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark font-medium">Brand Moodboard</p>
          </div>
          <p className="font-body text-[13px] text-dh-text-mid font-light leading-[1.9] italic">{brandId.moodboard}</p>
        </div>
      )}

      {/* Colour Palette */}
      <div className="flex items-center gap-2.5 mb-4">
        <Palette size={14} className="text-dh-accent-dark" />
        <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark font-medium flex items-center gap-3.5">
          Your Palette<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-2">
        {colours.map((c: any, i: number) => {
          const isExpanded = expandedIdx === i;
          const isCopied = copiedIdx === i;
          return (
            <div key={i} className="text-center cursor-pointer group relative"
              onClick={() => copyHex(c.hex || c.c, i)}
              onMouseEnter={() => setExpandedIdx(i)}
              onMouseLeave={() => setExpandedIdx(null)}>
              <div
                className="w-full rounded-xl mb-2.5 relative overflow-hidden transition-all duration-500 ease-out"
                style={{
                  background: c.hex || c.c,
                  height: isExpanded ? '100px' : isCopied ? '80px' : '60px',
                  boxShadow: isExpanded
                    ? `0 12px 36px ${(c.hex || c.c)}60, 0 4px 16px rgba(0,0,0,0.15)`
                    : '0 2px 12px rgba(0,0,0,0.1)',
                  transform: isExpanded ? 'scale(1.08)' : 'scale(1)',
                  zIndex: isExpanded ? 10 : 1,
                }}
              >
                {/* Shimmer sweep on hover */}
                {isExpanded && (
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer-sweep" style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                    }} />
                  </div>
                )}
                {/* Ripple effect on copy */}
                {isCopied && (
                  <div className="absolute inset-0 flex items-center justify-center animate-scale-in">
                    <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)' }} />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
                {!isCopied && !isExpanded && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </div>
                )}
                {/* Expanded: show use text */}
                {isExpanded && !isCopied && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 transition-opacity duration-300" style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" className="mb-1"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    <p className="font-ui text-[7px] tracking-[1px] uppercase text-white font-medium">Click to copy</p>
                  </div>
                )}
              </div>
              <p className="font-body text-xs font-medium transition-all duration-200" style={{ color: isCopied ? (c.hex || c.c) : 'var(--dh-text)' }}>{c.name || c.n}</p>
              <div className="flex items-center justify-center gap-1">
                <p className="font-body text-[10px] text-dh-text-light">{c.hex || c.c}</p>
                {isCopied ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 opacity-50"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                )}
              </div>
              <p className="font-body text-[10px] text-dh-text-light italic mt-0.5">{c.use}</p>
            </div>
          );
        })}
      </div>
      {/* Why explanations for static colours */}
      {!br.colours?.length && brandId.colours[0]?.why && (
        <div className="mt-4 mb-6">
          {brandId.colours.map((c: any, i: number) => (
            <p key={i} className="font-body text-[12px] text-dh-text-light font-light leading-[1.7] mb-1.5">
              <strong className="text-dh-text-mid">{c.n}:</strong> {c.why}
            </p>
          ))}
        </div>
      )}
      <p className="font-body text-[11px] text-dh-text-light italic text-center mb-6 font-light">Tap any swatch to copy the hex code</p>

      {/* Interactive Brand Board */}
      <div className="rounded-3xl overflow-hidden mb-8" style={{ background: 'linear-gradient(145deg, rgba(var(--dh-accent-rgb),0.11), rgba(255,255,255,0.32))', border: '1px solid rgba(var(--dh-accent-rgb),0.28)' }}>
        <div className="p-6" style={{ borderBottom: '1px solid rgba(var(--dh-accent-rgb),0.18)' }}>
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-1 font-medium">Interactive Brand Board</p>
              <p className="font-display italic text-[22px] leading-[1.2]" style={{ color: 'var(--dh-text)' }}>{brandTitle}</p>
            </div>
            <button onClick={copyBrandBoard} className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-ui text-[8px] tracking-[2px] uppercase cursor-pointer" style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', border: 'none' }}>
              <Copy size={12} /> Copy Board
            </button>
          </div>

          <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' }}>
            {colours.slice(0, 5).map((c: any, i: number) => (
              <button key={i} onClick={() => copyHex(c.hex || c.c, i)} className="text-left rounded-2xl overflow-hidden cursor-pointer group" style={{ border: '1px solid rgba(var(--dh-accent-rgb),0.22)', background: 'rgba(255,255,255,0.28)' }}>
                <span className="block h-16 transition-transform group-hover:scale-[1.03]" style={{ background: c.hex || c.c }} />
                <span className="block p-3">
                  <span className="block font-ui text-[7px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{c.name || c.n}</span>
                  <span className="block font-body text-[11px] text-dh-text-light mt-1">{c.hex || c.c}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.34)', border: '1px solid rgba(var(--dh-accent-rgb),0.20)' }}>
              <Type size={15} className="text-dh-accent-dark mb-3" />
              <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">Font Pairing Preview</p>
              <p className="font-display italic text-[30px] leading-none mb-2" style={{ color: 'var(--dh-text)' }}>{brandTitle}</p>
              <p className="font-body text-[12px] leading-[1.7] text-dh-text-mid font-light">Use {displayFont} for emotional headlines and {bodyFont} for clean buying information, captions, and checkout copy.</p>
            </div>
            <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.34)', border: '1px solid rgba(var(--dh-accent-rgb),0.20)' }}>
              <ImageIcon size={15} className="text-dh-accent-dark mb-3" />
              <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">Sample Social Card</p>
              <div className="rounded-2xl p-5 text-center" style={{ background: socialCardBg, color: socialCardInk, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.20)' }}>
                <p className="font-display italic text-[24px] leading-[1.05] mb-2">{product}</p>
                <p className="font-ui text-[8px] tracking-[2px] uppercase" style={{ opacity: 0.82 }}>for {customer || 'your people'}</p>
              </div>
            </div>
            <div className="md:col-span-2 rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.34)', border: '1px solid rgba(var(--dh-accent-rgb),0.20)' }}>
              <Store size={15} className="text-dh-accent-dark mb-3" />
              <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">Storefront Direction</p>
              <p className="font-display italic text-[18px] leading-[1.55] mb-2" style={{ color: 'var(--dh-text)' }}>{brandTitle} on {firstPlatform || 'your main platform'}</p>
              <p className="font-body text-[12px] leading-[1.8] text-dh-text-mid font-light">Lead with one clear promise, show the product in use, keep the price path simple ({priceHint || 'start with your entry offer'}), and repeat the same colours from this board so the page feels intentional.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Strategy Note */}
      {customer && aesthetic && (
        <div className="p-4 rounded-xl mb-6 flex gap-3 items-start" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderLeft: '2px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
          <AlertCircle size={15} className="text-dh-accent-dark flex-shrink-0 mt-0.5" />
          <p className="font-display italic text-[13px] leading-[1.85] text-dh-text-light">
            Expert Note: We've paired {fonts[0]?.name || brandId.typo?.split('—')[0]?.trim() || 'this typography'} with these colours to balance authority with approachability — specifically to appeal to {customer}. The {aesthetic.toLowerCase()} aesthetic signals trust and intention, which is exactly what your audience looks for before buying.
          </p>
        </div>
      )}

      {/* Typography */}
      <div className="flex items-center gap-2.5 mb-4">
        <Type size={14} className="text-dh-accent-dark" />
        <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark font-medium flex items-center gap-3.5">
          Your Typography<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
        </p>
      </div>
      {fonts.length > 0 ? (
        fonts.map((f: any, i: number) => (
          <div key={i} className="p-5 rounded-2xl mb-3" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '2px solid var(--dh-accent)' }}>
            <p className="font-body text-sm text-dh-text-mid font-light"><strong>{f.role}:</strong> {f.name} — {f.why}</p>
          </div>
        ))
      ) : (
        <div className="p-5 rounded-2xl mb-3" style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '2px solid var(--dh-accent)' }}>
          <p className="font-display italic text-[17px] mb-1.5" style={{ color: 'var(--dh-text)' }}>{brandId.typo}</p>
          <p className="font-body text-[13px] text-dh-text-mid font-light leading-[1.8]">{brandId.typoWhy}</p>
        </div>
      )}

      {/* Logo Concepts */}
      {logoConcepts.length > 0 ? (
        <>
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mt-6 mb-4 font-medium flex items-center gap-3.5">
            Logo Concepts<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
          </p>
          {logoConcepts.map((lc: any, i: number) => (
            <div key={i} className="p-[26px_28px] rounded-2xl mb-3.5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '2px solid var(--dh-accent)' }}>
              <p className="font-display italic text-[17px] mb-1.5" style={{ color: 'var(--dh-text)' }}>{lc.name}</p>
              <p className="font-body text-sm text-dh-text-mid font-light leading-7">{lc.description}</p>
            </div>
          ))}
        </>
      ) : (
        <>
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mt-6 mb-4 font-medium flex items-center gap-3.5">
            Logo Direction<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
          </p>
          {[{ n: 'Concept A — Primary', d: brandId.logo }, { n: 'Concept B — Alternative', d: brandId.logo2 }].map((lc, i) => (
            <div key={i} className="p-[26px_28px] rounded-2xl mb-3.5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '2px solid var(--dh-accent)' }}>
              <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-1.5 font-medium">{lc.n}</p>
              <p className="font-body text-sm text-dh-text-mid font-light leading-7">{lc.d}</p>
            </div>
          ))}
        </>
      )}

      {/* Voice Guidelines */}
      {brandId.voiceGuidelines?.length > 0 && (
        <div className="mt-6">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-4 font-medium flex items-center gap-3.5">
            Brand Voice Guide<span className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
          </p>
          {brandId.voiceGuidelines.map((g: string, i: number) => (
            <div key={i} className="flex gap-3 items-start mb-2.5">
              <span className="text-dh-accent text-[10px] mt-[5px] flex-shrink-0">◆</span>
              <p className="font-body text-[13px] text-dh-text-mid font-light leading-[1.7]">{g}</p>
            </div>
          ))}
        </div>
      )}

      {/* Design Do / Don't with Lucide icons */}
      {(brandId.designDo?.length > 0 || brandId.designDont?.length > 0 || br.designDo?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
          <div>
            <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-4 font-medium flex items-center gap-2">
              <Check size={14} className="text-dh-accent-dark" /> Design Do
            </p>
            {(br.designDo || brandId.designDo).map((d: string, i: number) => (
              <div key={i} className="flex gap-2.5 items-start mb-3">
                <Check size={14} className="text-dh-accent-dark mt-0.5 flex-shrink-0" />
                <p className="font-body text-[13px] text-dh-text-mid font-light leading-[1.7]">{d}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-text-light mb-4 font-medium flex items-center gap-2">
              <X size={14} className="text-dh-text-light" /> Design Don't
            </p>
            {(br.designDont || brandId.designDont).map((d: string, i: number) => (
              <div key={i} className="flex gap-2.5 items-start mb-3">
                <X size={14} className="text-dh-text-light mt-0.5 flex-shrink-0" />
                <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.7] italic">{d}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Premium Investment Note */}
      {brandId.premiumNote && (
        <div className="mt-8 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(var(--dh-accent-rgb), 0.1) 0%, rgba(var(--dh-accent-rgb), 0.04) 100%)', border: '1.5px solid var(--dh-accent)' }}>
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles size={14} className="text-dh-accent-dark" />
            <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-semibold">Premium Investment Advice</p>
          </div>
          <p className="font-body text-[13px] text-dh-text-mid font-light leading-[1.85]">{brandId.premiumNote}</p>
        </div>
      )}
    </RoomCard>
  );
}
