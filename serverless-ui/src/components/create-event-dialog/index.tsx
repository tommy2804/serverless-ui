import React, { useEffect, useState } from "react";
import { Dialog, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  DialogButtons,
  DialogForm,
  DialogLoading,
  DialogPayment,
  DialogTitle,
  DialogTranzilaPayment,
  DialogUploadFiles,
} from "./components";
import "./styles.scss";
import "../../shared/styles/themes.scss";
import {
  IzmeFile,
  DialogWindow,
  FormActionType,
  handleNext,
  handleBack,
  titleIcon,
  titleText,
  titleSubText,
  organizationDefaults,
} from "../../shared/create-event-helpers";
import { useDialogContext } from "../../state/dialog-context";
import { useLoginStateContext } from "../../state/login-context";
import { WatermarkPosition } from "../../types/watermark";
import DialogBranding from "./dialogs/dialog-branding";
import DialogGifts from "./dialogs/dialog-gifts";
import useUnsavedChanges from "../../hooks/use-unsaved-changes";
import { resolveBrandedImagePreview } from "./utils";
import { DialogFormProps } from "./interface";
import { MINIMUM_UPLOAD_PHOTOS } from "../../utils/constants";

const CreateEventDialog: React.FC = () => {
  const {
    handleClose,
    formState,
    dispatch,
    openDialog,
    dialog,
    setDialog,
    handleNextPaymentForm,
    handleCreatePayment,
    setFiles,
    files,
    debouncedEventUrlValue,
    isEventPhotoValid,
    isEventLogoValid,
    selectedGiftEvent,
    loadingStartTime,
    uploadProgress,
    isEventUrlExist,
    isUrlValid,
    isNameValid,
    handleComponentMinimized,
    isComponentMinimized,
    eventUrlRequestValid,
  } = useDialogContext();
  const isNonMobile = useMediaQuery("(min-width:650px)");
  const [eventLogo, setEventLogo] = useState<IzmeFile[]>(formState.eventLogo);
  const [eventPhoto, setEventPhoto] = useState<IzmeFile[]>(formState.eventPhoto);
  const [eventWatermark, setEventWatermark] = useState<IzmeFile[]>(formState.eventWatermark);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>(
    formState.watermarkPosition || WatermarkPosition.BOTTOM_LEFT
  );
  const [eventWatermarkSize, setEventWatermarkSize] = useState<number>(
    formState.eventWatermarkSize || 1
  );
  const { t } = useTranslation();
  const { setUnsavedChanges } = useUnsavedChanges();
  const { userPayload, organizationPayload } = useLoginStateContext();
  const [isNextClicked, setIsNextClicked] = useState(false);

  console.log(openDialog);

  async function handleNextGiftsForm(
    setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>,
    dialog: DialogWindow
  ) {
    const { id } = selectedGiftEvent || {};
    const organizationDefaults = {
      location: selectedGiftEvent?.location || "",
      photographer: selectedGiftEvent?.photographerName || "",
      instagram: selectedGiftEvent?.instagram || "",
      facebook: selectedGiftEvent?.facebook || "",
      website: selectedGiftEvent?.website || "",
      eventName: selectedGiftEvent?.eventName || "",
    };
    dispatch({
      type: FormActionType.SetGiftEvent,
      orgDefaults: organizationDefaults as organizationDefaults,
      giftEventId: id,
    });
    handleNext(setDialog, dialog);
  }

  function handleCreateNewEvent(
    setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>,
    dialog: DialogWindow
  ) {
    const organizationDefaults = {
      location: organizationPayload?.location || "",
      photographer: organizationPayload?.photographerName || "",
      instagram: organizationPayload?.instagram || "",
      facebook: organizationPayload?.facebook || "",
      website: organizationPayload?.website || "",
      eventPhoto: organizationPayload?.eventPhoto || [],
      eventLogo: organizationPayload?.eventLogo || [],
    };
    dispatch({
      type: FormActionType.SetOrgDefaults,
      orgDefaults: organizationDefaults as organizationDefaults,
    });
    handleNext(setDialog, dialog);
  }

  function handleNextFirstForm(
    setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>,
    dialog: DialogWindow
  ) {
    setIsNextClicked(true);
    if (
      isNameValid &&
      isUrlValid &&
      !isEventUrlExist &&
      formState.eventURL === debouncedEventUrlValue &&
      eventUrlRequestValid.current
    ) {
      handleNext(setDialog, dialog, selectedGiftEvent?.logo && selectedGiftEvent?.mainImage);
      setIsNextClicked(false);
    }
  }

  async function handleNextSecondForm(
    setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>,
    dialog: DialogWindow
  ) {
    setIsNextClicked(true);
    if (eventWatermark.length) {
      dispatch({
        type: FormActionType.SetWatermark,
        files: eventWatermark,
      });
      dispatch({
        type: FormActionType.SetWatermarkPosition,
        position: watermarkPosition,
      });
      dispatch({
        type: FormActionType.SetWatermarkSize,
        value: eventWatermarkSize,
      });
    }
    if (isEventPhotoValid && isEventLogoValid) {
      handleNext(setDialog, dialog);
      setIsNextClicked(false);
    } else {
      if (!isEventLogoValid) {
        dispatch({
          type: FormActionType.SetLogo,
          files: [],
        });
      }
      if (!isEventPhotoValid) {
        dispatch({
          type: FormActionType.SetPhoto,
          files: [],
        });
      }
    }
  }

  async function handleNextThirdForm(
    setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>,
    dialog: DialogWindow
  ) {
    setIsNextClicked(true);
    if (formState.isFutureEvent) {
      await handleNextPaymentForm();
      setTimeout(() => {
        setIsNextClicked(false);
      }, 4000);
    } else if (files.length >= MINIMUM_UPLOAD_PHOTOS) {
      handleNext(setDialog, dialog);
      setIsNextClicked(false);
    }
  }

  function handleNextFifthForm(
    setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>,
    dialog: DialogWindow
  ) {
    handleNext(setDialog, dialog);
  }

  const closeModalHandler = () => {
    handleClose();
    setIsNextClicked(false);
  };

  const nextHandlers: Record<
    DialogWindow,
    (setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>, dialog: DialogWindow) => void
  > = {
    [DialogWindow.GIFTS]: () => handleNextGiftsForm(setDialog, dialog),
    [DialogWindow.FIRST]: () => handleNextFirstForm(setDialog, dialog),
    [DialogWindow.SECOND]: () => handleNextSecondForm(setDialog, dialog),
    [DialogWindow.THIRD]: () => handleNextThirdForm(setDialog, dialog),
    [DialogWindow.FOURTH]: handleCreatePayment,
    [DialogWindow.FIFTH]: () => handleNextFifthForm(setDialog, dialog),
    [DialogWindow.SIXTH]: () => handleNextFifthForm(setDialog, dialog),
  };

  const renderDialogForm = () => {
    const FormComponentMap: Record<DialogWindow, React.FC<DialogFormProps>> = {
      [DialogWindow.GIFTS]: DialogGifts,
      [DialogWindow.FIRST]: DialogForm,
      [DialogWindow.SECOND]: DialogBranding,
      [DialogWindow.THIRD]: DialogUploadFiles,
      [DialogWindow.FOURTH]: DialogPayment,
      [DialogWindow.FIFTH]: DialogTranzilaPayment,
      [DialogWindow.SIXTH]: DialogLoading,
    };

    const FormComponent = FormComponentMap[dialog];

    return (
      <FormComponent
        isNonMobile={isNonMobile}
        formState={formState}
        dispatch={dispatch}
        files={files}
        setFiles={setFiles}
        handleClose={closeModalHandler}
        handleNext={() => nextHandlers[dialog](setDialog, dialog)}
        debouncedEventUrlValue={debouncedEventUrlValue}
        isEventNameValid={isNameValid}
        isEventUrlValid={isUrlValid}
        selectedGiftEvent={selectedGiftEvent}
        isEventUrlExist={isEventUrlExist}
        eventPhoto={formState.eventPhoto}
        eventLogo={formState.eventLogo}
        eventWatermark={formState.eventWatermark}
        watermarkPosition={formState.watermarkPosition}
        eventWatermarkSize={formState.eventWatermarkSize}
        isEventPhotoValid={isEventPhotoValid}
        isEventLogoValid={isEventLogoValid}
        setEventPhoto={setEventPhoto}
        setEventLogo={setEventLogo}
        setEventWatermark={setEventWatermark}
        setWatermarkPosition={setWatermarkPosition}
        setWatermarkSize={setEventWatermarkSize}
        loadingStartTime={loadingStartTime}
        uploadProgress={uploadProgress}
        isNextClicked={isNextClicked}
      />
    );
  };

  useEffect(() => {
    setUnsavedChanges(openDialog || isComponentMinimized);
  }, [openDialog, isComponentMinimized, setUnsavedChanges]);

  useEffect(() => {
    dispatch({
      type: FormActionType.SetFiles,
      files,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    const updateEventPhoto = async () => {
      if (!eventLogo.length) return;
      const updatedEventLogo = await resolveBrandedImagePreview(eventLogo);
      dispatch({
        type: FormActionType.SetLogo,
        files: updatedEventLogo as IzmeFile[],
      });
    };
    updateEventPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventLogo]);

  useEffect(() => {
    const updateEventPhoto = async () => {
      if (!eventPhoto.length) return;
      const updatedEventPhoto = await resolveBrandedImagePreview(eventPhoto);
      dispatch({
        type: FormActionType.SetPhoto,
        files: updatedEventPhoto as IzmeFile[],
      });
    };
    updateEventPhoto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventPhoto]);

  useEffect(() => {
    const updateEventWatermark = async () => {
      const updatedEventWatermark = await resolveBrandedImagePreview(eventWatermark);
      dispatch({
        type: FormActionType.SetWatermark,
        files: updatedEventWatermark as IzmeFile[],
      });
    };
    if (!eventWatermark.length) {
      dispatch({
        type: FormActionType.SetWatermark,
        files: [] as IzmeFile[],
      });
    } else {
      updateEventWatermark();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventWatermark]);

  useEffect(() => {
    dispatch({
      type: FormActionType.SetWatermarkSize,
      value: eventWatermarkSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventWatermarkSize]);

  useEffect(() => {
    dispatch({
      type: FormActionType.SetWatermarkPosition,
      position: watermarkPosition,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watermarkPosition]);

  const handleBackResolver = () => {
    if (dialog === DialogWindow.FIRST) {
      return () => handleBack(setDialog, dialog, userPayload?.giftsEvents.length);
    }
    if (dialog === DialogWindow.THIRD) {
      return () =>
        handleBack(
          setDialog,
          dialog,
          userPayload?.giftsEvents.length,
          selectedGiftEvent?.logo && selectedGiftEvent?.mainImage
        );
    }
    return () => handleBack(setDialog, dialog);
  };

  const nextButtonTextResolver = () => {
    if (
      dialog === DialogWindow.FOURTH ||
      (dialog === DialogWindow.THIRD && formState.isFutureEvent)
    ) {
      return "proceed-create-event";
    }
    return "next";
  };
  const isShowLoading = dialog === DialogWindow.THIRD && formState.isFutureEvent && isNextClicked;

  return (
    <div className='container'>
      <Dialog
        open={openDialog}
        sx={{
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
        keepMounted
        maxWidth='lg'>
        {dialog === DialogWindow.FIFTH ? ( // TODO: should be handled by switch case and not here
          <DialogTranzilaPayment
            handleNext={handleNextPaymentForm}
            formState={formState}
            onFailedPayment={() =>
              setTimeout(() => {
                handleBack(setDialog, dialog);
              }, 1500)
            }
            handleBack={() => handleBack(setDialog, dialog)}
          />
        ) : (
          <>
            <DialogTitle
              handleBack={() =>
                handleBack(
                  setDialog,
                  dialog,
                  dialog === DialogWindow.FIRST && userPayload?.giftsEvents.length
                )
              }
              handleClose={closeModalHandler}
              titleIcon={titleIcon[dialog]}
              title={t(titleText[dialog])}
              subTitle={t(titleSubText[dialog])}
              toMinimize={dialog === DialogWindow.SIXTH}
              isNonMobile={isNonMobile}
              handleComponentMinimized={handleComponentMinimized}
            />
            <div className={`divider ${dialog === DialogWindow.SIXTH ? "sixth-divider" : null}`} />

            {renderDialogForm()}
            {dialog === DialogWindow.SIXTH ? null : (
              <>
                <div className='divider' />
                <DialogButtons
                  handleBack={handleBackResolver()}
                  handleNext={() => nextHandlers[dialog](setDialog, dialog)}
                  handleClose={closeModalHandler}
                  isNonMobile={isNonMobile}
                  nextTitle={nextButtonTextResolver()}
                  isShowLoading={isShowLoading}
                  backButtonHidden={
                    (dialog === DialogWindow.FIRST && !(userPayload?.giftsEvents.length > 0)) ||
                    dialog === DialogWindow.GIFTS
                  }
                  isCreateNewEventButtonHidden={dialog !== DialogWindow.GIFTS}
                  handleCreateNewEvent={() => handleCreateNewEvent(setDialog, dialog)}
                />
              </>
            )}
          </>
        )}
      </Dialog>
    </div>
  );
};

export default CreateEventDialog;
