export interface ThemeDef {
  id: string;
  label: string;
  vars: Record<string, string>;
}

export const THEMES: ThemeDef[] = [
  {
    id: "midnight",
    label: "Midnight",
    vars: {
      "--fm-bg": "#000000",
      "--fm-surface": "#1c1c1c",
      "--fm-surface-2": "#2a2a2a",
      "--fm-text": "#ffffff",
      "--fm-muted": "#a0a0a0",
      "--fm-accent": "#8ad5f5",
      "--fm-accent-text": "#04222e",
      "--fm-brand": "#a8c49a",
    },
  },
  {
    id: "olive",
    label: "Olive",
    vars: {
      "--fm-bg": "#10140f",
      "--fm-surface": "#1e241c",
      "--fm-surface-2": "#2b332a",
      "--fm-text": "#f2f5ef",
      "--fm-muted": "#a7b3a2",
      "--fm-accent": "#a8c49a",
      "--fm-accent-text": "#122016",
      "--fm-brand": "#a8c49a",
    },
  },
  {
    id: "royal",
    label: "Royal",
    vars: {
      "--fm-bg": "#0b0f1d",
      "--fm-surface": "#171d33",
      "--fm-surface-2": "#232b48",
      "--fm-text": "#f0f2ff",
      "--fm-muted": "#9aa3c4",
      "--fm-accent": "#b799ea",
      "--fm-accent-text": "#1a0f2e",
      "--fm-brand": "#b799ea",
    },
  },
  {
    id: "sunrise",
    label: "Sunrise",
    vars: {
      "--fm-bg": "#1a1210",
      "--fm-surface": "#2a1d19",
      "--fm-surface-2": "#3a2a24",
      "--fm-text": "#fff4ed",
      "--fm-muted": "#c3a89c",
      "--fm-accent": "#f2b563",
      "--fm-accent-text": "#2c1a05",
      "--fm-brand": "#f58a80",
    },
  },
  {
    id: "parchment",
    label: "Parchment",
    vars: {
      "--fm-bg": "#f4efe4",
      "--fm-surface": "#ffffff",
      "--fm-surface-2": "#e8e0cf",
      "--fm-text": "#241f16",
      "--fm-muted": "#6d6455",
      "--fm-accent": "#5c8d6a",
      "--fm-accent-text": "#ffffff",
      "--fm-brand": "#5c8d6a",
    },
  },
];

export function applyTheme(id: string) {
  const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
  const root = document.documentElement;
  for (const [k, v] of Object.entries(theme.vars)) root.style.setProperty(k, v);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.vars["--fm-bg"]);
}
