# 🏛️ EXECUTION POWERHOUSE INTEGRATION GUIDE

Transform your 12-room blueprint into an execution machine. This guide shows you exactly how to use the new components and content.

---

## 1. COPY PILL COMPONENT (With Feedback)

The `CopyPill` component gives instant visual feedback when users copy content.

### Basic Usage

```tsx
import CopyPill from '@/components/CopyPill';

export default function MyRoom() {
  return (
    <div>
      <p>Here's your first sale script:</p>
      <p className="p-4 bg-dh-blush rounded-lg text-[13px]">
        Hey [Name]! I've been making [product] and thought of you...
      </p>
      
      <CopyPill 
        text="Hey [Name]! I've been making [product] and thought of you..."
        label="Copy Script"
      />
    </div>
  );
}
```

### With Callback

```tsx
<CopyPill 
  text={execution?.firstSaleScript}
  label="Copy to Clipboard"
  onCopy={() => {
    toast('Script copied! Paste and personalize.');
  }}
/>
```

### Multiple Copy Buttons

```tsx
<div className="space-y-3">
  {execution?.hooks.map((hook, i) => (
    <div key={i} className="p-3 rounded-lg bg-rgba(var(--dh-accent-rgb), 0.05)">
      <p className="font-body text-[12px] mb-2">{hook}</p>
      <CopyPill 
        text={hook}
        label={`Copy Hook ${i + 1}`}
      />
    </div>
  ))}
</div>
```

---

## 2. REALITY CHECK ROOM (Room 0 - Trust Builder)

This is your authority move. Show the trap early, and users know you're an expert.

### Component Structure

```tsx
// src/components/screens/ResultsScreen.tsx
// Add this as a new room or integrate into GateScreen

export default function RealityCheckRoom() {
  const { aiResults } = useQuiz();
  const execution = aiResults?.executionContent;
  
  return (
    <div data-room-id="r00" className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="font-display text-[32px] text-dh-text mb-2">
          {execution?.realityCheck.trapEmoji} {execution?.realityCheck.trapName}
        </h2>
        <p className="font-body text-[13px] text-dh-text-light">
          Before you launch, understand the biggest trap in your niche.
        </p>
      </div>

      {/* The Trap Warning Box */}
      <div className="p-6 rounded-2xl border-2 border-dh-rose-gold/30" 
           style={{ background: 'rgba(214, 168, 154, 0.08)' }}>
        <p className="font-body text-[13px] whitespace-pre-line text-dh-text-mid leading-[1.8]">
          {execution?.realityCheck.content}
        </p>
      </div>

      {/* Next Button - Action Oriented */}
      <button 
        onClick={() => scrollToRoom('r01')}
        className="dh-cta w-full py-3 rounded-xl font-ui text-[11px] tracking-[2px] uppercase"
      >
        {execution?.nextStepCopy}
        <svg className="inline ml-2 w-4 h-4" fill="none" stroke="currentColor">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
```

---

## 3. FIRST 48 HOURS CHECKLIST (Room 6 - First Sale)

Hour-by-hour execution checklist that feels alive and actionable.

```tsx
import CopyPill from '@/components/CopyPill';

export default function FirstSaleRoom() {
  const { aiResults } = useQuiz();
  const execution = aiResults?.executionContent;
  const [completedDay1, setCompletedDay1] = useState<Set<number>>(new Set());

  const toggleComplete = (index: number) => {
    const newSet = new Set(completedDay1);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
      playClick('soft'); // Satisfying click
    }
    setCompletedDay1(newSet);
  };

  return (
    <div data-room-id="r06" className="space-y-12">
      <div>
        <h2 className="font-display text-[28px] text-dh-text mb-2">
          Your First 48 Hours
        </h2>
        <p className="font-body text-[13px] text-dh-text-light">
          Not vague goals. Real, hour-by-hour actions.
        </p>
      </div>

      {/* DAY 1 */}
      <div>
        <h3 className="font-display text-[18px] text-dh-text mb-4">Day 1</h3>
        <div className="space-y-2">
          {execution?.first48Hours.day1.map((action, i) => {
            const [time, task] = action.split(' – ');
            const isCompleted = completedDay1.has(i);

            return (
              <div
                key={i}
                onClick={() => toggleComplete(i)}
                className="p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: isCompleted
                    ? 'rgba(var(--dh-accent-rgb), 0.12)'
                    : 'rgba(var(--dh-accent-rgb), 0.05)',
                  border: `1px solid rgba(var(--dh-accent-rgb), ${isCompleted ? 0.35 : 0.15})`,
                  opacity: isCompleted ? 0.7 : 1,
                  textDecoration: isCompleted ? 'line-through' : 'none',
                }}
              >
                <div className="flex gap-3">
                  <span className="text-dh-accent-dark font-medium text-[11px] min-w-fit">
                    {time}
                  </span>
                  <div className="flex-1">
                    <p className="font-body text-[12px] text-dh-text">
                      {task}
                    </p>
                  </div>
                  {isCompleted && (
                    <span className="text-dh-accent-dark">✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DAY 2 */}
      <div>
        <h3 className="font-display text-[18px] text-dh-text mb-4">Day 2</h3>
        <div className="space-y-2">
          {execution?.first48Hours.day2.map((action, i) => {
            const [time, task] = action.split(' – ');
            return (
              <div key={i} className="p-4 rounded-xl bg-rgba(var(--dh-accent-rgb), 0.05) border border-rgba(var(--dh-accent-rgb), 0.15)">
                <div className="flex gap-3">
                  <span className="text-dh-accent-dark font-medium text-[11px] min-w-fit">
                    {time}
                  </span>
                  <p className="font-body text-[12px] text-dh-text">{task}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completion Rate */}
      <div className="p-4 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)' }}>
        <p className="font-ui text-[10px] tracking-[2px] uppercase text-dh-accent-dark mb-2">
          Completion: {completedDay1.size} / {execution?.first48Hours.day1.length}
        </p>
        <div className="w-full h-2 rounded-full bg-rgba(var(--dh-accent-rgb), 0.15)">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(completedDay1.size / (execution?.first48Hours.day1.length || 1)) * 100}%`,
              background: 'linear-gradient(90deg, var(--dh-accent), var(--dh-accent-dark))',
            }}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## 4. FIRST SALE SCRIPT SECTION

