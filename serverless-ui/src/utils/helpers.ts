import { IzmeFile, imageURLToBase64, base64ToIzmeFile } from "../shared/create-event-helpers";
import { ImageMetadata, WatermarkPosition } from "../types/watermark";

const USE_ORIGINAL_IMAGE = ["watermark"];

export const resolveImageUrlFunc =
  (organization: string, eventId?: string) => (type: string, version?: number) =>
    `/organization-assets/resized/${organization}/${eventId ? `${eventId}/` : ""}${type}${
      version ? `-${version}` : ""
    }`;

export const resolveEventPhotosFunc = (organization: string, eventId: string) => (imgId: string) =>
  `/small/${organization}/${eventId}/${imgId}`;

export const photoDownload = (photoUrl: string, name?: string) => {
  const link = document.createElement("a");
  link.href = photoUrl;
  link.download = name || "Izme_photo.jpg"; // You can customize the download filename
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getImgIdFromSrc = (imgSrc: string) => imgSrc.split("/").at(-1) || "";

export const handleBrandImage = async (
  id: string,
  type: string,
  isFile: boolean,
  version?: number
): Promise<IzmeFile[]> => {
  if (!isFile) return [];
  const typeWithVersion = version ? `${type}-${version}` : type;
  const resizedOrOriginal = USE_ORIGINAL_IMAGE.includes(type) ? "original" : "resized";
  const brandImage = await urlToIzmeFile(
    `/organization-assets/${resizedOrOriginal}/${id}/${typeWithVersion}`
  );
  return [brandImage];
};

export const urlToIzmeFile = async (url: string) => {
  const base64Image = await imageURLToBase64(url);
  return base64ToIzmeFile(base64Image as string);
};

export const getImageObject = (imageFile: IzmeFile): Promise<HTMLImageElement | SVGImageElement> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imageFile);
  });

export const getImageMetadata = (imageObj: HTMLImageElement | SVGImageElement): ImageMetadata => ({
  width: imageObj instanceof SVGImageElement ? imageObj.width.baseVal.value : imageObj.width,
  height: imageObj instanceof SVGImageElement ? imageObj.height.baseVal.value : imageObj.height,
});

export const getWatermarkPositionX = (
  position: WatermarkPosition,
  imageWidth?: number,
  logoWidth?: number
) => {
  if (!imageWidth || !logoWidth) {
    return 15;
  }
  const width = logoWidth + 15;
  switch (position) {
    case WatermarkPosition.BOTTOM_LEFT:
    case WatermarkPosition.TOP_LEFT:
      return 15;
    case WatermarkPosition.BOTTOM_RIGHT:
    case WatermarkPosition.TOP_RIGHT:
      return imageWidth - width;
    case WatermarkPosition.BOTTOM_CENTER:
    case WatermarkPosition.TOP_CENTER:
      return (imageWidth - width) / 2;
    default:
      return 15;
  }
};

export const getWatermarkPositionY = (
  position: WatermarkPosition,
  imageHeight?: number,
  logoHeight?: number
) => {
  if (!imageHeight || !logoHeight) {
    return 15;
  }
  const height = logoHeight + 15;
  switch (position) {
    case WatermarkPosition.TOP_LEFT:
    case WatermarkPosition.TOP_RIGHT:
    case WatermarkPosition.TOP_CENTER:
      return 15;
    case WatermarkPosition.BOTTOM_LEFT:
    case WatermarkPosition.BOTTOM_RIGHT:
    case WatermarkPosition.BOTTOM_CENTER:
      return imageHeight - height;
    default:
      return 15;
  }
};
export const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
