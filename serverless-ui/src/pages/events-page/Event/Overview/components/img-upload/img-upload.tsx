import { useState } from "react";
import { Button, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import UploadImageBox from "../../../../../../shared/upload-image-box/upload-image-box";
import { uploadBrandedImage } from "../../../../../../api/events-api";

import { resolveImageUrlFunc } from "../../../../../../utils/helpers";
import "./img-upload.scss";
import { IzmeFile } from "../../../../../../shared/create-event-helpers";
import { useLoginStateContext } from "../../../../../../state/login-context";
import { useSingleEventContext } from "../../../../../../state/single-event-context";

interface ImgUploadProps {
  logoVersion?: number;
  mainImageVersion?: number;
}

const ImgUpload = ({ logoVersion, mainImageVersion }: ImgUploadProps) => {
  const { t } = useTranslation();
  const { id } = useSingleEventContext();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [localLogoUpload, setLocalLogoUpload] = useState<IzmeFile[]>([]);
  const [localMainImageUpload, setLocalMainImageUpload] = useState<IzmeFile[]>([]);
  const { userPayload } = useLoginStateContext();
  const resolveImageUrl = resolveImageUrlFunc(userPayload?.organization, id || "");

  const isMobile = useMediaQuery("(max-width:960px)");

  const handleOnSave = async () => {
    if (localLogoUpload.at(-1)) {
      const { success } = await uploadBrandedImage(
        localLogoUpload.at(-1) || localLogoUpload[0],
        "logo",
        id
      );
      if (success) {
        setIsEdit(false);
      }
    }
    if (localMainImageUpload.at(-1)) {
      const { success } = await uploadBrandedImage(
        localMainImageUpload.at(-1) || localMainImageUpload[0],
        "mainImage",
        id
      );
      if (success) {
        setIsEdit(false);
      }
    }
  };

  return (
    <div className='wrapper-img-upload'>
      <div className='flex gap1rem upload-wrapper width100 mobile-flex-column flex-center'>
        <UploadImageBox
          title={t("logo")}
          boxText={t("click-upload")}
          boxMobileText={t("click-upload-event-logo")}
          isMobile={isMobile}
          eventPhoto={localLogoUpload}
          setEventPhoto={setLocalLogoUpload}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          currentImgSrc={resolveImageUrl("logo", logoVersion)}
        />
        <UploadImageBox
          title={t("main-image")}
          boxText={t("click-upload")}
          boxMobileText={t("click-upload-main-image")}
          isMobile={isMobile}
          eventPhoto={localMainImageUpload}
          setEventPhoto={setLocalMainImageUpload}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          currentImgSrc={resolveImageUrl("mainImage", mainImageVersion)}
        />
      </div>
      {isEdit && (
        <div className='width100 flex flex-right-row buttons-area'>
          <div className='flex save-cancel-btn-wrapper gap1rem'>
            <Button
              color='secondary'
              onClick={() => setIsEdit(false)}
              className='secondary-button button-gap width100 no-wrap max-width100 border-radius6 bold600 button-padding cancel'
              variant='contained'>
              {t("cancel")}
            </Button>
            <Button
              type='submit'
              onClick={handleOnSave}
              className='button-gap width100 no-wrap max-width150 border-radius8 bold600 save'
              variant='contained'
              sx={{
                borderRadius: "8px",
              }}>
              {t("save-changes")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImgUpload;
