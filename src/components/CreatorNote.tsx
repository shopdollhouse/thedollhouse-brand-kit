import DollhouseMark from './DollhouseMark';

export default function CreatorNote() {
  return (
    <div className="rounded-3xl p-[52px_44px] mb-7 text-center relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1e0f09, #2d1810, #1a0e08)', border: '1px solid rgba(196,168,154,0.12)' }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, transparent, rgba(196,168,154,0.5), transparent)' }} />

      <div className="animate-float-arch inline-block mb-6"><DollhouseMark size={36} /></div>

      <p className="font-ui text-[9px] tracking-[4px] uppercase text-dh-accent-dark mb-5 font-medium opacity-75">A Note from Mandy</p>

      <p className="font-display italic text-[20px] leading-[1.85] max-w-[560px] mx-auto mb-7" style={{ color: 'rgba(255,255,255,0.92)' }}>
        Your blueprint isn't just a plan—it's permission to start. Permission to be seen. Permission to charge what you're worth.
      </p>

      <p className="font-body text-[13px] leading-[1.8] text-dh-text-light max-w-[560px] mx-auto mb-8" style={{ color: 'rgba(196,168,154,0.7)' }}>
        Every room you've filled in represents a decision made with intention. You know your customer. You know your brand. You know your first move. The world has been waiting for what you're building.
      </p>

      <p className="font-body text-[13px] leading-[1.8] text-dh-text-light max-w-[560px] mx-auto mb-8" style={{ color: 'rgba(196,168,154,0.7)' }}>
        This week, take the smallest possible action. Post that carousel. Reach out to three people. Finish that product photo. You don't need to be perfect. You need to be real.
      </p>

      <div className="flex items-center justify-center gap-4 mb-5">
        <div className="flex-1 h-px max-w-[60px]" style={{ background: 'rgba(196,168,154,0.2)' }} />
        <span className="text-[12px]" style={{ color: 'rgba(196,168,154,0.3)' }}>♥</span>
        <div className="flex-1 h-px max-w-[60px]" style={{ background: 'rgba(196,168,154,0.2)' }} />
      </div>

      <p className="font-display italic text-[22px] tracking-[2px] mb-1" style={{ color: 'rgba(196,168,154,0.75)' }}>Mandy</p>
      <p className="font-ui text-[8px] tracking-[3px] uppercase font-medium" style={{ color: 'rgba(196,168,154,0.4)' }}>Creator, The Dollhouse</p>

      <div className="mt-8 flex items-center justify-center gap-2">
        <div className="h-px w-12" style={{ background: 'rgba(196,168,154,0.15)' }} />
        <span className="text-[8px] font-ui tracking-[2px]" style={{ color: 'rgba(196,168,154,0.2)' }}>✦</span>
        <div className="h-px w-12" style={{ background: 'rgba(196,168,154,0.15)' }} />
      </div>
    </div>
  );
}
