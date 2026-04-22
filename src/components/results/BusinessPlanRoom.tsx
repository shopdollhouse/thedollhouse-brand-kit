import RoomCard from './RoomCard';

interface BusinessPlanRoomProps { aiResults: any; displayName: string; mission: string; }

export default function BusinessPlanRoom({ aiResults, displayName, mission }: BusinessPlanRoomProps) {
  const bp = aiResults?.businessPlan;
  if (!bp) return null;

  return (
    <RoomCard num="11" name="The Expansion Room" tagline="Your 90-day plan — mission, goals, revenue"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent)" strokeWidth="1.6" strokeLinecap="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>}>
      
      {bp.mission && (
        <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
          <p className="font-body text-[15px] leading-8 text-dh-text-mid font-light">{bp.mission}</p>
        </div>
      )}

      {bp.ninetyDayGoal && (
        <div className="mb-4">
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">90-Day Goal</p>
          <p className="font-body text-sm text-dh-text-mid font-light leading-7">{bp.ninetyDayGoal}</p>
        </div>
      )}

      {bp.revenueTarget && (
        <div className="mb-4">
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Revenue Target</p>
          <p className="font-body text-sm text-dh-text-mid font-light leading-7">{bp.revenueTarget}</p>
        </div>
      )}

      {bp.personalNote && (
        <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderTop: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderBottom: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
          <p className="font-display italic text-[19px] leading-8" style={{ color: 'var(--dh-text)' }}>{bp.personalNote}</p>
        </div>
      )}
    </RoomCard>
  );
}
