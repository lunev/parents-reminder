import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { Home, Settings, ChildAdd, ChildEdit, NotFound } from "@/pages";
import { ROUTES } from "@/config";
import { Toaster } from "@/components/ui/sonner";
import "./assets/css/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <HashRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.CHILD_ADD} element={<ChildAdd />} />
          <Route path={ROUTES.CHILD_EDIT} element={<ChildEdit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </HashRouter>
    </ThemeProvider>
  </StrictMode>,
);
