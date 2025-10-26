import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1A3A5F", // Blue base color
      light: "#3d6488",
      lighter: "#75b8d6",
      dark: "#132842",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#bcbf8f", // Olive beige base color
      light: "#d2d5b3",
      lighter: "#f0f1e8",
      dark: "#a8ac7d",
      contrastText: "#082241",
    },
    error: {
      main: "#c05a5a", // Soft red
      light: "#e69999",
      lighter: "#fcdede",
      dark: "#a04545",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#e8923a", // Soft orange
      light: "#f5b868",
      lighter: "#ffe4b8",
      dark: "#d87d25",
      contrastText: "#082241",
    },
    info: {
      main: "#5a8faf", // Soft blue
      light: "#8ab5d0",
      lighter: "#d4e8f5",
      dark: "#457699",
      contrastText: "#ffffff",
    },
    success: {
      main: "#5a9a66", // Soft green
      light: "#8cc595",
      lighter: "#d4efdb",
      dark: "#457a52",
      contrastText: "#ffffff",
    },
    background: {
      default: "#FAFAF7",
      paper: "#ffffff",
    },
    text: {
      primary: "#082241",
      secondary: "#4a5568",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        avatar: {
          marginRight: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
        },
        input: {
          padding: "4px 0",
          fontSize: "0.875rem",
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          marginBottom: 4,
          fontSize: "0.75rem",
          fontWeight: 600,
          color: "rgba(0, 0, 0, 0.6)",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});
