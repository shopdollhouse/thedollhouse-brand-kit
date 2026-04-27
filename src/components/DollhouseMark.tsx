type DollhouseMarkProps = {
  size?: number;
  className?: string;
};

export default function DollhouseMark({ size = 52, className = '' }: DollhouseMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 240"
      fill="none"
      aria-label="The Dollhouse"
      className={className}
      style={{ filter: 'drop-shadow(0 2px 8px rgba(156, 123, 110, 0.18))' }}
    >
      {/* Outer arch */}
      <path
        d="M30 220C30 120 85 30 100 30C115 30 170 120 170 220"
        stroke="var(--dh-accent-dark)"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner arch */}
      <path
        d="M65 220C65 145 85 75 100 75C115 75 135 145 135 220"
        stroke="var(--dh-accent-dark)"
        strokeWidth="12"
        strokeLinecap="round"
        fill="none"
      />

      {/* Heart at top */}
      <path
        d="M100 25C100 25 92 15 82 15C72 15 65 22 65 32C65 42 100 60 100 60C100 60 135 42 135 32C135 22 128 15 118 15C108 15 100 25 100 25Z"
        fill="var(--dh-accent-dark)"
      />
    </svg>
  );
}