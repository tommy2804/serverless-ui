import React from 'react';
import { Typography, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';
import KeyboardBackspaceOutlined from '@mui/icons-material/KeyboardBackspaceOutlined';
import { useTranslation } from 'react-i18next';
import MinimizeSvg from '/images/minimize.svg';

interface DialogTitleProps {
  handleClose: () => void;
  handleBack: () => void;
  titleIcon: string;
  title: string;
  subTitle: string;
  toMinimize?: boolean;
  hideMinimizeAndClosedButton?: boolean;
  handleComponentMinimized?: () => void;
  isNonMobile: boolean;
  isCancelBackButton?: boolean;
  backButtonHidden?: boolean;
}
const DialogTitle: React.FC<DialogTitleProps> = ({
  handleClose,
  handleBack,
  title,
  subTitle,
  titleIcon,
  toMinimize,
  isNonMobile,
  isCancelBackButton,
  handleComponentMinimized,
  hideMinimizeAndClosedButton,
  backButtonHidden,
}) => {
  const { t, i18n } = useTranslation();

  const closeHideButtonResolver = () => {
    if (hideMinimizeAndClosedButton) return null;
    if (toMinimize) {
      return (
        <button className="rmv-default" onClick={() => handleComponentMinimized?.()}>
          <img src={MinimizeSvg} alt="minimize" />
        </button>
      );
    }
    return (
      <IconButton
        size="small"
        edge="start"
        color="inherit"
        onClick={handleClose}
        aria-label="close"
      >
        <Close />
      </IconButton>
    );
  };

  return (
    <div className="pad2">
      <div className={`dialog-title-bg ${i18n.dir() === 'rtl' && 'dialog-title-bg-rtl'}`} />
      <div className="flex">
        <img
          style={{
            width: 48,
            height: 48,
            marginInlineStart: '0.5rem',
          }}
          src={titleIcon}
          alt="title"
        />
        <div className="pad-start-1 dialog-title-container">
          {!isNonMobile ? (
            <button className="rmv-default " onClick={handleBack}>
              {isCancelBackButton || backButtonHidden ? null : (
                <div className="back-icon">
                  <KeyboardBackspaceOutlined
                    sx={{
                      fontSize: '18px',
                      transform: i18n.dir() === 'rtl' ? 'rotate(180deg)' : '',
                    }}
                  />
                </div>
              )}
            </button>
          ) : null}
          <span className="title-text">{t(title)} </span>
          {toMinimize ? (
            <div className="minimize-subtitle-contain">
              <p className="subtitle">{t(subTitle)}</p>
            </div>
          ) : (
            <Typography color="GrayText" variant="body2">
              {t(subTitle)}
            </Typography>
          )}
        </div>
        <div className={`dialog-close-icon${i18n.dir() === 'rtl' ? '-rtl' : ''}`}>
          {closeHideButtonResolver()}
        </div>
      </div>
    </div>
  );
};

export default DialogTitle;
