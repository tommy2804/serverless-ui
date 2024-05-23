/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Tooltip, useMediaQuery } from "@mui/material";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import IzmeCircularLoading from "../../../shared/loading/circular";
import { resolveImageUrlFunc } from "../../../utils/helpers";
import EnlargedImage from "./Images/components/enlargedImage/enlarged-image";
import { GetIconsListPhoto } from "./Images/icon-list";
import EventTabs from "./Tabs/tabs";
import "./current-event.scss";
import { Permission } from "../../../types/user-dto";
import NoPermissionsTooltip from "../../../shared/no-permissions-tooltip";
import useSingleEvent from "../../../hooks/use-single-event";
import { useLoginStateContext } from "../../../state/login-context";
import { SingleEventContext } from "../../../state/single-event-context";

const CurrentEvent = () => {
  const { currentEvent, liveUpdateEvent } = useSingleEvent();
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width:960px)");
  const [isEnlarged, setIsEnlarged] = useState<string>("");
  const { userPayload, isAuthorized } = useLoginStateContext();
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const isEditEventAuthorized = isAuthorized(Permission.MANAGE_EVENTS);
  const iconList = GetIconsListPhoto([1], () => setIsEnlarged(""));

  if (!currentEvent) {
    return <IzmeCircularLoading />;
  }

  const closeEnlargedImage = (): void => {
    setIsEnlarged("");
  };

  const { hostname } = location;
  const domain = hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);

  const openEnlargedImage = (type: "logo" | "mainImage"): void => {
    const version = type === "logo" ? currentEvent.logoVersion : currentEvent.mainImageVersion;
    const typeWithVersion = version ? `${type}-${version}` : type; // for backward compatibility
    setIsEnlarged(typeWithVersion);
  };
  const { giftRoot } = currentEvent;

  const resolveImageUrl = giftRoot
    ? resolveImageUrlFunc(giftRoot)
    : resolveImageUrlFunc(userPayload?.organization, currentEvent.id);

  return (
    <SingleEventContext.Provider value={currentEvent}>
      <div className='main-container current-event'>
        {isEnlarged ? (
          <EnlargedImage
            iconList={iconList}
            closeFunc={closeEnlargedImage}
            isEnlarged={!!isEnlarged}
            imgSrc={resolveImageUrl(isEnlarged)}
          />
        ) : (
          ""
        )}

        <div className='header flex-center-column'>
          <div className='cover-image' onClick={() => openEnlargedImage("mainImage")}>
            <img
              className='cover-image'
              src={resolveImageUrl("mainImage", currentEvent.mainImageVersion)}
              alt='cover'
            />
          </div>
          <div className='body-wrapper'>
            <div className='bottom-header flex-center'>
              <div className='header-left-fixed'>
                <div className='logo-container'>
                  <div onClick={() => openEnlargedImage("logo")} className='logo-wrap'>
                    <img src={resolveImageUrl("logo", currentEvent.logoVersion)} alt='profile' />
                  </div>
                </div>
                <div className='info-header-wrapper flex'>
                  <div className='header-text-wrapper'>
                    <span className='title'>
                      {currentEvent.name}
                      <Tooltip title={t("go-to-guest")}>
                        <a
                          href={`https://${domain}/${currentEvent.id}?lang=${i18n.language}`}
                          target='_blank'
                          className='link-a'>
                          <LaunchOutlinedIcon
                            color='primary'
                            sx={{
                              fontSize: "1rem",
                              "&:hover": {
                                color: "black",
                              },
                            }}
                          />
                        </a>
                      </Tooltip>
                    </span>
                    <div className='small-details-wrapper'>
                      {currentEvent.location && (
                        <span className='info-item'>
                          <LocationOnOutlined />
                          {currentEvent.location}
                        </span>
                      )}
                      {!isMobile && currentEvent.location && currentEvent.event_date ? "|" : ""}
                      <span className='info-item'>
                        <CalendarToday />
                        {new Date(currentEvent.event_date).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='current-event-buttons-wrapper'>
                <NoPermissionsTooltip isDisabled={!isEditEventAuthorized}>
                  <Button
                    disabled={!isEditEventAuthorized}
                    color='secondary'
                    onClick={() => setIsEditEventDialogOpen(true)}
                    className='secondary-button button-gap event-button'
                    variant='contained'
                    startIcon={<img className='search-icon' src='/images/edit-icon.svg' alt='' />}>
                    {t("edit-event-details")}
                  </Button>
                </NoPermissionsTooltip>
                <Link
                  className='link-title event-button'
                  to={`/events/${currentEvent.id}/share`}
                  relative='path'>
                  <Button
                    className='button-gap button-radius'
                    variant='contained'
                    sx={{
                      width: "100%",
                    }}
                    startIcon={<img className='search-icon' src='/images/share-icon.svg' alt='' />}>
                    {t("share-event")}
                  </Button>
                </Link>
              </div>
            </div>
            <div className='current-event-tabs flex-center-column width100'>
              <EventTabs favorite_photos={currentEvent?.favorite_photos} />
            </div>
          </div>
        </div>
      </div>
    </SingleEventContext.Provider>
  );
};

export default CurrentEvent;
