import React from "react";
import { useTranslation } from "react-i18next";
import Close from "@mui/icons-material/Close";
import { Button, Snackbar } from "@mui/material";
import successIcon from "/images/toaster-success.svg";
import errorIcon from "/images/toaster-error.svg";

import "./izme-toaster.scss";
import { useToasterContext } from "../../state/toaster-context";

const getIcon = (type: "success" | "error") => {
  switch (type) {
    case "success":
      return <img src={successIcon} alt='check' />;
    case "error":
      return <img src={errorIcon} alt='check' />;
    default:
      return <img src={successIcon} alt='check' />;
  }
};

const getHorizontal = (isMobile: boolean, dir: "rtl" | "ltr") => {
  if (isMobile) return "center";
  return dir === "ltr" ? "right" : "left";
};

const IzmeToaster: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { onClose, toasterProps } = useToasterContext();
  if (!toasterProps) return null;

  const { type, text, buttonText, primaryButtonAction } = toasterProps || {};

  const isMobile = window.innerWidth < 800;
  const horizontal = getHorizontal(isMobile, i18n.dir());
  const vertical = isMobile ? "bottom" : "top";

  const buttonColor = "#475467";

  return (
    <Snackbar
      open={true}
      onClose={onClose}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={6000}>
      <div className={`izme-general-toaster ${isMobile ? "mobile-dialog" : ""}`}>
        {!isMobile && getIcon(type)}
        <div className={`text-wrapper ${isMobile ? "flex-text-wrapper" : ""}`}>
          {isMobile && getIcon(type)}
          <span>{text}</span>
          <Button
            sx={{
              color: buttonColor,
              padding: "0",
              ":hover": {
                backgroundColor: "transparent",
                color: "#101828",
              },
            }}
            onClick={() => {
              primaryButtonAction?.();
              onClose();
            }}>
            {buttonText || t("dismiss")}
          </Button>
        </div>
        <Close
          sx={{
            color: buttonColor,
            marginInlineStart: "auto",
            cursor: "pointer",
            ":hover": {
              color: "#101828",
            },
          }}
          onClick={onClose}
        />
      </div>
    </Snackbar>
  );
};

export default IzmeToaster;
