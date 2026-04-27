export default function AchievementMedal({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ribbon */}
      <path
        d="M16 8L14 20M32 8L34 20"
        stroke="var(--dh-accent)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Medal circle */}
      <circle cx="24" cy="28" r="14" stroke="var(--dh-accent)" strokeWidth="2" fill="none" />
      <circle cx="24" cy="28" r="11" fill="rgba(var(--dh-accent-rgb), 0.1)" />

      {/* Inner circle */}
      <circle cx="24" cy="28" r="8" stroke="var(--dh-accent)" strokeWidth="1.5" fill="none" />

      {/* Decorative elements */}
      <circle cx="24" cy="28" r="4" fill="var(--dh-accent)" opacity="0.3" />

      {/* Stars around medal */}
      <path
        d="M24 16L25.5 21L31 21L27 24.5L28.5 29.5L24 26L19.5 29.5L21 24.5L17 21L23 21L24 16Z"
        fill="var(--dh-accent)"
        opacity="0.4"
      />
    </svg>
  );
}
