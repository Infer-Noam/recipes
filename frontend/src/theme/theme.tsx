import {
  createTheme,
  type ThemeOptions,
  type Theme,
} from "@mui/material/styles";
import { ColorMode } from "./colorMode.enum";

declare module "@mui/material/styles" {
  interface Palette {
    border: {
      primary: string;
      secondary: string;
    };
  }

  interface PaletteOptions {
    border?: {
      primary?: string;
    };
  }
}

export const themeOptions: (colorMode: ColorMode) => ThemeOptions = (
  colorMode
) => ({
  palette: {
    mode: colorMode,
    primary: {
      main: "#9f3939ff",
    },
    border: {
      primary: colorMode === ColorMode.LIGHT ? "#bdbdbd" : "#616161",
    },
  },
});

export const createAppTheme: (colorMode: ColorMode) => Theme = (colorMode) =>
  createTheme(themeOptions(colorMode));
