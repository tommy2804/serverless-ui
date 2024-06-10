import React from "react";
import { Button as MuiButton, ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  focusColor?: string;
  defaultColor?: string;
  disabledColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  focusColor,
  defaultColor,
  disabledColor,
  sx,
  ...props
}) => {
  return (
    <MuiButton
      variant='contained'
      sx={{
        backgroundColor: defaultColor || "#2F3640",
        borderRadius: "8px",
        height: "60px",
        width: "134px",
        fontWeight: "600",
        "&:hover": {
          backgroundColor: focusColor || "#5F6873",
        },
        "&:disabled": {
          backgroundColor: disabledColor || "#F2D4C9",
        },
        ...sx, // Allow custom styling to override default
      }}
      {...props}>
      {children}
    </MuiButton>
  );
};

export default CustomButton;
