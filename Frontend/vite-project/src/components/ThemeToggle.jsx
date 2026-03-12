import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      style={{
        width: "42px",
        height: "24px",
        borderRadius: "12px",
        border: "none",
        background: theme === "dark" ? "#2a2a38" : "#e0e0d8",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.3s",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: theme === "dark" ? "20px" : "3px",
          width: "18px",
          height: "18px",
          borderRadius: "50%",
          background: theme === "dark" ? "#e8c547" : "#f0a020",
          transition: "left 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
        }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
    </button>
  );
};

export default ThemeToggle;
