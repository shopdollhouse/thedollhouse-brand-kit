import { useQuiz } from '@/context/QuizContext';
import { playClick } from '@/lib/sounds';
import { toast } from 'sonner';
import DollhouseMark from './DollhouseMark';
import HeartIcon from './HeartIcon';
import certificateBg from '@/assets/password-bg.jpg';

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
  const socialHandle = '@thedollhouse_studio';
  const website = 'shopdollhouse.co';

  const handleShare = async () => {
    playClick('soft');
    const text = `I just completed my private brand blueprint with The Dollhouse. ${brand} is ready for its first-sale era. ${socialHandle} | ${website}`;

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
      className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto px-3 pb-3 pt-[72px] animate-fade-in sm:px-4 sm:pb-4"
      style={{
        background:
          'radial-gradient(circle at 20% 10%, rgba(255,245,240,0.98), rgba(237,203,190,0.92) 42%, rgba(248,231,223,0.96) 100%)',
      }}
    >
      <div className="w-full max-w-[760px] py-2">
        <div
          className="relative overflow-hidden rounded-[26px]"
          style={{
            height: 'min(500px, calc(100vh - 235px))',
            minHeight: 430,
            backgroundColor: '#f8e3dc',
            backgroundImage: `url(${certificateBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            border: '1px solid rgba(195,153,98,0.38)',
            boxShadow: '0 34px 100px rgba(83,48,35,0.22), inset 0 0 0 1px rgba(255,255,255,0.82)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,246,240,0.02) 0%, rgba(255,246,240,0.08) 40%, rgba(255,246,240,0.58) 63%, rgba(255,246,240,0.86) 100%)',
            }}
          />
          <div className="absolute inset-3 rounded-[21px]" style={{ border: '1px solid rgba(196,151,91,0.34)' }} />
          <div className="absolute inset-6 rounded-[17px]" style={{ border: '1px solid rgba(196,151,91,0.16)' }} />
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 12% 18%, rgba(205,126,119,0.42) 0 1px, transparent 1px), radial-gradient(circle at 70% 30%, rgba(190,145,88,0.34) 0 1px, transparent 1px)',
              backgroundSize: '18px 18px, 26px 26px',
            }}
          />

          <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-[42%_58%]">
            <div className="hidden lg:block" />

            <div className="flex flex-col items-center justify-center px-6 py-6 text-center sm:px-8 lg:px-9">
              <div className="mb-3 flex flex-col items-center gap-2">
                <DollhouseMark size={30} />
                <div className="rounded-full px-5 py-2" style={{ border: '1px solid rgba(190,145,88,0.36)', background: 'rgba(255,250,246,0.54)' }}>
                  <p className="font-ui text-[7px] font-semibold uppercase tracking-[3px]" style={{ color: '#9c6b3d' }}>
                    Founder Completion File
                  </p>
                </div>
              </div>

              <div className="mb-3 flex w-full items-center justify-center gap-3">
                <span className="h-px w-10" style={{ background: 'rgba(190,145,88,0.36)' }} />
                <p className="font-ui text-[8px] font-semibold uppercase tracking-[5px]" style={{ color: '#a7794d' }}>
                  The Dollhouse
                </p>
                <span className="h-px w-10" style={{ background: 'rgba(190,145,88,0.36)' }} />
              </div>

              <p className="font-ui text-[7px] font-semibold uppercase tracking-[3px]" style={{ color: '#9c6b3d' }}>
                Certificate of Completion
              </p>
              <p className="mt-1.5 font-display text-[17px] italic leading-none" style={{ color: '#ba7d78' }}>
                awarded to
              </p>
              <h1 className="mt-1.5 max-w-[420px] font-display italic leading-[0.96]" style={{ color: '#b96d67', fontSize: 'clamp(38px, 5vw, 58px)' }}>
                {name}
              </h1>

              <p className="mt-3 max-w-[390px] font-display text-[15px] italic leading-[1.35]" style={{ color: 'rgba(156,95,88,0.78)' }}>
                for completing a private 19-question brand blueprint for <span style={{ color: '#b96d67' }}>{brand}</span>.
              </p>
              <p className="mt-1.5 max-w-[390px] font-body text-[10px] leading-[1.45]" style={{ color: 'rgba(112,78,62,0.70)' }}>
                Their custom launch file includes positioning, offer direction, pricing, content prompts, sales scripts, and a first-sale action plan for {certificateTitle}.
              </p>

              <div className="my-3 flex items-center justify-center gap-3">
                <span className="h-px w-12" style={{ background: 'rgba(190,145,88,0.36)' }} />
                <span style={{ color: '#bd9561' }}><HeartIcon size={12} /></span>
                <span className="h-px w-12" style={{ background: 'rgba(190,145,88,0.36)' }} />
              </div>

              <div className="grid w-full max-w-[380px] grid-cols-1 gap-1.5 sm:grid-cols-2">
                <div className="rounded-full px-3 py-2" style={{ border: '1.5px solid rgba(190,145,88,0.62)' }}>
                  <p className="font-ui text-[7px] font-semibold uppercase tracking-[2.4px]" style={{ color: '#9c6b3d' }}>
                    {brand}
                  </p>
                </div>
                <div className="rounded-full px-3 py-2" style={{ border: '1.5px solid rgba(190,145,88,0.62)' }}>
                  <p className="font-ui text-[7px] font-semibold uppercase tracking-[2.4px]" style={{ color: '#9c6b3d' }}>
                    {aesthetic}
                  </p>
                </div>
                <div className="rounded-full px-3 py-2" style={{ border: '1.5px solid rgba(190,145,88,0.62)' }}>
                  <p className="font-ui text-[7px] font-semibold uppercase tracking-[2.4px]" style={{ color: '#9c6b3d' }}>
                    {date}
                  </p>
                </div>
                <div className="rounded-full px-3 py-2" style={{ border: '1.5px solid rgba(190,145,88,0.62)' }}>
                  <p className="font-ui text-[7px] font-semibold uppercase tracking-[2.4px]" style={{ color: '#9c6b3d' }}>
                    17 Rooms Complete
                  </p>
                </div>
              </div>

              <div className="mt-3.5 flex h-[46px] w-[46px] items-center justify-center rounded-full" style={{ border: '1.5px solid rgba(190,145,88,0.58)', boxShadow: 'inset 0 0 0 5px rgba(255,250,246,0.62)' }}>
                <span style={{ color: '#bd9561' }}><HeartIcon size={13} /></span>
              </div>

              <p className="mt-3 font-ui text-[7px] font-semibold uppercase tracking-[3px]" style={{ color: '#9c6b3d' }}>
                Built With The Dollhouse Brand Studio
              </p>
              <p className="mt-1.5 font-ui text-[7px] font-semibold uppercase tracking-[2px]" style={{ color: '#b47f55' }}>
                {socialHandle}  |  {website}
              </p>
              <p className="mt-1.5 font-body text-[9px]" style={{ color: 'rgba(112,78,62,0.62)' }}>
                Tag us when you share your completion moment.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-3 grid w-full max-w-[460px] gap-2">
          <button
            onClick={handleShare}
            className="w-full rounded-2xl py-3 font-ui text-[9px] font-semibold uppercase tracking-[2.4px] transition-all hover:-translate-y-0.5"
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
            className="w-full rounded-2xl py-3 font-ui text-[9px] font-semibold uppercase tracking-[2.4px] transition-all hover:-translate-y-0.5"
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

        <div className="mt-3 text-center">
          <p className="font-display italic text-[13px]" style={{ color: '#9c6b3d' }}>
            Your completion certificate is ready to share.
          </p>
          <p className="font-body text-[10px] leading-[1.5]" style={{ color: 'rgba(112,78,62,0.62)' }}>
            Post it with {socialHandle} so new founders can find The Dollhouse.
          </p>
        </div>
      </div>
    </div>
  );
}
