import React, { ReactNode, SetStateAction } from "react";
import { Box } from "@mui/system";
import uploadCloud from "/images/upload-cloud.svg";
import Dnd from "../upload-image/dnd";
import CompletedUpload from "./completed-upload";

import "./upload-image-box.scss";
import UploadImageBoxTooltip from "./upload-image-box-tooltip";
import { IzmeFile } from "../create-event-helpers";

interface UploadImageBoxTooltipProps {
  tooltipImage: string;
}

const PreviewTooltip = ({ tooltipImage }: UploadImageBoxTooltipProps) => (
  <img className='tooltip-image' src={`/images/${tooltipImage}.jpeg`} alt={`preview photo`} />
);

interface UploadImageBoxProps {
  title: string;
  boxText: string;
  boxMobileText: string;
  isMobile: boolean;
  eventPhoto: IzmeFile[];
  setEventPhoto: React.Dispatch<SetStateAction<IzmeFile[]>>;
  isEdit?: boolean;
  setIsEdit?: React.Dispatch<SetStateAction<boolean>>;
  isMultiple?: boolean;
  currentImgSrc?: string;
  isDisabled?: boolean;
  isAcceptSvg?: boolean;
  onChanges?: () => void;
  className?: string;
  tooltipImageName?: string;
}

const UploadImageBox = ({
  title,
  boxText,
  boxMobileText,
  isMobile,
  eventPhoto,
  setEventPhoto,
  isEdit,
  setIsEdit,
  isMultiple,
  currentImgSrc,
  isDisabled,
  isAcceptSvg,
  onChanges,
  className,
  tooltipImageName,
}: UploadImageBoxProps) => {
  if (!isEdit && setIsEdit) {
    return (
      <CompletedUpload title={title} editFunc={setIsEdit} currentImgSrc={currentImgSrc || ""} />
    );
  }

  const classes = className ? `upload-img-icon ${className}` : "upload-img-icon";

  return (
    <div className='flex flex-center flex-column width100 gap1rem upload-image-box'>
      <label>
        {title}
        {tooltipImageName && (
          <UploadImageBoxTooltip
            tooltipContent={<PreviewTooltip tooltipImage={tooltipImageName} />}
          />
        )}
      </label>
      <Box className='upload-box'>
        <Dnd
          files={eventPhoto}
          setFiles={setEventPhoto}
          isMultiple={isMultiple}
          isDisabled={isDisabled}
          isAcceptSvg={isAcceptSvg}
          onChange={onChanges}>
          <div className='flex-center flex-column item-wrapper'>
            <img className={classes} src={eventPhoto.at(-1)?.preview || uploadCloud} alt='cloud' />
            <span className={isDisabled ? "disabled-upload-text" : ""}>
              {isMobile ? boxMobileText : boxText}
            </span>
          </div>
        </Dnd>
      </Box>
    </div>
  );
};

export default UploadImageBox;
