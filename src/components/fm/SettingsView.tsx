import { useRef, useState } from "react";

import { defaultState, migrate, type AppState } from "@/lib/db";
import { useStore } from "@/lib/store";
import { THEMES } from "@/lib/theme";

export function SettingsView({ onBack }: { onBack: () => void }) {
  const { state, update, replaceAll } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const backup = () => {
    try {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
      a.href = url;
      a.download = `faith-mark-backup-${stamp}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setMessage("Backup file saved to your device.");
    } catch {
      setMessage("Could not create the backup file.");
    }
  };

  const restore = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<AppState>;
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.trackers)) {
        setMessage("That file is not a Faith Mark backup.");
        return;
      }
      replaceAll(migrate(parsed));
      setMessage("Backup restored successfully.");
    } catch {
      setMessage("Could not read that file.");
    }
  };

  const resetAll = () => {
    replaceAll(defaultState());
    setMessage("Everything was reset to defaults.");
  };

  return (
    <div className="fm-screen">
      <header className="fm-header">
        <button className="fm-linkbtn" onClick={onBack}>
          ‹ Back
        </button>
        <h1 className="fm-title">Settings</h1>
        <span />
      </header>

      <div className="fm-body fm-pad">
        <h2 className="fm-section">Theme</h2>
        <div className="fm-theme-grid">
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={`fm-theme${state.settings.theme === t.id ? " is-active" : ""}`}
              onClick={() =>
                update((d) => {
                  d.settings.theme = t.id;
                  return d;
                })
              }
            >
              <span className="fm-theme-dots">
                <i style={{ background: t.vars["--fm-bg"] }} />
                <i style={{ background: t.vars["--fm-surface"] }} />
                <i style={{ background: t.vars["--fm-accent"] }} />
              </span>
              {t.label}
            </button>
          ))}
        </div>

        <h2 className="fm-section">Backup &amp; restore</h2>
        <p className="fm-hint">
          Everything is stored on this device. Save a backup file, then restore it any time — no internet needed.
        </p>
        <button className="fm-btn fm-btn-primary fm-full" onClick={backup}>
          Back up to file
        </button>
        <button className="fm-btn fm-btn-soft fm-full" onClick={() => fileRef.current?.click()}>
          Restore from file
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="fm-hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void restore(file);
            e.target.value = "";
          }}
        />

        <h2 className="fm-section">Danger zone</h2>
        <button className="fm-btn fm-btn-ghost fm-full fm-danger" onClick={resetAll}>
          Reset all data
        </button>

        {message && <p className="fm-toast">{message}</p>}

        <p className="fm-hint fm-center">Faith Mark · works fully offline</p>
      </div>
    </div>
  );
}
