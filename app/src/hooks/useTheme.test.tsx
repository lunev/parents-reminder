import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { ThemeProviderContext } from "@/context/theme-context";
import { useTheme } from "./useTheme";

describe("useTheme", () => {
  it("returns the default context value when rendered without a provider", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("system");
  });

  it("returns the value provided by ThemeProviderContext", () => {
    const setTheme = () => {};
    const { result } = renderHook(() => useTheme(), {
      wrapper: ({ children }) => (
        <ThemeProviderContext.Provider value={{ theme: "dark", setTheme }}>
          {children}
        </ThemeProviderContext.Provider>
      ),
    });

    expect(result.current.theme).toBe("dark");
    expect(result.current.setTheme).toBe(setTheme);
  });
});
