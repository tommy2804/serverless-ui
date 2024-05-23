import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getEventPhotos } from '../../../../../api/events-api';

const useEventPhotos = () => {
  const { nameUrl } = useParams();
  const [eventPhotos, setEventPhotos] = useState<string[]>([]);
  const [lastKey, setLastKey] = useState<string>();
  const called = useRef(false);

  const fetchPhotos = async () => {
    if (!lastKey && called.current) return; // only first time should fetch without lastKey
    called.current = true;
    try {
      const data = await getEventPhotos(nameUrl!, lastKey);
      if (data?.photos) {
        setEventPhotos((pre) => [...(pre || []), ...(data.photos as string[])]);
        setLastKey(data.lastKey as string);
      }
    } catch (error) {
      console.error('something went wrong useSingleEvent');
    }
  };

  useEffect(() => {
    if (called.current) return;
    if (!nameUrl) return;
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameUrl]);

  return {
    photos: eventPhotos,
    handleNextScroll: fetchPhotos,
    lastKey,
  };
};

export default useEventPhotos;
