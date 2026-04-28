import { useState, useEffect, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { playClick } from '@/lib/sounds';
import { DoorOpen, Sparkles } from 'lucide-react';

export default function QuizScreen() {
  const { questions, currentQuestion, setCurrentQuestion, answers, setAnswer, setScreen } = useQuiz();
  const [otherInput, setOtherInput] = useState('');
  const [showOther, setShowOther] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const q = questions[currentQuestion];
  const firstName = answers.firstName ? answers.firstName.split(' ')[0] : '';
  const pctDone = (currentQuestion + 1) / questions.length;

  const encouragements = [
    '', 'Nice to meet you ♥', 'Great start.', "You're building something.",
    'A quarter done.', 'Looking good.', 'Over a third done.', 'Halfway there ♥',
    'More than halfway.', 'The rooms are filling in.', 'Getting specific now.',
    'Nearly there.', 'Last few questions.', 'Almost done.', 'One more after this.', 'Last one ♥',
  ];

  const goNext = () => {
    if (q.type === 'text' && !answers[q.id]?.trim()) return;
    playClick('soft');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      playClick('success');
      setScreen('loading');
    }
  };

  const goBack = () => {
    playClick('back');
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const handleChoice = (val: string) => {
    playClick('select');
    setAnswer(q.id, val);
    setShowOther(false);
    setTimeout(goNext, 260);
  };

  const handleSkip = () => {
    setAnswer(q.id, '__skip__');
    goNext();
  };

  // Animate card on question change
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.animation = 'none';
      cardRef.current.offsetHeight; // trigger reflow
      cardRef.current.style.animation = 'riseIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }
    setShowOther(false);
    setOtherInput('');
  }, [currentQuestion]);

  // Auto-focus text input
  useEffect(() => {
    if (q.type === 'text' || q.type === 'text-optional') {
      setTimeout(() => {
        const el = document.getElementById('q-text-input');
        if (el) (el as HTMLInputElement).focus();
      }, 80);
    }
  }, [currentQuestion, q.type]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start pt-[80px] px-5 pb-[120px] animate-rise-in relative z-[1]">
      {/* Room pill */}
      <div className="dh-premium-chip mb-4">
        <DoorOpen />
        Room {currentQuestion + 1} of {questions.length}
      </div>

      <div className="inline-flex items-center gap-2 rounded-full py-1.5 px-4 font-ui text-[10px] tracking-[3px] uppercase text-dh-accent-dark font-medium mb-4"
        style={{ background: 'rgba(var(--dh-accent-rgb), 0.1)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
        <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(var(--dh-accent-rgb), 0.15)', border: '1px solid rgba(var(--dh-accent-rgb), 0.25)' }}>
          <span className="text-[10px]">🏡</span>
        </div>
        {firstName && currentQuestion > 0 ? `${firstName} · ` : ''}Q{currentQuestion + 1} of {questions.length}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[200px] h-1 rounded-full overflow-hidden mb-7" style={{ background: 'rgba(var(--dh-accent-rgb), 0.25)' }}>
        <div className="h-full rounded-full transition-all duration-400 ease-out" style={{ width: `${Math.round(pctDone * 100)}%`, background: 'var(--dh-accent-dark)' }} />
      </div>

      {/* Encouragement */}
      <p className="font-display italic text-[13px] text-dh-text-light mb-2 h-5 text-center">
        {encouragements[currentQuestion] || ''}
      </p>

      {/* Card */}
      <div ref={cardRef} className="glass dh-premium-panel rounded-[24px] p-12 max-w-[560px] w-full">
        <div className="flex items-center justify-center gap-2 mb-5">
          <Sparkles size={14} className="text-dh-accent-dark" />
          <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-accent-dark font-medium">Building Your Private Blueprint</p>
        </div>
        <p className="font-content text-center leading-[1.45] mb-8 font-medium" style={{ fontSize: 'clamp(18px, 3vw, 24px)', color: 'var(--dh-text)' }}>
          {q.text}
        </p>

        {/* Text input */}
        {(q.type === 'text' || q.type === 'text-optional') && (
          <div>
            <input
              id="q-text-input"
              type="text"
              className="w-full py-[15px] px-[18px] rounded-[14px] font-content text-[16px] font-normal outline-none transition-all mb-1"
              style={{
                background: 'rgba(var(--dh-accent-rgb), 0.06)',
                border: '1.5px solid rgba(var(--dh-accent-rgb), 0.25)',
                color: 'var(--dh-text)',
              }}
              placeholder={q.placeholder}
              value={answers[q.id] || ''}
              onChange={(e) => setAnswer(q.id, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && goNext()}
            />
            <button
              onClick={goNext}
              className="dh-cta block w-full py-4 px-8 mt-4 rounded-[14px] font-content text-sm font-semibold cursor-pointer text-center"
            >
              Continue →
            </button>
            {q.type === 'text-optional' && (
              <button
                onClick={handleSkip}
                className="block w-full mt-2.5 py-2 font-content text-xs font-normal text-dh-text-light text-center cursor-pointer transition-colors hover:text-dh-accent"
                style={{ background: 'none', border: 'none' }}
              >
                {q.skipLabel || 'Skip for now'}
              </button>
            )}
          </div>
        )}

        {/* Choice buttons */}
        {q.type === 'choice' && (
          <div>
            {q.options?.map((opt) => (
              <button
                key={opt}
              className="dh-snappy block w-full py-[15px] px-5 pl-11 mb-2.5 rounded-[14px] font-content text-[15px] font-normal text-left cursor-pointer transition-all relative"
                style={{
                  background: answers[q.id] === opt ? 'rgba(var(--dh-accent-rgb), 0.08)' : 'hsl(var(--card))',
                  border: `1.5px solid ${answers[q.id] === opt ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb), 0.25)'}`,
                  color: 'var(--dh-text)',
                }}
                onClick={() => handleChoice(opt)}
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-all"
                  style={{
                    border: '1.5px solid var(--dh-accent)',
                    background: answers[q.id] === opt ? 'var(--dh-accent-dark)' : 'transparent',
                    boxShadow: answers[q.id] === opt ? '0 0 8px rgba(var(--dh-accent-rgb), 0.5)' : 'none',
                  }}
                />
                {opt}
              </button>
            ))}

            {/* "Other" option for questions where preset buckets may miss the buyer */}
            {q.allowOther && (
              <>
                <button
                  className="dh-snappy block w-full py-[15px] px-5 pl-11 mb-2.5 rounded-[14px] font-content text-[15px] font-normal text-left cursor-pointer transition-all relative"
                  style={{
                    background: showOther ? 'rgba(var(--dh-accent-rgb), 0.08)' : 'hsl(var(--card))',
                    border: `1.5px solid ${showOther ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb), 0.25)'}`,
                    color: 'var(--dh-text)',
                  }}
                  onClick={() => {
                    setShowOther(true);
                    setAnswer(q.id, otherInput);
                  }}
                >
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                    style={{
                      border: '1.5px solid var(--dh-accent)',
                      background: showOther ? 'var(--dh-accent-dark)' : 'transparent',
                    }}
                  />
                  Other — I'll describe them
                </button>
                {showOther && (
                  <div className="mt-2.5">
                    <input
                      type="text"
                      className="w-full py-[15px] px-[18px] rounded-[14px] font-content text-[16px] outline-none transition-all"
                      style={{
                        background: 'rgba(var(--dh-accent-rgb), 0.06)',
                        border: '1.5px solid rgba(var(--dh-accent-rgb), 0.25)',
                        color: 'var(--dh-text)',
                      }}
                      placeholder={q.otherPlaceholder || 'Tell us in your own words'}
                      value={otherInput}
                      onChange={(e) => {
                        setOtherInput(e.target.value);
                        setAnswer(q.id, e.target.value);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && otherInput.trim() && goNext()}
                      autoFocus
                    />
                    <button
                      onClick={() => otherInput.trim() && goNext()}
                      className="block w-full py-4 mt-2.5 rounded-[14px] font-content text-sm font-semibold cursor-pointer text-center transition-all"
                      style={{ background: 'var(--dh-btn-bg)', color: 'var(--dh-btn-text)' }}
                    >
                      Continue →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Back button */}
        {currentQuestion > 0 && (
          <button
            onClick={goBack}
            className="block w-full mt-4 py-2 font-content text-xs font-normal text-dh-text-light text-center cursor-pointer transition-colors hover:text-dh-accent"
            style={{ background: 'none', border: 'none' }}
          >
            ← Go Back
          </button>
        )}
      </div>
    </div>
  );
}
