import type { ReactNode } from "react";

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fm-overlay" onClick={onClose} role="presentation">
      <div className="fm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <h3 className="fm-modal-title">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function ProgressBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className="fm-bar">
      <div
        className="fm-bar-fill"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color ?? "var(--fm-accent)" }}
      />
    </div>
  );
}

export function Ring({ pct, label, sub }: { pct: number; label: string; sub?: string }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="fm-ring-wrap">
      <svg width="76" height="76" viewBox="0 0 76 76" className="fm-ring">
        <circle cx="38" cy="38" r={r} className="fm-ring-track" />
        <circle
          cx="38"
          cy="38"
          r={r}
          className="fm-ring-value"
          strokeDasharray={c}
          strokeDashoffset={c - (c * Math.min(100, pct)) / 100}
        />
        <text x="38" y="43" textAnchor="middle" className="fm-ring-text">
          {label}
        </text>
      </svg>
      {sub ? <span className="fm-ring-sub">{sub}</span> : null}
    </div>
  );
}

export function StatBox({ top, bottom, caption }: { top: string; bottom: string; caption: string }) {
  return (
    <div className="fm-statbox-wrap">
      <div className="fm-statbox">
        <span className="fm-statbox-top">{top}</span>
        <span className="fm-statbox-line" />
        <span className="fm-statbox-bottom">{bottom}</span>
      </div>
      <span className="fm-statbox-caption">{caption}</span>
    </div>
  );
}
