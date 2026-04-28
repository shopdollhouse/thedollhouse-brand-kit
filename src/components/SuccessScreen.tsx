import { useQuiz } from '@/context/QuizContext';
import { playClick } from '@/lib/sounds';
import { toast } from 'sonner';
import DollhouseMark from './DollhouseMark';
import HeartIcon from './HeartIcon';

interface SuccessScreenProps {
  onClose?: () => void;
}

export default function SuccessScreen({ onClose }: SuccessScreenProps = {}) {
  const { answers, setScreen } = useQuiz();
  const name = (answers.firstName || '').split(' ')[0] || 'Founder';
  const brand = answers.brandName || 'Your Brand';
  const aesthetic = answers.aesthetic || 'Soft & feminine';
  const product = answers.product || 'brand';
  const certificateTitle = product || brand;
  const date = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });

  const handleShare = async () => {
    playClick('soft');
    const text = `I just completed my brand blueprint with @thedollhouse_studio. ${brand} is officially ready to launch. Get yours: shopdollhouse.co`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Brand Blueprint',
          text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        toast('Message copied. Paste to share on Threads or TikTok.');
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto p-4 animate-fade-in sm:p-6"
      style={{
        background:
          'radial-gradient(circle at 20% 10%, rgba(255,245,240,0.98), rgba(237,203,190,0.92) 42%, rgba(248,231,223,0.96) 100%)',
      }}
    >
      <div className="w-full max-w-[1080px] py-5">
        <div
          className="relative min-h-[620px] overflow-hidden rounded-[34px]"
          style={{
            background:
              'linear-gradient(100deg, rgba(239,188,179,0.34) 0%, rgba(255,246,241,0.94) 38%, rgba(255,249,244,0.98) 100%)',
            border: '1px solid rgba(195,153,98,0.38)',
            boxShadow: '0 34px 100px rgba(83,48,35,0.22), inset 0 0 0 1px rgba(255,255,255,0.82)',
          }}
        >
          <div className="absolute inset-4 rounded-[28px]" style={{ border: '1px solid rgba(196,151,91,0.34)' }} />
          <div className="absolute inset-7 rounded-[23px]" style={{ border: '1px solid rgba(196,151,91,0.16)' }} />
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 18%, rgba(205,126,119,0.42) 0 1px, transparent 1px), radial-gradient(circle at 70% 30%, rgba(190,145,88,0.34) 0 1px, transparent 1px)',
              backgroundSize: '18px 18px, 26px 26px',
            }}
          />

          <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[48%] min-w-[360px] opacity-90">
            <svg viewBox="0 0 520 720" className="h-full w-full" preserveAspectRatio="xMinYMax slice" aria-hidden="true">
              <defs>
                <linearGradient id="certBlush" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d17f7a" stopOpacity="0.34" />
                  <stop offset="100%" stopColor="#f3c6bd" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              <path d="M8 668 C96 608 146 694 226 628 C282 582 326 612 388 552 C420 521 472 520 520 566 L520 720 L0 720 Z" fill="url(#certBlush)" />
              <g fill="none" stroke="#c77770" strokeOpacity="0.34" strokeWidth="2.2">
                <path d="M68 548 L68 350 L180 236 L180 548 Z" />
                <path d="M180 548 L180 300 L252 382 L252 548 Z" />
                <path d="M252 548 L252 410 L334 320 L334 548 Z" />
                <path d="M94 548 L94 420 C94 376 140 376 140 420 L140 548" />
                <path d="M34 548 L410 548" />
                <path d="M86 350 L180 350" />
              </g>
              <g fill="none" stroke="#c77770" strokeOpacity="0.28" strokeWidth="2">
                <path d="M50 114 C124 96 156 146 132 204 C109 260 34 248 24 188 C18 153 27 126 50 114 Z" fill="#f4c7bf" fillOpacity="0.2" />
                <path d="M58 126 C112 121 136 154 119 194 C101 238 51 223 40 184 C32 155 39 136 58 126 Z" />
                <path d="M64 142 C102 142 118 166 105 192 C92 220 58 210 50 184 C44 164 50 149 64 142 Z" />
                <path d="M112 116 C156 75 198 68 238 76" />
                <path d="M134 104 C142 64 166 42 198 28" />
                <path d="M152 129 C196 108 236 116 268 144" />
                <path d="M166 93 C178 70 206 58 234 60" />
                <path d="M170 130 C200 126 228 140 246 164" />
                <path d="M126 88 C126 58 140 36 164 18" />
              </g>
              <g fill="none" stroke="#c77770" strokeOpacity="0.33" strokeWidth="2">
                <path d="M314 566 C394 536 448 586 436 650 C424 716 334 720 294 672 C256 626 270 582 314 566 Z" fill="#f4c7bf" fillOpacity="0.22" />
                <path d="M326 580 C382 562 420 594 410 638 C400 690 334 690 308 654 C282 618 294 590 326 580 Z" />
                <path d="M340 598 C378 590 396 612 390 638 C384 666 346 668 330 646 C314 624 320 604 340 598 Z" />
                <path d="M294 672 C254 684 216 674 184 646" />
                <path d="M306 694 C284 716 244 724 204 712" />
                <path d="M410 650 C452 666 486 698 510 724" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 grid min-h-[620px] grid-cols-1 lg:grid-cols-[42%_58%]">
            <div className="hidden lg:block" />

            <div className="flex flex-col items-center justify-center px-8 py-12 text-center sm:px-12 lg:px-16">
              <div className="mb-6 flex flex-col items-center gap-4">
                <DollhouseMark size={46} />
                <div className="rounded-full px-7 py-3" style={{ border: '1px solid rgba(190,145,88,0.36)', background: 'rgba(255,250,246,0.54)' }}>
                  <p className="font-ui text-[10px] font-semibold uppercase tracking-[5px]" style={{ color: '#9c6b3d' }}>
                    Private Strategy File
                  </p>
                </div>
              </div>

              <div className="mb-8 flex w-full items-center justify-center gap-5">
                <span className="h-px w-16" style={{ background: 'rgba(190,145,88,0.36)' }} />
                <p className="font-ui text-[11px] font-semibold uppercase tracking-[8px]" style={{ color: '#a7794d' }}>
                  The Dollhouse
                </p>
                <span className="h-px w-16" style={{ background: 'rgba(190,145,88,0.36)' }} />
              </div>

              <p className="font-display text-[24px] italic leading-none" style={{ color: '#ba7d78' }}>
                Your Brand Blueprint
              </p>
              <h1 className="mt-4 max-w-[620px] font-display italic leading-[0.96]" style={{ color: '#b96d67', fontSize: 'clamp(60px, 8.5vw, 106px)' }}>
                {certificateTitle}
              </h1>

              <p className="mt-7 max-w-[520px] font-display text-[22px] italic leading-[1.65]" style={{ color: 'rgba(156,95,88,0.76)' }}>
                A personalised strategy built entirely around {name}'s vision, aesthetic, audience, offer, and first-sale goals.
              </p>

              <div className="my-8 flex items-center justify-center gap-4">
                <span className="h-px w-20" style={{ background: 'rgba(190,145,88,0.36)' }} />
                <span style={{ color: '#bd9561' }}><HeartIcon size={17} /></span>
                <span className="h-px w-20" style={{ background: 'rgba(190,145,88,0.36)' }} />
              </div>

              <div className="grid w-full max-w-[460px] grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-full px-5 py-3" style={{ border: '1.5px solid rgba(190,145,88,0.62)' }}>
                  <p className="font-ui text-[10px] font-semibold uppercase tracking-[4px]" style={{ color: '#9c6b3d' }}>
                    {aesthetic}
                  </p>
                </div>
                <div className="rounded-full px-5 py-3" style={{ border: '1.5px solid rgba(190,145,88,0.62)' }}>
                  <p className="font-ui text-[10px] font-semibold uppercase tracking-[4px]" style={{ color: '#9c6b3d' }}>
                    {date}
                  </p>
                </div>
                <div className="rounded-full px-5 py-3" style={{ border: '1.5px solid rgba(190,145,88,0.62)' }}>
                  <p className="font-ui text-[10px] font-semibold uppercase tracking-[4px]" style={{ color: '#9c6b3d' }}>
                    17 Rooms
                  </p>
                </div>
                <div className="rounded-full px-5 py-3" style={{ border: '1.5px solid rgba(190,145,88,0.62)' }}>
                  <p className="font-ui text-[10px] font-semibold uppercase tracking-[4px]" style={{ color: '#9c6b3d' }}>
                    First Sale Sprint
                  </p>
                </div>
              </div>

              <div className="mt-9 flex h-[78px] w-[78px] items-center justify-center rounded-full" style={{ border: '1.5px solid rgba(190,145,88,0.58)', boxShadow: 'inset 0 0 0 8px rgba(255,250,246,0.62)' }}>
                <span style={{ color: '#bd9561' }}><HeartIcon size={20} /></span>
              </div>

              <p className="mt-6 font-ui text-[10px] font-semibold uppercase tracking-[8px]" style={{ color: '#9c6b3d' }}>
                Personal Use Only
              </p>
              <p className="mt-3 font-body text-[11px]" style={{ color: 'rgba(112,78,62,0.62)' }}>
                Completed after a custom 19-question blueprint experience for {brand}.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 grid w-full max-w-[540px] gap-2">
          <button
            onClick={handleShare}
            className="w-full rounded-2xl py-3.5 font-ui text-[10px] font-semibold uppercase tracking-[2.8px] transition-all hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #c7975c 0%, #9f6e3e 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 14px 30px rgba(113,72,42,0.2)',
            }}
          >
            Share My Achievement
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
            className="w-full rounded-2xl py-3.5 font-ui text-[10px] font-semibold uppercase tracking-[2.8px] transition-all hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,250,246,0.72)',
              border: '1px solid rgba(190,145,88,0.34)',
              color: '#9c6b3d',
              cursor: 'pointer',
            }}
          >
            Back to Blueprint
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="font-display italic text-[15px]" style={{ color: '#9c6b3d' }}>
            Your private blueprint is complete.
          </p>
          <p className="font-body text-[11px] leading-[1.5]" style={{ color: 'rgba(112,78,62,0.62)' }}>
            Go make that first sale, then come back and celebrate the proof.
          </p>
        </div>
      </div>
    </div>
  );
}
