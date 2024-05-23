import { useState, useEffect, useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';
import { getEventRandomPhotos } from '../../api/events-api';

interface EventRandomPhotosProps {
  eventId: string;
  isMobile: boolean;
}

const ImagesSkeleton = ({ isMobile }: any) => (
  <Skeleton
    variant="rectangular"
    width="100%"
    height={isMobile ? 120 : 166}
    sx={{
      borderRadius: '8px',
    }}
  />
);

const EventRandomPhotos = ({ eventId, isMobile }: EventRandomPhotosProps): JSX.Element => {
  const EVENT_SLIDER_IMG_COUNT = isMobile ? 2 : 3;
  const [randomPhotos, setRandomPhotos] = useState<string[]>(
    Array(EVENT_SLIDER_IMG_COUNT).fill(''),
  );
  const wasCalled = useRef(false);

  const getPhotos = async () => {
    const { randomPhotos } = await getEventRandomPhotos(eventId);
    setRandomPhotos(randomPhotos);
  };
  useEffect(() => {
    if (wasCalled.current) return;
    wasCalled.current = true;
    getPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="photos-area">
      {randomPhotos?.slice(0, EVENT_SLIDER_IMG_COUNT).map((item, i) => (
        <div key={item || i} className="image-wrapper">
          {item ? (
            <img className="image-item" src={item} alt="item" />
          ) : (
            <ImagesSkeleton isMobile={isMobile} />
          )}
        </div>
      ))}
    </div>
  );
};

export default EventRandomPhotos;
