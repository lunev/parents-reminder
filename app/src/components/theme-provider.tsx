import { useEffect } from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (isDark: boolean) => {
      root.classList.toggle("dark", isDark);
      root.classList.toggle("light", !isDark);
    };

    applyTheme(media.matches);

    const handleChange = (e: MediaQueryListEvent) => applyTheme(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return children;
}
