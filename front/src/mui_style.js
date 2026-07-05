import { createTheme } from "@mui/material";

export const whiteTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "contained" &&
            ownerState.color === "primary" && {
              backgroundColor: "#2b0000",
              color: "#fff",
            }),
        }),
      },
    },
  },
  palette: {
    primary: {
      main: "#02002b",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2b0000",
    },
  },
});

export const darkTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "contained" &&
            ownerState.color === "primary" && {
              backgroundColor: "#2b0000",
              color: "#fff",
            }),
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.variant === "contained" &&
            ownerState.colors === "primary" && {
              backgroundColor: "#9c9c9c",
              color: "#fff",
            }),
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: "#2c2c2c",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#7a7a7a",
          "&.Mui-selected": {
            color: "#ffffff",
            backgroundColor: "#2b0000",
          },
        },
      },
    },
  },
  palette: {
    primary: {
      main: "#02002b",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2b0000",
    },
  },
});
