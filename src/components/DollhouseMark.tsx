type DollhouseMarkProps = {
  size?: number;
  className?: string;
};

export default function DollhouseMark({ size = 52, className = '' }: DollhouseMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 100"
      fill="none"
      aria-label="The Dollhouse"
      className={className}
      style={{ filter: 'drop-shadow(0 2px 8px rgba(156, 123, 110, 0.18))' }}
    >
      <rect
        x="10"
        y="15"
        width="60"
        height="70"
        rx="8"
        fill="var(--dh-accent)"
        opacity="0.15"
      />
      <path
        d="M25 65C25 45 35 30 40 30C45 30 55 45 55 65"
        stroke="var(--dh-accent-dark)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="25"
        y1="65"
        x2="55"
        y2="65"
        stroke="var(--dh-accent-dark)"
        strokeWidth="2"
      />
    </svg>
  );
}