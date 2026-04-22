import { Component, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-10 text-center">
          <div className="animate-float-arch mb-6">
            <svg width="48" height="66" viewBox="0 -8 56 86" fill="none">
              <path d="M10 78 L10 28 Q10 5 28 5 Q46 5 46 28 L46 78" stroke="var(--dh-accent)" strokeWidth="1.3" fill="none" />
              <path d="M17 78 L17 31 Q17 16 28 16 Q39 16 39 31 L39 78" stroke="var(--dh-accent)" strokeWidth="0.6" fill="none" opacity="0.4" />
            </svg>
          </div>
          <p className="font-display italic text-[24px] mb-3" style={{ color: 'var(--dh-text)' }}>Something went wrong</p>
          <p className="font-body text-sm text-dh-text-light font-light mb-6 leading-[1.8] max-w-[400px]">
            Don't worry — your answers are safe. Try refreshing the page, or start over if the issue persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="py-3 px-8 rounded-full font-ui text-[10px] tracking-[3px] uppercase cursor-pointer font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', border: 'none' }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
