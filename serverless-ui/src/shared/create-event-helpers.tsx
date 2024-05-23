/* eslint-disable no-restricted-syntax */
import detailsIcon from "/images/details-con.svg";
import giftIcon from "/images/gift-icon.svg";
import paymentIcon from "/images/payment-icon.svg";
import imageIcon from "/images/image-icon.svg";
import brandingIcon from "/images/branding-icon.png";
import { Dayjs } from "dayjs";
import { getPresignUrls, uploadPhotoToPresignUrl } from "../api/events-api";
import { t } from "i18next";
import { AxiosResponse } from "axios";
import {
  getImageMetadata,
  getImageObject,
  getWatermarkPositionX,
  getWatermarkPositionY,
} from "../utils/helpers";
import { WatermarkPosition } from "../types/watermark";

const MAX_PRESIGNS = 1;

export enum DialogWindow {
  GIFTS = "Gifts",
  FIRST = "Set Details",
  SECOND = "Branding",
  THIRD = "Upload Photos",
  FOURTH = "Payments",
  FIFTH = "EventCreated",
  SIXTH = "KeepOpen",
}

export interface IzmeFile extends File {
  preview: string;
  sizeInMB: number;
}

export interface PresignUrlFile {
  fileName: string;
  fileSize: number;
}

export interface UploadProgress {
  totalImages: number;
  uploadedImages: number;
  currentImagePercentage: number;
}

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const getPresignUrlsWithRetry = async (
  files: PresignUrlFile[],
  eventId: string
): Promise<AxiosResponse> => {
  try {
    return await getPresignUrls(files, eventId);
  } catch (err) {
    await sleep(3000);
    return getPresignUrls(files, eventId);
  }
};

export const uploadPhotosOneByOne = async (
  izmePhotos: IzmeFile[],
  eventId: string,
  updateProgress: (progress: UploadProgress) => void,
  isAddWatermarkToPhotos: boolean,
  watermark?: IzmeFile,
  watermarkPosition?: WatermarkPosition,
  watermarkSize: number = 1
): Promise<void> => {
  const totalImages = izmePhotos.length;
  let uploadedImages = 0;
  const duplicatedPhotos: string[] = [];
  const failedPhotos: string[] = [];
  const izmePhotosCopy = [...izmePhotos];

  const updateProgressForApi = (currentImagePercentage: number): void => {
    updateProgress({
      totalImages,
      uploadedImages,
      currentImagePercentage,
    });
  };

  while (izmePhotosCopy.length > 0) {
    const firstPhotos = izmePhotosCopy.splice(0, MAX_PRESIGNS);

    const processedPhotos = await Promise.all(
      firstPhotos.map(async (file) => {
        if (watermark && watermarkPosition && isAddWatermarkToPhotos) {
          try {
            return await addWatermark(file, watermark, watermarkPosition, watermarkSize);
          } catch (error) {
            console.error(`Error adding watermark to ${file.name}: ${error}`);
            return file; // Continue with the original image if watermarking fails
          }
        }
        return file;
      })
    );

    const presignUrlsResponse = await getPresignUrlsWithRetry(
      processedPhotos.map((file) => ({
        fileName: file.name,
        fileSize: file.size,
      })),
      eventId
    );

    const presignUrlsObject = presignUrlsResponse.data.results
      .filter((result: any) => !result.err && result.success)
      .reduce((acc: Record<string, string>, result: any) => {
        acc[result.fileName] = result.presignUrl;
        return acc;
      }, {});

    duplicatedPhotos.push(
      ...presignUrlsResponse.data.results
        .filter((result: any) => !result.success && result.reason === "duplicate")
        .map((result: any) => result.fileName)
    );

    failedPhotos.push(
      ...presignUrlsResponse.data.results
        .filter((result: any) => result.err)
        .map((result: any) => result.fileName)
    );

    for (const photo of processedPhotos) {
      try {
        const photoPresignUrl = presignUrlsObject[photo.name];
        const isImageAlreadyUploaded = duplicatedPhotos.includes(photo.name);
        if (photoPresignUrl) {
          await uploadPhotoToPresignUrl(photo, photoPresignUrl, updateProgressForApi);
        } else if (!isImageAlreadyUploaded) {
          throw new Error("Not enough tokens");
        }
        uploadedImages += 1;
      } catch (error) {
        console.error(`Failed to upload ${photo.name}: ${error}`);
        failedPhotos.push(photo.name);
      }

      updateProgress({
        totalImages,
        uploadedImages,
        currentImagePercentage: 0,
      });
    }
  }

  updateProgress({
    totalImages,
    uploadedImages,
    currentImagePercentage: 0,
  });
};

