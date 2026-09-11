import { useState } from "react";

import type { Achievement, AchievementRule } from "@/lib/achievements";
import type { Tracker } from "@/lib/db";
import { evaluateAchievements, useStore } from "@/lib/store";
import { Modal } from "./ui";

const EMOJIS = ["🏆", "👑", "🕊️", "🦁", "🦅", "📖", "🔥", "✝️", "🌿", "⭐", "🖋️", "🎼"];

export function AchievementsView({ tracker, onBack }: { tracker: Tracker; onBack: () => void }) {
  const { state, update } = useStore();
  const unlocked = new Set(evaluateAchievements(tracker, state.books, state.achievements));
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<(Achievement & { isNew?: boolean }) | null>(null);

  const blank = (): Achievement & { isNew: boolean } => ({
    id: crypto.randomUUID(),
    title: "",
    desc: "",
    emoji: "🏆",
    rule: { type: "books", books: [] },
    isNew: true,
  });

  const save = () => {
    if (!form || !form.title.trim()) return;
    const { isNew, ...achievement } = form;
    achievement.title = achievement.title.trim();
    update((d) => {
      if (isNew) d.achievements.push(achievement);
      else {
        const i = d.achievements.findIndex((a) => a.id === achievement.id);
        if (i >= 0) d.achievements[i] = achievement;
      }
      return d;
    });
    setForm(null);
  };

  const remove = (id: string) => {
    update((d) => {
      d.achievements = d.achievements.filter((a) => a.id !== id);
      for (const t of d.trackers) t.unlocked = t.unlocked.filter((x) => x !== id);
      return d;
    });
  };

  const setRule = (rule: AchievementRule) => form && setForm({ ...form, rule });

  return (
    <div className="fm-screen">
      <header className="fm-header">
        <button className="fm-linkbtn" onClick={onBack}>
          ‹ Back
        </button>
        <span className="fm-count">
          {unlocked.size}/{state.achievements.length}
        </span>
        <button className="fm-linkbtn" onClick={() => setEditing((v) => !v)}>
          {editing ? "Done" : "Edit"}
        </button>
      </header>
      <h1 className="fm-ach-title">Achievements</h1>

      <div className="fm-toolbar">
        <button className="fm-linkbtn" onClick={() => setForm(blank())}>
          + Add achievement
        </button>
      </div>

      <div className="fm-body fm-pad">
        <ul className="fm-ach-list">
          {state.achievements.map((a) => {
            const isUnlocked = unlocked.has(a.id);
            return (
              <li key={a.id} className={`fm-ach-row${isUnlocked ? " fm-ach-unlocked" : ""}`}>
                <span className="fm-ach-icon">{isUnlocked ? a.emoji : "🔒"}</span>
                <span className="fm-ach-text">
                  <strong>{a.title}</strong>
                  <small>{a.desc}</small>
                </span>
                {editing && (
                  <span className="fm-row-actions">
                    <button className="fm-smallbtn" onClick={() => setForm({ ...a })}>
                      Edit
                    </button>
                    <button className="fm-smallbtn fm-danger" onClick={() => remove(a.id)}>
                      Delete
                    </button>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {form && (
        <Modal title={form.isNew ? "Add achievement" : "Edit achievement"} onClose={() => setForm(null)}>
          <label className="fm-label">Title</label>
          <input
            className="fm-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <label className="fm-label">Description</label>
          <input
            className="fm-input"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
          />
          <label className="fm-label">Reward icon</label>
          <div className="fm-swatches">
            {EMOJIS.map((e) => (
              <button
                key={e}
                className={`fm-emoji${form.emoji === e ? " is-active" : ""}`}
                onClick={() => setForm({ ...form, emoji: e })}
              >
                {e}
              </button>
            ))}
          </div>
          <label className="fm-label">Unlock when</label>
          <select
            className="fm-input"
            value={form.rule.type}
            onChange={(e) => {
              const type = e.target.value as AchievementRule["type"];
              if (type === "books") setRule({ type: "books", books: [] });
              else if (type === "group")
                setRule({ type: "group", testament: "OT", group: state.groups.OT[0] ?? "" });
              else if (type === "testament") setRule({ type: "testament", testament: "OT" });
              else setRule({ type: "percent", percent: 50 });
            }}
          >
            <option value="books">Selected books are finished</option>
            <option value="group">A whole group is finished</option>
            <option value="testament">A whole testament is finished</option>
            <option value="percent">A percentage of the Bible is read</option>
          </select>

          {form.rule.type === "books" && (
            <div className="fm-checklist">
              {state.books.map((b) => {
                const rule = form.rule as { type: "books"; books: string[] };
                const checked = rule.books.includes(b.id);
                return (
                  <label key={b.id} className="fm-check">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setRule({
                          type: "books",
                          books: checked ? rule.books.filter((x) => x !== b.id) : [...rule.books, b.id],
                        })
                      }
                    />
                    {b.name}
                  </label>
                );
              })}
            </div>
          )}

          {form.rule.type === "group" && (
            <>
              <select
                className="fm-input"
                value={form.rule.testament}
                onChange={(e) =>
                  setRule({
                    type: "group",
                    testament: e.target.value as "OT" | "NT" | "ALL",
                    group: (form.rule as { group: string }).group,
                  })
                }
              >
                <option value="OT">Old Testament</option>
                <option value="NT">New Testament</option>
                <option value="ALL">Both testaments</option>
              </select>
              <select
                className="fm-input"
                value={form.rule.group}
                onChange={(e) =>
                  setRule({
                    type: "group",
                    testament: (form.rule as { testament: "OT" | "NT" | "ALL" }).testament,
                    group: e.target.value,
                  })
                }
              >
                {[...new Set([...state.groups.OT, ...state.groups.NT])].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </>
          )}

          {form.rule.type === "testament" && (
            <select
              className="fm-input"
              value={form.rule.testament}
              onChange={(e) => setRule({ type: "testament", testament: e.target.value as "OT" | "NT" })}
            >
              <option value="OT">Old Testament</option>
              <option value="NT">New Testament</option>
            </select>
          )}

          {form.rule.type === "percent" && (
            <input
              className="fm-input"
              type="number"
              min={1}
              max={100}
              value={form.rule.percent}
              onChange={(e) =>
                setRule({ type: "percent", percent: Math.max(1, Math.min(100, Number(e.target.value) || 1)) })
              }
            />
          )}

          <div className="fm-modal-actions">
            <button className="fm-btn fm-btn-ghost" onClick={() => setForm(null)}>
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
