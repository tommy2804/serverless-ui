import { createTheme } from "@mui/material/styles";

const useGlobalMuiTheme = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#e31b54",
      },
      secondary: {
        main: "#FFFFFF",
      },
    },
    components: {
      MuiChip: {
        styleOverrides: {
          root: {
            margin: 0,
            padding: 0,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:disabled": {
              color: "inherit",
              opacity: "0.4",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#C01048", // Define your hover color here
            },
            "&:disabled": {
              backgroundColor: "#FECDD6", // Define your hover color here
            },
          },
        },
      },
    },
  });

  return theme;
};

export default useGlobalMuiTheme;
