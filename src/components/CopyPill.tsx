import { useState } from 'react';
import { playClick } from '@/lib/sounds';

interface CopyPillProps {
  text: string;
  label?: string;
  onCopy?: () => void;
}

export default function CopyPill({ text, label = 'Copy', onCopy }: CopyPillProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      playClick('soft');
      setIsCopied(true);
      onCopy?.();

      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      onClick={handleCopy}
      disabled={isCopied}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-ui text-[9px] tracking-[2px] uppercase font-medium cursor-pointer transition-all duration-200"
      style={{
        background: isCopied
          ? 'rgba(var(--dh-accent-rgb), 0.15)'
          : 'rgba(var(--dh-accent-rgb), 0.08)',
        border: '1px solid rgba(var(--dh-accent-rgb), 0.25)',
        color: 'var(--dh-accent-dark)',
        opacity: isCopied ? 1 : 0.9,
        transform: isCopied ? 'scale(1)' : 'scale(1)',
      }}
      onMouseEnter={(e) => !isCopied && (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => !isCopied && (e.currentTarget.style.opacity = '0.9')}
    >
      {isCopied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
