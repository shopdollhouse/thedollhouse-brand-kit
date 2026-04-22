import { useState, useCallback } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { playChime, playDoorClick } from '@/lib/sounds';
import GateUnlockOverlay from '../GateUnlockOverlay';
import dollhouseLogo from '@/assets/dollhouse-arch-logo.png';

const ArchIcon = ({ size = 52 }: { size?: number }) => (
  <img
    src={dollhouseLogo}
    alt="The Dollhouse"
    width={size}
    height={size * 1.32}
    className="object-contain"
    style={{ filter: 'drop-shadow(0 2px 8px rgba(156, 123, 110, 0.18))' }}
  />
);

const PASSWORDS = ['ENTERTHEROOM'];

export default function GateScreen() {
  const { setScreen } = useQuiz();
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('Enter');
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlockDone = useCallback(() => {
    setScreen('welcome');
  }, [setScreen]);

  const go = () => {
    if (!pw.trim()) return;
    const phrases = ['Opening the door…', 'Turning the key…', 'Unlocking your room…', 'One moment…'];
    setLoadMsg(phrases[Math.floor(Math.random() * phrases.length)]);
    setLoading(true); setErr(false);
    setTimeout(() => {
      if (PASSWORDS.includes(pw.trim().toUpperCase())) {
        playDoorClick();
        setTimeout(() => playChime(), 150);
        setUnlocking(true);
      } else {
        setErr(true); setLoading(false); setLoadMsg('Enter');
      }
    }, 700);
  };

  return (
    <>
    <GateUnlockOverlay active={unlocking} onDone={handleUnlockDone} />
    <div className="flex min-h-full flex-col items-center justify-center px-5 py-6 animate-rise-in relative z-[1]">
      <div className="animate-float-arch mb-3">
        <ArchIcon size={40} />
      </div>
      <p className="font-display italic text-[15px] text-dh-accent-dark tracking-[6px] text-center mb-[2px] opacity-70">the</p>
      <h1 className="font-display italic font-normal text-center tracking-[clamp(5px,0.8vw,10px)] uppercase leading-none" style={{ fontSize: 'clamp(36px, 5.5vw, 56px)', color: 'var(--dh-text)' }}>Dollhouse</h1>
      <p className="font-ui text-xs tracking-[5px] italic text-dh-text-light font-light text-center mt-1 mb-4">private access</p>

      {/* Ornament */}
      <div className="flex items-center gap-3.5 w-[200px] mx-auto mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--dh-accent)]" />
        <span className="text-[var(--dh-accent)] text-[10px] leading-none">♥</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--dh-accent)]" />
      </div>

      <p className="font-body text-[13px] text-dh-text-light font-light leading-[1.8] text-center max-w-[320px] mx-auto mb-1.5">
        Answer 16 questions and walk away with your complete brand strategy, product plan, and launch roadmap — built specifically for you.
      </p>
      <p className="font-body text-[12px] text-dh-text-light font-light leading-[1.7] text-center max-w-[300px] mx-auto mb-4 opacity-75">
        Your password is in your purchase confirmation email. Questions?{' '}
        <a href="https://shopdollhouse.co" target="_blank" className="text-dh-accent-dark no-underline">shopdollhouse.co</a>
      </p>

      {/* Personal Use Only */}
      <div className="max-w-[400px] w-[90%] mx-auto mb-4 p-[10px_16px] rounded-xl text-center" style={{ background: 'rgba(var(--dh-accent-rgb), 0.07)', border: '1px solid rgba(var(--dh-accent-rgb), 0.2)' }}>
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--dh-accent-dark)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark font-medium">Personal Use Only</p>
        </div>
        <p className="font-body text-[11px] text-dh-text-light font-light leading-[1.6]">
          This blueprint is licensed for personal use only. It may not be resold, redistributed, shared, or reproduced in any form without prior written permission from The Dollhouse.
        </p>
      </div>

      {/* Password box */}
      <div className="text-center p-6 px-7 rounded-[20px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] max-w-[380px] w-[90%] glass">
        <p className="font-ui text-[11px] tracking-[4px] uppercase text-dh-accent-dark mb-3 font-medium">Enter your password</p>
        <div className="relative mb-1">
          <input
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && go()}
            placeholder="Password"
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
        {err && <p className="font-ui text-[10px] tracking-[2px] text-[#c4604a] mt-2">Incorrect password — try again</p>}
        <button onClick={go} disabled={loading} className="block w-full py-[13px] px-8 rounded-[14px] font-ui text-[11px] tracking-[3px] uppercase font-medium cursor-pointer text-center mt-3 transition-opacity" style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)', opacity: loading ? 0.7 : 1 }}>
          {loadMsg}
        </button>
      </div>
    </div>
    </>
  );
}
