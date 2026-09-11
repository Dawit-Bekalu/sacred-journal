import type { BookDef } from "@/lib/bible";
import type { Tracker } from "@/lib/db";
import { readCount, useStore } from "@/lib/store";

export function BookView({
  tracker,
  book,
  onBack,
}: {
  tracker: Tracker;
  book: BookDef;
  onBack: () => void;
}) {
  const { update } = useStore();
  const read = new Set(tracker.progress[book.id] ?? []);
  const count = readCount(tracker, book);
  const pct = (count / book.chapters) * 100;
  const allRead = count >= book.chapters;

  const setChapters = (next: number[]) => {
    update((d) => {
      const t = d.trackers.find((x) => x.id === tracker.id);
      if (t) t.progress[book.id] = next;
      return d;
    });
  };

  const toggle = (n: number) => {
    const next = new Set(read);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    setChapters([...next].sort((a, b) => a - b));
  };

  return (
    <div className="fm-screen">
      <header className="fm-header">
        <button className="fm-linkbtn" onClick={onBack}>
          ‹ Back
        </button>
        <span />
        <button
          className="fm-linkbtn"
          onClick={() =>
            setChapters(allRead ? [] : Array.from({ length: book.chapters }, (_, i) => i + 1))
          }
        >
          🔖 {allRead ? "Mark all as unread" : "Mark all as read"}
        </button>
      </header>
      <div className="fm-booktitle">
        <h1>{book.name}</h1>
        <p>{pct.toFixed(1)}%</p>
      </div>
      <div className="fm-body fm-pad">
        <div className="fm-chapters">
          {Array.from({ length: book.chapters }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              className={`fm-chapter${read.has(n) ? " is-read" : ""}`}
              style={read.has(n) ? { background: tracker.color, borderColor: tracker.color } : undefined}
              onClick={() => toggle(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
