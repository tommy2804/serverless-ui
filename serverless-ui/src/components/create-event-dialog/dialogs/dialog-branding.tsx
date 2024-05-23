import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";

import "../styles/dialog-branding.scss";
import { CustomTextField } from "../styles/styled-components";
import facebookSvg from "/images/facebook-icon.svg";
import instagramSvg from "/images/instagram-icon.svg";
import globeSvg from "/images/globe-icon.svg";
import DialogWatermarkPreview from "./dialog-watermark-preview";
import { WatermarkPosition } from "../../../types/watermark";
import { MAX_INPUT_LENGTH } from "../../../utils/constants";
import { handleBrandImage } from "../../../utils/helpers";
import {
  IzmeFile,
  FormAction,
  FormActionType,
  FormState,
} from "../../../shared/create-event-helpers";
import UploadImageBox from "../../../shared/upload-image-box/upload-image-box";

interface DialogBrandingProps {
  setEventPhoto: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  setEventLogo: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  setEventWatermark: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  setWatermarkPosition: React.Dispatch<React.SetStateAction<WatermarkPosition>>;
  setWatermarkSize: React.Dispatch<React.SetStateAction<number>>;
  formState: FormState;
  isNonMobile: boolean;
  dispatch: React.Dispatch<FormAction>;
  isEventPhotoValid: boolean | undefined;
  isEventLogoValid: boolean | undefined;
  selectedGiftEvent: any;
  eventPhoto: IzmeFile[];
  eventLogo: IzmeFile[];
  eventWatermark: IzmeFile[];
  eventWatermarkSize: number;
  watermarkPosition: WatermarkPosition;
  isGiftEventWithMainImage?: boolean;
  isGiftEventWithLogo?: boolean;
  isNextClicked?: boolean;
  giftFields?: string[];
  isEdit?: boolean;
}

