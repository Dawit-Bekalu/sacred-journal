import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AchievementsView } from "@/components/fm/AchievementsView";
import { BookView } from "@/components/fm/BookView";
import { Celebration } from "@/components/fm/Celebration";
import { SettingsView } from "@/components/fm/SettingsView";
import { TrackerListView } from "@/components/fm/TrackerListView";
import { TrackerView } from "@/components/fm/TrackerView";
import { StoreProvider, evaluateAchievements, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Faith Mark — Offline Bible Reading Tracker" },
      {
        name: "description",
        content:
          "Track your Bible reading chapter by chapter with Faith Mark: 66 books, groups, stats and 28 achievements — fully offline on your phone.",
      },
      { property: "og:title", content: "Faith Mark — Offline Bible Reading Tracker" },
      {
        property: "og:description",
        content:
          "Chapter-by-chapter Bible reading tracker with achievements, stats, themes and local backup. Works with no internet.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <StoreProvider>
      <FaithMarkApp />
    </StoreProvider>
  ),
});

type View =
  | { name: "list" }
  | { name: "settings" }
  | { name: "tracker"; trackerId: string }
  | { name: "book"; trackerId: string; bookId: string }
  | { name: "achievements"; trackerId: string };

function FaithMarkApp() {
  const { state, ready, update } = useStore();
  const [view, setView] = useState<View>({ name: "list" });
  const [queue, setQueue] = useState<string[]>([]);

  const trackerId = "trackerId" in view ? view.trackerId : null;
  const tracker = state.trackers.find((t) => t.id === trackerId) ?? null;

  // Unlock / re-lock achievements whenever progress changes.
  useEffect(() => {
    if (!ready) return;
    let newlyUnlocked: string[] = [];
    let changed = false;
    const nextTrackers = state.trackers.map((t) => {
      const earned = evaluateAchievements(t, state.books, state.achievements);
      const earnedSet = new Set(earned);
      const kept = t.unlocked.filter((id) => earnedSet.has(id));
      const fresh = earned.filter((id) => !t.unlocked.includes(id));
      if (fresh.length || kept.length !== t.unlocked.length) changed = true;
      if (fresh.length && t.id === trackerId) newlyUnlocked = [...newlyUnlocked, ...fresh];
      return { ...t, unlocked: [...kept, ...fresh] };
    });
    if (changed) {
      update((d) => {
        d.trackers = nextTrackers;
        return d;
      });
      if (newlyUnlocked.length) setQueue((q) => [...q, ...newlyUnlocked]);
    }
  }, [state.trackers, state.books, state.achievements, ready, trackerId, update]);

  useEffect(() => {
    if (tracker === null && (view.name === "tracker" || view.name === "book" || view.name === "achievements")) {
      setView({ name: "list" });
    }
  }, [tracker, view.name]);

  if (!ready) {
    return (
      <div className="fm-splash">
        <div className="fm-splash-logo">
          <span>Faith</span>
          <strong>Mark</strong>
        </div>
      </div>
    );
  }

  const celebrating = queue[0] ? state.achievements.find((a) => a.id === queue[0]) : undefined;

  let screen = null;
  if (view.name === "settings") {
    screen = <SettingsView onBack={() => setView({ name: "list" })} />;
  } else if (view.name === "tracker" && tracker) {
    screen = (
      <TrackerView
        tracker={tracker}
        onBack={() => setView({ name: "list" })}
        onOpenBook={(bookId) => setView({ name: "book", trackerId: tracker.id, bookId })}
        onAchievements={() => setView({ name: "achievements", trackerId: tracker.id })}
      />
    );
  } else if (view.name === "book" && tracker) {
    const book = state.books.find((b) => b.id === view.bookId);
    screen = book ? (
      <BookView
        tracker={tracker}
        book={book}
        onBack={() => setView({ name: "tracker", trackerId: tracker.id })}
      />
    ) : null;
  } else if (view.name === "achievements" && tracker) {
    screen = (
      <AchievementsView tracker={tracker} onBack={() => setView({ name: "tracker", trackerId: tracker.id })} />
    );
  }

  return (
    <>
      {screen ?? (
        <TrackerListView
          onOpen={(id) => setView({ name: "tracker", trackerId: id })}
          onSettings={() => setView({ name: "settings" })}
        />
      )}
      {celebrating && (
        <Celebration achievement={celebrating} onClose={() => setQueue((q) => q.slice(1))} />
      )}
    </>
  );
}
