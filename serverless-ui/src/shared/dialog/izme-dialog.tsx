import React from "react";
import { Button, Dialog } from "@mui/material";
import Close from "@mui/icons-material/Close";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import checkSvg from "/images/title-check.svg";
import { useTranslation } from "react-i18next";

import { closeIconStyle } from "./mui-styles";
import "./izme-dialog.scss";
import {
  useIzmeDialogContext,
  IzmeCustomDialogProps,
  IzmeDialogProps,
} from "../../state/general-dialog-context";

const getIcon = (type: "success" | "warning" | "error") => {
  switch (type) {
    case "success":
      return <img src={checkSvg} alt='check' />;
    case "warning":
      return (
        <WarningRoundedIcon
          sx={{ width: "1.75em", height: "1.75em", color: "var(--warning-500)" }}
        />
      );
    case "error":
      return <img src={checkSvg} alt='check' />;
    default:
      return <img src={checkSvg} alt='check' />;
  }
};

interface CheckBackgroundProps {
  dir: "rtl" | "ltr";
}

const CheckBackground = ({ dir }: CheckBackgroundProps) => (
  <div className={`border-1 ${dir}`}>
    <div className='border-2'>
      <div className='border-3'>
        <div className='border-4'>
          <div className='border-5'>
            <div className='border-6' />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IzmeDialog: React.FC = () => {
  const { i18n } = useTranslation();
  const { onClose, dialogProps } = useIzmeDialogContext();
  if (!dialogProps) return null;

  if ((dialogProps as IzmeCustomDialogProps).customComponent) {
    const { customComponent } = dialogProps as IzmeCustomDialogProps;
    return (
      <Dialog open={true} onClose={onClose}>
        {customComponent}
      </Dialog>
    );
  }

  const {
    title,
    type,
    message,
    primaryButton,
    primaryButtonAction,
    secondaryButton,
    secondaryButtonAction,
  } = dialogProps as IzmeDialogProps;
  return (
    <Dialog
      open={true}
      onClose={() => {}} // disable close by clicking outside the dialog
    >
      <div className='izme-general-dialog'>
        <div className='icon-background'>
          <CheckBackground dir={i18n.dir()} />
          {getIcon(type)}
          <Close sx={closeIconStyle} onClick={onClose} />
        </div>
        <p className='dialog-title'>{title}</p>
        <span className='dialog-subtitle'>{message}</span>
        <div className='buttons-wrapper'>
          {secondaryButton && (
            <Button
              variant='contained'
              onClick={() => {
                secondaryButtonAction?.();
                onClose();
              }}
              color='secondary'
              sx={{
                color: "#344054",
                "&:hover": {
                  backgroundColor: "#F0F2F5",
                },
              }}>
              {secondaryButton}
            </Button>
          )}
          <Button
            onClick={() => {
              primaryButtonAction();
              onClose();
            }}
            variant='contained'>
            {primaryButton}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default IzmeDialog;
