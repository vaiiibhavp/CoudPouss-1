// src/mui-theme.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    normal?: string;
    neutralWhiteDark?: string;
    naturalGray?: string;
  }

  interface SimplePaletteColorOptions {
    normal?: string;
    neutralWhiteDark?: string;
    naturalGray?: string;
  }
}
