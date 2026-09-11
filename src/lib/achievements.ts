export type AchievementRule =
  | { type: "books"; books: string[] }
  | { type: "group"; testament: "OT" | "NT" | "ALL"; group: string }
  | { type: "testament"; testament: "OT" | "NT" }
  | { type: "percent"; percent: number };

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  rule: AchievementRule;
}

const b = (...names: string[]) => names.map((n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-"));

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "the-man", title: "The Man", desc: "Read Matthew", emoji: "👨", rule: { type: "books", books: b("Matthew") } },
  { id: "the-lion", title: "The Lion", desc: "Read Mark", emoji: "🦁", rule: { type: "books", books: b("Mark") } },
  { id: "the-calf", title: "The Calf", desc: "Read Luke", emoji: "🐂", rule: { type: "books", books: b("Luke") } },
  { id: "the-eagle", title: "The Eagle", desc: "Read John", emoji: "🦅", rule: { type: "books", books: b("John") } },
  {
    id: "evangelist",
    title: "Evangelist",
    desc: "Read the four Gospels",
    emoji: "📜",
    rule: { type: "books", books: b("Matthew", "Mark", "Luke", "John") },
  },
  { id: "apostle", title: "Apostle", desc: "Read Acts", emoji: "🔥", rule: { type: "books", books: b("Acts") } },
  {
    id: "the-rock",
    title: "The Rock",
    desc: "Read Peter's first and second letter",
    emoji: "🪨",
    rule: { type: "books", books: b("1 Peter", "2 Peter") },
  },
  {
    id: "the-beginning",
    title: "The Beginning",
    desc: "Read Genesis",
    emoji: "🌅",
    rule: { type: "books", books: b("Genesis") },
  },
  {
    id: "no-longer-slave",
    title: "No longer slave",
    desc: "Read Exodus",
    emoji: "⛓️",
    rule: { type: "books", books: b("Exodus") },
  },
  {
    id: "sanctified",
    title: "Sanctified",
    desc: "Read Leviticus",
    emoji: "🕯️",
    rule: { type: "books", books: b("Leviticus") },
  },
  {
    id: "are-we-there-yet",
    title: "Are we there yet?",
    desc: "Read Numbers",
    emoji: "🏜️",
    rule: { type: "books", books: b("Numbers") },
  },
  {
    id: "covenant",
    title: "Covenant",
    desc: "Read Deuteronomy",
    emoji: "📖",
    rule: { type: "books", books: b("Deuteronomy") },
  },
  {
    id: "no-longer-ruthless",
    title: "No Longer Ruthless",
    desc: "Read Ruth",
    emoji: "🌾",
    rule: { type: "books", books: b("Ruth") },
  },
  {
    id: "scribe",
    title: "Scribe",
    desc: "Read the 5 books of Moses",
    emoji: "🖋️",
    rule: { type: "group", testament: "OT", group: "Laws of Moses" },
  },
  {
    id: "poet",
    title: "Poet",
    desc: "Read all the poetry books",
    emoji: "🎼",
    rule: { type: "group", testament: "OT", group: "Poetry" },
  },
  {
    id: "historian",
    title: "Historian",
    desc: "Read all History books",
    emoji: "🏛️",
    rule: { type: "group", testament: "ALL", group: "History" },
  },
  {
    id: "prophet",
    title: "Prophet",
    desc: "Read all major and minor prophets",
    emoji: "🔮",
    rule: {
      type: "books",
      books: b(
        "Isaiah",
        "Jeremiah",
        "Lamentations",
        "Ezekiel",
        "Daniel",
        "Hosea",
        "Joel",
        "Amos",
        "Obadiah",
        "Jonah",
        "Micah",
        "Nahum",
        "Habakkuk",
        "Zephaniah",
        "Haggai",
        "Zechariah",
        "Malachi",
      ),
    },
  },
  {
    id: "wise-man",
    title: "Wise Man",
    desc: "Read Proverbs, Job and Ecclesiastes",
    emoji: "🦉",
    rule: { type: "books", books: b("Proverbs", "Job", "Ecclesiastes") },
  },
  {
    id: "royal",
    title: "Royal",
    desc: "Read the books of Samuel, Kings and Chronicles",
    emoji: "👑",
    rule: {
      type: "books",
      books: b("1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles"),
    },
  },
  {
    id: "paulinist",
    title: "Paulinist",
    desc: "Read all of Paul's letters",
    emoji: "✉️",
    rule: { type: "group", testament: "NT", group: "Paul's letters" },
  },
  {
    id: "penpal",
    title: "Penpal",
    desc: "Read all of the letters",
    emoji: "📬",
    rule: {
      type: "books",
      books: b(
        "Romans",
        "1 Corinthians",
        "2 Corinthians",
        "Galatians",
        "Ephesians",
        "Philippians",
        "Colossians",
        "1 Thessalonians",
        "2 Thessalonians",
        "1 Timothy",
        "2 Timothy",
        "Titus",
        "Philemon",
        "Hebrews",
        "James",
        "1 Peter",
        "2 Peter",
        "1 John",
        "2 John",
        "3 John",
        "Jude",
      ),
    },
  },
  {
    id: "apocalyptic",
    title: "Apocalyptic",
    desc: "Read Daniel, Joel, Ezekiel, Zechariah and Revelation",
    emoji: "🌪️",
    rule: { type: "books", books: b("Daniel", "Joel", "Ezekiel", "Zechariah", "Revelation") },
  },
  {
    id: "the-new-covenant",
    title: "The New Covenant",
    desc: "Read the entire New Testament",
    emoji: "✝️",
    rule: { type: "testament", testament: "NT" },
  },
  {
    id: "before-christ",
    title: "Before Christ",
    desc: "Read the entire Old Testament",
    emoji: "🕎",
    rule: { type: "testament", testament: "OT" },
  },
  { id: "p25", title: "25%", desc: "Read 25% of the Bible", emoji: "🥉", rule: { type: "percent", percent: 25 } },
  { id: "p50", title: "50%", desc: "Read 50% of the Bible", emoji: "🥈", rule: { type: "percent", percent: 50 } },
  { id: "p75", title: "75%", desc: "Read 75% of the Bible", emoji: "🥇", rule: { type: "percent", percent: 75 } },
  {
    id: "bible-nerd",
    title: "Bible Nerd",
    desc: "Read the whole Bible",
    emoji: "🏆",
    rule: { type: "percent", percent: 100 },
  },
];
