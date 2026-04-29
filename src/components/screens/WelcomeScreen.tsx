import { useQuiz } from '@/context/QuizContext';
import DollhouseMark from '@/components/DollhouseMark';
import { BadgeDollarSign, ClipboardCheck, Download, Palette, Store, Target } from 'lucide-react';

export default function WelcomeScreen() {
  const { setScreen } = useQuiz();

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-[80px] px-5 pb-[120px] animate-rise-in relative z-[1]">
      <div className="dh-premium-chip mb-5">
        <ClipboardCheck />
        Commissioned Blueprint
      </div>

      <div className="animate-float-arch mb-6">
        <DollhouseMark size={70} />
      </div>
      
      {/* Pill */}
      <div className="inline-flex items-center gap-2.5 py-[7px] px-5 rounded-full font-ui text-[11px] tracking-[4px] uppercase text-dh-accent-dark mb-7 font-medium"
        style={{ background: 'rgba(var(--dh-accent-rgb), 0.1)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
        Brand Starter System
      </div>
      
      <p className="dh-wordmark-kicker text-center mb-0 opacity-90" style={{ fontSize: 'clamp(38px, 5vw, 58px)', letterSpacing: '0.01em' }}>the</p>
      <h1 className="dh-wordmark text-center uppercase" style={{ fontSize: 'clamp(56px, 8vw, 96px)', letterSpacing: '0.04em' }}>DOLLHOUSE</h1>
      
      <div className="flex items-center gap-3.5 w-[200px] mx-auto mt-0 mb-7">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--dh-accent)]" />
        <span className="text-[var(--dh-accent)] text-[10px] leading-none">♥</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--dh-accent)]" />
      </div>

      {/* Welcome card */}
      <div className="glass dh-premium-panel rounded-[24px] p-[52px_48px] max-w-[560px] w-full">
        <p className="font-display italic text-[22px] text-center leading-[1.6] mb-0" style={{ color: 'var(--dh-text)' }}>
          You already know what you want to build.<br /><em>Now let's build it.</em>
        </p>
        <div className="h-px my-6" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }} />
        <p className="font-body text-[14px] text-dh-text-mid font-light leading-[1.85] mb-4">
          Answer 19 questions and walk away with your complete business blueprint — your product, your platform, your price, your first sale plan, a full marketing strategy, and a brand identity. Built specifically for you.
        </p>
        
        <div className="grid grid-cols-2 gap-2.5 my-6">
          {[
            [Store, 'Where to sell'],
            [BadgeDollarSign, 'What to charge'],
            [Target, 'First sale plan'],
            [Palette, 'Brand identity'],
            [ClipboardCheck, '90-day roadmap'],
            [Download, 'PDF download'],
          ].map(([Icon, item]) => {
            const TileIcon = Icon as typeof Store;
            return (
            <div key={item as string} className="dh-value-tile rounded-xl p-3.5 text-left">
              <TileIcon className="text-dh-accent-dark mb-2" size={16} />
              <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark font-medium mb-1">{item as string}</p>
              <p className="font-body text-[11px] text-dh-text-light font-light leading-[1.55]">
                {item === 'Where to sell' ? 'Your best-fit platforms and setup path.' :
                 item === 'What to charge' ? 'Starter pricing built around your offer.' :
                 item === 'First sale plan' ? 'Scripts, actions, follow-ups, and proof.' :
                 item === 'Brand identity' ? 'Colours, fonts, voice, and logo direction.' :
                 item === '90-day roadmap' ? 'A beginner-friendly weekly operating plan.' :
                 'A keepsake blueprint to save and revisit.'}
              </p>
            </div>
          )})}
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