export interface FormState {
  eventName: string;
  eventURL: string;
  eventDate: Dayjs;
  location: string;
  files: IzmeFile[];
  eventPhoto: IzmeFile[];
  eventLogo: IzmeFile[];
  eventWatermark: IzmeFile[];
  watermarkPosition: WatermarkPosition;
  eventWatermarkSize: number;
  numberOfPhotos: number;
  useAccountCredits: boolean;
  creditsToUse: number;
  giftCreditsToUse: number;
  credits: number | undefined;
  isPublicEvent: boolean;
  photographer?: string;
  drive?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  thtk?: string;
  couponId?: string;
  discount?: number;
  sum?: number;
  selectedGiftEventId?: number | undefined;
  isFutureEvent?: boolean;
}

export interface organizationDefaults {
  location: string;
  photographer: string;
  instagram: string;
  facebook: string;
  website: string;
  eventPhoto: IzmeFile[];
  eventLogo: IzmeFile[];
  eventName: string;
}

export interface GiftEvent {
  eventId: number;
  name: string;
  root: string;
  tokens: number;
  organization: string;
}

export const titleIcon = {
  [DialogWindow.GIFTS]: giftIcon,
  [DialogWindow.FIRST]: detailsIcon,
  [DialogWindow.SECOND]: brandingIcon,
  [DialogWindow.THIRD]: imageIcon,
  [DialogWindow.FOURTH]: paymentIcon,
  [DialogWindow.FIFTH]: "",
  [DialogWindow.SIXTH]: imageIcon,
};
export const titleText = {
  [DialogWindow.GIFTS]: "use-your-gifts",
  [DialogWindow.FIRST]: "general-details",
  [DialogWindow.SECOND]: "event-branding",
  [DialogWindow.THIRD]: "upload-photos",
  [DialogWindow.FOURTH]: "payment",
  [DialogWindow.FIFTH]: "",
  [DialogWindow.SIXTH]: "uploading-images",
};
export const titleSubText = {
  [DialogWindow.GIFTS]: "gift-event-invite",
  [DialogWindow.FIRST]: "enter-details",
  [DialogWindow.SECOND]: "event-logo",
  [DialogWindow.THIRD]: "upload-files",
  [DialogWindow.FOURTH]: "confirm-payment",
  [DialogWindow.FIFTH]: "",
  [DialogWindow.SIXTH]: "please-dont-close",
};

export const handleNext = (
  setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>,
  dialog: DialogWindow,
  skip?: boolean
) => {
  const order = [
    DialogWindow.GIFTS,
    DialogWindow.FIRST,
    DialogWindow.SECOND,
    DialogWindow.THIRD,
    DialogWindow.FOURTH,
    DialogWindow.FIFTH,
    DialogWindow.SIXTH,
  ];
  const index = order.indexOf(dialog);
  const increment = skip ? 2 : 1;
  setDialog(order[index + increment]);
};

export const handleBack = (
  setDialog: React.Dispatch<React.SetStateAction<DialogWindow>>,
  dialog: DialogWindow,
  giftEvents?: boolean,
  skip?: boolean
) => {
  switch (dialog) {
    case DialogWindow.FIRST:
      setDialog(giftEvents ? DialogWindow.GIFTS : DialogWindow.FIRST);
      break;
    case DialogWindow.SECOND:
      setDialog(DialogWindow.FIRST);
      break;
    case DialogWindow.THIRD:
      setDialog(giftEvents && skip ? DialogWindow.FIRST : DialogWindow.SECOND);
      break;
    case DialogWindow.FOURTH:
      setDialog(DialogWindow.THIRD);
      break;
    case DialogWindow.FIFTH:
      setDialog(DialogWindow.FOURTH);
      break;

    default:
      break;
  }
};

