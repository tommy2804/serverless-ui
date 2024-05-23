import React from "react";
import Typography from "@mui/material/Typography";
import KeyboardBackspaceOutlined from "@mui/icons-material/KeyboardBackspaceOutlined";
import { useTranslation } from "react-i18next";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { CircularProgress } from "@mui/material";
import { useDialogContext } from "../../../state/dialog-context";

interface DialogButtonsProps {
  handleClose: () => void;
  handleNext: () => void;
  handleBack: () => void;
  isNonMobile: boolean;
  nextTitle?: string;
  backButtonHidden?: boolean;
  isCreateNewEventButtonHidden?: boolean;
  handleCreateNewEvent?: () => void;
  isNextDisabled?: boolean;
  isShowLoading?: boolean;
}

const DialogButtons: React.FC<DialogButtonsProps> = ({
  handleClose,
  handleNext,
  handleBack,
  isNonMobile,
  nextTitle = "Next",
  backButtonHidden,
  isCreateNewEventButtonHidden,
  handleCreateNewEvent = () => {},
  isNextDisabled,
  isShowLoading,
}) => {
  const { t, i18n } = useTranslation();
  const { setSelectedGiftEvent } = useDialogContext();

  const createNewEventButtonClickHandler = () => {
    setSelectedGiftEvent(undefined);
    handleCreateNewEvent();
  };

  return (
    <div className='dialog-button-container'>
      {isNonMobile ? (
        <>
          {!backButtonHidden ? (
            <button className='back-button-container rmv-default' onClick={handleBack}>
              <div className='back-icon'>
                <KeyboardBackspaceOutlined
                  sx={{
                    fontSize: "18px",
                    marginBlockStart: "0.1rem",
                    transform: i18n.dir() === "rtl" ? "rotate(180deg)" : "",
                  }}
                />
              </div>
              <Typography> {t("back")}</Typography>
            </button>
          ) : (
            <div>
              {isCreateNewEventButtonHidden ? null : (
                <button
                  className='create-event-btn-container rmv-default'
                  onClick={createNewEventButtonClickHandler}>
                  <div className='create-even-icon'>
                    <AddCircleOutline sx={{ fontSize: "1.25em" }} />
                  </div>
                  <Typography fontSize='1em'> {t("create-event")}</Typography>
                </button>
              )}
            </div>
          )}

          <div className='flex'>
            <button className='close-button rmv-default' onClick={handleClose}>
              {t("cancel")}
            </button>
            <button
              className='next-button rmv-default'
              onClick={handleNext}
              disabled={isNextDisabled}>
              {isShowLoading ? (
                <CircularProgress
                  size={20}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                t(nextTitle)
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {isCreateNewEventButtonHidden ? null : (
            <button
              className='create-event-btn-container rmv-default'
              onClick={createNewEventButtonClickHandler}>
              <div className='create-even-icon'>
                <AddCircleOutline fontSize='small' sx={{ height: "0.75em" }} />
              </div>
              <Typography fontSize='small'> {t("create-event")}</Typography>
            </button>
          )}
          <button
            className='next-button rmv-default'
            disabled={isNextDisabled}
            onClick={() => {
              handleNext();
            }}>
            {isShowLoading ? (
              <CircularProgress
                size={20}
                sx={{
                  color: "white",
                }}
              />
            ) : (
              t(nextTitle)
            )}
          </button>
          <button className='close-button rmv-default' onClick={handleClose}>
            {t("cancel")}
          </button>
        </>
      )}
    </div>
  );
};

export default DialogButtons;
