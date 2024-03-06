import { styled } from "@mui/material/styles";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import { Typography } from "@mui/material";

interface CustomTextFieldProps extends OutlinedTextFieldProps {
  iconComponent?: React.ReactNode;
  isLeftIcon?: boolean;
  isNonMobile?: boolean;
  customWidth?: string;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  iconComponent,
  ...otherProps
}) => {
  return (
    <CssTextField
      size="small"
      fullWidth
      {...otherProps}
      InputProps={{
        endAdornment: iconComponent ? <span>{iconComponent}</span> : null,
        ...(otherProps.InputProps ?? {}),
      }}
    />
  );
};

export const CssTextField = styled(TextField)({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "14px",
    color: "#98a2b3",
    paddingInlineStart: "0.2rem",
  },
  "& .MuiInputBase-input": {
    color: "black",
  },

  "& .MuiInputLabel-root": {
    color: "#667085",
    fontSize: "14px",

    "&.Mui-focused": {
      color: "#98a2b3",
      fontSize: "16px",
    },
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#98a2b3",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
      borderWidth: "1px",
      borderRadius: "7px",
    },
    "&:hover fieldset": {},
    "&.Mui-focused fieldset": {},
  },
});

export const FormText = styled(Typography)({
  color: "#101828",
  fontWeight: 700,
  fontSize: "0.75rem",
  width: "20rem",
});
export const NonMobileText = styled(Typography)({
  color: "#101828",
  fontWeight: 500,
  fontSize: "0.75rem",
});

export const CustomAvatar = styled("div")({
  marginRight: "1rem",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  overflow: "hidden",
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#F2F4F7",
  position: "relative",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});