export enum FormActionType {
  SetInitialValues = "SET_INITIAL_VALUES",
  SetGiftEvent = "SET_GIFT_EVENT",
  SetOrgDefaults = "SET_ORG_DEFAULTS",
  SetField = "SET_FIELD",
  SetFiles = "SET_FILES",
  SetPhoto = "SET_PHOTO",
  SetLogo = "SET_LOGO",
  SetWatermark = "SET_WATERMARK",
  SetWatermarkPosition = "SET_WATERMARK_POSITION",
  SetWatermarkSize = "SET_WATERMARK_SIZE",
  SetIsAddWatermarkToPhotos = "SET_IS_ADD_WATERMARK_TO_PHOTOS",
  SetIsPublicEvent = "SET_IS_PUBLIC_EVENT",
  SetIsFutureEvent = "SET_IS_FUTURE_EVENT",
  DeleteFiles = "DELETE_FILES",
  RESET = "RESET",
}

// reducer
export type FormAction =
  | { type: FormActionType.SetInitialValues; initialValues: FormState }
  | { type: FormActionType.SetGiftEvent; orgDefaults: organizationDefaults; giftEventId: number }
  | { type: FormActionType.SetOrgDefaults; orgDefaults: organizationDefaults }
  | {
      type: FormActionType.SetField;
      field: string;
      value: string | Dayjs | null | number | boolean;
    }
  | { type: FormActionType.SetFiles; files: IzmeFile[] }
  | { type: FormActionType.SetPhoto; files: IzmeFile[] }
  | { type: FormActionType.SetLogo; files: IzmeFile[] }
  | { type: FormActionType.SetWatermark; files: IzmeFile[] }
  | { type: FormActionType.SetWatermarkPosition; position: WatermarkPosition }
  | { type: FormActionType.SetWatermarkSize; value: number }
  | { type: FormActionType.SetIsAddWatermarkToPhotos; value: boolean }
  | { type: FormActionType.SetIsPublicEvent; value: boolean }
  | { type: FormActionType.DeleteFiles; files: IzmeFile[] }
  | { type: FormActionType.RESET; values: FormState }
  | { type: FormActionType.SetIsFutureEvent; value: boolean };

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case FormActionType.SetInitialValues:
      return {
        ...state,
        ...action.initialValues,
      };
    case FormActionType.SetGiftEvent:
      return {
        ...state,
        ...action.orgDefaults,
        selectedGiftEventId: action.giftEventId,
      };
    case FormActionType.SetOrgDefaults:
      return {
        ...state,
        ...action.orgDefaults,
      };
    case FormActionType.SetField:
      return {
        ...state,
        [action.field]: action.value,
      };
    case FormActionType.SetFiles:
      return {
        ...state,
        files: action.files,
      };
    case FormActionType.SetPhoto:
      return {
        ...state,
        eventPhoto: action.files,
      };
    case FormActionType.SetLogo:
      return {
        ...state,
        eventLogo: action.files,
      };
    case FormActionType.SetWatermark:
      return {
        ...state,
        eventWatermark: action.files,
      };
    case FormActionType.SetWatermarkPosition:
      return {
        ...state,
        watermarkPosition: action.position,
      };
    case FormActionType.SetIsPublicEvent:
      return {
        ...state,
        isPublicEvent: action.value,
      };
    case FormActionType.SetWatermarkSize:
      return {
        ...state,
        eventWatermarkSize: action.value,
      };
    case FormActionType.DeleteFiles:
      return {
        ...state,
        files: [],
      };
    case FormActionType.RESET:
      return {
        ...action.values,
      };
    case FormActionType.SetIsFutureEvent:
      return {
        ...state,
        isFutureEvent: action.value,
      };
    default:
      return state;
  }
};

export const updateCreditsToUse = (
  files: IzmeFile[],
  useAccountCredits: boolean,
  credits: number | undefined,
  dispatch: React.Dispatch<FormAction>,
  selectedGiftEvent: any = undefined
) => {
  const uploadedImages = files.length || 0;
  let localGiftCreditsToUse = 0;
  if (selectedGiftEvent?.id) {
    localGiftCreditsToUse = Math.min(selectedGiftEvent.tokens, uploadedImages);
    dispatch({
      type: FormActionType.SetField,
      field: "giftCreditsToUse",
      value: localGiftCreditsToUse,
    });
  }
  const remainEventTokens = Math.max(uploadedImages - localGiftCreditsToUse, 0);
  if (remainEventTokens >= 0) {
    const localCreditsToUse = useAccountCredits ? Math.min(remainEventTokens, credits || 0) : 0;
    dispatch({
      type: FormActionType.SetField,
      field: "creditsToUse",
      value: localCreditsToUse,
    });
  }
};

