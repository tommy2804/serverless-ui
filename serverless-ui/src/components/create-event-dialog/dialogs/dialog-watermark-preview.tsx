import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button, Dialog, DialogActions, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Close } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

import "../styles/dialog-watermark-preview.scss";
import { IzmeFile } from "../../../shared/create-event-helpers";
import { WatermarkPosition } from "../../../types/watermark";
import {
  getImageObject,
  getImageMetadata,
  getWatermarkPositionX,
  getWatermarkPositionY,
} from "../../../utils/helpers";

interface ImageLogoPreviewProps {
  onClose: () => void;
  removeWatermark: () => void;
  eventWatermark: IzmeFile;
  watermarkPosition: WatermarkPosition;
  setWatermarkPosition: React.Dispatch<React.SetStateAction<WatermarkPosition>>;
  eventWatermarkSize: number;
  setWatermarkSize: React.Dispatch<React.SetStateAction<number>>;
}

const DialogWatermarkPreview = ({
  onClose,
  removeWatermark,
  watermarkPosition,
  setWatermarkPosition,
  eventWatermark,
  eventWatermarkSize,
  setWatermarkSize,
}: ImageLogoPreviewProps) => {
  const [watermarkStyle, setWatermarkStyle] = useState({
    bottom: "15px",
  } as React.CSSProperties);
  const { t } = useTranslation();
  const watermarkPreviewModal = useRef(null);
  const logoStyleResolver = async () => {
    const modal = watermarkPreviewModal.current as HTMLDivElement | null;
    const width = modal?.clientWidth || 0;
    const height = modal?.clientHeight || 0;
    const logo = await getImageObject(eventWatermark);
    const logoMetadata = getImageMetadata(logo);
    const logoRatio = logoMetadata.height / logoMetadata.width;
    const finalLogoWidth = width * eventWatermarkSize;
    const finalLogoHeight = finalLogoWidth * logoRatio;
    const positionX = getWatermarkPositionX(watermarkPosition, width, finalLogoWidth);
    const positionY = getWatermarkPositionY(watermarkPosition, height, finalLogoHeight);
    return {
      width: `${finalLogoWidth}px`,
      height: `${finalLogoHeight}px`,
      left: `${positionX}px`,
      bottom: !height || !finalLogoHeight ? `${positionY}px` : undefined,
      top: height && finalLogoHeight ? `${positionY}px` : undefined,
    };
  };
  const MAX_WATERMARK_SIZE = 0.5;
  const MIN_WATERMARK_SIZE = 0.05;
  const WATERMARK_SIZE_STEP = 0.05;

  const watermarkSizeChangeHandler = (type: "increase" | "decrease") => {
    switch (type) {
      case "increase":
        if (eventWatermarkSize < MAX_WATERMARK_SIZE) {
          setWatermarkSize((prev) => prev + WATERMARK_SIZE_STEP);
        }
        break;
      case "decrease":
        if (eventWatermarkSize > MIN_WATERMARK_SIZE) {
          setWatermarkSize((prev) => prev - WATERMARK_SIZE_STEP);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    logoStyleResolver().then((style) => {
      setWatermarkStyle(style);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watermarkPosition, eventWatermark, watermarkPreviewModal.current, eventWatermarkSize]);

  const handlePositionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setWatermarkPosition(e.target.value as WatermarkPosition);
  };

  const watermarkPositionRadioRenderer = () =>
    Object.values(WatermarkPosition).map((position) => (
      <FormControlLabel key={position} value={position} control={<Radio />} label={t(position)} />
    ));

  return (
    <Dialog open={true} onClose={onClose} className='image-logo-preview-dialog'>
      <div className='dialog-header'>
        <Close className='close-icon' onClick={onClose} />
      </div>
      <div
        ref={watermarkPreviewModal}
        className='imagePreview'
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
        }}>
        <img className='preview-image' src='/images/watermark-preview-image.png' alt='preview' />
        {eventWatermark && (
          <img
            src={eventWatermark.preview}
            alt='preview logo'
            style={watermarkStyle}
            className='watermark'
          />
        )}
      </div>
      <div className='image-watermark-preview'>
        <RadioGroup
          row={true}
          aria-labelledby='watermark-position-radio-buttons-group'
          name='watermark-position-radio-buttons-group'
          value={watermarkPosition || WatermarkPosition.TOP_LEFT}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePositionChange(e)}>
          {watermarkPositionRadioRenderer()}
        </RadioGroup>
        <div className='watermark-size-buttons'>
          <span className='watermark-size-buttons__text'>{t("watermark-size")}</span>
          <Button
            className='watermark-size-button'
            onClick={() => watermarkSizeChangeHandler("decrease")}
            disabled={eventWatermarkSize <= MIN_WATERMARK_SIZE}>
            <RemoveIcon />
          </Button>
          <Button
            className='watermark-size-button'
            onClick={() => watermarkSizeChangeHandler("increase")}
            disabled={eventWatermarkSize >= MAX_WATERMARK_SIZE}>
            <AddIcon />
          </Button>
        </div>
      </div>
      <DialogActions>
        <Button autoFocus onClick={removeWatermark} className='close-button'>
          {t("delete")}
        </Button>
        <Button autoFocus onClick={onClose} className='confirm-btn'>
          {t("done")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogWatermarkPreview;
