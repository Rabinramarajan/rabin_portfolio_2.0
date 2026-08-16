"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material";
import { theme } from "@/lib/mui-theme";

/** Scoped to the contact form — never wrap the whole document (CssBaseline
 *  restyles `body` and is a common source of first-load layout shift). */
export function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}
