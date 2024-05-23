import { Dayjs } from "dayjs";
import { WatermarkPosition } from "./watermark";

export interface CreateEventDTO {
  eventName: string;
  nameUrl: string;
  numberOfPhotos: number;
  creditsToUse: number;
  isPublicEvent: boolean;
  giftCreditsToUse?: number;
  eventDate?: Dayjs;
  location?: string;
  photographerName?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  thtk?: string;
  selectedGiftEventId?: string;
  selectedGiftEventOrgId?: string;
  eventWatermarkSize?: number;
  watermarkPosition?: WatermarkPosition;
  watermark: boolean;
  couponId?: string;
}

export interface UpdateEventDTO {
  eventId: string;
  eventName?: string;
  eventDate?: Dayjs;
  location?: string;
  photographerName?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  isPublicEvent?: boolean;
}

export interface GetSingleEventDTO {
  best_photos: string[];
  location: string;
  name_url: string;
  selfies_taken: number;
  time_created: number;
  name: string;
  randomPhotos: string[];
  nextEvent: any | null;
  photos_taken: number;
  number_of_photos: number;
  total_photos?: number; // after event is ready it will present the total number of photos
  missingPhotos?: number;
  organization: string;
  username: string;
  id: string;
  event_date: any;
  isPublicEvent: boolean;
  tokens: any[];
  ttl: number;
  photographer_name?: string;
  facebook?: string;
  website?: string;
  instagram?: string;
  qrcode?: boolean;
  logo?: string;
  mainImage?: string;
  watermark?: boolean;
  watermarkPosition: WatermarkPosition;
  eventWatermarkSize: number;
  giftRoot?: string;
  nextEventPromotion: any;
  favorite_photos: string[];
  logoVersion?: number;
  mainImageVersion?: number;
  giftFields?: string[];
  socialMediaClick?: string;
  photoDownload?: string;
  contactMeClick?: string;
  nextEventClick?: string;
}

export interface ISingleEventResult {
  error: boolean;
  event: GetSingleEventDTO;
  success: boolean;
}

export interface GetEventPhotosDto {
  error: boolean;
  success: boolean;
  photos?: string[];
  lastKey?: string;
}

export interface INextEvent {
  name: string;
  date: string;
  location: string;
  website: string;
}

export enum DataNotFoundType {
  Events = "events",
  Transactions = "transactions",
}

export type BrandingImageType = "logo" | "mainImage" | "next-event-logo" | "watermark";
