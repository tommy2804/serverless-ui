import React, { ReactNode, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { IzmeFile } from "../create-event-helpers";

interface DndProps {
  files: IzmeFile[];
  setFiles: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  children: ReactNode;
  isMultiple?: boolean;
  isDisabled?: boolean;
  isAcceptSvg?: boolean;
  onChange?: () => void;
}

const Dnd = ({
  files,
  setFiles,
  children,
  isMultiple = true,
  isDisabled = false,
  isAcceptSvg = false,
  onChange,
}: DndProps) => {
  useEffect(() => () => files.forEach((file) => URL.revokeObjectURL(file.preview)), [files]);
  const accept = {
    "image/png": [],
    "image/jpeg": [],
    "image/jpg": [],
    "image/webp": [],
  };

  if (isAcceptSvg) {
    // @ts-ignore
    accept["image/svg+xml"] = [];
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    onDrop: (acceptedFiles) => {
      onChange?.();
      setFiles((prev) =>
        [...prev, ...acceptedFiles].map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            sizeInMB: file.size / (1024 * 1024), // Calculating size in MB and adding it to the file object
          })
        )
      );
    },
    multiple: isMultiple,
    disabled: isDisabled,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default Dnd;
