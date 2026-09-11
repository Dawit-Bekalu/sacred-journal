import { DEFAULT_ACHIEVEMENTS, type Achievement } from "./achievements";
import { DEFAULT_BOOKS, DEFAULT_GROUPS, type BookDef } from "./bible";

export interface Tracker {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  /** bookId -> array of read chapter numbers */
  progress: Record<string, number[]>;
  /** unlocked achievement ids (celebrated) */
  unlocked: string[];
}

export interface Settings {
  theme: string;
}

export interface AppState {
  version: number;
  trackers: Tracker[];
  books: BookDef[];
  groups: { OT: string[]; NT: string[] };
  achievements: Achievement[];
  settings: Settings;
}

export const TRACKER_COLORS = [
  "#a8c49a",
  "#8ad5f5",
  "#7d9fe8",
  "#b799ea",
  "#ef8fc9",
  "#f58a80",
  "#f2b563",
  "#f6cf4a",
];

export const defaultState = (): AppState => ({
  version: 1,
  trackers: [],
  books: DEFAULT_BOOKS.map((b) => ({ ...b })),
  groups: { OT: [...DEFAULT_GROUPS.OT], NT: [...DEFAULT_GROUPS.NT] },
  achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
  settings: { theme: "midnight" },
});

const DB_NAME = "faith-mark";
const STORE = "state";
const KEY = "app";
const LS_KEY = "faith-mark-state";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadState(): Promise<AppState> {
  try {
    const db = await openDB();
    const value = await new Promise<AppState | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = () => resolve(req.result as AppState | undefined);
      req.onerror = () => reject(req.error);
    });
    if (value) return migrate(value);
  } catch {
    /* fall through to localStorage */
  }
  try {
    const rawLs = localStorage.getItem(LS_KEY);
    if (rawLs) return migrate(JSON.parse(rawLs));
  } catch {
    /* ignore */
  }
  return defaultState();
}

export async function saveState(state: AppState): Promise<void> {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(state, KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    /* ignore — localStorage copy still holds the data */
  }
}

export function migrate(input: Partial<AppState>): AppState {
  const base = defaultState();
  return {
    version: 1,
    trackers: (input.trackers ?? []).map((t) => ({
      id: t.id ?? crypto.randomUUID(),
      name: t.name ?? "Tracker",
      color: t.color ?? TRACKER_COLORS[0],
      createdAt: t.createdAt ?? Date.now(),
      progress: t.progress ?? {},
      unlocked: t.unlocked ?? [],
    })),
    books: input.books?.length ? input.books : base.books,
    groups: input.groups ?? base.groups,
    achievements: input.achievements?.length ? input.achievements : base.achievements,
    settings: { theme: input.settings?.theme ?? base.settings.theme },
  };
}
