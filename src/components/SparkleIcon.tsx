export default function SparkleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main star */}
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill="var(--dh-accent)"
      />

      {/* Small sparkles */}
      <circle cx="4" cy="8" r="1.5" fill="var(--dh-accent)" opacity="0.6" />
      <circle cx="20" cy="8" r="1.5" fill="var(--dh-accent)" opacity="0.6" />
      <circle cx="6" cy="18" r="1" fill="var(--dh-accent)" opacity="0.5" />
      <circle cx="18" cy="18" r="1" fill="var(--dh-accent)" opacity="0.5" />
    </svg>
  );
}
