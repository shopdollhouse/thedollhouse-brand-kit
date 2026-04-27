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
      <div className="w-full max-w-[500px]">
        {/* Certificate */}
        <div
          ref={certificateRef}
          className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
          style={{ background: '#faf3ea', border: '2px solid var(--dh-accent)' }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center" style={{ background: 'linear-gradient(135deg, var(--dh-accent) 0%, var(--dh-accent-dark) 100%)' }}>
            <p className="font-ui text-[9px] tracking-[4px] uppercase text-white opacity-90 mb-2">
              ✦ Blueprint Certificate ✦
            </p>
            <div className="inline-block mb-2">
              <DollhouseMark size={48} />
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-12 text-center">
            {/* Brand Name */}
            <h1 className="font-display italic text-[42px] leading-[1.2] mb-2" style={{ color: 'var(--dh-accent-dark)' }}>
              {brand}
            </h1>

            {/* Aesthetic Badge */}
            <div className="inline-block mb-6 px-4 py-2 rounded-full" style={{ background: 'rgba(var(--dh-accent-rgb), 0.12)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
              <p className="font-ui text-[10px] tracking-[2px] uppercase text-dh-accent-dark">
                {aestheticEmojis[aesthetic]} {aesthetic}
              </p>
            </div>

            {/* Certificate Text */}
            <div className="mb-8">
              <p className="font-body text-[13px] text-dh-text-mid leading-[1.8] mb-4">
                This certifies that
              </p>
              <p className="font-display italic text-[28px] text-dh-text mb-4">
                {name}
              </p>
              <p className="font-body text-[12px] text-dh-text-light leading-[1.7]">
                has completed their personalized brand blueprint and is ready to launch with intention, clarity, and a brand worth remembering.
              </p>
            </div>

            {/* Decorative Line */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.3)' }} />
              <span style={{ color: 'var(--dh-accent)' }}>♥</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(var(--dh-accent-rgb), 0.3)' }} />
            </div>

            {/* Date & Signature */}
            <div className="text-center">
              <p className="font-body text-[11px] text-dh-text-light mb-3">
                Completed {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="font-display italic text-[14px] text-dh-accent-dark">
                The Dollhouse Studio
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 text-center" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)' }}>
            <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-text-light opacity-70">
              Your Blueprint is Private. Your Success is Public.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl font-ui text-[10px] tracking-[2px] uppercase font-medium transition-all"
            style={{
              background: 'var(--dh-btn-bg)',
              color: 'var(--dh-btn-text)',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Share on Threads / TikTok
          </button>

          <button
            onClick={handleScreenshot}
            className="w-full py-3 rounded-xl font-ui text-[10px] tracking-[2px] uppercase font-medium transition-all"
            style={{
              background: 'none',
              color: 'var(--dh-accent-dark)',
              border: '1.5px solid var(--dh-accent)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(var(--dh-accent-rgb), 0.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            Download Certificate
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
            className="w-full py-3 rounded-xl font-ui text-[10px] tracking-[2px] uppercase font-medium text-dh-text-light transition-all"
            style={{
              background: 'none',
              border: '1px solid rgba(var(--dh-accent-rgb), 0.2)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Back to Blueprint
          </button>
        </div>

        {/* Celebration Note */}
        <div className="mt-6 text-center">
          <p className="font-body text-[12px] text-dh-text-light italic">
            Your blueprint is complete.<br />Now go make that first sale. ✨
          </p>
        </div>
      </div>
    </div>
  );
}
