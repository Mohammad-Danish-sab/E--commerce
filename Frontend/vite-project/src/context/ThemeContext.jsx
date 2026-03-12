import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    const vars =
      theme === "dark"
        ? {
            "--bg": "#08080f",
            "--surface": "#111118",
            "--surface2": "#1a1a24",
            "--border": "rgba(255,255,255,0.07)",
            "--text": "#f0f0f5",
            "--muted": "#9090a8",
            "--gold": "#e8c547",
            "--gold2": "#c9a227",
            "--red": "#ff4d6d",
            "--green": "#68d391",
            "--blue": "#63b3ed",
          }
        : {
            "--bg": "#f5f5f0",
            "--surface": "#ffffff",
            "--surface2": "#f0f0eb",
            "--border": "rgba(0,0,0,0.08)",
            "--text": "#1a1a2e",
            "--muted": "#6b6b80",
            "--gold": "#b8950a",
            "--gold2": "#9a7d08",
            "--red": "#e53e5e",
            "--green": "#2d9e5a",
            "--blue": "#2b7fc7",
          };

    Object.entries(vars).forEach(([k, v]) =>
      document.documentElement.style.setProperty(k, v),
    );
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
