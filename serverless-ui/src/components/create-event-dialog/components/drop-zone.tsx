import React, { useEffect } from "react";
import DropZoneContent from "./drop-zone-content";
import { IzmeFile } from "../../../shared/create-event-helpers";

interface DropZoneProps {
  setFiles: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  files: IzmeFile[];
  dropZoneContainerStyles?: string;
  dropZoneStyles?: string;
  isUpload?: boolean;
  CustomAvatar?: React.ReactNode;
  uploadIcon?: React.ReactNode;
  isNonMobile: boolean;
  multiple: boolean;
  disabled?: boolean;
}
const MyDropzone: React.FC<DropZoneProps> = ({
  isNonMobile,
  setFiles,
  files,
  dropZoneContainerStyles,
  dropZoneStyles = "dropzone",
  CustomAvatar,
  uploadIcon,
  multiple,
  isUpload = false,
  disabled = false,
}) => {
  useEffect(() => () => files.forEach((file) => URL.revokeObjectURL(file.preview)), [files]);

  return (
    <DropZoneContent
      files={files}
      setFiles={setFiles}
      CustomAvatar={CustomAvatar}
      isNonMobile={isNonMobile}
      isUpload={isUpload}
      uploadIcon={uploadIcon}
      dropZoneContainerStyles={dropZoneContainerStyles}
      dropZoneStyles={dropZoneStyles}
      multiple={multiple}
      disabled={disabled}
    />
  );
};

export default MyDropzone;
