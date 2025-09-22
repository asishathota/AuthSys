import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const Theme = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const storedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-[var(--bg-dark)] bg-[var(--bg-dark-light)]"
    >
      {theme === "dark" ? (
        <Sun className="text-[var(--text)] size-5 md:size-6" />
      ) : (
        <Moon className="text-[var(--text)] size-5 md:size-6" />
      )}
    </button>
  );
};

export default Theme;
