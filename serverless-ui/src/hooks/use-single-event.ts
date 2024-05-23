import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSingleEvent } from "../api/events-api";
import { GetSingleEventDTO } from "../types/event-dto";

const useSingleEvent = () => {
  const { nameUrl } = useParams();
  const [eventData, setEventData] = useState<GetSingleEventDTO>();
  const navigate = useNavigate();
  const called = useRef(false);

  const fetchEvent = async () => {
    try {
      const data = await getSingleEvent(nameUrl!);

      setEventData(data?.event);
    } catch (error) {
      navigate("/404", {
        replace: true,
      });
      console.error("something went wrong useSingleEvent");
    }
  };

  const liveUpdateEvent = (changes: any) => {
    if (changes.eventName) changes.name = changes.eventName;
    if (changes.eventDate) changes.event_date = changes.eventDate;
    setEventData((pre: any) => ({
      ...pre,
      ...changes,
    }));
  };

  useEffect(() => {
    if (called.current) return;
    if (!nameUrl || nameUrl === eventData?.name_url) return;
    called.current = true;
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameUrl]);

  return {
    currentEvent: eventData,
    liveUpdateEvent,
  };
};

export default useSingleEvent;
