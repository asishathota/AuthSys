import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

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
      className="p-2 hover:bg-[var(--bg-dark)] rounded-lg bg-[var(--bg-dark-light)]"
    >
      {theme === "dark" ? (
        <FiSun className="text-[var(--text)] size-4 md:size-5" />
      ) : (
        <FiMoon className="text-[var(--text)] size-4 md:size-5" />
      )}
    </button>
  );
};

export default Theme;
