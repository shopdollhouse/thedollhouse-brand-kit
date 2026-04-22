import { useQuiz } from '@/context/QuizContext';
import dollhouseLogo from '@/assets/dollhouse-arch-logo.png';

const ArchIcon = () => (
  <img
    src={dollhouseLogo}
    alt="The Dollhouse"
    width={70}
    height={92}
    className="object-contain"
    style={{ filter: 'drop-shadow(0 2px 8px rgba(156, 123, 110, 0.18))' }}
  />
);

const testimonials = [
  {
    quote: "I genuinely had no idea what to sell or what to call it. I came out of this with a product idea, a brand name I actually love, a colour palette and a week one plan. I did my first sale four days later.",
    name: "Mia T.",
    desc: "Handmade jewellery, USA",
    img: "https://i.pravatar.cc/60?img=47",
  },
  {
    quote: "The platform setup section alone saved me weeks of Googling. It told me exactly which two platforms to focus on for my budget and walked me through the setup steps.",
    name: "Jade S.",
    desc: "Digital products, Canada",
    img: "https://i.pravatar.cc/60?img=25",
  },
  {
    quote: "The branding section gave me hex codes, font pairings and logo directions that actually matched my vibe. My graphic designer said it was the clearest brief she had ever received.",
    name: "Rachel K.",
    desc: "Candle brand, Canada",
    img: "https://i.pravatar.cc/60?img=32",
  },
];

export default function WelcomeScreen() {
  const { setScreen } = useQuiz();

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-[80px] px-5 pb-[120px] animate-rise-in relative z-[1]">
      <div className="animate-float-arch mb-6">
        <ArchIcon />
      </div>
      
      {/* Pill */}
      <div className="inline-flex items-center gap-2.5 py-[7px] px-5 rounded-full font-ui text-[11px] tracking-[4px] uppercase text-dh-accent-dark mb-7 font-medium"
        style={{ background: 'rgba(var(--dh-accent-rgb), 0.1)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
        Brand Starter System
      </div>
      
      <p className="font-display italic text-dh-text-light tracking-[6px] text-center mb-[1px]" style={{ fontSize: 'clamp(14px, 2vw, 18px)' }}>the</p>
      <h1 className="font-display italic font-normal text-center tracking-[clamp(5px,0.8vw,10px)] uppercase leading-none" style={{ fontSize: 'clamp(40px, 6.5vw, 64px)', color: 'var(--dh-text)' }}>Dollhouse</h1>
      
      <div className="flex items-center gap-3.5 w-[200px] mx-auto mt-0 mb-7">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--dh-accent)]" />
        <span className="text-[var(--dh-accent)] text-[10px] leading-none">♥</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--dh-accent)]" />
      </div>

      {/* Welcome card */}
      <div className="glass rounded-[20px] p-[52px_48px] max-w-[520px] w-full shadow-[0_8px_48px_rgba(0,0,0,0.07)]">
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
          className="block w-full py-4 px-8 rounded-2xl font-ui text-[11px] tracking-[3px] uppercase font-medium cursor-pointer text-center mt-6 transition-all hover:brightness-110 hover:-translate-y-0.5"
          style={{
            background: 'var(--dh-btn-bg)',
            color: 'var(--dh-btn-text)',
            boxShadow: '0 4px 20px rgba(var(--dh-accent-rgb), 0.25)',
          }}
        >
          Enter The Dollhouse →
        </button>
      </div>

      {/* Testimonials */}
      <div className="mt-8 flex flex-col gap-3.5 max-w-[480px] w-full">
        {testimonials.map((t, i) => (
          <div key={i} className="glass rounded-[18px] p-[22px_24px] text-left">
            <p className="font-display italic text-[15px] leading-[1.75] mb-3" style={{ color: 'var(--dh-text)' }}>
              "{t.quote}"
            </p>
            <div className="flex items-center gap-2.5">
              <img src={t.img} alt={t.name} className="w-[38px] h-[38px] rounded-full object-cover flex-shrink-0" style={{ border: '1.5px solid var(--dh-glass-border)' }} />
              <div>
                <p className="font-ui text-[9px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{t.name}</p>
                <p className="font-body text-[11px] text-dh-text-light font-light">{t.desc}</p>
              </div>
              <div className="ml-auto flex gap-0.5 text-dh-accent text-[13px]">★★★★★</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
