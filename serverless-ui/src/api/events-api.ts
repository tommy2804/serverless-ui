import { AxiosResponse } from "axios";
import api from "../utils/api";
import {
  CreateEventDTO,
  GetEventPhotosDto,
  INextEvent,
  ISingleEventResult,
  UpdateEventDTO,
  BrandingImageType,
} from "../types/event-dto";
import { IzmeFile, PresignUrlFile } from "../shared/create-event-helpers";

const SERVICE_BASE_URL = "/api";

export const uploadPhotoToPresignUrl = async (
  file: IzmeFile,
  uploadlUrl: string,
  updateProgress?: (partOfImage: number) => void
): Promise<void> => {
  let lastPercent = 0;

  await api.put(uploadlUrl, file, {
    headers: { "Content-Type": file.type },
    onUploadProgress: (e: any) => {
      const percentCompleted = Math.round((e.loaded * 100) / e.total);
      if (updateProgress && percentCompleted - lastPercent > 20) {
        updateProgress(percentCompleted / 100);
        lastPercent = percentCompleted;
      }
    },
  });
};

export const createEvent = async (event: CreateEventDTO): Promise<AxiosResponse> =>
  api.post(`${SERVICE_BASE_URL}/events`, { event });

export const updateEvent = async (event: UpdateEventDTO): Promise<AxiosResponse> =>
  api.put(`${SERVICE_BASE_URL}/events`, { event });

export const uploadBrandedImage = async (
  izmeFile: IzmeFile,
  type: BrandingImageType,
  eventId?: string
): Promise<any> => {
  const file: PresignUrlFile = {
    fileName: izmeFile.name,
    fileSize: izmeFile.size,
  };
  const res: AxiosResponse = await api.post(`${SERVICE_BASE_URL}/profile-presign-url`, {
    file,
    eventId,
    type,
  });
  if (res.status !== 200 || (res.data.err && !res.data.success)) return;
  const { uploadlUrl } = res.data;
  await uploadPhotoToPresignUrl(izmeFile, uploadlUrl);
  return { success: true };
};

export const getPresignUrls = async (
  files: PresignUrlFile[],
  eventId: string
): Promise<AxiosResponse> =>
  api.post(`${SERVICE_BASE_URL}/photos-presign-url`, {
    files,
    folderName: eventId,
  });

export const getEvents = async (search?: string): Promise<any> => {
  const res = await api.get("/api/events", {
    params: {
      search,
    },
  });
  return res.data;
};

export const getSingleEvent = async (eventNameUrl: string): Promise<ISingleEventResult> => {
  const res = await api.get(`/api/events/${eventNameUrl}`);
  return res.data;
};

export const getEventPhotos = async (
  eventId: string,
  marker?: string
): Promise<GetEventPhotosDto> => {
  const res = await api.get("/api/events/get-photos", {
    params: {
      eventId,
      marker,
    },
  });
  return res.data;
};

export const getEventRandomPhotos = async (eventId: string) => {
  const res = await api.get("/api/events/get-event-random-photos", {
    params: {
      eventId,
    },
  });
  return res.data;
};

export const verifyEventUrl = async (nameUrl: string): Promise<any> => {
  const res = await api.get("/api/events/verify-name-url", {
    params: {
      nameUrl,
    },
  });
  return res.data;
};

export const deleteEvent = async (eventId: string): Promise<any> => {
  const res = await api.delete("/api/events", {
    params: {
      id: eventId,
    },
  });
  return res.data;
};

export const createNextEventPromotion = async (
  eventId: string,
  nextEvent: INextEvent
): Promise<any> => {
  const res = await api.post("/api/events/next-event-promotion", {
    eventId,
    nextEvent,
  });
  if (res.status !== 200 || (res.data.err && !res.data.success)) return;
  return { success: true };
};

export const deleteNextEventPromotion = async (eventId: string): Promise<any> => {
  const res = await api.delete("/api/events/next-event-promotion", {
    params: {
      eventId,
    },
  });
  if (res.status !== 200 || (res.data.err && !res.data.success)) return { success: false };
  return { success: true };
};

export const deletePhotos = async (eventId: string, photos: string[]): Promise<any> => {
  const res = await api.post("/api/events/delete-photos", {
    eventId,
    photos,
  });
  if (res.status !== 200 || (res.data.err && !res.data.success)) return { success: false };
  return { success: true };
};

interface ISetFavoritePhotos {
  eventId: string;
  photosToAdd?: string[];
  photosToRemove?: string[];
}
export const setFavoritePhotos = async ({
  eventId,
  photosToAdd,
  photosToRemove,
}: ISetFavoritePhotos): Promise<any> => {
  if (!photosToAdd && !photosToRemove) return { success: false, error: true };
  if (photosToAdd && photosToRemove) return { success: false, error: true };
  const photos = photosToAdd || photosToRemove;
  if (photos?.length === 0) return { success: false, error: true };
  const res = await api.post("/api/events/set-favorite-photos", {
    eventId,
    photosToAdd,
    photosToRemove,
  });
  if (res.status !== 200 || (res.data.err && !res.data.success))
    return { success: false, error: true };
  return { success: true };
};

export const cerateQrCode = async (eventId: string): Promise<void> => {
  await api.post("/api/create-qrcode", {
    eventId,
  });
};

export const finishUpload = async (eventId: string): Promise<void> => {
  await api.post("/api/events/finish-upload", {
    eventId,
  });
};

export const addImagesToEvent = async (
  id: string,
  creditsToUse: number,
  thtk?: string
): Promise<void> =>
  api.post("/api/events/add-images", {
    id,
    creditsToUse,
    thtk,
  });

export const calculateCoupon = async (couponId: string, numberOfPhotos: number): Promise<any> => {
  const res = await api.get("/api/events/calculate-coupon", {
    params: {
      couponId,
      numberOfPhotos,
    },
  });
  return res.data;
};
