interface SummaryCardProps {
  mission: string;
  platforms: string[];
  priceHint: string;
  social: string[];
  aesthetic: string;
  urgency: string;
}

export default function SummaryCard({ mission, platforms, priceHint, social, aesthetic, urgency }: SummaryCardProps) {
  const timeline = urgency === 'This week' ? 'Start today' : urgency === 'This month' ? 'This month' : 'Your pace';
  
  const items = [
    { label: 'Sell on', value: platforms.join('\n') },
    { label: 'Price range', value: priceHint },
    { label: 'Grow on', value: social.join('\n') },
    { label: 'Aesthetic', value: aesthetic },
    { label: 'Timeline', value: timeline },
  ];

  return (
    <div className="rounded-3xl p-12 mb-7 relative overflow-hidden shadow-[0_12px_52px_rgba(0,0,0,0.18)]"
      style={{ background: 'var(--dh-dark-bg)' }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(to right, transparent, var(--dh-accent), transparent)' }} />
      
      <p className="font-ui text-[9px] tracking-[5px] uppercase mb-4 font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>
        Your Blueprint at a Glance
      </p>
      <p className="font-display italic leading-[1.7] mb-7" style={{ fontSize: 'clamp(17px, 3vw, 21px)', color: 'rgba(255,255,255,0.9)' }}>
        {mission}
      </p>
      
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
        {items.map(item => (
          <div key={item.label} className="p-4 rounded-[14px]" style={{ background: 'rgba(196,168,154,0.07)', border: '1px solid rgba(196,168,154,0.14)' }}>
            <p className="font-ui text-[8px] tracking-[3px] uppercase mb-1.5 font-medium" style={{ color: 'rgba(196,168,154,0.5)' }}>{item.label}</p>
            <p className="font-display text-[17px] leading-[1.4] whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.88)' }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