const DialogBranding: React.FunctionComponent<DialogBrandingProps> = ({
  setEventPhoto,
  setEventLogo,
  setEventWatermark,
  setWatermarkPosition,
  setWatermarkSize,
  dispatch,
  formState,
  isNonMobile,
  isEventPhotoValid,
  isEventLogoValid,
  selectedGiftEvent,
  eventPhoto,
  eventLogo,
  eventWatermark,
  watermarkPosition,
  eventWatermarkSize,
  isGiftEventWithMainImage,
  isGiftEventWithLogo,
  isNextClicked,
  giftFields,
  isEdit,
}) => {
  const { t } = useTranslation();
  const { website, instagram, facebook } = formState;
  const [isWaterMarkPreviewModalOpen, setIsWaterMarkPreviewModalOpen] = useState<boolean>(false);
  const isEventLogoError = isEventLogoValid === false;
  const isEventPhotoError = isEventPhotoValid === false;

  const removeWatermark = () => {
    setEventWatermark([]);
    setWatermarkPosition(WatermarkPosition.BOTTOM_LEFT);
    setWatermarkSize(1);
    setIsWaterMarkPreviewModalOpen(false);
  };

  useEffect(() => {
    const getGiftedEventImages = async () => {
      const { root, logo, mainImage, logoVersion, mainImageVersion } = selectedGiftEvent || {};
      const [giftLogo, giftMainImage] = await Promise.all([
        handleBrandImage(root, "logo", logo, logoVersion),
        handleBrandImage(root, "mainImage", mainImage, mainImageVersion),
      ]);
      setEventLogo(giftLogo);
      setEventPhoto(giftMainImage);
    };
    if (selectedGiftEvent) {
      getGiftedEventImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='container-dialog-branding'>
      <div className='branding-upload-container'>
        <div
          className={`upload-container ${
            selectedGiftEvent?.logo || isGiftEventWithLogo ? "disabled" : ""
          }`}>
          <UploadImageBox
            title={t("event-logo-only")}
            boxText={
              selectedGiftEvent?.logo || isGiftEventWithLogo ? t("gift-photo") : t("click-upload")
            }
            boxMobileText={
              selectedGiftEvent?.logo || isGiftEventWithLogo
                ? t("gift-photo")
                : t("click-upload-event-logo")
            }
            isMobile={!isNonMobile}
            eventPhoto={eventLogo}
            setEventPhoto={setEventLogo}
            isMultiple={false}
            isDisabled={selectedGiftEvent?.logo || isGiftEventWithLogo}
            tooltipImageName={"event-logo-example"}
          />
          {isEventLogoError && isNextClicked && (
            <p className='error-message'>{t("event-logo-error")}</p>
          )}
        </div>
        <div
          className={`${
            eventPhoto.length > 0
              ? "upload-container main-image-upload-container"
              : "upload-container"
          }  ${selectedGiftEvent?.mainImage || isGiftEventWithMainImage ? "disabled" : ""}`}>
          <UploadImageBox
            title={t("main-image")}
            boxText={
              selectedGiftEvent?.mainImage || isGiftEventWithMainImage
                ? t("gift-photo")
                : t("click-upload")
            }
            boxMobileText={
              selectedGiftEvent?.mainImage || isGiftEventWithMainImage
                ? t("gift-photo")
                : t("click-upload-main-image")
            }
            isMobile={!isNonMobile}
            eventPhoto={eventPhoto}
            setEventPhoto={setEventPhoto}
            isMultiple={false}
            isDisabled={selectedGiftEvent?.mainImage || isGiftEventWithMainImage}
            tooltipImageName={"event-main-image-example"}
          />
          {isEventPhotoError && isNextClicked && (
            <p className='error-message'>{t("event-photo-error")}</p>
          )}
        </div>
        {!isEdit && (
          <div className='upload-container'>
            <UploadImageBox
              title={t("event-watermark")}
              boxText={t("click-upload")}
              boxMobileText={t("click-upload-event-logo")}
              isMobile={!isNonMobile}
              eventPhoto={eventWatermark}
              setEventPhoto={setEventWatermark}
              isMultiple={false}
              isAcceptSvg={true}
              onChanges={() => setIsWaterMarkPreviewModalOpen(true)}
              className='image-contained'
              tooltipImageName={"event-watermark-example"}
            />
            {!!eventWatermark.length && (
              <Button
                classes={{ root: "watermark-button" }}
                variant='text'
                onClick={() => setIsWaterMarkPreviewModalOpen(true)}>
                {t("select-watermark-position-and-size")}
              </Button>
            )}
          </div>
        )}
      </div>
      <div className='divider' />
      <div className='event-social-branding'>
        <div className='title-contain'>
          <p className='title'>{t("event-social")}</p>
        </div>
        <div className='social-input-contain'>
          <CustomTextField
            isNonMobile={isNonMobile}
            variant='outlined'
            placeholder='www.'
            customHeight
            name='website'
            fullWidth
            value={website || ""}
            inputProps={{ maxLength: MAX_INPUT_LENGTH }}
            isLeftIcon={true}
            iconComponent={<img className='drive-img' src={globeSvg} alt='globe' />}
            onChange={(e) =>
              dispatch({
                type: FormActionType.SetField,
                field: "website",
                value: e.target.value,
              })
            }
            disabled={!!selectedGiftEvent?.website || giftFields?.includes("website")}
          />
        </div>
        <div className='social-input-contain'>
          <CustomTextField
            isNonMobile={isNonMobile}
            variant='outlined'
            placeholder='instagram.com/'
            customHeight
            name='instagram'
            fullWidth
            value={instagram || ""}
            inputProps={{ maxLength: MAX_INPUT_LENGTH }}
            isLeftIcon={true}
            iconComponent={<img className='drive-img' src={instagramSvg} alt='instagram' />}
            onChange={(e) =>
              dispatch({
                type: FormActionType.SetField,
                field: "instagram",
                value: e.target.value,
              })
            }
            disabled={!!selectedGiftEvent?.instagram || giftFields?.includes("instagram")}
          />
        </div>
        <div className='social-input-contain'>
          <CustomTextField
            isNonMobile={isNonMobile}
            variant='outlined'
            placeholder='facebook.com/'
            customHeight
            name='facebook'
            fullWidth
            value={facebook || ""}
            inputProps={{ maxLength: MAX_INPUT_LENGTH }}
            isLeftIcon={true}
            iconComponent={<img className='drive-img' src={facebookSvg} alt='facebook' />}
            onChange={(e) =>
              dispatch({
                type: FormActionType.SetField,
                field: "facebook",
                value: e.target.value,
              })
            }
            disabled={!!selectedGiftEvent?.facebook || giftFields?.includes("facebook")}
          />
        </div>
      </div>
      {isWaterMarkPreviewModalOpen && eventWatermark.length > 0 && (
        <DialogWatermarkPreview
          onClose={() => setIsWaterMarkPreviewModalOpen(false)}
          eventWatermark={eventWatermark[eventWatermark.length - 1]}
          watermarkPosition={watermarkPosition}
          setWatermarkPosition={setWatermarkPosition}
          eventWatermarkSize={eventWatermarkSize}
          setWatermarkSize={setWatermarkSize}
          removeWatermark={removeWatermark}
        />
      )}
    </div>
  );
};

export default DialogBranding;
