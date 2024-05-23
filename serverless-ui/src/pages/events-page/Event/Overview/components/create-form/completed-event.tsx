import { Box } from "@mui/system";
import { Button } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import editIcon from "/images/edit.svg";
import { useTranslation } from "react-i18next";
import "./completed-event.scss";
import { INextEvent } from "../../../../../../types/event-dto";

interface CompletedEventProps {
  eventData: INextEvent;
  nextEventImg: string;
  editFunc: React.Dispatch<React.SetStateAction<boolean>>;
}

const CompletedEvent = ({ eventData, nextEventImg, editFunc }: CompletedEventProps) => {
  const { t } = useTranslation();

  const handleEdit = () => editFunc(true);

  return (
    <div className='completed-event-wrapper'>
      <Box className='box-wrapper'>
        <div className='flex gap1rem mobile-column'>
          <div className='img-wrapper'>
            <img src={nextEventImg} alt='event' />
          </div>
          <div className='event-info-wrapper'>
            <span className='title'>{eventData.name}</span>
            <span className='info-item'>
              <LocationOnOutlined />
              {eventData.location}
            </span>
            <span className='info-item'>
              <CalendarToday />
              {eventData.date.toString()}
            </span>
          </div>
        </div>
        <div className='btn-wrapper'>
          <Button
            variant='text'
            className='edit-btn'
            startIcon={<img className='edit-icon' src={editIcon} alt='edit' />}
            onClick={handleEdit}>
            {t("edit-event")}
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default CompletedEvent;
