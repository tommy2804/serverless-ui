import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import { GlobalColors } from "../../../../shared/styles/colors";

export const contactUsSxStyles = {
  inputStyle: {
    height: "2.5rem",
    "&.MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: GlobalColors.inputDefaultBorder,
        borderWidth: "1.5px",
      },
    },
  },
  flexCenter: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    width: "100%",
  },
  subjectsInput: {
    height: "2.4rem",
    width: "100%",
    "&.Mui-selected": {
      backgroundColor: "white",
      "&:hover": {
        backgroundColor: "white",
      },
    },
  },
};

export const FormText = styled(Typography)({
  color: "#344054",
  fontWeight: 500,
  fontSize: "1rem",
});
