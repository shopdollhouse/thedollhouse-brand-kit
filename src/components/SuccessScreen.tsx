import { useQuiz } from '@/context/QuizContext';
import { useRef, useEffect } from 'react';
import { playClick } from '@/lib/sounds';
import { toast } from 'sonner';
import DollhouseMark from './DollhouseMark';
import passwordBg from '@/assets/password-bg.png';

interface SuccessScreenProps {
  onClose?: () => void;
}

export default function SuccessScreen({ onClose }: SuccessScreenProps = {}) {
  const { answers, resetAll, setScreen } = useQuiz();
  const certificateRef = useRef<HTMLDivElement>(null);
  const name = (answers.firstName || '').split(' ')[0] || 'Founder';
  const brand = answers.brandName || 'Your Brand';
  const aesthetic = answers.aesthetic || 'Soft & feminine';
  const product = answers.product || '';

  const aestheticEmojis: Record<string, string> = {
    'Soft & feminine': '✨',
    'Bold & editorial': '⚡',
    'Clean & minimal': '◆',
    'Warm & earthy': '🌿',
    'Playful & colourful': '🎨',
  };

  const handleScreenshot = () => {
    playClick('soft');
    // Use browser's native print functionality
    const printWindow = window.open('', '', 'height=800,width=800');
    if (printWindow && certificateRef.current) {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${brand} - Blueprint Certificate</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial; }
            @media print { body { padding: 0; } }
            .certificate { max-width: 100%; }
            img { max-width: 100%; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${certificateRef.current.outerHTML}
        </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  const handleShare = async () => {
    playClick('soft');
    const text = `🎉 I just completed my brand blueprint with @thedollhouse_studio! ${brand} is officially ready to launch. Get yours → shopdollhouse.co ✨`;

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
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: `url(${passwordBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '3px solid var(--dh-accent)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6), 0 0 0 1px rgba(0,0,0,0.05)'
          }}
        >
          {/* Overlay for readability */}
          <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(250, 243, 234, 0.70) 0%, rgba(245, 237, 226, 0.65) 100%)' }} />
          {/* Top decorative element */}
          <div className="h-1 relative z-10" style={{ background: 'linear-gradient(90deg, transparent, var(--dh-accent), transparent)' }} />

          {/* Main Content */}
          <div className="px-10 py-8 text-center relative z-10">
            {/* Celebration Icon */}
            <div className="mb-4 text-4xl">🎖️</div>

            {/* THE DOLLHOUSE Header */}
            <div className="mb-4">
              <div className="inline-block mb-2">
                <DollhouseMark size={32} />
              </div>
              <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-accent-dark font-semibold">
                The Dollhouse Brand Kit
              </p>
            </div>

            {/* Achievement Title */}
            <p className="font-display italic text-[14px] text-dh-accent-dark mb-3 uppercase tracking-widest">
              Blueprint Complete! 🎉
            </p>

            {/* Brand Name - Main Focus */}
            <h1 className="font-display italic text-[44px] leading-[1.1] mb-3" style={{ color: 'var(--dh-accent-dark)' }}>
              {brand}
            </h1>

            {/* Founder Name */}
            <p className="font-body text-[13px] text-dh-text-mid mb-4">
              Built by {name}
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex-1 h-px max-w-[30px]" style={{ background: 'var(--dh-accent)', opacity: 0.3 }} />
              <span className="text-[12px]" style={{ color: 'var(--dh-accent)' }}>✨</span>
              <div className="flex-1 h-px max-w-[30px]" style={{ background: 'var(--dh-accent)', opacity: 0.3 }} />
            </div>

            {/* Badge Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {/* Aesthetic Badge */}
              <div className="px-3 py-1.5 rounded-full border" style={{ background: 'transparent', border: '1.5px solid var(--dh-accent)' }}>
                <p className="font-ui text-[7px] tracking-[2px] uppercase font-semibold text-dh-accent-dark">
                  {aesthetic}
                </p>
              </div>

              {/* Date Badge */}
              <div className="px-3 py-1.5 rounded-full border" style={{ background: 'transparent', border: '1.5px solid var(--dh-accent)' }}>
                <p className="font-ui text-[7px] tracking-[2px] uppercase font-semibold text-dh-accent-dark">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              {/* Rooms Badge */}
              <div className="px-3 py-1.5 rounded-full border" style={{ background: 'transparent', border: '1.5px solid var(--dh-accent)' }}>
                <p className="font-ui text-[7px] tracking-[2px] uppercase font-semibold text-dh-accent-dark">
                  12 Rooms
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px mb-5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />

            {/* The Dollhouse Info Section */}
            <div className="mb-3">
              <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-text-light mb-2 font-semibold">
                Built with The Dollhouse
              </p>
              <div className="space-y-1">
                <p className="font-body text-[10px] text-dh-text-mid">
                  🌐 <span style={{ color: 'var(--dh-accent-dark)' }}>shopdollhouse.co</span>
                </p>
                <p className="font-body text-[10px] text-dh-text-mid">
                  📱 <span style={{ color: 'var(--dh-accent-dark)' }}>@thedollhouse_studio</span>
                </p>
              </div>
            </div>

            {/* Footer Text */}
            <p className="font-ui text-[7px] tracking-[2px] uppercase text-dh-text-light font-semibold">
              Personal Use • Share Your Success
            </p>
          </div>

          {/* Bottom decorative element */}
          <div className="h-1 relative z-10" style={{ background: 'linear-gradient(90deg, transparent, var(--dh-accent), transparent)' }} />
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
            🎉 Share My Achievement
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
            📸 Save Certificate
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
            Your blueprint is complete.
          </p>
          <p className="font-body text-[11px] text-dh-text-light leading-[1.5]">
            Go make that first sale. Then share your success. 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
