import { playClick } from '@/lib/sounds';

interface ResetConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ResetConfirmDialog({ isOpen, onConfirm, onCancel }: ResetConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    playClick('soft');
    onConfirm();
  };

  const handleCancel = () => {
    playClick('soft');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-5 animate-fade-in"
         style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
         onClick={handleCancel}>
      <div className="rounded-3xl p-9 w-full max-w-[420px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] animate-glass-slide"
           style={{ background: 'hsl(var(--background))', border: '1px solid var(--dh-glass-border)' }}
           onClick={e => e.stopPropagation()}>

        <div className="mb-6">
          <p className="font-display italic text-[24px] text-dh-accent-dark mb-2">Reset your blueprint?</p>
          <p className="font-body text-[13px] text-dh-text-light leading-[1.6]">
            This will clear all your answers and return you to the beginning. Your blueprint will be completely reset.
          </p>
        </div>

        <div className="h-px mb-6" style={{ background: 'rgba(var(--dh-accent-rgb), 0.2)' }} />

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-xl font-ui text-[10px] tracking-[2px] uppercase font-medium cursor-pointer transition-all"
            style={{
              background: 'none',
              color: 'var(--dh-text-light)',
              border: '1px solid rgba(var(--dh-accent-rgb), 0.25)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
            Keep My Blueprint
          </button>

          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl font-ui text-[10px] tracking-[2px] uppercase font-medium cursor-pointer transition-all"
            style={{
              background: 'var(--dh-btn-bg)',
              color: 'var(--dh-btn-text)',
              border: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
            Yes, Reset
          </button>
        </div>
      </div>
    </div>
  );
}