Make it copy-able with context.

```tsx
<div className="space-y-4">
  <div>
    <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3">
      Copy & Paste Script
    </p>
    <div className="p-6 rounded-2xl bg-dh-blush border border-dh-rose-gold/20">
      <p className="font-body text-[13px] text-dh-text-mid leading-[1.8] whitespace-pre-line">
        {execution?.firstSaleScript}
      </p>
    </div>
  </div>

  {/* Copy Button */}
  <div className="flex gap-2">
    <CopyPill
      text={execution?.firstSaleScript || ''}
      label="Copy Full Script"
    />
  </div>

  {/* Context */}
  <div className="p-4 rounded-xl bg-rgba(var(--dh-accent-rgb), 0.05)">
    <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-accent-dark mb-2">
      How to Use
    </p>
    <p className="font-body text-[11px] text-dh-text-light">
      {execution?.firstSaleContext}
    </p>
  </div>
</div>
```

---

## 5. TIKTOK/REELS HOOKS LIBRARY

Copyable hooks with context about when to use them.

```tsx
<div>
  <h3 className="font-display text-[18px] text-dh-text mb-4">
    5 TikTok/Reels Hooks
  </h3>
  <p className="font-body text-[12px] text-dh-text-light mb-6">
    These hooks convert because they promise a specific transformation, not just information.
  </p>

  <div className="space-y-3">
    {execution?.hooks.map((hook, i) => (
      <div
        key={i}
        className="p-4 rounded-xl border border-rgba(var(--dh-accent-rgb), 0.2)"
        style={{ background: 'rgba(var(--dh-accent-rgb), 0.05)' }}
      >
        <div className="flex gap-3 items-start">
          <span className="text-dh-accent-dark font-medium text-[10px] min-w-fit pt-1">
            Hook {i + 1}
          </span>
          <div className="flex-1">
            <p className="font-body text-[12px] text-dh-text mb-3 italic">
              {hook}
            </p>
            <CopyPill
              text={hook}
              label={`Copy Hook ${i + 1}`}
            />
          </div>
        </div>
      </div>
    ))}
  </div>

  <div className="p-4 mt-6 rounded-xl" style={{ background: 'rgba(var(--dh-accent-rgb), 0.08)' }}>
    <p className="font-ui text-[8px] tracking-[3px] uppercase text-dh-accent-dark mb-2">
      Pro Tip
    </p>
    <p className="font-body text-[11px] text-dh-text-light">
      Don't use the exact hook. Use it as a template. Replace [product] and [result] with your specifics. Authenticity beats polish.
    </p>
  </div>
</div>
```

---

## 6. ACTION-ORIENTED NEXT BUTTON

Instead of "Next Room" use the execution action copy.

```tsx
<button
  onClick={() => navigateToRoom(execution?.nextRoom)}
  className="dh-cta w-full py-3 rounded-xl font-ui text-[11px] tracking-[2px] uppercase font-medium text-center mt-8 flex items-center justify-center gap-2"
>
  {execution?.nextStepCopy}
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6" />
  </svg>
</button>
```

### Example Output

- "Go to Pricing Room: Set Your Tiers"
- "Go to Social Room: Create Your Voice"
- "Go to First Sale Room: Land Your First Customer"

---

## 7. SALES PAGE OUTLINE (Copy-Friendly Format)