export function calculateEstimatedTimeLeft(
  totalImages: number,
  uploadedImages: number,
  currentImagePercentage: number,
  startTime: number
): number {
  const now = new Date().getTime();
  const diff = now - startTime;
  const fixUploadedImages = uploadedImages + currentImagePercentage;
  const throughputRate = diff ? diff / fixUploadedImages / 1000 : 0;
  const remainingImages = totalImages - fixUploadedImages;
  const estimatedTimeRemaining = remainingImages * throughputRate;
  return Math.ceil(estimatedTimeRemaining);
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTimeParts: string[] = [];
  if (hours > 0) {
    formattedTimeParts.push(`${hours} ${t("hours")}`);
  }
  if (minutes > 0) {
    formattedTimeParts.push(`${minutes} ${t("minutes")}`);
  }
  if (remainingSeconds > 0 || formattedTimeParts.length === 0) {
    formattedTimeParts.push(`${remainingSeconds} ${t("seconds")}`);
  }
  return formattedTimeParts.join(" ");
}

export const percetageUploaded = (uploadedImages: number, totalImages: number): number => {
  const percentageUploaded = (uploadedImages / totalImages) * 100;
  return percentageUploaded > 100 ? 100 : percentageUploaded || 0;
};

export const imageURLToBase64 = async (imageUrl: string) => {
  if (!imageUrl) return "";
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};

export const base64ToIzmeFile = (base64: string, fileName: string = "IzmeFileObject") => {
  const matchResult = base64.match(/:(.*?);/);
  if (!matchResult || matchResult.length < 2) {
    throw new Error("Error converting base64 to IzmeFile");
  }
  const mime = matchResult[1];
  const byteString = atob(base64.split(",")[1]);
  const arrayNBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayNBuffer);

  for (let i = 0; i < byteString.length; i += 1) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayNBuffer], { type: mime });
  const file = new File([blob], fileName, { type: mime });
  const sizeInMB = file.size / (1024 * 1024);

  const izmeFile: IzmeFile = Object.assign(file, {
    preview: base64,
    sizeInMB,
  });

  return izmeFile;
};

export const canvasToIzmeFile = (canvas: HTMLCanvasElement, imageFile: IzmeFile): IzmeFile => {
  const canvasBase64String = canvas.toDataURL(imageFile.type);
  return base64ToIzmeFile(canvasBase64String, imageFile.name);
};

const addWatermark = async (
  imageFile: IzmeFile,
  watermarkFile: IzmeFile,
  position: WatermarkPosition,
  watermarkSize: number
): Promise<IzmeFile> => {
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");
  const [image, watermark] = await Promise.all([
    getImageObject(imageFile),
    getImageObject(watermarkFile),
  ]);
  const imageWidth = image instanceof SVGImageElement ? image.width.baseVal.value : image.width;
  const imageHeight = image instanceof SVGImageElement ? image.height.baseVal.value : image.height;
  canvas.width = imageWidth;
  canvas.height = imageHeight;
  canvasContext?.drawImage(image, 0, 0, imageWidth, imageHeight);
  const watermarkMetadata = getImageMetadata(watermark);
  const watermarkRatio = watermarkMetadata.height / watermarkMetadata.width;
  const finalLogoWidth = imageWidth * watermarkSize;
  const finalLogoHeight = finalLogoWidth * watermarkRatio;
  const positionX = getWatermarkPositionX(position, imageWidth, finalLogoWidth);
  const positionY = getWatermarkPositionY(position, imageHeight, finalLogoHeight);
  canvasContext?.drawImage(watermark, positionX, positionY, finalLogoWidth, finalLogoHeight);
  return canvasToIzmeFile(canvas, imageFile) as IzmeFile;
};

export enum InputState {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  DEFAULT = "DEFAULT",
}
