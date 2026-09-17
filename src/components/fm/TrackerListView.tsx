import { useState } from "react";

import { TRACKER_COLORS, type Tracker } from "@/lib/db";
import { totals, useStore, useT } from "@/lib/store";
import { Modal } from "./ui";

export function TrackerListView({
  onOpen,
  onSettings,
}: {
  onOpen: (id: string) => void;
  onSettings: () => void;
}) {
  const { state, update } = useStore();
  const t = useT();
  const [editing, setEditing] = useState(false);
  const [dialog, setDialog] = useState<{ mode: "add" | "edit"; tracker?: Tracker } | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(TRACKER_COLORS[0]!);

  const openAdd = () => {
    setName("");
    setColor(TRACKER_COLORS[0]!);
    setDialog({ mode: "add" });
  };
  const openEdit = (tr: Tracker) => {
    setName(tr.name);
    setColor(tr.color);
    setDialog({ mode: "edit", tracker: tr });
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    update((d) => {
      if (dialog?.mode === "edit" && dialog.tracker) {
        const tr = d.trackers.find((x) => x.id === dialog.tracker!.id);
        if (tr) {
          tr.name = trimmed;
          tr.color = color;
        }
      } else {
        d.trackers.push({
          id: crypto.randomUUID(),
          name: trimmed,
          color,
          createdAt: Date.now(),
          progress: {},
          unlocked: [],
        });
      }
      return d;
    });
    setDialog(null);
  };

  const remove = (id: string) => {
    update((d) => {
      d.trackers = d.trackers.filter((x) => x.id !== id);
      return d;
    });
  };

  return (
    <div className="fm-screen">
      <header className="fm-header">
        <span />
        <h1 className="fm-title">{t("bibleTrackers")}</h1>
        <button className="fm-iconbtn" onClick={onSettings} aria-label={t("settings")}>
          <span className="fm-gear">⚙</span>
          <small>{t("settings")}</small>
        </button>
      </header>

      <div className="fm-toolbar">
        <button className="fm-linkbtn" onClick={openAdd}>
          {t("addNew")}
        </button>
        {state.trackers.length > 0 && (
          <button className="fm-linkbtn" onClick={() => setEditing((v) => !v)}>
            ✏️ {editing ? t("done") : t("edit")}
          </button>
        )}
      </div>

      <div className="fm-body">
        {state.trackers.length === 0 ? (
          <div className="fm-empty">
            <div className="fm-blob">📚</div>
            <h2>{t("noTrackers")}</h2>
            <p>{t("noTrackersHint")}</p>
            <button className="fm-btn fm-btn-soft" onClick={openAdd}>
              {t("addNewTracker")}
            </button>
          </div>
        ) : (
          <ul className="fm-list">
            {state.trackers.map((tr) => {
              const pct = totals(tr, state.books).all.pct;
              return (
                <li key={tr.id} className="fm-row">
                  <button className="fm-row-main" onClick={() => onOpen(tr.id)}>
                    <span className="fm-pct" style={{ background: tr.color }}>
                      {pct.toFixed(1)}%
                    </span>
                    <span className="fm-row-name">{tr.name}</span>
                    <span className="fm-chevron">›</span>
                  </button>
                  {editing && (
                    <div className="fm-row-actions">
                      <button className="fm-smallbtn" onClick={() => openEdit(tr)}>
                        {t("edit")}
                      </button>
                      <button className="fm-smallbtn fm-danger" onClick={() => remove(tr.id)}>
                        {t("delete")}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {dialog && (
        <Modal
          title={dialog.mode === "add" ? t("addTrackerTitle") : t("editTrackerTitle")}
          onClose={() => setDialog(null)}
        >
          <label className="fm-label">{t("name")}</label>
          <input className="fm-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <label className="fm-label">{t("color")}</label>
          <div className="fm-swatches">
            {TRACKER_COLORS.map((c) => (
              <button
                key={c}
                className={`fm-swatch${c === color ? " is-active" : ""}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`${t("color")} ${c}`}
              />
            ))}
          </div>
          <div className="fm-modal-actions">
            <button className="fm-btn fm-btn-ghost" onClick={() => setDialog(null)}>
              {t("cancel")}
            </button>
            <button className="fm-btn fm-btn-primary" onClick={save}>
              {t("save")}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
