import { IzmeFile, imageURLToBase64 } from "../../shared/create-event-helpers";

export const resolveBrandedImagePreview = async (files: IzmeFile[]) => {
  const file = files[files.length - 1];
  const base64Preview = await imageURLToBase64(file.preview);
  if (base64Preview) {
    file.preview = base64Preview as string;
    const updatedFiles = files.slice(0, files.length - 1);
    updatedFiles.push(file);
    return updatedFiles;
  }
};
