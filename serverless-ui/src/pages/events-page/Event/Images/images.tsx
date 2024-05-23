import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SingleImage from "./components/singleImage/single-image";
import useEventPhotos from "./hooks/use-event-photos";

import { resolveEventPhotosFunc } from "../../../../utils/helpers";
import EditBar from "./components/editBar/edit-bar";
import IzmeCircularLoading from "../../../../shared/loading/circular";
import EnlargedImage from "./components/enlargedImage/enlarged-image";
import "./images.scss";
import { DialogWindow } from "../../../../shared/create-event-helpers";
import { useLoginStateContext } from "../../../../state/login-context";
import { useSingleEventContext } from "../../../../state/single-event-context";

export const FAVORITE_LIMIT = 20;

interface ImagesProps {
  favoriteArr: string[];
  setFavoriteArr: Dispatch<SetStateAction<string[]>>;
  isContinueUpload?: boolean;
}

const Images = ({ favoriteArr, setFavoriteArr, isContinueUpload }: ImagesProps) => {
  const [selectedArray, setSelectedArray] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isEnlarged, setIsEnlarged] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const { id, missingPhotos, total_photos, number_of_photos } = useSingleEventContext();
  const { t } = useTranslation();
  const { photos, handleNextScroll, lastKey } = useEventPhotos();
  const { userPayload } = useLoginStateContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const isMissingImages = !!missingPhotos;
  const [photosList, setPhotosList] = useState<string[]>([]);

  const photosFunc = resolveEventPhotosFunc(userPayload?.organization, id);

  const handleCancelClick = () => {
    setSelectedArray([]);
    setIsEditMode(false);
  };

  const handleCloseEnlarged = () => {
    setIsEnlarged(false);
  };

  const selectImagesButtonClickHandler = () => {
    if (isEditMode) {
      setSelectedArray([]);
      setIsEditMode(false);
    } else {
      setIsEditMode(true);
    }
  };

  useEffect(() => {
    setPhotosList(photos);
  }, [photos]);

  useEffect(() => {
    if (isMissingImages) {
      searchParams.set("continueUpload", "true");
      const newUrl = `${location.pathname}?${searchParams.toString()}`;
      navigate(newUrl, { replace: true });
    } else {
      searchParams.delete("continueUpload");
      const newUrl = `${location.pathname}?${searchParams.toString()}`;
      navigate(newUrl, { replace: true });
    }
    // if (isContinueUpload && isMissingImages) {
    //   completeUploadHandler();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!photos) {
    return (
      <div className='loading-images-wrapper'>
        <IzmeCircularLoading />
      </div>
    );
  }

  return (
    <div ref={containerRef} className='images-tab-wrapper'>
      <div className='images-top-row'>
        <span>
          {total_photos || number_of_photos} {t("images")}
          {/* {isMissingImages && (
            <Button onClick={completeUploadHandler} className='missing-photos-alert'>
              <WarningAmberIcon />
              <span>{t("missing-photos", { number: missingPhotos })}</span>
            </Button>
          )} */}
        </span>
        <div className='buttons-container'>
          <button className='select-images-button' onClick={selectImagesButtonClickHandler}>
            {isEditMode ? t("done") : t("select")}
          </button>
          {/* <button className='pale-pink-button' onClick={handleAddImages}>
            {isMissingImages ? t("complete-image-upload") : t("add-images")}
          </button> */}
        </div>
      </div>
      <div className='scroll-container'>
        <InfiniteScroll
          className='images-container'
          dataLength={photosList.length}
          next={handleNextScroll}
          hasMore={lastKey !== null}
          loader={<CircularProgress />}>
          {photosList.map((item) => (
            <SingleImage
              key={item}
              imgSrc={photosFunc(item)}
              isEnlarged={isEnlarged}
              setIsEnlarged={setIsEnlarged}
              isEditMode={isEditMode}
              setIsEditMode={setIsEditMode}
              selectedArray={selectedArray}
              setSelectedArray={setSelectedArray}
              setCurrentSrc={setCurrentSrc}
              favoriteArr={favoriteArr}
            />
          ))}
        </InfiniteScroll>
      </div>
      {isEditMode && (
        <EditBar
          selectedArray={selectedArray}
          favoriteArr={favoriteArr}
          handleCancelClick={handleCancelClick}
          setFavoriteArr={setFavoriteArr}
          currentSrc={currentSrc}
          setSelectedArray={setSelectedArray}
          setPhotosList={setPhotosList}
        />
      )}
      {isEnlarged && (
        <EnlargedImage
          setIsEnlarged={setIsEnlarged}
          closeFunc={handleCloseEnlarged}
          isEnlarged={isEnlarged}
          setFavoriteArr={setFavoriteArr}
          imgSrc={currentSrc}
          favoriteArr={favoriteArr}
          setPhotosList={setPhotosList}
        />
      )}
    </div>
  );
};

export default Images;
