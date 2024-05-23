import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";
import heart from "/images/heart.svg";
import { AddCircleOutlineOutlined, DeleteOutlined, EventBusy } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import CameraFrontOutlinedIcon from "@mui/icons-material/CameraFrontOutlined";
import ConnectWithoutContactOutlinedIcon from "@mui/icons-material/ConnectWithoutContactOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import ImgUpload from "./components/img-upload/img-upload";
import CreateEventForm from "./components/create-form/create-event-form";
import { styles } from "./overview-styles";
import { deleteEvent } from "../../../../api/events-api";
import { resolveEventPhotosFunc } from "../../../../utils/helpers";
import "./overview.scss";
import StatisticBox from "./components/statistics-box/statistic-box";
import dayjs from "dayjs";
import { Checkbox } from "@mui/material";
import { useIzmeDialogContext } from "../../../../state/general-dialog-context";
import { useSingleEventContext } from "../../../../state/single-event-context";
import ImageCarousel from "../../../../shared/image-carousel/image-carousel";
import { useToasterContext } from "../../../../state/toaster-context";

interface OverviewProps {
  favoriteArr: string[];
  setFavoriteArr: Dispatch<SetStateAction<string[]>>;
}

const Overview = ({ favoriteArr, setFavoriteArr }: OverviewProps) => {
  const { t, i18n } = useTranslation();
  const { setDialogProps } = useIzmeDialogContext();
  const { setToasterProps } = useToasterContext();
  const { userPayload } = useStateContext();
  const navigate = useNavigate();

  console.log("number_of_photos");

  const {
    number_of_photos,
    total_photos,
    missingPhotos,
    selfies_taken,
    id,
    socialMediaClick,
    photoDownload,
    contactMeClick,
    nextEventClick,
    logoVersion,
    mainImageVersion,
    ttl,
    isPublicEvent: wasPublicEvent,
  } = useSingleEventContext();
  const [isPublicEvent, setIsPublicEvent] = useState(wasPublicEvent);

  // const [isNextPromotionFormOpen, setIsNextPromotionFormOpen] = useState<boolean>(
  //   !!nextEventPromotion
  // );
  // const handleFormClick = () => setIsNextPromotionFormOpen((prev) => !prev);

  const handleDeleteEvent = () => {
    setDialogProps({
      type: "success",
      title: t("delete-event"),
      message: t("delete-event-confirm"),
      primaryButton: t("delete"),
      primaryButtonAction: () =>
        deleteEvent(id)
          .then(() => {
            setToasterProps({
              type: "success",
              text: t("delete-event-success"),
            });
            navigate("/events");
          })
          .catch(() => {
            setToasterProps({
              type: "error",
              text: t("delete-event-error"),
            });
          }),
      secondaryButton: t("cancel"),
    });
  };
  const photosFunc = resolveEventPhotosFunc(userPayload?.organization, id);

  const expirationDate = dayjs(ttl * 1000).format("DD MMMM, YYYY");
  const isLastMonth = dayjs()
    .add(1, "month")
    .isAfter(dayjs(ttl * 1000));

  return (
    <div className='overview-wrapper flex-center-column'>
      <div className='first-row flex-center'>
        {favoriteArr.length > 0 ? (
          <ImageCarousel
            imgWidth={150}
            padding={16}
            images={favoriteArr.map((imgId: string) => photosFunc(imgId))}
            setFavoriteArr={setFavoriteArr}
          />
        ) : (
          <Box className='box-wrapper'>
            {t("click-on-the")} <img src={heart} alt='heart' />
            {t("button-images-tab")}
          </Box>
        )}
      </div>
      <div className='info-wrapper flex-center'>
        <StatisticBox
          icon={<PhotoLibraryOutlinedIcon sx={styles.icon("#E26EE5")} />}
          tooltip={t("total-images-description")}
          statisticData={(
            number_of_photos ||
            total_photos ||
            0 - (missingPhotos || 0)
          )?.toLocaleString()}
          text={t("total-images")}
        />
        <StatisticBox
          icon={<CameraFrontOutlinedIcon sx={styles.icon("#FFB534")} />}
          statisticData={selfies_taken?.toLocaleString()}
          tooltip={t("selfies-taken-description")}
          text={t("selfies-taken")}
        />

        <StatisticBox
          icon={<CloudDownloadOutlinedIcon sx={styles.icon("#39A7FF")} />}
          statisticData={photoDownload ? photoDownload.toLocaleString() : "0"}
          tooltip={t("photo-downloads-description")}
          text={t("photo-downloads")}
        />

        {socialMediaClick && (
          <StatisticBox
            icon={<Diversity1OutlinedIcon sx={styles.icon("#65B741")} />}
            statisticData={socialMediaClick}
            tooltip={t("social-media-description")}
            text={t("social-media")}
          />
        )}

        {/* {nextEventPromotion && nextEventClick && (
          <StatisticBox
            icon={<ConnectWithoutContactOutlinedIcon sx={styles.icon("#FC6736")} />}
            statisticData={nextEventClick}
            tooltip={t("event-promotion-description")}
            text={t("event-promotion")}
          />
        )} */}
        {contactMeClick && (
          <StatisticBox
            icon={<DraftsOutlinedIcon sx={styles.icon("#7E30E1")} />}
            statisticData={contactMeClick.toLocaleString()}
            tooltip={t("contact-me-description")}
            text={t("contact-me")}
          />
        )}
      </div>
      <Box className='flex-column shadow-box mobile-column'>
        <div className='flex-between gap1rem mobile-column'>
          <div className='event-branding-title'>
            <div className='bold'>
              {t("event-branding")}
              <span className='light-text'>({t("optional")})</span>
            </div>
            <div className='box-details'>{t("event-branding2-details")}</div>
          </div>
          {/* {isBrandingOpen ? (
            ''
          ) : (
            <button className="flex-center add-button" onClick={handleBrandingClick}>
              <AddCircleOutlineOutlined fontSize="small" />
              {t('add')}
            </button>
          )} */}
        </div>
        <ImgUpload logoVersion={logoVersion} mainImageVersion={mainImageVersion} />
      </Box>
      <Box className='flex-column shadow-box'>
        <div className='flex-between gap1rem mobile-column'>
          <div className='next-event-header'>
            <div>
              <div className='bold'>
                {t("next-event-promotion")}
                <span className='light-text'>({t("optional")})</span>
              </div>
              <div className='box-details'>{t("next-event-promotion-details")}</div>
            </div>
          </div>
          {/* {isNextPromotionFormOpen ? (
            ""
          ) : (
            <button className='flex-center add-button' onClick={handleFormClick}>
              <AddCircleOutlineOutlined fontSize='small' />
              {t("add")}
            </button>
          )} */}
        </div>
      </Box>
      <div className={`expired-alert ${isLastMonth ? "last-month" : ""}`}>
        <EventBusy />
        <span>
          {t("expire-on")}
          {expirationDate}
        </span>
      </div>
      <label className='add-watermark-to-photos'>
        <Checkbox
          sx={{
            padding: 0,
            marginInlineEnd: "0.5rem",
          }}
          defaultChecked={wasPublicEvent}
          value={isPublicEvent}
          onChange={(e) => {
            setIsPublicEvent(e.target.checked);
          }}
        />
        <span>{t("is-public-event")}</span>
      </label>
      <Button
        onClick={handleDeleteEvent}
        className='button-gap button-radius'
        variant='contained'
        sx={{
          width: "100%",
          maxWidth: "150px",
          backgroundColor: "var(--rose-50)",
          color: "var(--rose-700)",
          "&:hover": {
            backgroundColor: "var(--rose-100)",
          },
          display: "flex",
          gap: i18n.dir() === "rtl" ? "0.5rem" : "0",
        }}
        startIcon={
          <DeleteOutlined
            sx={{
              transform: "scaleX(-1)",
            }}
          />
        }>
        {t("delete-event")}
      </Button>
    </div>
  );
};

export default Overview;
function useStateContext(): { userPayload: any } {
  throw new Error("Function not implemented.");
}
