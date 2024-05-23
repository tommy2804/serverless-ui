import React, { Dispatch } from "react";
import { FormAction, IzmeFile, UploadProgress, FormState } from "../../shared/create-event-helpers";
import { WatermarkPosition } from "../../types/watermark";

export interface DialogFormProps {
  isNonMobile: boolean;
  formState: FormState;
  dispatch: Dispatch<FormAction>;
  files: IzmeFile[];
  setFiles: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  handleNext: () => void;
  handleClose: () => void;
  isEventNameValid: boolean;
  isEventUrlValid: boolean;
  isEventUrlExist: boolean;
  debouncedEventUrlValue: string;
  selectedGiftEvent: any;
  eventPhoto: IzmeFile[];
  setEventPhoto: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  eventLogo: IzmeFile[];
  setEventLogo: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  eventWatermark: IzmeFile[];
  setEventWatermark: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  watermarkPosition: WatermarkPosition;
  setWatermarkPosition: React.Dispatch<React.SetStateAction<WatermarkPosition>>;
  eventWatermarkSize: number;
  setWatermarkSize: React.Dispatch<React.SetStateAction<number>>;
  isEventPhotoValid: boolean | undefined;
  isEventLogoValid: boolean | undefined;
  uploadProgress: UploadProgress;
  loadingStartTime: number;
  isNextClicked?: boolean;
}
