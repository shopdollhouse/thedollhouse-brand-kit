import { ReactNode } from 'react';

interface RoomCardProps {
  num: string;
  name: string;
  tagline: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function RoomCard({ num, name, tagline, icon, children, className = '' }: RoomCardProps) {
  return (
    <div className={`glass dh-premium-panel rounded-3xl p-[52px_56px] mb-7 animate-room-reveal ${className}`}
      style={{ animationDelay: `${parseInt(num) * 0.05}s` }}>
      <div className="flex items-start gap-[18px] mb-9 pb-7" style={{ borderBottom: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
        <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ border: '1px solid rgba(var(--dh-accent-rgb), 0.25)', background: 'rgba(var(--dh-accent-rgb), 0.08)' }}>
          {icon}
        </div>
        <div>
          <p className="font-ui text-[10px] tracking-[4px] uppercase text-dh-accent-dark mb-[5px] opacity-70 font-medium">{num}</p>
          <p className="font-display text-xl italic leading-[1.2] mb-1" style={{ color: 'var(--dh-text)' }}>{name}</p>
          <p className="font-body text-[13px] text-dh-text-light font-light">{tagline}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
