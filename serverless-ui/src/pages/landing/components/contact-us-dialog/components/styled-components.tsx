import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { TextField } from "@mui/material";
import { CustomTextFieldProps, CssTextFieldProps } from "../../../utils/interface";
import { InputState } from "../../../utils/helpers";
import { GlobalColors } from "../../../../../shared/styles/colors";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const RtlProvider = ({ children }: any) => (
  <CacheProvider value={cacheRtl}>{children}</CacheProvider>
);

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  iconComponent,
  isLeftIcon,
  customWidth,
  customHeight,
  inputState,
  children,
  ...otherProps
}) => {
  const { i18n } = useTranslation();
  return (
    <CssTextField
      customHeight={customHeight ? "auto" : null}
      customWidth={customWidth}
      size='small'
      inputState={inputState}
      fullWidth
      dir={i18n.dir()}
      {...otherProps}
      InputProps={{
        ...otherProps.InputProps,
        [isLeftIcon ? "startAdornment" : "endAdornment"]: iconComponent && (
          <span>{iconComponent}</span>
        ),
      }}
    />
  );
};

export const CssTextField = styled(
  ({
    customHeight,
    customWidth,
    inputState,
    dir,
    isNonMobile,
    required,
    children,
    ...otherProps
  }: CssTextFieldProps) =>
    dir === "rtl" ? (
      <RtlProvider>
        <TextField {...otherProps} />
      </RtlProvider>
    ) : (
      <TextField {...otherProps} />
    )
)(({ customHeight, customWidth, inputState = InputState.DEFAULT, dir }) => ({
  "& .MuiInputBase-input::placeholder": {
    fontSize: "14px",
    color: "#98a2b3",
    paddingInlineStart: "0.2rem",
  },
  "& .MuiInputBase-root": {
    color: "black",
    height: customHeight,
    width: customWidth,
    "& .MuiInputLabel-root": {
      color: "#667085",
      fontSize: "14px",
      "&.Mui-focused": {
        color: "#98a2b3",
        fontSize: "16px",
      },
    },
  },
  "& .MuiInputBase-root[data-length]:after": {
    content: 'attr(data-length) "/" attr(data-maxlength)',
    position: "absolute",
    fontWeight: "400",
    fontSize: "0.75rem",
    lineHeight: "1.66",
    letterSpacing: "0.03333em",
    bottom: "-1.25rem",
    [dir === "rtl" ? "left" : "right"]: "0.5rem",
    color: "#98a2b3",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#98a2b3",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    margin: "0",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: {
        [InputState.ERROR]: GlobalColors.inputErrorBorder,
        [InputState.SUCCESS]: GlobalColors.inputSuccessBorder,
        [InputState.DEFAULT]: GlobalColors.inputDefaultBorder,
      }[inputState || InputState.DEFAULT],
      borderWidth: "1px",
      borderRadius: "7px",
    },
    "&:hover fieldset": {
      borderColor: {
        [InputState.ERROR]: GlobalColors.inputErrorBorder,
        [InputState.SUCCESS]: GlobalColors.inputSuccessBorder,
        [InputState.DEFAULT]: GlobalColors.inputDefaultBorder,
      }[inputState || InputState.DEFAULT],
      borderWidth: "1.5px",
    },
    "&.Mui-focused fieldset": {
      borderColor: {
        [InputState.ERROR]: GlobalColors.inputErrorBorder,
        [InputState.SUCCESS]: GlobalColors.inputSuccessBorder,
        [InputState.DEFAULT]: GlobalColors.inputDefaultBorder,
      }[inputState || InputState.DEFAULT],
      borderWidth: "1.5px",
    },
  },
}));
