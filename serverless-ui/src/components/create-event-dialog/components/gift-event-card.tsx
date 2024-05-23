import React from "react";
import { useTranslation } from "react-i18next";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import { useDialogContext } from "../../../state/dialog-context";

interface GiftEventCardProps {
  giftEvent: any;
}

const GiftEventCard = ({ giftEvent }: GiftEventCardProps) => {
  const { t } = useTranslation();
  const { selectedGiftEvent, setSelectedGiftEvent } = useDialogContext();
  const { root, name, tokens, location, photographerName, logo, eventId, eventName, logoVersion } =
    giftEvent;
  const formattedTokens = tokens.toLocaleString("en-US");
  const isChecked = selectedGiftEvent?.eventId === eventId;

  return (
    <button
      className={`gift-event-card ${isChecked ? "selected" : ""}`}
      onClick={() => setSelectedGiftEvent(isChecked ? undefined : giftEvent)}>
      <div className='gift-event-card__title_container'>
        <div className='gift-event-card__title_wrapper'>
          {logo && (
            <img
              className='gift-event-organization-logo'
              src={`/organization-assets/resized/${root}/logo-${logoVersion}`}
              alt={`${name} event logo`}
            />
          )}
          <span className='gift-event-organization-name'> {name} </span>
        </div>
        <div className='gift-event-card__radio_wrapper'>
          {isChecked ? (
            <CheckCircleIcon color='primary' />
          ) : (
            <RadioButtonUncheckedIcon color='disabled' />
          )}
        </div>
      </div>
      <div className='gift-event-card__details_container'>
        <div className='gift-event-card__details_header'>
          <span className='gift-event-card__details_event_name'>{eventName}</span>
          <div className='gift-event-card__details_tokens'>
            <div className='gift-event-card__details_tokens_icon' />
            {t("x-tokens-available", { tokens: formattedTokens })}
          </div>
        </div>
        <div className='gift-event-card__details_body'>
          {location && (
            <span className='gift-event-card__details_event_location'>
              <LocationOnOutlinedIcon sx={{ fontSize: "0.875rem" }} />
              {location}
            </span>
          )}
          {photographerName && (
            <span className='gift-event-card__details_event_date'>
              <PhotoCameraOutlinedIcon sx={{ fontSize: "0.875rem" }} />
              {photographerName}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export default GiftEventCard;
