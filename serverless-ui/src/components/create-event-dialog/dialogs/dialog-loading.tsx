import React, { useMemo } from "react";
import { t } from "i18next";
import { CustomLinearProgress, CustomCircularProgress } from "../components/custom-progress";
import {
  UploadProgress,
  calculateEstimatedTimeLeft,
  percetageUploaded,
  formatTime,
} from "../../../shared/create-event-helpers";
// import { RenderButtons } from '../styles/styled-components';

interface DialogLoadingProps {
  isNonMobile: boolean;
  uploadProgress: UploadProgress;
  loadingStartTime: number;
}

const DialogLoading: React.FC<DialogLoadingProps> = ({
  isNonMobile,
  loadingStartTime,
  uploadProgress,
}: DialogLoadingProps) => {
  const { uploadedImages, totalImages, currentImagePercentage } = uploadProgress;
  const estimatedTimeLeftInSeconds = useMemo(
    () =>
      calculateEstimatedTimeLeft(
        totalImages,
        uploadedImages,
        currentImagePercentage,
        loadingStartTime
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [totalImages, uploadedImages, currentImagePercentage]
  );

  const percentageLeft = percetageUploaded(uploadedImages, totalImages);

  return (
    <div className='loading-dialog-container'>
      {/* loader + logo */}
      <div className='loader-logo-contain'>
        <CustomCircularProgress
          strokeWidth={8}
          value={percentageLeft}
          size={isNonMobile ? 250 : 170}
        />

        <p className='loader-text'>{t("ai-magic")}</p>
      </div>
      {/* loader images left */}
      <div className='loader-present-contain'>
        <div className='content'>
          <span className='title-minimized'>{t("uploaded", { uploadedImages, totalImages })}</span>
          <span className='ellipse' />
          <span className='title-minimized'>
            {!Number.isNaN(estimatedTimeLeftInSeconds)
              ? formatTime(estimatedTimeLeftInSeconds)
              : t("calculate-estimated-time")}
          </span>
        </div>

        <div className='progress-container'>
          {/* time calculation  */}
          <CustomLinearProgress
            customwidth={isNonMobile ? "30rem" : "55vw"}
            variant='determinate'
            value={percentageLeft}
          />
        </div>
      </div>
    </div>
  );
};

export default DialogLoading;
