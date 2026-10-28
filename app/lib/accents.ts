// Shared by the client theme store and the server-rendered boot script, so no "use client" here.
export const THEME_KEY = "fritz-theme";

// Inlined into <head> so a saved theme is applied before first paint (no flash).
export const themeBootScript =
  'try{var t=JSON.parse(localStorage.getItem("' +
  THEME_KEY +
  '")||"null");if(t&&t.mode)document.documentElement.dataset.theme=t.mode}catch(e){}';
