import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from "react";
import dayjs from "dayjs";
import { useDebounce } from "use-debounce";
import { useTranslation } from "react-i18next";
import { useLoginStateContext } from "./login-context";
import { WatermarkPosition } from "../types/watermark";
import { useToasterContext } from "./toaster-context";
import { verifyEventUrl, uploadBrandedImage, createEvent, finishUpload } from "../api/events-api";
import {
  DialogWindow,
  UploadProgress,
  FormAction,
  IzmeFile,
  formReducer,
  FormActionType,
  updateCreditsToUse,
  handleNext,
  uploadPhotosOneByOne,
  FormState,
  organizationDefaults,
} from "../shared/create-event-helpers";
import { inputValidationHandler } from "../utils/form-utils";

interface ContextProps {
  children: React.ReactNode;
}

interface DialogContextProps {
  dialog: DialogWindow;
  setDialog: Dispatch<SetStateAction<DialogWindow>>;
  isComponentMinimized: boolean;
  openDialog: boolean;
  uploadProgress: UploadProgress;
  formState: FormState;
  dispatch: Dispatch<FormAction>; // Use the correct type for dispatch
  handleComponentMinimized: () => void;
  handleComponentMaximized: () => void;
  handleClickOpen: () => void;
  handleClose: () => void;
  handleNextPaymentForm: () => Promise<void>;
  handleCreatePayment: () => Promise<void>;
  setFiles: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  files: IzmeFile[];
  debouncedEventUrlValue: string;
  isEventPhotoValid: boolean | undefined;
  isEventLogoValid: boolean | undefined;
  loadingStartTime: number;
  setLoadingStartTime: React.Dispatch<React.SetStateAction<number>>;
  lastCreateTime: number | undefined;
  selectedGiftEvent: any | undefined;
  setSelectedGiftEvent: React.Dispatch<React.SetStateAction<any | undefined>>;
  isEventUrlExist: boolean;
  isNameValid: boolean;
  isUrlValid: boolean;
  eventUrlRequestValid: React.MutableRefObject<boolean>;
}

// Create the context
const DialogContext = createContext<DialogContextProps>({
  dialog: DialogWindow.FIRST,
  setDialog: () => {},
  isComponentMinimized: false,
  openDialog: false,
  uploadProgress: {
    totalImages: 0,
    uploadedImages: 0,
    currentImagePercentage: 0,
  },
  debouncedEventUrlValue: "",
  isEventPhotoValid: undefined,
  isEventLogoValid: undefined,
  loadingStartTime: 0,
  setLoadingStartTime: () => {},
  dispatch: () => {},
  formState: {
    eventName: "",
    eventURL: "",
    eventDate: dayjs(),
    location: "",
    photographer: "",
    files: [],
    eventPhoto: [],
    eventLogo: [],
    eventWatermark: [],
    watermarkPosition: WatermarkPosition.BOTTOM_LEFT,
    eventWatermarkSize: 0.15,
    useAccountCredits: true,
    creditsToUse: 0,
    giftCreditsToUse: 0,
    drive: "",
    instagram: "",
    isPublicEvent: false,
    facebook: "",
    website: "",
    numberOfPhotos: 0,
    credits: undefined,
    selectedGiftEventId: undefined,
    isFutureEvent: false,
  },
  handleComponentMinimized: () => {},
  handleComponentMaximized: () => {},
  handleClickOpen: () => {},
  handleClose: () => {},
  handleNextPaymentForm: async () => {},
  handleCreatePayment: async () => {},
  setFiles: () => {},
  files: [],
  lastCreateTime: undefined,
  selectedGiftEvent: undefined,
  setSelectedGiftEvent: () => {},
  isEventUrlExist: false,
  isNameValid: false,
  isUrlValid: false,
  eventUrlRequestValid: { current: false },
});

export const useDialogContext = () => useContext(DialogContext);

