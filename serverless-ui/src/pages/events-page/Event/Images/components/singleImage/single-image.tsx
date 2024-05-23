import { Dispatch, SetStateAction, useRef, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { CheckCircle, RadioButtonUnchecked, FavoriteOutlined } from '@mui/icons-material';
import './single-image.scss';
import { getImgIdFromSrc } from '../../../../../../utils/helpers';

interface SingleImageProps {
  imgSrc: string;
  isEnlarged: boolean;
  setIsEnlarged: Dispatch<SetStateAction<boolean>>;
  isEditMode: boolean;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
  selectedArray: string[];
  setSelectedArray: Dispatch<SetStateAction<string[]>>;
  setCurrentSrc: Dispatch<SetStateAction<string>>;
  favoriteArr: string[];
}

const SingleImage = ({
  imgSrc,
  isEnlarged,
  setIsEnlarged,
  isEditMode,
  setIsEditMode,
  selectedArray,
  setSelectedArray,
  setCurrentSrc,
  favoriteArr,
}: SingleImageProps) => {
  const [isLongPress, setIsLongPress] = useState<boolean>(false);
  const timerRefMobile = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const isChecked = selectedArray.includes(imgSrc);
  const isImgFavorite = favoriteArr.includes(getImgIdFromSrc(imgSrc));

  const handleImageClick = () => {
    if (!imgSrc) return;
    if (!isEditMode) setIsEditMode(true);
    if (selectedArray.includes(imgSrc)) {
      setSelectedArray((prev) => prev.filter((item) => item !== imgSrc));
    } else {
      setSelectedArray((prev) => [...prev, imgSrc]);
    }
  };

  const handleOnMouseDown = () => {
    setCurrentSrc(imgSrc);
    setIsLongPress(false);
    if (isEditMode) {
      handleImageClick();
    }

    timerRef.current = setTimeout(() => {
      if (!isEditMode && !isEnlarged) {
        setIsLongPress(true);
        handleImageClick();
        setIsEditMode(true);
      }
    }, 500);
  };

  const handleOnMouseUp = () => {
    clearTimeout(timerRef.current);
    if (!isLongPress && !isEditMode) {
      setIsEditMode(false);
      setIsEnlarged(true);
    }
  };

  const handleTouchStart = () =>
    (timerRefMobile.current = setTimeout(() => {
      setIsEditMode(false);
      setIsEnlarged(true);
    }, 500));

  const handleTouchEnd = () => clearTimeout(timerRefMobile.current);

  return (
    <div
      className={`single-image-wrapper ${isChecked ? 'selected' : ''}`}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isEditMode && (
        <Checkbox
          className="check-box"
          icon={<RadioButtonUnchecked />}
          checkedIcon={<CheckCircle />}
          checked={isChecked}
        />
      )}
      <img draggable={false} src={imgSrc} alt="in-gallery" className="image-gallery" />
      {isImgFavorite ? <FavoriteOutlined className="liked-svg" /> : <span />}
    </div>
  );
};

export default SingleImage;
