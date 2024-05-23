import { memo, MouseEvent, useRef } from "react";
import { Box, Button, Card, ThemeProvider, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import CameraAltOutlined from "@mui/icons-material/CameraAltOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { EventBusy, MoreVertOutlined } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import dayjs from "dayjs";
import useGenericEventTheme from "./use-generic-event-theme";
import EventRandomPhotos from "./event-random-photos";
import { resolveImageUrlFunc } from "../../utils/helpers";
import ProfilePicture from "../profile-picture";
import "./generic-event.scss";
import GenericEventShortcutMenu from "./generic-event-shortcut-menu";
import { useLoginStateContext } from "../../state/login-context";
import { GenericEventObj } from "../../types/generic-event";

interface GenericEventProps {
  genericEventItem: GenericEventObj;
  onDeleteEvent: () => void;
}

const GenericEvent = ({ genericEventItem, onDeleteEvent }: GenericEventProps) => {
  const { t } = useTranslation();
  const { userPayload } = useLoginStateContext();
  const isMobile = useMediaQuery("(max-width:640px)");
  const theme = useGenericEventTheme();
  const { giftRoot } = genericEventItem;
  const resolveImageUrl = giftRoot
    ? resolveImageUrlFunc(giftRoot)
    : resolveImageUrlFunc(userPayload?.organization, genericEventItem.id);
  const formatDate = dayjs(genericEventItem.date).format("DD MMMM, YYYY");
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const shortcutMenuClickHandler = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    const target = e.currentTarget;
    if (target && target === lastFocusedElement.current) {
      target.blur();
      lastFocusedElement.current = null;
    } else {
      lastFocusedElement.current = target;
    }
  };

  const underLineDiv = (
    <div className='underline-wrapper'>
      <div className='user-info-wrapper'>
        <ProfilePicture />
        <span>{genericEventItem.username}</span>
      </div>
      <div className='underline-wrapper-buttons'>
        <Link
          to={`/events/${genericEventItem.id}?editEvent=true`}
          relative='path'
          className='edit-button'>
          <EditOutlined />
          {t("edit-event")}
        </Link>
        <IconButton
          className='menu-button'
          onClick={(e) => shortcutMenuClickHandler(e)}
          onBlur={() => (lastFocusedElement.current = null)}>
          <MoreVertOutlined />
        </IconButton>
        <GenericEventShortcutMenu
          genericEventItem={genericEventItem}
          onDeleteEvent={onDeleteEvent}
        />
      </div>
    </div>
  );

  const expirationDate = dayjs(genericEventItem.ttl * 1000).format("DD MMMM, YYYY");
  const isShowExpired = dayjs()
    .add(1, "month")
    .isAfter(dayjs(genericEventItem.ttl * 1000));

  return (
    <ThemeProvider theme={theme}>
      <Box className='event-container'>
        <Box className='details-wrapper'>
          <div className='header-wrapper'>
            <div className='logo-wrap'>
              <Link className='link-title' to={`/events/${genericEventItem.id}`} relative='path'>
                <img src={resolveImageUrl("logo", genericEventItem.logoVersion)} alt='profile' />
              </Link>
            </div>
            <Link className='link-title' to={`/events/${genericEventItem.id}`} relative='path'>
              <span className='typo-title'>
                {genericEventItem.name}
                <ExitToAppIcon
                  sx={{
                    fontSize: "1.1rem",
                  }}
                />
              </span>
            </Link>
            {isShowExpired && (
              <div className='expired-alert'>
                <EventBusy />
                <span className='info-item'>
                  {t("expire-on")}
                  {expirationDate}
                </span>
              </div>
            )}
            {!!genericEventItem.missingPhotos && (
              <Link
                to={`/events/${genericEventItem.id}?continueUpload=true`}
                className='missing-photos'>
                <WarningAmberIcon />
                <span>{t("missing-photos", { number: genericEventItem.missingPhotos })}</span>
              </Link>
            )}
          </div>
          <div className='info-wrapper'>
            {genericEventItem.location && (
              <span className='info-item'>
                <LocationOnOutlined />
                {genericEventItem.location}
              </span>
            )}
            <div className='date-location'>
              <span className='info-item'>
                <CalendarToday />
                {formatDate}
              </span>
              {genericEventItem.photographer_name && (
                <span className='info-item'>
                  <CameraAltOutlined />
                  {genericEventItem.photographer_name}
                </span>
              )}
            </div>
          </div>
          {isMobile ? "" : underLineDiv}
        </Box>
        <div className='photos-wrapper'>
          <Card
            className='card-photo-wrapper'
            sx={{
              borderRadius: "8px",
            }}>
            {genericEventItem.numOfPhoto > 0 ? (
              <div className='view-all-wrapper'>
                <span className='num-of-photos'>
                  {(
                    genericEventItem.numOfPhoto - (genericEventItem.missingPhotos || 0)
                  )?.toLocaleString()}{" "}
                  {t("image")}
                </span>
                <Link
                  className='link-title'
                  to={`/events/${genericEventItem.id}/images`}
                  relative='path'>
                  <Button className='view-all-button' size='medium' variant='contained'>
                    {t("view-all")}
                  </Button>
                </Link>
              </div>
            ) : (
              <span className='no-photos'>{t("no-images")}</span>
            )}
            {genericEventItem.numOfPhoto > 0 ? (
              <EventRandomPhotos eventId={genericEventItem.id} isMobile={isMobile} />
            ) : null}
          </Card>
        </div>
        {isMobile ? underLineDiv : ""}
      </Box>
    </ThemeProvider>
  );
};

export default memo(
  GenericEvent,
  (prevProps, nextProps) => prevProps.genericEventItem.id === nextProps.genericEventItem.id
);
