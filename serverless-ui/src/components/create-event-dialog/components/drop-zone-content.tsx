import React from "react";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import { IzmeFile } from "../../../shared/create-event-helpers";
import { useToasterContext } from "../../../state/toaster-context";

interface DropZoneContentProps {
  files: IzmeFile[];
  setFiles: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  CustomAvatar: React.ReactNode;
  isUpload: boolean;
  uploadIcon: React.ReactNode;
  isNonMobile: boolean;
  dropZoneContainerStyles?: string;
  dropZoneStyles?: string;
  multiple: boolean;
  disabled?: boolean;
}

const DropZoneContent: React.FC<DropZoneContentProps> = ({
  setFiles,
  CustomAvatar,
  isNonMobile,
  isUpload,
  uploadIcon,
  dropZoneContainerStyles,
  multiple,
  dropZoneStyles = "dropzone",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const { setToasterProps } = useToasterContext();

  const removeDuplicatesFiles = (files: (IzmeFile | any)[]) => {
    const uniqueFiles = files.reduce((uniqueMap, file) => {
      if (!uniqueMap.has(file.name)) {
        uniqueMap.set(file.name, file);
      }
      return uniqueMap;
    }, new Map());
    return [...uniqueFiles.values()];
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    disabled,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
      "image/webp": [],
    },
    maxSize: 10485760 * 10, // 100MB
    multiple,
    onDrop: (acceptedFiles) => {
      setFiles((prev) =>
        removeDuplicatesFiles([...prev, ...acceptedFiles]).map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            sizeInMB: file.size / (1024 * 1024), // Calculating size in MB and adding it to the file object
          })
        )
      );
    },
    onDropRejected: (fileRejections) => {
      setToasterProps({
        type: "error",
        text: t("files-upload-error", { number: fileRejections.length }),
      });
    },
  });

  // render function
  const renderMobileContent = () => {
    if (isDragActive) {
      return <span>{t("drop-here")} ...</span>;
    }
    return (
      <div className='container'>
        <div>
          <span className='mark-text'>{t("upload-click")}</span> <span>{t("or-dnd")}</span>
        </div>
        <span className='dropzone-subtext'>PNG, JPG, JPEG or WEBP </span>
      </div>
    );
  };
  const renderNonMobileContent = () => {
    if (isNonMobile && isDragActive) {
      return <span>{t("drop-here")} ...</span>;
    }

    return (
      <div className='event-photo-container'>
        {isUpload ? (
          <>
            <div>
              <span className='mark-text'>{t("upload-click")}</span> <span>{t("or-dnd")}</span>
            </div>
            <span className='dropzone-subtext'>PNG, JPG, JPEG or WEBP </span>
          </>
        ) : (
          <>
            <span>{t("upload-event-photo")}</span>
            {uploadIcon}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      style={{ display: "flex" }}
      {...getRootProps()}
      className={`${dropZoneContainerStyles} ${disabled ? "disabled" : ""}`}
      onClick={open}>
      <button className='rmv-default' type='button'>
        {CustomAvatar}
      </button>

      <div className={dropZoneStyles}>
        <input {...getInputProps()} disabled={disabled} />

        <div>{isNonMobile ? renderMobileContent() : renderNonMobileContent()}</div>
      </div>
    </div>
  );
};

export default DropZoneContent;
