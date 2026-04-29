import { useState, useCallback } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { playChime, playDoorClick } from '@/lib/sounds';
import GateUnlockOverlay from '../GateUnlockOverlay';
import DollhouseMark from '@/components/DollhouseMark';
import { BadgeCheck, FileText, LockKeyhole, Sparkles } from 'lucide-react';

const PASSWORDS = ['ENTERTHEROOM'];

export default function GateScreen() {
  const { setScreen } = useQuiz();
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [errMsg, setErrMsg] = useState('Incorrect access key — try again');
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('Enter');
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlockDone = useCallback(() => {
    setScreen('welcome');
  }, [setScreen]);

  const go = async () => {
    if (!pw.trim()) return;
    const phrases = ['Opening the door…', 'Turning the key…', 'Unlocking your room…', 'One moment…'];
    setLoadMsg(phrases[Math.floor(Math.random() * phrases.length)]);
    setLoading(true); setErr(false);
    await new Promise(resolve => setTimeout(resolve, 650));
    if (PASSWORDS.includes(pw.trim().toUpperCase())) {
      try {
        sessionStorage.setItem('dh_access_verified', '1');
        localStorage.setItem('dh_unlocked', '1');
      } catch {}
      playDoorClick();
      setTimeout(() => playChime(), 150);
      setUnlocking(true);
    } else {
      setErrMsg('Incorrect access key — try again');
      setErr(true); setLoading(false); setLoadMsg('Enter');
    }
  };

  return (
    <>
    <GateUnlockOverlay active={unlocking} onDone={handleUnlockDone} />
    <div
      className="flex min-h-full flex-col items-center justify-center px-5 py-6 animate-rise-in relative z-[1]"
      style={{
        background:
          'radial-gradient(ellipse at 50% 48%, rgba(255,250,244,0.92) 0%, rgba(255,246,238,0.84) 34%, rgba(255,246,238,0.54) 54%, transparent 74%)',
      }}
    >
      <div className="dh-premium-chip mb-4">
        <LockKeyhole />
        Private Strategy Suite
      </div>

      <div className="animate-float-arch mb-3">
        <DollhouseMark size={46} />
      </div>
      <p className="dh-wordmark-kicker text-center mb-0 opacity-90" style={{ fontSize: 'clamp(38px, 5vw, 58px)', letterSpacing: '0.01em' }}>the</p>
      <h1 className="dh-wordmark text-center uppercase" style={{ fontSize: 'clamp(56px, 8vw, 96px)', letterSpacing: '0.04em', color: 'rgba(176, 112, 105, 0.92)' }}>DOLLHOUSE</h1>
      <p className="font-ui text-xs tracking-[5px] italic font-light text-center mt-1 mb-4" style={{ color: 'rgba(107,82,64,0.72)' }}>private access</p>

      {/* Ornament */}
      <div className="flex items-center gap-3.5 w-[200px] mx-auto mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--dh-accent)]" />
        <span className="text-[var(--dh-accent)] text-[10px] leading-none">♥</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--dh-accent)]" />
      </div>

      <p className="font-body text-[13px] font-light leading-[1.8] text-center max-w-[320px] mx-auto mb-1.5" style={{ color: 'rgba(107,82,64,0.82)' }}>
        Answer 19 questions and walk away with your complete brand strategy, product plan, and launch roadmap — built specifically for you.
      </p>
      <div className="grid grid-cols-3 gap-2.5 w-full max-w-[430px] my-3">
        {[
          [FileText, '17 Rooms'],
          [Sparkles, 'Custom Plan'],
          [BadgeCheck, 'Portable Save'],
        ].map(([Icon, label]) => {
          const TileIcon = Icon as typeof FileText;
          return (
            <div key={label as string} className="dh-value-tile rounded-xl py-3 px-2 text-center">
              <TileIcon className="mx-auto mb-1.5 text-dh-accent-dark" size={15} />
              <p className="font-ui text-[8px] tracking-[2px] uppercase text-dh-accent-dark font-medium">{label as string}</p>
            </div>
          );
        })}
      </div>
      <p className="font-body text-[12px] font-light leading-[1.7] text-center max-w-[300px] mx-auto mb-4" style={{ color: 'rgba(107,82,64,0.68)' }}>
        Your access key is in your purchase confirmation email. Questions?{' '}
        <a href="https://shopdollhouse.co" target="_blank" rel="noreferrer" className="text-dh-accent-dark no-underline">shopdollhouse.co</a>
      </p>

      {/* Access key box */}
      <div className="text-center p-6 px-7 rounded-[20px] max-w-[380px] w-[90%] glass dh-premium-panel">
        <p className="font-ui text-[11px] tracking-[4px] uppercase text-dh-accent-dark mb-3 font-medium">Enter your access key</p>
        <div className="relative mb-1">
          <input
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go()}
            placeholder="Access Key"
            className="w-full py-3 px-4 pr-[42px] rounded-lg text-sm font-body tracking-[3px] text-center outline-none transition-colors"
            style={{
              border: `1.5px solid ${err ? '#c4604a' : 'var(--dh-glass-border)'}`,
              background: 'rgba(var(--dh-accent-rgb), 0.06)',
              color: 'var(--dh-text)',
              boxSizing: 'border-box',
            }}
          />
          <button onClick={() => setShow(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--dh-text-light)' }}>
            {show ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>
        {err && <p className="font-ui text-[10px] tracking-[2px] text-[#c4604a] mt-2">{errMsg}</p>}
        <button onClick={go} disabled={loading} className="dh-cta block w-full py-[13px] px-8 rounded-[14px] font-ui text-[11px] tracking-[3px] uppercase font-medium cursor-pointer text-center mt-3" style={{ opacity: loading ? 0.7 : 1 }}>
          {loadMsg}
        </button>
      </div>

      {/* Personal Use Only */}
      <div className="max-w-[400px] w-[90%] mx-auto mt-4 p-[10px_16px] rounded-xl text-center" style={{ background: 'rgba(var(--dh-accent-rgb), 0.07)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium">Personal Use Only</p>
        </div>
        <p className="font-body text-[11px] text-dh-text-light font-light leading-[1.6]">
          This blueprint is licensed for personal use only. It may not be resold, redistributed, shared, or reproduced in any form without prior written permission from The Dollhouse.
        </p>
      </div>
    </div>
    </>
  );
}
