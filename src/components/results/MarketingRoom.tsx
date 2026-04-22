import RoomCard from './RoomCard';

interface MarketingRoomProps { aiResults: any; brandId: any; customer: string; product: string; }

export default function MarketingRoom({ aiResults, brandId, customer, product }: MarketingRoomProps) {
  const mk = aiResults?.marketing;
  if (!mk) return null;

  return (
    <RoomCard num="10" name="The Strategy Room" tagline="Your marketing plan — content, social, email"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent)" strokeWidth="1.6" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}>
      
      {mk.coreMessage && (
        <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Core Message</p>
          <p className="font-display italic text-[19px] leading-[1.85] text-dh-text-mid">{mk.coreMessage}</p>
        </div>
      )}

      {mk.contentPillars?.map((cp: any, i: number) => (
        <div key={i} className="p-[22px_26px] mb-3.5 rounded-r-xl" style={{ borderLeft: '2px solid var(--dh-accent)', background: 'rgba(var(--dh-accent-rgb), 0.05)' }}>
          <p className="font-display italic text-[17px] mb-1" style={{ color: 'var(--dh-text)' }}>{cp.pillar}</p>
          <p className="font-body text-sm text-dh-text-mid font-light leading-7">{cp.description}</p>
        </div>
      ))}

      {mk.quickWins?.length > 0 && (
        <div className="mt-6">
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-4 font-medium">Quick Wins This Week</p>
          <div className="flex flex-wrap gap-2">
            {mk.quickWins.map((w: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 py-3 px-5 rounded-full font-body text-sm font-light"
                style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', color: 'var(--dh-text)' }}>
                ◆ {w}
              </span>
            ))}
          </div>
        </div>
      )}
    </RoomCard>
  );
}
