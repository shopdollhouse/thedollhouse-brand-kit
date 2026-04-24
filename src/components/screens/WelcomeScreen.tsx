import { useQuiz } from '@/context/QuizContext';
import DollhouseMark from '@/components/DollhouseMark';

export default function WelcomeScreen() {
  const { setScreen } = useQuiz();

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-[80px] px-5 pb-[120px] animate-rise-in relative z-[1]">
      <div className="animate-float-arch mb-6">
        <DollhouseMark size={70} />
      </div>
      
      {/* Pill */}
      <div className="inline-flex items-center gap-2.5 py-[7px] px-5 rounded-full font-ui text-[11px] tracking-[4px] uppercase text-dh-accent-dark mb-7 font-medium"
        style={{ background: 'rgba(var(--dh-accent-rgb), 0.1)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
        Brand Starter System
      </div>
      
      <p className="dh-wordmark-kicker text-center mb-1" style={{ fontSize: 'clamp(26px, 4vw, 42px)' }}>the</p>
      <h1 className="dh-wordmark text-center" style={{ fontSize: 'clamp(48px, 7vw, 82px)' }}>Dollhouse</h1>
      
      <div className="flex items-center gap-3.5 w-[200px] mx-auto mt-0 mb-7">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--dh-accent)]" />
        <span className="text-[var(--dh-accent)] text-[10px] leading-none">♥</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--dh-accent)]" />
      </div>

      {/* Welcome card */}
      <div className="glass rounded-[24px] p-[52px_48px] max-w-[520px] w-full" style={{ boxShadow: 'var(--dh-shadow-soft)' }}>
        <p className="font-display italic text-[22px] text-center leading-[1.6] mb-0" style={{ color: 'var(--dh-text)' }}>
          You already know what you want to build.<br /><em>Now let's build it.</em>
        </p>
        <div className="h-px my-6" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
        <p className="font-body text-[14px] text-dh-text-mid font-light leading-[1.85] mb-4">
          Answer 16 questions and walk away with your complete business blueprint — your product, your platform, your price, your first sale plan, a full marketing strategy, and a brand identity. Built specifically for you.
        </p>
        
        <div className="flex flex-col gap-2 my-4 text-left">
          {[
            'Your product recommendation and starting price',
            'The exact platforms to sell on and how to set them up',
            'A day-by-day first sale plan with exact actions',
            'Colour palette, fonts, logo direction and brand voice',
            'A 90-day content and marketing roadmap',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-dh-accent-dark flex-shrink-0 mt-0.5">◆</span>
              <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.6]">{item}</p>
            </div>
          ))}
        </div>
        
        <p className="font-display italic text-[15px] text-dh-accent-dark text-center mb-0">
          Every decision made for you. Nothing generic.
        </p>
        <div className="h-px my-6" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
        
        <button
          onClick={() => setScreen('questions')}
          className="dh-cta block w-full py-4 px-8 rounded-2xl font-ui text-[11px] tracking-[3px] uppercase font-medium cursor-pointer text-center mt-6"
        >
          Enter The Dollhouse →
        </button>
      </div>
    </div>
  );
}
