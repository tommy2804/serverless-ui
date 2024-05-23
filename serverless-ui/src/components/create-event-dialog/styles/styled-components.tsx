import { styled } from "@mui/material/styles";
import TextField, { OutlinedTextFieldProps } from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import { InputState } from "../../../shared/create-event-helpers";
import { GlobalColors } from "../../../shared/styles/colors";

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const RtlProvider = ({ children }: any) => (
  <CacheProvider value={cacheRtl}>{children}</CacheProvider>
);

interface CustomTextFieldProps extends OutlinedTextFieldProps {
  iconComponent?: React.ReactNode;
  isLeftIcon?: boolean;
  isNonMobile: boolean;
  customWidth?: string;
  customHeight?: boolean;
  inputState?: InputState;
}
interface CssTextFieldProps extends OutlinedTextFieldProps {
  customHeight?: string | null;
  customWidth?: string;
  isNonMobile?: boolean;
  inputState?: InputState;
}

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

export const FormText = styled(Typography)({
  color: GlobalColors.inputText,
  fontWeight: 700,
  fontSize: "0.75rem",
  width: "20rem",
});
export const NonMobileText = styled(Typography)({
  color: GlobalColors.inputText,
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
  marginInlineEnd: "1rem",

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
});

interface renderButtonsProps {
  handleClose: () => void;
  handleNext: () => void;
  isNonMobile: boolean;
  nextTitle?: string;
  backTitle?: string;
}
export const RenderButtons: React.FC<renderButtonsProps> = ({
  isNonMobile,
  handleClose,
  handleNext,
  nextTitle = "continue",
  backTitle = "cancel",
}) => {
  const { t } = useTranslation();
  return (
    <div className='actions'>
      {isNonMobile ? (
        <>
          <button className='close-button rmv-default' onClick={handleClose}>
            {t(backTitle)}
          </button>
          <button
            className='next-button rmv-default'
            onClick={() => {
              handleNext();
            }}>
            {t(nextTitle)}
          </button>
        </>
      ) : (
        <>
          <button className='next-button rmv-default' onClick={handleNext}>
            {t(nextTitle)}
          </button>
          <button className='close-button rmv-default' onClick={handleClose}>
            {t(backTitle)}
          </button>
        </>
      )}
    </div>
  );
};
export const InputValidationCheckIcon = styled("img")({
  width: "1em",
  height: "1em",
  marginBlockStart: "0.3rem",
});
