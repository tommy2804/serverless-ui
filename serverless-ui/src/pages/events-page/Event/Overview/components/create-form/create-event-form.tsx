import { useState } from "react";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { AddPhotoAlternateOutlined } from "@mui/icons-material";
import { Button, CircularProgress, useMediaQuery } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CompletedEvent from "./completed-event";
import {
  createNextEventPromotion,
  deleteNextEventPromotion,
  uploadBrandedImage,
} from "../../../../../../api/events-api";
import { INextEvent } from "../../../../../../types/event-dto";
import { resolveImageUrlFunc } from "../../../../../../utils/helpers";
import "./create-event-form.scss";
import MyDropzone from "../../../../../../components/create-event-dialog/components/drop-zone";
import { CustomAvatar } from "../../../../../../components/input";
import { IzmeFile } from "../../../../../../shared/create-event-helpers";
import { useLoginStateContext } from "../../../../../../state/login-context";
import { useSingleEventContext } from "../../../../../../state/single-event-context";

const emptyState: INextEvent = {
  name: "",
  date: "",
  location: "",
  website: "",
};

interface CreateEventFormProps {
  closeFunc: () => void;
}

const CreateEventForm = ({ closeFunc }: CreateEventFormProps) => {
  const { register, handleSubmit, control } = useForm();
  const { id, nextEventPromotion } = useSingleEventContext();
  const [isEventEdit, setIsEventEdit] = useState<boolean>(false);
  const [nextEventData, setNextEventData] = useState<INextEvent>(
    nextEventPromotion ? JSON.parse(nextEventPromotion) : emptyState
  );

  const [nextEventImg, setNextEventImg] = useState<IzmeFile[]>([]);
  const [isCreatingEvent, setIsCreatingEvent] = useState<boolean>(false);

  const { t } = useTranslation();
  const currImg: IzmeFile = nextEventImg.at(-1) || nextEventImg[0];
  const { userPayload } = useLoginStateContext();
  const imgUrlFunc = resolveImageUrlFunc(userPayload?.organization, id);

  const onSubmit = async (data: SubmitHandler<INextEvent> | INextEvent) => {
    setIsCreatingEvent(true);
    let imagUpload;
    if (currImg) {
      imagUpload = uploadBrandedImage(currImg, "next-event-logo", id);
    } else if (!nextEventPromotion) {
      return;
    }
    const [nextEventReponse] = await Promise.all([
      createNextEventPromotion(id, data as INextEvent),
      imagUpload,
    ]);
    if (nextEventReponse.success) {
      setNextEventData(data as INextEvent);
      setIsEventEdit(false);
    }
    setIsCreatingEvent(false);
  };
  const isMobile = useMediaQuery("(max-width:960px)");
  const today = dayjs();

  const photoUpload = (isExist: boolean) => {
    const src = nextEventImg?.length > 0 ? currImg?.preview : imgUrlFunc("next-event-logo");
    if (nextEventImg?.length > 0 || isExist) {
      return (
        <img
          src={src} // url for the new added photo
          alt='Preview'
        />
      );
    }
    return <AddPhotoAlternateOutlined color='action' sx={{ fontSize: 22 }} />;
  };

  return (
    <form className='form' onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)}>
      {(!!nextEventPromotion || !!nextEventData?.name) && !isEventEdit ? (
        <CompletedEvent
          eventData={nextEventData}
          nextEventImg={currImg?.preview || imgUrlFunc("next-event-logo")}
          editFunc={setIsEventEdit}
        />
      ) : (
        <>
          <div className='flex gap1rem'>
            <span className='form-item'>
              <label>{t("event-name")}</label>
              <input
                className='input'
                type='text'
                defaultValue={nextEventData.name}
                required
                placeholder={t("event-name-place-holder")}
                minLength={2}
                {...register("name")}
              />
            </span>
            <span className='form-item'>
              <label>{t("event-date")}</label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  control={control}
                  name='date'
                  defaultValue={dayjs(today)}
                  render={({ field }) => (
                    <DatePicker
                      className='date-picker'
                      minDate={today}
                      value={field.value || dayjs(nextEventData.date)}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      format='YYYY-MM-DD'
                    />
                  )}
                />
              </LocalizationProvider>
            </span>
          </div>
          <div className='flex gap1rem'>
            <span className='form-item'>
              <label>{t("event-location")}</label>
              <input
                className='input'
                type='text'
                defaultValue={nextEventData.location}
                placeholder={t("location")}
                required
                minLength={2}
                {...register("location")}
              />
            </span>
            <span className='form-item'>
              <label>{t("event-website")}</label>
              <input
                className='input'
                type='text'
                defaultValue={nextEventData.location}
                placeholder='example.com'
                required
                minLength={2}
                {...register("website")}
              />
            </span>
          </div>
          <div className='dropzone-wrapper'>
            <label>{t("branded-image")}</label>
            <MyDropzone
              CustomAvatar={<CustomAvatar>{photoUpload(!!nextEventPromotion)}</CustomAvatar>}
              files={nextEventImg}
              setFiles={setNextEventImg}
              isNonMobile={!isMobile}
              multiple={false}
            />
          </div>
          <div className='flex-between form-btns-wrapper'>
            <div className='flex save-cancel-wrapper gap1rem'>
              <Button
                color='secondary'
                onClick={() => {
                  setIsEventEdit(false);
                  if (!nextEventPromotion) closeFunc();
                }}
                className='secondary-button button-gap width100 no-wrap border-radius6 bold600 button-padding cancel'
                variant='contained'>
                {t("cancel")}
              </Button>
              <Button
                type='submit'
                className={`button-gap width100 no-wrap border-radius6 bold600 button-padding save${
                  isCreatingEvent ? " loading" : ""
                }`}
                variant='contained'
                disabled={isCreatingEvent}>
                {isCreatingEvent ? (
                  <CircularProgress size={16} sx={{ color: "white" }} />
                ) : (
                  t("save-changes")
                )}
              </Button>
            </div>
            <div className='create-event-btn-wrapper'>
              {nextEventPromotion && (
                <Button
                  onClick={() => {
                    setIsEventEdit(false);
                    deleteNextEventPromotion(id);
                    closeFunc();
                  }}
                  className='pale-pink-button space'
                  variant='contained'
                  startIcon={<DeleteOutlineIcon />}>
                  {t("delete-event-promotion")}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </form>
  );
};

export default CreateEventForm;
