"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/lib/mui-theme";

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme={false} />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
