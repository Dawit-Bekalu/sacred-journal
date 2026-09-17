import { useRef, useState } from "react";

import { defaultState, migrate, type AppState } from "@/lib/db";
import type { Lang } from "@/lib/i18n";
import { useStore, useT } from "@/lib/store";
import { THEMES } from "@/lib/theme";

export function SettingsView({ onBack }: { onBack: () => void }) {
  const { state, update, replaceAll } = useStore();
  const t = useT();
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
      setMessage(t("msgBackupSaved"));
    } catch {
      setMessage(t("msgBackupFail"));
    }
  };

  const restore = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as Partial<AppState>;
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.trackers)) {
        setMessage(t("msgNotBackup"));
        return;
      }
      replaceAll(migrate(parsed));
      setMessage(t("msgRestored"));
    } catch {
      setMessage(t("msgReadFail"));
    }
  };

  const resetAll = () => {
    replaceAll(defaultState());
    setMessage(t("msgReset"));
  };

  return (
    <div className="fm-screen">
      <header className="fm-header">
        <button className="fm-linkbtn" onClick={onBack}>
          {t("back")}
        </button>
        <h1 className="fm-title">{t("settings")}</h1>
        <span />
      </header>

      <div className="fm-body fm-pad">
        <h2 className="fm-section">{t("language")}</h2>
        <div className="fm-theme-grid">
          {(
            [
              ["en", "English"],
              ["am", "አማርኛ"],
            ] as Array<[Lang, string]>
          ).map(([id, label]) => (
            <button
              key={id}
              className={`fm-theme${state.settings.language === id ? " is-active" : ""}`}
              onClick={() =>
                update((d) => {
                  d.settings.language = id;
                  return d;
                })
              }
            >
              {label}
            </button>
          ))}
        </div>

        <h2 className="fm-section">{t("theme")}</h2>
        <div className="fm-theme-grid">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              className={`fm-theme${state.settings.theme === theme.id ? " is-active" : ""}`}
              onClick={() =>
                update((d) => {
                  d.settings.theme = theme.id;
                  return d;
                })
              }
            >
              <span className="fm-theme-dots">
                <i style={{ background: theme.vars["--fm-bg"] }} />
                <i style={{ background: theme.vars["--fm-surface"] }} />
                <i style={{ background: theme.vars["--fm-accent"] }} />
              </span>
              {theme.label}
            </button>
          ))}
        </div>

        <h2 className="fm-section">{t("backupRestore")}</h2>
        <p className="fm-hint">{t("backupHint")}</p>
        <button className="fm-btn fm-btn-primary fm-full" onClick={backup}>
          {t("backupToFile")}
        </button>
        <button className="fm-btn fm-btn-soft fm-full" onClick={() => fileRef.current?.click()}>
          {t("restoreFromFile")}
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

        <h2 className="fm-section">{t("dangerZone")}</h2>
        <button className="fm-btn fm-btn-ghost fm-full fm-danger" onClick={resetAll}>
          {t("resetAll")}
        </button>

        {message && <p className="fm-toast">{message}</p>}

        <p className="fm-hint fm-center">{t("worksOffline")}</p>
      </div>
    </div>
  );
}