export const DialogProvider: React.FC<ContextProps> = ({ children }) => {
  const { organizationPayload, userPayload } = useLoginStateContext();
  const { t } = useTranslation();
  const { setToasterProps } = useToasterContext();
  const [dialog, setDialog] = useState<DialogWindow>(
    userPayload?.giftsEvents.length > 0 ? DialogWindow.GIFTS : DialogWindow.FIRST
  );
  const [isComponentMinimized, setIsComponentMinimized] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    totalImages: 0,
    uploadedImages: 0,
    currentImagePercentage: 0,
  });
  const [files, setFiles] = useState<IzmeFile[]>([]);
  const [loadingStartTime, setLoadingStartTime] = useState<number>(0);
  const [lastCreateTime, setLastCreateTime] = useState<number | undefined>(undefined);
  const [selectedGiftEvent, setSelectedGiftEvent] = useState<any | undefined>(undefined);
  const [isEventUrlExist, setIsEventUrlExist] = useState<boolean>(false);
  const eventUrlRequestValid = useRef(false);

  const organizationDefaults: organizationDefaults = useMemo(
    () => ({
      location: organizationPayload?.location || "",
      photographer: organizationPayload?.photographerName || "",
      instagram: organizationPayload?.instagram || "",
      facebook: organizationPayload?.facebook || "",
      website: organizationPayload?.website || "",
      eventPhoto: organizationPayload?.eventPhoto || [],
      eventLogo: organizationPayload?.eventLogo || [],
      eventName: organizationPayload?.eventName || "",
    }),
    [organizationPayload]
  );

  const initialFormState: any = useMemo(
    () => ({
      ...organizationDefaults,
      eventName: "",
      eventURL: "",
      eventDate: dayjs(),
      files: [],
      useAccountCredits: true,
      creditsToUse: 0,
      giftCreditsToUse: 0,
      drive: "",
      numberOfPhotos: 0,
      isPublicEvent: false,
      credits: organizationPayload?.tokens,
      eventWatermark: [],
      watermarkPosition: WatermarkPosition.BOTTOM_LEFT,
      eventWatermarkSize: 0.15,
      isFutureEvent: false,
    }),
    [organizationDefaults, organizationPayload?.tokens]
  );

  const handleComponentMinimized = () => {
    setIsComponentMinimized(true);
    setOpenDialog(false);
  };

  const handleComponentMaximized = () => {
    setIsComponentMinimized(false);
    handleClickOpen();
  };

  const [formState, dispatch] = useReducer(formReducer, initialFormState);

  const {
    instagram,
    facebook,
    website,
    eventDate,
    eventName,
    eventURL,
    photographer,
    location,
    files: izmePhotos,
    useAccountCredits,
    creditsToUse,
    giftCreditsToUse,
    eventPhoto,
    eventLogo,
    eventWatermark,
    credits,
  } = formState;

  useEffect(() => {
    dispatch({
      type: FormActionType.SetOrgDefaults,
      orgDefaults: organizationDefaults,
    });
  }, [organizationDefaults]);

  useEffect(() => {
    updateCreditsToUse(files, useAccountCredits, credits, dispatch, selectedGiftEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.files, formState.useAccountCredits]);

  useEffect(() => {
    setDialog(userPayload?.giftsEvents.length > 0 ? DialogWindow.GIFTS : DialogWindow.FIRST);
  }, [userPayload]);

  const [debouncedEventUrlValue] = useDebounce(formState.eventURL, 300);

  const isNameValid = inputValidationHandler(formState.eventName, /^$/);
  const isUrlValid = inputValidationHandler(debouncedEventUrlValue, /[^A-Za-z0-9-]/);
  const isEventLogoValid = !!formState.eventLogo.length;
  const isEventPhotoValid = !!formState.eventPhoto.length;

  useEffect(() => {
    const isUrlExistResolver = async () => {
      try {
        eventUrlRequestValid.current = false;
        const res = await verifyEventUrl(debouncedEventUrlValue);
        setIsEventUrlExist(res.exist);
        if (!res.exist && debouncedEventUrlValue === eventURL) eventUrlRequestValid.current = true;
      } catch (e) {
        setIsEventUrlExist(false);
      }
    };

    if (debouncedEventUrlValue) {
      isUrlExistResolver();
    }
  }, [debouncedEventUrlValue]);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    dispatch({
      type: FormActionType.RESET,
      values: initialFormState,
    });
    setOpenDialog(false);
    setFiles([]);
    setUploadProgress({
      totalImages: 0,
      uploadedImages: 0,
      currentImagePercentage: 0,
    });
    setDialog(userPayload?.giftsEvents.length > 0 ? DialogWindow.GIFTS : DialogWindow.FIRST);
    setSelectedGiftEvent(undefined);
    handleResetUpload();
    setIsComponentMinimized(false);
  };

  const handleResetUpload = () => {
    dispatch({
      type: FormActionType.RESET,
      values: initialFormState,
    });
    setFiles([]);
    setDialog(userPayload?.giftsEvents.length > 0 ? DialogWindow.GIFTS : DialogWindow.FIRST);
  };

  const handleDispatch = useCallback(
    (action: FormAction) => {
      dispatch(action);
    },
    [dispatch]
  );

  async function handleCreatePayment() {
    // if (!credits && credits !== 0) return;
    const tokensAfterGift = izmePhotos.length - giftCreditsToUse;
    const tokensToPay = useAccountCredits ? tokensAfterGift - creditsToUse : tokensAfterGift;
    // if (tokensToPay <= 0) {
    handleNext(setDialog, dialog, true);
    handleNextPaymentForm(true);
    return;
    // }

    handleNext(setDialog, dialog);
  }

  const handleBrandedImage = async (
    type: "mainImage" | "logo" | "watermark",
    eventId: string,
    file?: IzmeFile
  ): Promise<void> => {
    if (!file) return;
    await uploadBrandedImage(file, type, eventId);
  };

  async function handleNextPaymentForm(skipNext?: boolean) {
    if (!formState.isFutureEvent) {
      skipNext || handleNext(setDialog, dialog);
    }
    const { data } = await createEvent({
      eventName,
      numberOfPhotos: izmePhotos.length,
      creditsToUse: useAccountCredits ? creditsToUse : 0,
      giftCreditsToUse,
      thtk: formState.thtk,
      nameUrl: eventURL,
      location,
      eventDate,
      photographerName: photographer,
      instagram,
      facebook,
      website,
      isPublicEvent: formState.isPublicEvent,
      selectedGiftEventId: selectedGiftEvent?.eventId,
      selectedGiftEventOrgId: selectedGiftEvent?.root,
      eventWatermarkSize: formState.eventWatermarkSize,
      watermark: !!formState.eventWatermark.length,
      watermarkPosition: formState.watermarkPosition,
      couponId: formState.couponId, // will use only when no thtk
    });

    const { eventId, success } = data;

    if (!success) {
      setToasterProps({
        type: "error",
        text: t("event-creation-error"),
      });
      return;
    }

    await Promise.all([
      handleBrandedImage("mainImage", eventId, eventPhoto[eventPhoto.length - 1]),
      handleBrandedImage("logo", eventId, eventLogo[eventLogo.length - 1]),
      handleBrandedImage("watermark", eventId, eventWatermark[eventWatermark.length - 1]),
    ]);

    if (izmePhotos.length > 0) {
      try {
        setLoadingStartTime(new Date().getTime());
        const { watermarkPosition, eventWatermarkSize } = formState;
        const eventWatermark = formState.eventWatermark.length
          ? formState.eventWatermark[formState.eventWatermark.length - 1]
          : undefined;
        const isAddWatermark = !!eventWatermark;
        await uploadPhotosOneByOne(
          izmePhotos,
          eventId,
          setUploadProgress,
          isAddWatermark,
          eventWatermark,
          watermarkPosition,
          eventWatermarkSize
        );
        finishUpload(eventId);
        setLastCreateTime(new Date().getTime());
      } catch (error) {
        console.error("Error uploading photos:", error);
        setToasterProps({
          type: "error",
          text: t("event-upload-images-error"),
        });
      }
    }
    if (formState.isFutureEvent) {
      setLastCreateTime(new Date().getTime());
    }
    if (uploadProgress.uploadedImages === uploadProgress.totalImages) {
      setTimeout(() => {
        handleClose();
        if (success) {
          setToasterProps({
            type: "success",
            text: t("event-created"),
          });
        }
      }, 4000);
    }
  }

  return (
    <DialogContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        isComponentMinimized,
        formState,
        isEventLogoValid,
        isEventPhotoValid,
        dispatch: handleDispatch,
        openDialog,
        handleComponentMinimized,
        handleComponentMaximized,
        handleClickOpen,
        handleClose,
        setDialog,
        dialog,
        handleNextPaymentForm,
        handleCreatePayment,
        uploadProgress,
        setFiles,
        files,
        debouncedEventUrlValue,
        loadingStartTime,
        setLoadingStartTime,
        lastCreateTime,
        selectedGiftEvent,
        setSelectedGiftEvent,
        isEventUrlExist,
        isNameValid,
        isUrlValid,
        eventUrlRequestValid,
      }}>
      {children}
    </DialogContext.Provider>
  );
};
