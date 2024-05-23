import React from "react";
import { useTranslation } from "react-i18next";
import IconButton from "@mui/material/IconButton";
import ClearOutlined from "@mui/icons-material/ClearOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Checkbox from "@mui/material/Checkbox";
import MyDropzone from "../components/drop-zone";

// import driveSvg from '/images/google_drive.svg';
import uploadIcon from "/images/upload-icon.svg";
import FileIcon from "/images/File-icon.svg";
import Check from "/images/check.svg";
import "../styles/dialog-upload-files.scss";
import {
  IzmeFile,
  FormAction,
  FormActionType,
  FormState,
} from "../../../shared/create-event-helpers";
import { MINIMUM_UPLOAD_PHOTOS } from "../../../utils/constants";

interface DialogUploadFilesProps {
  files: IzmeFile[];
  setFiles: React.Dispatch<React.SetStateAction<IzmeFile[]>>;
  formState: FormState;
  isNonMobile: boolean;
  dispatch: React.Dispatch<FormAction>;
  missingPhotos?: number;
  numberOfPhotos?: number;
  isNextClicked?: boolean;
  isEdit?: boolean;
  isWatermark?: boolean;
}

const DialogUploadFiles: React.FC<DialogUploadFilesProps> = ({
  isNonMobile,
  files,
  setFiles,
  formState,
  missingPhotos,
  numberOfPhotos,
  isNextClicked,
  isEdit,
  isWatermark,
  dispatch,
}) => {
  const { t } = useTranslation();

  const clearFiles = () => {
    setFiles([]);
  };

  const isShowTooMuchImagesToCompleteAlert =
    !!missingPhotos && (numberOfPhotos || 0) < (files ? files.length : 0);

  const addWatermarkToPhotosChangeHandler = () => {
    if (dispatch) {
      dispatch({
        type: FormActionType.SetIsAddWatermarkToPhotos,
        value: true,
      });
    }
  };

  const createFutureEventChangeHandler = () => {
    if (!formState.isFutureEvent && files.length) {
      clearFiles();
    }
    if (dispatch) {
      dispatch({
        type: FormActionType.SetIsFutureEvent,
        value: !(formState as FormState)?.isFutureEvent,
      });
    }
  };

  const addWatermarkToPhotosCheckboxRenderer = () => {
    if (!isEdit || !isWatermark) return null;
    return (
      <label className='add-watermark-to-photos'>
        <Checkbox
          sx={{
            padding: 0,
            marginInlineEnd: "0.5rem",
          }}
          checked={true}
          onChange={addWatermarkToPhotosChangeHandler}
        />
        <span>{t("add-watermark-to-images")}</span>
      </label>
    );
  };

  const createFutureEventCheckboxRenderer = () => {
    if (isEdit) return null;
    return (
      <label className='add-watermark-to-photos'>
        <Checkbox
          sx={{
            padding: 0,
            marginInlineEnd: "0.5rem",
          }}
          checked={(formState as FormState)?.isFutureEvent}
          onChange={createFutureEventChangeHandler}
        />
        <span>{t("create-future-event")}</span>
      </label>
    );
  };

  const isPublicEventCheckboxRenderer = () => {
    if (isEdit) return null;
    return (
      <label className='add-watermark-to-photos'>
        <Checkbox
          sx={{
            padding: 0,
            marginInlineEnd: "0.5rem",
          }}
          value={formState.isPublicEvent || false}
          onChange={(e) => {
            dispatch({
              type: FormActionType.SetIsPublicEvent,
              value: e.target.checked,
            });
          }}
        />
        <span>{t("is-public-event")}</span>
      </label>
    );
  };

  const isShowMinImagesError =
    !formState.isFutureEvent && files.length < MINIMUM_UPLOAD_PHOTOS && isNextClicked;

  return (
    <div
      className='container upload-files-container'
      style={{
        padding: isNonMobile ? "2rem" : "0.4rem",
      }}>
      {addWatermarkToPhotosCheckboxRenderer()}
      {/* import files from drive button */}
      {/* <div className="drive-contain">
        <CustomTextField
          isNonMobile={isNonMobile}
          variant="outlined"
          placeholder={t('google-drive-link')}
          name="driveLink"
          fullWidth
          isLeftIcon={true}
          iconComponent={<img className="drive-img" src={driveSvg} alt="drive" />}
          customHeight={true}
        />
      </div> */}

      {/* or line */}
      {/* <div className="or-line">
        <div className="or-line__line" />
        <span className="or-text">{t('OR')}</span>
        <div className="or-line__line" />
      </div> */}
      {isShowMinImagesError && (
        <span className='error-message'>
          {t("upload-at-least-images", {
            number: MINIMUM_UPLOAD_PHOTOS,
          })}
        </span>
      )}
      {/* import files from computer button */}
      <MyDropzone
        CustomAvatar={<img className='upload-icon' src={uploadIcon} alt='drive' />}
        files={files}
        setFiles={setFiles}
        multiple={true}
        dropZoneContainerStyles='dropzone-upload-container'
        dropZoneStyles=''
        isNonMobile={isNonMobile}
        isUpload={true}
        disabled={formState?.isFutureEvent}
      />
      {/* files dropped */}
      {files.length > 0 && !formState.isFutureEvent ? (
        <div className='files-container'>
          {files.length > 0 ? (
            <IconButton className='rmv-default clear-icon' onClick={clearFiles}>
              <ClearOutlined fontSize='small' />
            </IconButton>
          ) : null}
          <div className='row'>
            <img className='File-icon' src={FileIcon} alt='dsfaj' />
            <div className='text-container'>
              <span className='text'>{formState?.eventName}</span>
              <div className='dropzone-subtext'>
                <span>
                  {`${formState?.files
                    .reduce((acc, file) => acc + (file.sizeInMB || 0), 0)
                    .toFixed(2)} MB`}
                </span>
                <span>
                  {formState?.files.length} {t("images")}
                </span>
              </div>
            </div>
          </div>

          <button className='check rmv-default'>
            <img src={Check} alt='check' />
          </button>
        </div>
      ) : null}
      {createFutureEventCheckboxRenderer()}
      {isPublicEventCheckboxRenderer()}
      {/* missing photos alert */}
      {isShowTooMuchImagesToCompleteAlert && (
        <div className='selected-too-much-images-alert'>
          <WarningAmberIcon />
          <span className='selected-too-much-image'>{t("selected-too-much-image")}</span>
        </div>
      )}
    </div>
  );
};

export default DialogUploadFiles;
