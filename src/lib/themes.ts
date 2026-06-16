export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  fonts: {
    display: string;
    body: string;
    googleFontsUrl: string;
  };
  preview: {
    bg: string;
    text: string;
    accent: string;
    secondary: string;
  };
}

export const THEMES: ThemeDefinition[] = [
  {
    id: "baroque-dark",
    name: "Baroque Dark",
    description: "Oxblood & gold on near-black. Intimate, candlelit, classic.",
    fonts: {
      display: "'Cormorant Garamond', serif",
      body: "'EB Garamond', serif",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap",
    },
    preview: {
      bg: "#1a100c",
      text: "#f0e6d0",
      accent: "#7a1e16",
      secondary: "#c8a96e",
    },
  },
  {
    id: "coastal-light",
    name: "Coastal Light",
    description: "Sage & warm sand on white. Airy, Mediterranean, relaxed.",
    fonts: {
      display: "'Playfair Display', serif",
      body: "'Lato', sans-serif",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Lato:wght@300;400;700&display=swap",
    },
    preview: {
      bg: "#f7f5f0",
      text: "#1a2825",
      accent: "#4d8874",
      secondary: "#b89e78",
    },
  },
  {
    id: "tropical-modern",
    name: "Tropical Modern",
    description: "Emerald & coral on off-white. Vibrant, fresh, contemporary.",
    fonts: {
      display: "'Montserrat', sans-serif",
      body: "'Montserrat', sans-serif",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap",
    },
    preview: {
      bg: "#f5f7f0",
      text: "#162820",
      accent: "#2d8c5e",
      secondary: "#e05a3a",
    },
  },
  {
    id: "tokyo-minimal",
    name: "Tokyo Minimal",
    description: "Ink black & crimson on pure white. Sharp, graphic, precise.",
    fonts: {
      display: "'Noto Serif JP', serif",
      body: "'Inter', sans-serif",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500&family=Inter:wght@300;400;500&display=swap",
    },
    preview: {
      bg: "#ffffff",
      text: "#0a0a0a",
      accent: "#c0392b",
      secondary: "#0a0a0a",
    },
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    description:
      "Terracotta & navy on warm cream. Rustic, Southern European, warm.",
    fonts: {
      display: "'Libre Baskerville', serif",
      body: "'Source Sans 3', sans-serif",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600&display=swap",
    },
    preview: {
      bg: "#f5f0e8",
      text: "#1a2040",
      accent: "#c25e30",
      secondary: "#1a2040",
    },
  },
  {
    id: "nordic-forest",
    name: "Nordic Forest",
    description: "Forest green & amber on slate. Calm, Scandinavian, natural.",
    fonts: {
      display: "'DM Serif Display', serif",
      body: "'DM Sans', sans-serif",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap",
    },
    preview: {
      bg: "#e8eceb",
      text: "#0f2018",
      accent: "#2d5a3d",
      secondary: "#c49a2a",
    },
  },
];
