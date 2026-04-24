type DollhouseMarkProps = {
  size?: number;
  className?: string;
};

export default function DollhouseMark({ size = 52, className = '' }: DollhouseMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-label="The Dollhouse"
      className={className}
      style={{ filter: 'drop-shadow(0 2px 8px rgba(156, 123, 110, 0.18))' }}
    >
      <path
        d="M22 78V34C22 19.6 33.6 8 48 8s26 11.6 26 26v44H60V34c0-6.6-5.4-12-12-12S36 27.4 36 34v44H22Z"
        stroke="var(--dh-accent-dark)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M22 34c8-12 18-18 30-18 9.7 0 17.1 4.5 22 13.5M36 34c6.2-11.2 14.2-17.2 24-18"
        stroke="var(--dh-accent-dark)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}