import { useMemo } from "react";

import type { Achievement } from "@/lib/achievements";

const CARDS = [
  { bg: "linear-gradient(160deg,#123a2a,#2f7d5b)", art: "🕊️", verse: "Your word is a lamp to my feet." },
  { bg: "linear-gradient(160deg,#2a1f4d,#6446a8)", art: "✨", verse: "The light shines in the darkness." },
  { bg: "linear-gradient(160deg,#3d2410,#a5661f)", art: "🔥", verse: "Did not our hearts burn within us?" },
  { bg: "linear-gradient(160deg,#0f2c46,#2b7fae)", art: "⛵", verse: "Peace! Be still." },
  { bg: "linear-gradient(160deg,#3a1424,#a03a63)", art: "👑", verse: "The Lord reigns forever." },
  { bg: "linear-gradient(160deg,#12331a,#4f9c46)", art: "🌿", verse: "He restores my soul." },
];

export function Celebration({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.4,
        rotate: Math.random() * 360,
        color: ["#8ad5f5", "#a8c49a", "#f2b563", "#ef8fc9", "#b799ea", "#f6cf4a"][i % 6],
      })),
    [],
  );
  const card = useMemo(() => {
    const sum = [...achievement.id].reduce((a, ch) => a + ch.charCodeAt(0), 0);
    return CARDS[sum % CARDS.length]!;
  }, [achievement.id]);

  return (
    <div className="fm-overlay" role="dialog" aria-label="Achievement unlocked">
      <div className="fm-confetti" aria-hidden="true">
        {confetti.map((c, i) => (
          <span
            key={i}
            style={{
              left: `${c.left}%`,
              background: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              transform: `rotate(${c.rotate}deg)`,
            }}
          />
        ))}
      </div>
      <div className="fm-modal fm-pop">
        <h3 className="fm-modal-title">Achievement</h3>
        <p className="fm-congrats">Congratulations! 🎉</p>
        <div className="fm-imagecard" style={{ background: card.bg }}>
          <span className="fm-imagecard-art">{card.art}</span>
          <span className="fm-imagecard-verse">{card.verse}</span>
        </div>
        <div className="fm-ach-row fm-ach-unlocked">
          <span className="fm-ach-icon">{achievement.emoji}</span>
          <span>
            <strong>{achievement.title}</strong>
            <small>{achievement.desc}</small>
          </span>
        </div>
        <button className="fm-btn fm-btn-primary fm-full" onClick={onClose}>
          Hurray!
        </button>
      </div>
    </div>
  );
}
