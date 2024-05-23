import { useEffect, useMemo, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Button from "@mui/material/Button";
import { useDebounce } from "use-debounce";
import GenericEvent from "../../shared/generic-events/generic-event";
import IzmeCircularLoading from "../../shared/loading/circular";
import DataNotFound from "./events-not-found/events-not-found";
import { getEvents } from "../../api/events-api";
import "./events.scss";
import { Permission } from "../../types/user-dto";
import NoPermissionsTooltip from "../../shared/no-permissions-tooltip";
import { DataNotFoundType } from "../../types/event-dto";
import { useLoginStateContext } from "../../state/login-context";
import { useDialogContext } from "../../state/dialog-context";
import { GenericEventObj } from "../../types/generic-event";

const Events = () => {
  const { t } = useTranslation();
  const { handleClickOpen, lastCreateTime } = useDialogContext();
  const [events, setEvents] = useState<GenericEventObj[] | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [debouncedSearchText] = useDebounce(searchText, 300);
  const wasCall = useRef(false);
  const { userPayload, isAuthorized } = useLoginStateContext();
  const countGiftsEvents = userPayload?.giftsEvents?.length;
  const countGiftsEventsString = countGiftsEvents ? `(${countGiftsEvents})` : "";

  const handleGetEvents = async () => {
    const { events } = await getEvents();
    const resolveEvents: any = events.filter(Boolean).map((event: any) => ({
      ...event,
      numOfPhoto: event.total_photos || event.number_of_photos,
      date: event.event_date,
    }));
    setEvents(resolveEvents as GenericEventObj[]);
  };

  const filterEvents = (event: GenericEventObj) => {
    if (!debouncedSearchText) return true;
    return ["id", "name", "location"].some((key: string) =>
      ((event as any)[key] as string)?.toLowerCase().includes(debouncedSearchText.toLowerCase())
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const filteredEvents = useMemo(() => events?.filter(filterEvents), [events, debouncedSearchText]);
  const totalFilteredEventsString = filteredEvents?.length ? ` (${filteredEvents?.length})` : "";
  const eventsPerPage = 5;
  const [displayedEvents, setDisplayedEvents] = useState<GenericEventObj[]>(
    filteredEvents?.slice(0, eventsPerPage) || []
  );

  const onDeleteEvent = (id: string) => {
    setDisplayedEvents((prevEvents) => prevEvents?.filter((event) => event.id !== id) || []);
  };

  useEffect(() => {
    if (wasCall.current) return;
    wasCall.current = true;
    handleGetEvents();
  }, []);

  useEffect(() => {
    if (lastCreateTime) {
      setTimeout(() => {
        handleGetEvents();
      }, 6000);
    }
  }, [lastCreateTime]);

  useEffect(() => {
    if (!filteredEvents) return;
    const page = Math.max(Math.ceil(displayedEvents.length / eventsPerPage) - 1, 0);
    const firstDisplayedIndex =
      filteredEvents?.findIndex((event) => event.id === displayedEvents[0]?.id) || 0;
    const newEvents = firstDisplayedIndex > 0 ? filteredEvents?.slice(0, firstDisplayedIndex) : [];
    setDisplayedEvents([
      ...newEvents,
      ...filteredEvents.slice(newEvents.length, (page + 1) * eventsPerPage),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredEvents]);

  const resolvedEventsList = () => {
    if (!displayedEvents) return <IzmeCircularLoading />;
    if (displayedEvents.length === 0) {
      return (
        <DataNotFound
          fromSearch={displayedEvents.length > 0}
          handleClick={handleClickOpen}
          dataType={DataNotFoundType.Events}
        />
      );
    }
    return displayedEvents.map((item) => (
      <GenericEvent
        key={item.id}
        genericEventItem={item}
        onDeleteEvent={() => onDeleteEvent(item.id)}
      />
    ));
  };

  const handleLoadMoreEvents = () => {
    const page = Math.ceil(displayedEvents.length / eventsPerPage) + 1;
    const startIndex = (page - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const nextEvents = filteredEvents?.slice(startIndex, endIndex) || [];

    if (nextEvents.length > 0) {
      setDisplayedEvents((prevEvents) => [...prevEvents, ...nextEvents]);
    }
  };

  const isDisabled = !isAuthorized(Permission.CREATE_EVENTS);

  if (!events) return <IzmeCircularLoading />;

  return (
    <div className='main-container'>
      <div className='event-page-headline-wrapper'>
        <div className='header-text-wrapper'>
          <span className='head-bold-text no-wrap'>
            {t("manage-events")}
            {totalFilteredEventsString}
          </span>
          <span>{t("manage-events-desc")}</span>
        </div>
        <div className='search-bar-area-wrapper'>
          <div className='event-search-bar-wrapper'>
            <FormControl className='width100' variant='outlined'>
              <OutlinedInput
                className='event-search-bar'
                id='outlined-adornment-password'
                type='text'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder={t("search-event")}
                startAdornment={
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
          <NoPermissionsTooltip isDisabled={isDisabled}>
            <div className='event-create-button-wrapper'>
              <Button
                disabled={isDisabled}
                onClick={handleClickOpen}
                className='event-create-button'
                variant='contained'
                color='primary'
                startIcon={<AddCircleOutline />}
                sx={{
                  borderRadius: "8px",
                  span: {
                    marginRight: 0,
                    marginLeft: 0,
                  },
                }}>
                {`${t("create-event")} ${countGiftsEventsString}`}
              </Button>
            </div>
          </NoPermissionsTooltip>
        </div>
      </div>
      <Box className='width100'>
        <InfiniteScroll
          className='events-container width100'
          dataLength={displayedEvents.length}
          next={handleLoadMoreEvents}
          hasMore={(filteredEvents?.length || 0) > displayedEvents.length}
          loader={null}>
          {resolvedEventsList()}
        </InfiniteScroll>
      </Box>
    </div>
  );
};
export default Events;
