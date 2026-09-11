import { useMemo, useState } from "react";

import type { BookDef, Testament } from "@/lib/bible";
import type { Tracker } from "@/lib/db";
import { evaluateAchievements, isBookComplete, readCount, totals, useStore } from "@/lib/store";
import { Modal, ProgressBar, Ring, StatBox } from "./ui";

type Tab = "OT" | "NT" | "STATS";

interface BookForm {
  id?: string;
  name: string;
  abbr: string;
  chapters: string;
  group: string;
  testament: Testament;
}

export function TrackerView({
  tracker,
  onBack,
  onOpenBook,
  onAchievements,
}: {
  tracker: Tracker;
  onBack: () => void;
  onOpenBook: (bookId: string) => void;
  onAchievements: () => void;
}) {
  const { state, update } = useStore();
  const [tab, setTab] = useState<Tab>("OT");
  const [editing, setEditing] = useState(false);
  const [bookForm, setBookForm] = useState<BookForm | null>(null);
  const [groupForm, setGroupForm] = useState<{ original?: string; name: string; testament: Testament } | null>(
    null,
  );

  const t = totals(tracker, state.books);
  const testament: Testament = tab === "NT" ? "NT" : "OT";
  const groups = state.groups[testament];

  const grouped = useMemo(() => {
    const map = new Map<string, BookDef[]>();
    for (const g of groups) map.set(g, []);
    for (const b of state.books.filter((x) => x.testament === testament)) {
      if (!map.has(b.group)) map.set(b.group, []);
      map.get(b.group)!.push(b);
    }
    return [...map.entries()];
  }, [groups, state.books, testament]);

  const unlockedCount = evaluateAchievements(tracker, state.books, state.achievements).length;

  const saveBook = () => {
    if (!bookForm) return;
    const name = bookForm.name.trim();
    const chapters = Math.max(1, Math.min(999, parseInt(bookForm.chapters, 10) || 1));
    if (!name) return;
    update((d) => {
      if (bookForm.id) {
        const book = d.books.find((b) => b.id === bookForm.id);
        if (book) {
          book.name = name;
          book.abbr = bookForm.abbr.trim() || name.slice(0, 5);
          book.chapters = chapters;
          book.group = bookForm.group;
          book.testament = bookForm.testament;
        }
      } else {
        const id = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).slice(2, 6)}`;
        d.books.push({
          id,
          name,
          abbr: bookForm.abbr.trim() || name.slice(0, 5),
          chapters,
          group: bookForm.group,
          testament: bookForm.testament,
        });
      }
      if (!d.groups[bookForm.testament].includes(bookForm.group)) d.groups[bookForm.testament].push(bookForm.group);
      return d;
    });
    setBookForm(null);
  };

  const deleteBook = (id: string) => {
    update((d) => {
      d.books = d.books.filter((b) => b.id !== id);
      for (const tr of d.trackers) delete tr.progress[id];
      return d;
    });
  };

  const saveGroup = () => {
    if (!groupForm) return;
    const name = groupForm.name.trim();
    if (!name) return;
    update((d) => {
      const list = d.groups[groupForm.testament];
      if (groupForm.original) {
        const i = list.indexOf(groupForm.original);
        if (i >= 0) list[i] = name;
        for (const b of d.books) {
          if (b.testament === groupForm.testament && b.group === groupForm.original) b.group = name;
        }
      } else if (!list.includes(name)) {
        list.push(name);
      }
      return d;
    });
    setGroupForm(null);
  };

  const deleteGroup = (name: string) => {
    update((d) => {
      d.groups[testament] = d.groups[testament].filter((g) => g !== name);
      d.books = d.books.filter((b) => !(b.testament === testament && b.group === name));
      return d;
    });
  };

  return (
    <div className="fm-screen">
      <header className="fm-header fm-header-3">
        <button className="fm-linkbtn fm-col" onClick={onBack}>
          <span className="fm-ico">🔖</span>
          <small>Bible Trackers</small>
        </button>
        <div className="fm-center">
          <strong className="fm-bigpct">{t.all.pct.toFixed(1)}%</strong>
          <small>of the Bible</small>
        </div>
        <button className="fm-linkbtn fm-col" onClick={onAchievements}>
          <span className="fm-ico">🏆</span>
          <small>Achievements</small>
        </button>
      </header>

      <div className="fm-tabs-wrap">
        <div className="fm-tabs-name">{tracker.name}</div>
        <div className="fm-tabs">
          {(
            [
              ["OT", "Old Testament"],
              ["NT", "New Testament"],
              ["STATS", "Stats"],
            ] as Array<[Tab, string]>
          ).map(([id, label]) => (
            <button
              key={id}
              className={`fm-tab${tab === id ? " is-active" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="fm-body fm-pad">
        {tab === "STATS" ? (
          <>
            <h2 className="fm-section">Percentage</h2>
            <div className="fm-rings">
              <Ring pct={t.ot.pct} label={`${Math.round(t.ot.pct)}%`} sub="Old Testament" />
              <Ring pct={t.nt.pct} label={`${Math.round(t.nt.pct)}%`} sub="New Testament" />
              <Ring pct={t.all.pct} label={`${Math.round(t.all.pct)}%`} sub="Whole Bible" />
            </div>
            <h2 className="fm-section">Chapters</h2>
            <div className="fm-stats">
              <StatBox top={`${t.ot.read}`} bottom={`${t.ot.chapters}`} caption="OT" />
              <StatBox top={`${t.nt.read}`} bottom={`${t.nt.chapters}`} caption="NT" />
              <StatBox top={`${t.all.read}`} bottom={`${t.all.chapters}`} caption="The Bible" />
            </div>
            <h2 className="fm-section">Books</h2>
            <div className="fm-stats">
              <StatBox top={`${t.ot.done}`} bottom={`${t.ot.books}`} caption="OT" />
              <StatBox top={`${t.nt.done}`} bottom={`${t.nt.books}`} caption="NT" />
              <StatBox top={`${t.all.done}`} bottom={`${t.all.books}`} caption="The Bible" />
            </div>
            <h2 className="fm-section">Achievements</h2>
            <div className="fm-stats">
              <StatBox top={`${unlockedCount}`} bottom={`${state.achievements.length}`} caption="Unlocked" />
            </div>
          </>
        ) : (
          <>
            <div className="fm-toolbar fm-toolbar-inline">
              <button
                className="fm-linkbtn"
                onClick={() =>
                  setBookForm({
                    name: "",
                    abbr: "",
                    chapters: "1",
                    group: groups[0] ?? "History",
                    testament,
                  })
                }
              >
                + Add book
              </button>
              <button
                className="fm-linkbtn"
                onClick={() => setGroupForm({ name: "", testament })}
              >
                + Add group
              </button>
              <button className="fm-linkbtn" onClick={() => setEditing((v) => !v)}>
                {editing ? "Done" : "Edit"}
              </button>
            </div>

            {grouped.map(([group, books]) => (
              <section key={group} className="fm-group">
                <div className="fm-group-head">
                  <h2 className="fm-section">{group}</h2>
                  {editing && (
                    <div className="fm-row-actions">
                      <button
                        className="fm-smallbtn"
                        onClick={() => setGroupForm({ original: group, name: group, testament })}
                      >
                        Rename
                      </button>
                      <button className="fm-smallbtn fm-danger" onClick={() => deleteGroup(group)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <div className="fm-books">
                  {books.map((b) => {
                    const read = readCount(tracker, b);
                    const pct = (read / b.chapters) * 100;
                    return (
                      <div key={b.id} className="fm-bookcell">
                        <button
                          className={`fm-book${isBookComplete(tracker, b) ? " is-done" : ""}`}
                          onClick={() => onOpenBook(b.id)}
                        >
                          <span className="fm-book-abbr">{b.abbr}</span>
                          <ProgressBar pct={pct} color={tracker.color} />
                        </button>
                        {editing && (
                          <div className="fm-row-actions">
                            <button
                              className="fm-smallbtn"
                              onClick={() =>
                                setBookForm({
                                  id: b.id,
                                  name: b.name,
                                  abbr: b.abbr,
                                  chapters: String(b.chapters),
                                  group: b.group,
                                  testament: b.testament,
                                })
                              }
                            >
                              Edit
                            </button>
                            <button className="fm-smallbtn fm-danger" onClick={() => deleteBook(b.id)}>
                              Del
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {books.length === 0 && <p className="fm-hint">No books in this group yet.</p>}
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      {bookForm && (
        <Modal title={bookForm.id ? "Edit book" : "Add book"} onClose={() => setBookForm(null)}>
          <label className="fm-label">Name</label>
          <input
            className="fm-input"
            value={bookForm.name}
            onChange={(e) => setBookForm({ ...bookForm, name: e.target.value })}
          />
          <label className="fm-label">Short name</label>
          <input
            className="fm-input"
            value={bookForm.abbr}
            onChange={(e) => setBookForm({ ...bookForm, abbr: e.target.value })}
          />
          <label className="fm-label">Chapters</label>
          <input
            className="fm-input"
            type="number"
            min={1}
            value={bookForm.chapters}
            onChange={(e) => setBookForm({ ...bookForm, chapters: e.target.value })}
          />
          <label className="fm-label">Testament</label>
          <select
            className="fm-input"
            value={bookForm.testament}
            onChange={(e) => {
              const nextT = e.target.value as Testament;
              setBookForm({
                ...bookForm,
                testament: nextT,
                group: state.groups[nextT][0] ?? bookForm.group,
              });
            }}
          >
            <option value="OT">Old Testament</option>
            <option value="NT">New Testament</option>
          </select>
          <label className="fm-label">Group</label>
          <select
            className="fm-input"
            value={bookForm.group}
            onChange={(e) => setBookForm({ ...bookForm, group: e.target.value })}
          >
            {state.groups[bookForm.testament].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <div className="fm-modal-actions">
            <button className="fm-btn fm-btn-ghost" onClick={() => setBookForm(null)}>
              Cancel
            </button>
            <button className="fm-btn fm-btn-primary" onClick={saveBook}>
              Save
            </button>
          </div>
        </Modal>
      )}

      {groupForm && (
        <Modal title={groupForm.original ? "Rename group" : "Add group"} onClose={() => setGroupForm(null)}>
          <label className="fm-label">Group name</label>
          <input
            className="fm-input"
            value={groupForm.name}
            onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
            autoFocus
          />
          <div className="fm-modal-actions">
            <button className="fm-btn fm-btn-ghost" onClick={() => setGroupForm(null)}>
              Cancel
            </button>
            <button className="fm-btn fm-btn-primary" onClick={saveGroup}>
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
