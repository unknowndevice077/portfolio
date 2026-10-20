// Shared by the client theme store and the server-rendered boot script, so no "use client" here.
export const ACCENTS = [
  { name: "Sky", hex: "#38bdf8", rgb: "56, 189, 248" },
  { name: "Lime", hex: "#84cc16", rgb: "132, 204, 22" },
  { name: "Orange", hex: "#f97316", rgb: "249, 115, 22" },
  { name: "Pink", hex: "#ec4899", rgb: "236, 72, 153" },
  { name: "Violet", hex: "#8b5cf6", rgb: "139, 92, 246" },
  { name: "Amber", hex: "#f59e0b", rgb: "245, 158, 11" },
];

export const THEME_KEY = "fritz-theme";

// Inlined into <head> so a saved light theme is applied before first paint (no dark flash).
export const themeBootScript =
  'try{var t=JSON.parse(localStorage.getItem("' +
  THEME_KEY +
  '")||"null");if(t){var r=document.documentElement;r.dataset.theme=t.mode;var a=' +
  JSON.stringify(ACCENTS) +
  '.find(function(x){return x.hex===t.accent});if(a){r.style.setProperty("--accent",a.hex);r.style.setProperty("--accent-rgb",a.rgb)}}}catch(e){}';
