export const PROFILE_THEMES = {
  default: { name: "Neapolitan", primary: "#604734", light: "#f0c5d4", soft: "#fcf7d9", accent: "#9b6b8a" },
  sage: { name: "Verde Sage", primary: "#4a7c59", light: "#d4e8db", soft: "#eef5f0", accent: "#4a7c59" },
  ocean: { name: "Azul Oceano", primary: "#2563eb", light: "#dbeafe", soft: "#eff6ff", accent: "#1d4ed8" },
  lavender: { name: "Roxo Lavanda", primary: "#7c3aed", light: "#ede9fe", soft: "#f5f3ff", accent: "#6d28d9" },
  sakura: { name: "Rosa Sakura", primary: "#ec4899", light: "#fce7f3", soft: "#fdf2f8", accent: "#db2777" },
  coral: { name: "Vermelho Coral", primary: "#ef4444", light: "#fee2e2", soft: "#fef2f2", accent: "#dc2626" },
  sunset: { name: "Laranja Sunset", primary: "#f97316", light: "#ffedd5", soft: "#fff7ed", accent: "#ea580c" },
  gold: { name: "Preto e Dourado", primary: "#1a1a1a", light: "#f5f5dc", soft: "#fafaf0", accent: "#d4af37" },
  midnight: { name: "Azul Noturno", primary: "#1e3a5f", light: "#dbeafe", soft: "#f0f4f8", accent: "#1e3a5f" },
  minimal: { name: "Cinza Minimalista", primary: "#4b5563", light: "#e5e7eb", soft: "#f9fafb", accent: "#374151" },
  coffee: { name: "Marrom Café", primary: "#6f4e37", light: "#ede0d4", soft: "#f5efe6", accent: "#5a3e2b" }
};

export const getTheme = (key) => PROFILE_THEMES[key] || PROFILE_THEMES.default;