```tsx
<div className="space-y-4">
  <div>
    <p className="font-ui text-[9px] tracking-[3px] uppercase text-dh-accent-dark mb-3">
      Sales Page Outline
    </p>
    <div className="p-6 rounded-2xl bg-dh-blush">
      <p className="font-body text-[12px] text-dh-text-mid whitespace-pre-line leading-[1.8]">
        {execution?.salesPageOutline}
      </p>
    </div>
  </div>

  <div className="flex gap-2">
    <CopyPill
      text={execution?.salesPageOutline || ''}
      label="Copy Outline"
    />
    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dh-accent-dark/30 font-ui text-[9px] tracking-[2px] uppercase text-dh-accent-dark hover:bg-dh-accent-dark/5 transition-all">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download PDF
    </button>
  </div>
</div>
```

---

## 8. FULL ROOM TEMPLATE

Here's a complete room that uses all the execution elements:

```tsx
import { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import CopyPill from '@/components/CopyPill';
import { playClick } from '@/lib/sounds';
import { toast } from 'sonner';

export default function FirstSaleRoom() {
  const { aiResults } = useQuiz();
  const execution = aiResults?.executionContent;
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  if (!execution) return null;

  return (
    <div data-room-id="r06" className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="font-display text-[32px] text-dh-text mb-2">
          Land Your First Sale
        </h2>
        <p className="font-body text-[13px] text-dh-text-light">
          Not lucky. Methodical. Here's your exact playbook for the first 48 hours.
        </p>
      </div>

      {/* First 48 Hours Checklist */}
      <div className="space-y-6">
        <div>
          <h3 className="font-display text-[20px] text-dh-text mb-4">Day 1: Setup & Message</h3>
          <div className="space-y-2">
            {execution.first48Hours.day1.map((action, i) => {
              const [time, task] = action.split(' – ');
              const isChecked = checkedItems.has(i);
              return (
                <div
                  key={i}
                  onClick={() => {
                    const newSet = new Set(checkedItems);
                    if (newSet.has(i)) newSet.delete(i);
                    else newSet.add(i);
                    setCheckedItems(newSet);
                    playClick('soft');
                  }}
                  className="p-4 rounded-xl cursor-pointer transition-all border"
                  style={{
                    background: isChecked ? 'rgba(var(--dh-accent-rgb), 0.12)' : 'rgba(var(--dh-accent-rgb), 0.05)',
                    borderColor: isChecked ? 'var(--dh-accent-dark)' : 'rgba(var(--dh-accent-rgb), 0.15)',
                    opacity: isChecked ? 0.6 : 1,
                    textDecoration: isChecked ? 'line-through' : 'none',
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <span className="text-dh-accent-dark font-medium text-[10px] min-w-fit">{time}</span>
                    <p className="font-body text-[12px] text-dh-text flex-1">{task}</p>
                    {isChecked && <span className="text-dh-accent-dark text-[16px]">✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* First Sale Script */}
      <div className="space-y-4">
        <h3 className="font-display text-[20px] text-dh-text">Email/DM Script</h3>
        <div className="p-6 rounded-2xl bg-dh-blush">
          <p className="font-body text-[13px] text-dh-text-mid whitespace-pre-line leading-[1.8]">
            {execution.firstSaleScript}
          </p>
        </div>
        <CopyPill text={execution.firstSaleScript} label="Copy Script" />
      </div>

      {/* Next Room */}
      <button className="dh-cta w-full py-3 rounded-xl font-ui text-[11px] tracking-[2px] uppercase flex items-center justify-center gap-2">
        {execution.nextStepCopy}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}
```

---

## Implementation Checklist

- [ ] Add `CopyPill.tsx` component (already done ✓)
- [ ] Create Room 0 (RealityCheckRoom) with trap warning
- [ ] Update FirstSaleRoom with 48-hour checklist
- [ ] Add hooks library to SocialRoom/ContentRoom
- [ ] Add sales page outline to a Room
- [ ] Update all navigation buttons to use `execution?.nextStepCopy`
- [ ] Test copy-to-clipboard feedback (should show "Copied!" for 2 seconds)
- [ ] Add completion tracking to checklists
- [ ] Style pills to match your brand (currently using dh-accent colors)

---

## Design Notes

### Colors
- Pills use `rgba(var(--dh-accent-rgb), 0.08)` for background
- Pills use `var(--dh-accent-dark)` for text
- Active/copied state uses `rgba(var(--dh-accent-rgb), 0.15)`

### Spacing
- Room spacing: `space-y-8` or `space-y-12` for breathing room
- Item spacing: `space-y-2` for checklists, `space-y-3` for hooks
- Content padding: `p-6` for content blocks

### Typography
- Room titles: `font-display text-[28px-32px]`
- Subheadings: `font-display text-[18px-20px]`
- Body text: `font-body text-[12px-13px]`
- Labels: `font-ui text-[8px-10px] tracking-[3px] uppercase`

---

## Next Steps

1. Integrate these components into your Room components
2. Test the CopyPill feedback on mobile (might need to adjust styling)
3. Consider adding keyboard shortcut (Cmd+C) detection for faster copy
4. Add analytics to track which content gets copied most
5. Consider "Share" buttons alongside "Copy" buttons

Your app is now an **execution powerhouse** worth every dollar of $97. 🏛️
