import { useQuiz } from '@/context/QuizContext';
import { useRef, useEffect } from 'react';
import { playClick } from '@/lib/sounds';
import { toast } from 'sonner';
import DollhouseMark from './DollhouseMark';
import html2canvas from 'html2canvas';

interface SuccessScreenProps {
  onClose?: () => void;
}

export default function SuccessScreen({ onClose }: SuccessScreenProps = {}) {
  const { answers, resetAll, setScreen } = useQuiz();
  const certificateRef = useRef<HTMLDivElement>(null);
  const name = (answers.firstName || '').split(' ')[0] || 'Founder';
  const brand = answers.brandName || 'Your Brand';
  const aesthetic = answers.aesthetic || 'Soft & feminine';

  const aestheticEmojis: Record<string, string> = {
    'Soft & feminine': '✨',
    'Bold & editorial': '⚡',
    'Clean & minimal': '◆',
    'Warm & earthy': '🌿',
    'Playful & colourful': '🎨',
  };

  const handleScreenshot = async () => {
    playClick('soft');
    if (certificateRef.current) {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          backgroundColor: '#faf3ea',
          scale: 2,
        });
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${brand}-blueprint-certificate.png`;
            a.click();
            URL.revokeObjectURL(url);
            toast('Certificate downloaded! Ready to share 📸');
          }
        });
      } catch (err) {
        console.error('Screenshot failed:', err);
        toast('Copy the certificate to share');
      }
    }
  };

  const handleShare = async () => {
    playClick('soft');
    const text = `I just built my brand blueprint with @thedollhouse_studio. ${brand} is ready to launch. ✨`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Brand Blueprint',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        toast('Message copied! Paste to share on Threads or TikTok');
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5 animate-fade-in"
         style={{ background: 'linear-gradient(135deg, rgba(250, 243, 234, 0.95) 0%, rgba(243, 220, 205, 0.85) 100%)' }}>
      <div className="w-full max-w-[540px]">
        {/* Certificate */}
        <div
          ref={certificateRef}
          className="rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #faf3ea 0%, #f5ede2 100%)',
            border: '3px solid var(--dh-accent)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6), 0 0 0 1px rgba(0,0,0,0.05)'
          }}
        >
          {/* Decorative Top Border */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg, transparent, var(--dh-accent), transparent)' }} />

          {/* Header with Rich Gradient */}
          <div className="px-10 pt-6 pb-4 text-center relative"
               style={{ background: 'linear-gradient(135deg, var(--dh-accent) 0%, var(--dh-accent-dark) 100%)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>
            {/* Decorative corner elements */}
            <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-white opacity-30" style={{ borderRadius: '2px' }} />
            <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-white opacity-30" style={{ borderRadius: '2px' }} />

            <p className="font-ui text-[7px] tracking-[3px] uppercase text-white opacity-85 mb-2 font-semibold">
              ✦ BRAND BLUEPRINT CERTIFICATE ✦
            </p>
            <div className="inline-block mb-2 relative">
              <div className="absolute -inset-3 rounded-full opacity-30" style={{ background: 'rgba(255,255,255,0.1)', filter: 'blur(8px)' }} />
              <DollhouseMark size={40} />
            </div>
            <p className="font-display italic text-[9px] tracking-[2px] text-white opacity-80">
              Authentically Designed & Personalized
            </p>
          </div>

          {/* Main Content */}
          <div className="px-10 py-8 text-center relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--dh-accent) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              {/* Preamble */}
              <p className="font-body text-[10px] tracking-[2px] uppercase text-dh-text-light mb-3" style={{ letterSpacing: '2px' }}>
                This Certifies That
              </p>

              {/* Brand Name - Premium Treatment */}
              <h1 className="font-display italic text-[42px] leading-[1.1] mb-2" style={{ color: 'var(--dh-accent-dark)', textShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                {brand}
              </h1>

              {/* Decorative Line */}
              <div className="flex items-center gap-3 justify-center mb-4">
                <div className="flex-1 h-px max-w-[30px]" style={{ background: 'linear-gradient(90deg, transparent, var(--dh-accent))' }} />
                <span className="text-[14px]" style={{ color: 'var(--dh-accent)' }}>✦</span>
                <div className="flex-1 h-px max-w-[30px]" style={{ background: 'linear-gradient(90deg, var(--dh-accent), transparent)' }} />
              </div>

              {/* Person Name */}
              <p className="font-body text-[11px] text-dh-text-mid mb-1">
                in recognition of
              </p>
              <p className="font-display italic text-[26px] text-dh-text mb-5" style={{ color: 'var(--dh-accent-dark)' }}>
                {name}
              </p>

              {/* Aesthetic Badge - Premium Style */}
              <div className="inline-block mb-5 px-4 py-2 rounded-full border-2"
                   style={{
                     background: 'rgba(var(--dh-accent-rgb), 0.08)',
                     border: '2px solid var(--dh-accent)',
                     boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4)'
                   }}>
                <p className="font-ui text-[8px] tracking-[2px] uppercase font-semibold text-dh-accent-dark">
                  {aestheticEmojis[aesthetic]} {aesthetic}
                </p>
              </div>

              {/* Certificate Text */}
              <div className="mb-6 max-w-[400px] mx-auto">
                <p className="font-body text-[11px] text-dh-text-mid leading-[1.6] font-light">
                  has completed their personalized brand blueprint and is ready to launch with intention, clarity, and lasting impact.
                </p>
              </div>

              {/* Fancy Divider */}
              <div className="flex items-center gap-2 justify-center mb-5">
                <div className="w-6 h-px" style={{ background: 'var(--dh-accent)', opacity: 0.3 }} />
                <span className="text-[11px]" style={{ color: 'var(--dh-accent)' }}>♥</span>
                <div className="w-6 h-px" style={{ background: 'var(--dh-accent)', opacity: 0.3 }} />
              </div>

              {/* Date & Signature Section */}
              <div className="border-t border-dashed" style={{ borderColor: 'rgba(var(--dh-accent-rgb), 0.25)', paddingTop: '12px' }}>
                <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-text-light mb-2 font-medium">
                  {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="mb-2">
                  <DollhouseMark size={24} />
                </div>
                <p className="font-display italic text-[14px] text-dh-accent-dark">
                  The Dollhouse Studio
                </p>
              </div>
            </div>
          </div>

          {/* Footer Banner */}
          <div className="px-10 py-3 text-center"
               style={{ background: 'linear-gradient(135deg, rgba(var(--dh-accent-rgb), 0.12) 0%, rgba(var(--dh-accent-rgb), 0.08) 100%)', borderTop: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <p className="font-ui text-[7px] tracking-[2px] uppercase text-dh-accent-dark opacity-70 font-semibold">
              ✧ Blueprint is Private · Success is Public ✧
            </p>
          </div>

          {/* Decorative Bottom Border */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg, transparent, var(--dh-accent), transparent)' }} />
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2">
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl font-ui text-[9px] tracking-[2px] uppercase font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--dh-accent) 0%, var(--dh-accent-dark) 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)')}
          >
            ✨ Share on Threads / TikTok
          </button>

          <button
            onClick={handleScreenshot}
            className="w-full py-3 rounded-xl font-ui text-[9px] tracking-[2px] uppercase font-semibold transition-all"
            style={{
              background: 'white',
              color: 'var(--dh-accent-dark)',
              border: '2px solid var(--dh-accent)',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(var(--dh-accent-rgb), 0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
          >
            📸 Download Certificate
          </button>

          <button
            onClick={() => {
              playClick('soft');
              if (onClose) {
                onClose();
              } else {
                setScreen('results');
              }
            }}
            className="w-full py-3 rounded-xl font-ui text-[9px] tracking-[2px] uppercase font-semibold text-dh-text-light transition-all"
            style={{
              background: 'rgba(var(--dh-accent-rgb), 0.06)',
              border: '1.5px solid rgba(var(--dh-accent-rgb), 0.3)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(var(--dh-accent-rgb), 0.12)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(var(--dh-accent-rgb), 0.06)')}
          >
            ← Back to Blueprint
          </button>
        </div>

        {/* Celebration Message */}
        <div className="mt-4 text-center">
          <p className="font-display italic text-[13px] text-dh-accent-dark mb-1">
            You're officially ready.
          </p>
          <p className="font-body text-[11px] text-dh-text-light leading-[1.5]">
            Now go make that first sale. ✨
          </p>
        </div>
      </div>
    </div>
  );
}
