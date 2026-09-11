import { useState } from "react";

import { TRACKER_COLORS, type Tracker } from "@/lib/db";
import { totals, useStore } from "@/lib/store";
import { Modal } from "./ui";

export function TrackerListView({
  onOpen,
  onSettings,
}: {
  onOpen: (id: string) => void;
  onSettings: () => void;
}) {
  const { state, update } = useStore();
  const [editing, setEditing] = useState(false);
  const [dialog, setDialog] = useState<{ mode: "add" | "edit"; tracker?: Tracker } | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(TRACKER_COLORS[0]!);

  const openAdd = () => {
    setName("");
    setColor(TRACKER_COLORS[0]!);
    setDialog({ mode: "add" });
  };
  const openEdit = (t: Tracker) => {
    setName(t.name);
    setColor(t.color);
    setDialog({ mode: "edit", tracker: t });
  };

  const save = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    update((d) => {
      if (dialog?.mode === "edit" && dialog.tracker) {
        const t = d.trackers.find((x) => x.id === dialog.tracker!.id);
        if (t) {
          t.name = trimmed;
          t.color = color;
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
      d.trackers = d.trackers.filter((t) => t.id !== id);
      return d;
    });
  };

  return (
    <div className="fm-screen">
      <header className="fm-header">
        <span />
        <h1 className="fm-title">Bible Trackers</h1>
        <button className="fm-iconbtn" onClick={onSettings} aria-label="Settings">
          <span className="fm-gear">⚙</span>
          <small>Settings</small>
        </button>
      </header>

      <div className="fm-toolbar">
        <button className="fm-linkbtn" onClick={openAdd}>
          📑 Add new
        </button>
        {state.trackers.length > 0 && (
          <button className="fm-linkbtn" onClick={() => setEditing((v) => !v)}>
            ✏️ {editing ? "Done" : "Edit"}
          </button>
        )}
      </div>

      <div className="fm-body">
        {state.trackers.length === 0 ? (
          <div className="fm-empty">
            <div className="fm-blob">📚</div>
            <h2>No Bible Trackers</h2>
            <p>Add a new Bible Tracker to keep track of your reading progress</p>
            <button className="fm-btn fm-btn-soft" onClick={openAdd}>
              + Add new Bible Tracker
            </button>
          </div>
        ) : (
          <ul className="fm-list">
            {state.trackers.map((t) => {
              const pct = totals(t, state.books).all.pct;
              return (
                <li key={t.id} className="fm-row">
                  <button className="fm-row-main" onClick={() => onOpen(t.id)}>
                    <span className="fm-pct" style={{ background: t.color }}>
                      {pct.toFixed(1)}%
                    </span>
                    <span className="fm-row-name">{t.name}</span>
                    <span className="fm-chevron">›</span>
                  </button>
                  {editing && (
                    <div className="fm-row-actions">
                      <button className="fm-smallbtn" onClick={() => openEdit(t)}>
                        Edit
                      </button>
                      <button className="fm-smallbtn fm-danger" onClick={() => remove(t.id)}>
                        Delete
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
          title={dialog.mode === "add" ? "Add new Bible Tracker" : "Edit Bible Tracker"}
          onClose={() => setDialog(null)}
        >
          <label className="fm-label">Name</label>
          <input className="fm-input" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          <label className="fm-label">Color</label>
          <div className="fm-swatches">
            {TRACKER_COLORS.map((c) => (
              <button
                key={c}
                className={`fm-swatch${c === color ? " is-active" : ""}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          <div className="fm-modal-actions">
            <button className="fm-btn fm-btn-ghost" onClick={() => setDialog(null)}>
              Cancel
            </button>
            <button className="fm-btn fm-btn-primary" onClick={save}>
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
