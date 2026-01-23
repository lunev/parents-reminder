import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Home, Settings, ReminderAdd, ReminderEdit, NotFound } from "@/pages";
import { ROUTES } from "@/config";
import "./assets/css/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HashRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.REMINDER_ADD} element={<ReminderAdd />} />
          <Route path={ROUTES.REMINDER_EDIT} element={<ReminderEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);
