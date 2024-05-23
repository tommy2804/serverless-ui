import React from "react";

import GiftEventCard from "../components/gift-event-card";

import "../styles/dialog-gifts.scss";
import { GiftEvent } from "../../../shared/create-event-helpers";
import { useLoginStateContext } from "../../../state/login-context";

const DialogGifts = () => {
  const { userPayload } = useLoginStateContext();

  return (
    <div className='form-container dialog-gifts'>
      {userPayload?.giftsEvents.map((giftEvent: GiftEvent) => (
        <GiftEventCard key={giftEvent.eventId} giftEvent={giftEvent} />
      ))}
    </div>
  );
};

export default DialogGifts;
