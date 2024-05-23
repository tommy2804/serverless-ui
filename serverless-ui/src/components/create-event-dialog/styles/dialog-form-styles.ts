import { GlobalColors } from "../../../shared/styles/colors";

export const DialogFormSxStyles = {
  datePicker: {
    "& .MuiOutlinedInput-root": {
      height: "2.5rem",
      fieldset: {
        borderColor: GlobalColors.inputDefaultBorder,
        borderWidth: "1px",
      },
      "&.Mui-focused fieldset": {
        borderColor: GlobalColors.inputDefaultBorder,
        borderWidth: "1.5px",
      },
    },
    width: "100%",
  },
  nearMeIcon: { fontSize: 20, marginBlockStart: "0.3rem" },
  nearMeIconMobile: {
    fontSize: 20,
    marginBlockStart: "0.3rem",
    marginInlineEnd: "0.1rem",
  },
};
