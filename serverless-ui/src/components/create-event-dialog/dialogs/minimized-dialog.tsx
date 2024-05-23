import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import Fullscreen from "@mui/icons-material/Fullscreen";
import { IconButton } from "@mui/material";
import { CustomLinearProgress } from "../components/custom-progress";

import "../styles/minimized.scss";
import "../../../shared/styles/themes.scss";
import { useDialogContext } from "../../../state/dialog-context";
import {
  calculateEstimatedTimeLeft,
  formatTime,
  percetageUploaded,
} from "../../../shared/create-event-helpers";

const ProgressMinimized: React.FC = () => {
  const { handleComponentMaximized, uploadProgress, loadingStartTime } = useDialogContext();
  const { uploadedImages, totalImages, currentImagePercentage } = uploadProgress;

  const percentageLeft = percetageUploaded(uploadedImages, totalImages);
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

  const { t, i18n } = useTranslation();

  return (
    <div className='minimized-container'>
      <div className='minimized-content-contain'>
        <div className='push-text-minimize'>
          <div className='content'>
            <span className='title-minimized'>
              {t("Uploaded")} {uploadedImages} {t("of")} {totalImages}
            </span>

            <span className='ellipse' />
            <span className='title-minimized'>
              {!Number.isNaN(estimatedTimeLeftInSeconds)
                ? formatTime(estimatedTimeLeftInSeconds)
                : t("calculate-estimated-time")}
            </span>
          </div>
          <div className='dont-close-contain'>
            <p className='subtitle'>{t("please-dont-close")}</p>
          </div>
        </div>

        <div className='progress-container'>
          {/* time calculation  */}

          <CustomLinearProgress customwidth='10rem' variant='determinate' value={percentageLeft} />
        </div>
        <div className={`${i18n.dir() === "rtl" ? "minimized-icon-rtl" : "minimized-icon"}`}>
          <IconButton onClick={handleComponentMaximized}>
            <Fullscreen />
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ProgressMinimized;
