import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Achievement } from "./achievements";
import type { BookDef } from "./bible";
import { defaultState, loadState, migrate, saveState, type AppState, type Tracker } from "./db";
import { applyTheme } from "./theme";

interface Ctx {
  state: AppState;
  ready: boolean;
  update: (fn: (draft: AppState) => AppState) => void;
  replaceAll: (next: AppState) => void;
}

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    let alive = true;
    loadState().then((loaded) => {
      if (!alive) return;
      setState(loaded);
      readyRef.current = true;
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    applyTheme(state.settings.theme);
  }, [state.settings.theme]);

  useEffect(() => {
    if (!ready) return;
    void saveState(state);
  }, [state, ready]);

  const update = useCallback((fn: (draft: AppState) => AppState) => {
    setState((prev) => fn(structuredClone(prev)));
  }, []);

  const replaceAll = useCallback((next: AppState) => setState(migrate(next)), []);

  const value = useMemo(() => ({ state, ready, update, replaceAll }), [state, ready, update, replaceAll]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/* ---------- derived helpers ---------- */

export const readCount = (tracker: Tracker, book: BookDef) =>
  (tracker.progress[book.id] ?? []).filter((c) => c >= 1 && c <= book.chapters).length;

export const isBookComplete = (tracker: Tracker, book: BookDef) =>
  book.chapters > 0 && readCount(tracker, book) >= book.chapters;

export function totals(tracker: Tracker, books: BookDef[]) {
  const sum = (list: BookDef[]) => {
    const chapters = list.reduce((a, b) => a + b.chapters, 0);
    const read = list.reduce((a, b) => a + readCount(tracker, b), 0);
    const done = list.filter((b) => isBookComplete(tracker, b)).length;
    return { chapters, read, books: list.length, done, pct: chapters ? (read / chapters) * 100 : 0 };
  };
  const ot = sum(books.filter((b) => b.testament === "OT"));
  const nt = sum(books.filter((b) => b.testament === "NT"));
  const all = sum(books);
  return { ot, nt, all };
}

export function evaluateAchievements(
  tracker: Tracker,
  books: BookDef[],
  achievements: Achievement[],
): string[] {
  const byId = new Map(books.map((b) => [b.id, b]));
  const complete = (id: string) => {
    const book = byId.get(id);
    return book ? isBookComplete(tracker, book) : false;
  };
  const t = totals(tracker, books);
  const out: string[] = [];
  for (const a of achievements) {
    let ok = false;
    if (a.rule.type === "books") {
      ok = a.rule.books.length > 0 && a.rule.books.every(complete);
    } else if (a.rule.type === "group") {
      const list = books.filter(
        (b) => b.group === a.rule.type === false ? false : b.group === (a.rule as { group: string }).group,
      );
      const scoped =
        (a.rule as { testament: string }).testament === "ALL"
          ? list
          : list.filter((b) => b.testament === (a.rule as { testament: string }).testament);
      ok = scoped.length > 0 && scoped.every((b) => isBookComplete(tracker, b));
    } else if (a.rule.type === "testament") {
      const scoped = books.filter((b) => b.testament === (a.rule as { testament: string }).testament);
      ok = scoped.length > 0 && scoped.every((b) => isBookComplete(tracker, b));
    } else if (a.rule.type === "percent") {
      ok = t.all.chapters > 0 && t.all.pct + 1e-9 >= a.rule.percent;
    }
    if (ok) out.push(a.id);
  }
  return out;
}
