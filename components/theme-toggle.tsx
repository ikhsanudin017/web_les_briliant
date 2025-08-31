"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      aria-label="Toggle theme"
      className="inline-flex items-center justify-center rounded-md border p-2 hover:bg-gray-50 dark:hover:bg-gray-900"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

