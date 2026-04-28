import RoomCard from './RoomCard';

interface BusinessPlanRoomProps { aiResults: any; displayName: string; mission: string; answers?: Record<string, string>; }

export default function BusinessPlanRoom({ aiResults, displayName, mission, answers = {} }: BusinessPlanRoomProps) {
  const bp = aiResults?.businessPlan;

  // Smart fallbacks if AI didn't generate business plan
  const fallbackBp = {
    mission: mission || `${displayName}'s business exists to serve their ideal customers with intention and quality.`,
    ninetyDayGoal: `Get your first ${answers.product || 'offer'} live on your chosen platform and make your first sale. Three sales proves the model works.`,
    revenueTarget:
      answers.budget === 'Higher' ? '$5,000+ in revenue' :
      answers.budget === '$50–$200' ? '$500–$2,000 in revenue' :
      answers.budget === 'Under $50' ? '$100–$500 in revenue' :
      'Revenue goal depends on your budget and scope',
    personalNote:
      answers.blocker === 'Not sure what to make or sell' ? `${displayName}, this blueprint has made the decision for you. Your next 90 days are about proving ${answers.product || 'this'} works. Stop researching, start selling.` :
      answers.blocker === "Don't know how to market" ? `${displayName}, the next 90 days are about showing up consistently. Post 3x per week, engage genuinely, and your audience will grow. The system works if you work the system.` :
      answers.blocker === 'Scared nobody will buy' ? `${displayName}, your first sale won't come from strangers. It'll come from someone who already knows and likes you. Start there. Then scale.` :
      `${displayName}, the next 90 days are about proving the model works. One sale is proof. Three sales is a pattern. Ten sales is a business.`
  };

  const finalBp = bp || fallbackBp;
  const weeklyOperatingPlan = [
    ['Build', `Improve or create one piece of ${answers.product || 'your offer'} every week.`],
    ['Sell', 'Send 5 personal messages, follow up with every warm lead, and make one clear public offer.'],
    ['Show', 'Publish your weekly content rotation and collect proof from every buyer or interested person.'],
    ['Review', 'Every Sunday, write down: what got attention, what got replies, what got money.'],
  ];

  return (
    <RoomCard num="11" name="The Expansion Room" tagline="Your 90-day plan — mission, goals, revenue"
      icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent)" strokeWidth="1.6" strokeLinecap="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>}>
      
      {finalBp.mission && (
        <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(var(--dh-accent-rgb), 0.06)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderLeft: '3px solid var(--dh-accent)' }}>
          <p className="font-body text-[15px] leading-8 text-dh-text-mid font-light">{finalBp.mission}</p>
        </div>
      )}

      {finalBp.ninetyDayGoal && (
        <div className="mb-4">
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">90-Day Goal</p>
          <p className="font-body text-sm text-dh-text-mid font-light leading-7">{finalBp.ninetyDayGoal}</p>
        </div>
      )}

      {finalBp.revenueTarget && (
        <div className="mb-4">
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-2 font-medium">Revenue Target</p>
          <p className="font-body text-sm text-dh-text-mid font-light leading-7">{finalBp.revenueTarget}</p>
        </div>
      )}

      {finalBp.personalNote && (
        <div className="mt-6 p-6 rounded-2xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.04)', borderTop: '1px solid rgba(var(--dh-accent-rgb), 0.25)', borderBottom: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
          <p className="font-display italic text-[19px] leading-8" style={{ color: 'var(--dh-text)' }}>{finalBp.personalNote}</p>
        </div>
      )}

      <div className="mt-6">
        <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3 font-medium">Your Weekly Operating System</p>
        {weeklyOperatingPlan.map(([label, text]) => (
          <div key={label} className="flex gap-3 items-start p-4 rounded-xl mb-2.5" style={{ background: 'rgba(var(--dh-accent-rgb), 0.045)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
            <span className="font-ui text-[8px] tracking-[2px] uppercase py-1 px-2 rounded flex-shrink-0" style={{ color: 'var(--dh-accent-dark)', background: 'rgba(var(--dh-accent-rgb), 0.08)' }}>{label}</span>
            <p className="font-body text-[13px] leading-[1.8] text-dh-text-mid font-light">{text}</p>
          </div>
        ))}
      </div>
    </RoomCard>
  );
}
