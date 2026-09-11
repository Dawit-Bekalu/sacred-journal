export type Testament = "OT" | "NT";

export interface BookDef {
  id: string;
  name: string;
  abbr: string;
  chapters: number;
  group: string;
  testament: Testament;
}

const raw: Array<[string, string, number, string, Testament]> = [
  ["Genesis", "Gen", 50, "Laws of Moses", "OT"],
  ["Exodus", "Ex", 40, "Laws of Moses", "OT"],
  ["Leviticus", "Lev", 27, "Laws of Moses", "OT"],
  ["Numbers", "Num", 36, "Laws of Moses", "OT"],
  ["Deuteronomy", "Deut", 34, "Laws of Moses", "OT"],
  ["Joshua", "Josh", 24, "History", "OT"],
  ["Judges", "Judg", 21, "History", "OT"],
  ["Ruth", "Ruth", 4, "History", "OT"],
  ["1 Samuel", "1 Sam", 31, "History", "OT"],
  ["2 Samuel", "2 Sam", 24, "History", "OT"],
  ["1 Kings", "1 Kings", 22, "History", "OT"],
  ["2 Kings", "2 Kings", 25, "History", "OT"],
  ["1 Chronicles", "1 Chron", 29, "History", "OT"],
  ["2 Chronicles", "2 Chron", 36, "History", "OT"],
  ["Ezra", "Ezra", 10, "History", "OT"],
  ["Nehemiah", "Neh", 13, "History", "OT"],
  ["Esther", "Est", 10, "History", "OT"],
  ["Job", "Job", 42, "Poetry", "OT"],
  ["Psalms", "Ps", 150, "Poetry", "OT"],
  ["Proverbs", "Prov", 31, "Poetry", "OT"],
  ["Ecclesiastes", "Eccles", 12, "Poetry", "OT"],
  ["Song of Solomon", "Song", 8, "Poetry", "OT"],
  ["Isaiah", "Isa", 66, "Major prophets", "OT"],
  ["Jeremiah", "Jer", 52, "Major prophets", "OT"],
  ["Lamentations", "Lam", 5, "Major prophets", "OT"],
  ["Ezekiel", "Ezek", 48, "Major prophets", "OT"],
  ["Daniel", "Dan", 12, "Major prophets", "OT"],
  ["Hosea", "Hos", 14, "Minor prophets", "OT"],
  ["Joel", "Joel", 3, "Minor prophets", "OT"],
  ["Amos", "Amos", 9, "Minor prophets", "OT"],
  ["Obadiah", "Obad", 1, "Minor prophets", "OT"],
  ["Jonah", "Jonah", 4, "Minor prophets", "OT"],
  ["Micah", "Mic", 7, "Minor prophets", "OT"],
  ["Nahum", "Nah", 3, "Minor prophets", "OT"],
  ["Habakkuk", "Hab", 3, "Minor prophets", "OT"],
  ["Zephaniah", "Zeph", 3, "Minor prophets", "OT"],
  ["Haggai", "Hag", 2, "Minor prophets", "OT"],
  ["Zechariah", "Zech", 14, "Minor prophets", "OT"],
  ["Malachi", "Mal", 4, "Minor prophets", "OT"],
  ["Matthew", "Matt", 28, "Gospels", "NT"],
  ["Mark", "Mark", 16, "Gospels", "NT"],
  ["Luke", "Luke", 24, "Gospels", "NT"],
  ["John", "John", 21, "Gospels", "NT"],
  ["Acts", "Acts", 28, "History", "NT"],
  ["Romans", "Rom", 16, "Paul's letters", "NT"],
  ["1 Corinthians", "1 Cor", 16, "Paul's letters", "NT"],
  ["2 Corinthians", "2 Cor", 13, "Paul's letters", "NT"],
  ["Galatians", "Gal", 6, "Paul's letters", "NT"],
  ["Ephesians", "Eph", 6, "Paul's letters", "NT"],
  ["Philippians", "Phil", 4, "Paul's letters", "NT"],
  ["Colossians", "Col", 4, "Paul's letters", "NT"],
  ["1 Thessalonians", "1 Thess", 5, "Paul's letters", "NT"],
  ["2 Thessalonians", "2 Thess", 3, "Paul's letters", "NT"],
  ["1 Timothy", "1 Tim", 6, "Paul's letters", "NT"],
  ["2 Timothy", "2 Tim", 4, "Paul's letters", "NT"],
  ["Titus", "Titus", 3, "Paul's letters", "NT"],
  ["Philemon", "Philem", 1, "Paul's letters", "NT"],
  ["Hebrews", "Heb", 13, "General letters", "NT"],
  ["James", "James", 5, "General letters", "NT"],
  ["1 Peter", "1 Pet", 5, "General letters", "NT"],
  ["2 Peter", "2 Pet", 3, "General letters", "NT"],
  ["1 John", "1 John", 5, "General letters", "NT"],
  ["2 John", "2 John", 1, "General letters", "NT"],
  ["3 John", "3 John", 1, "General letters", "NT"],
  ["Jude", "Jude", 1, "General letters", "NT"],
  ["Revelation", "Rev", 22, "Apocalyptic", "NT"],
];

export const DEFAULT_BOOKS: BookDef[] = raw.map(([name, abbr, chapters, group, testament]) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  abbr,
  chapters,
  group,
  testament,
}));

export const DEFAULT_GROUPS: Record<Testament, string[]> = {
  OT: ["Laws of Moses", "History", "Poetry", "Major prophets", "Minor prophets"],
  NT: ["Gospels", "History", "Paul's letters", "General letters", "Apocalyptic"],
};

export const bookId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
