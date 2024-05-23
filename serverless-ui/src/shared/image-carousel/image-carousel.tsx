import { useLayoutEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import { IconButton } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import EnlargedImage from "../../pages/events-page/Event/Images/components/enlargedImage/enlarged-image";
import { GetIconsListPhoto } from "../../pages/events-page/Event/Images/icon-list";
import { getImgIdFromSrc } from "../../utils/helpers";
import "./image-carousel.scss";

interface ImageCarouselProps {
  images: string[];
  imgWidth: number;
  padding: number;
  setFavoriteArr: Dispatch<SetStateAction<string[]>>;
}

const ImageCarousel = ({ images, imgWidth, padding, setFavoriteArr }: ImageCarouselProps) => {
  const [fullyDisplayedImages, setFullyDisplayedImages] = useState<number>(0);
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [isEnlarged, setIsEnlarged] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const numOfImagesInCarousel = images.length;
  const carouselWidth = (imgWidth + padding) * numOfImagesInCarousel + padding;
  const isArrows = numOfImagesInCarousel > fullyDisplayedImages;
  const isNextArrowDisabled = index === images.length - fullyDisplayedImages;
  const isPrevArrowDisabled = index === 0;
  const iconList = GetIconsListPhoto(
    [1, 2, 3, 4],
    setIsEnlarged!,
    currentSrc,
    images.map((item) => getImgIdFromSrc(item)),
    setFavoriteArr
  );

  useLayoutEffect(() => {
    if (!carouselRef.current) return;
    const { width } = carouselRef.current.getBoundingClientRect();
    setFullyDisplayedImages(Math.floor(width / (imgWidth + padding)));
  }, [fullyDisplayedImages, images, imgWidth, padding]);

  const toggleEnlargeImage = () => setIsEnlarged((prev) => !prev);

  const handleImageClick = (imgSrc: string) => () => {
    setCurrentSrc(imgSrc);
    toggleEnlargeImage();
  };

  const handlePrev = () => {
    setIndex(
      (prev) =>
        (prev + images.length - fullyDisplayedImages) % (images.length - fullyDisplayedImages + 1)
    );
  };

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % (images.length - fullyDisplayedImages + 1));
  };

  const transformValue = `translateX(${-index * (100 / numOfImagesInCarousel)}%)`;

  return (
    <div ref={carouselRef} className='carousel-container'>
      {isEnlarged ? (
        <EnlargedImage
          iconList={iconList}
          closeFunc={toggleEnlargeImage}
          isEnlarged={isEnlarged}
          imgSrc={currentSrc}
        />
      ) : (
        ""
      )}
      {isArrows && !isPrevArrowDisabled ? (
        <IconButton className='carousel-button carousel-prev' onClick={handlePrev}>
          <NavigateNext />
        </IconButton>
      ) : (
        <div />
      )}
      <div className='carousel-wrapper'>
        <div
          className='carousel-images'
          style={{ transform: transformValue, width: carouselWidth }}>
          {images.map((image) => (
            <div key={image} onClick={handleImageClick(image)} className='sliding-image-item'>
              <img src={image} alt='sliding-item' />
            </div>
          ))}
        </div>
      </div>
      {isArrows && !isNextArrowDisabled ? (
        <IconButton className='carousel-button carousel-next' onClick={handleNext}>
          <NavigateNext />
        </IconButton>
      ) : (
        <div />
      )}
    </div>
  );
};

export default ImageCarousel;
