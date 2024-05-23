import { Dispatch, SetStateAction } from "react";
import {
  FavoriteBorderOutlined,
  FavoriteOutlined,
  FileDownload,
  DeleteOutlined,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getImgIdFromSrc, photoDownload } from "../../../../../../utils/helpers";
import { deletePhotos, setFavoritePhotos } from "../../../../../../api/events-api";
import { FAVORITE_LIMIT } from "../../images";
import { getEventIdFromPhotoUrl } from "../../icon-list";
import { useIzmeDialogContext } from "../../../../../../state/general-dialog-context";
import { useToasterContext } from "../../../../../../state/toaster-context";

export const DOWNLOAD_PHOTO_LIMIT = 10;

export const useIconListEditBar = (
  selectedArray: string[],
  favoriteArr: string[],
  setFavoriteArr: Dispatch<SetStateAction<string[]>>,
  currentSrc: string,
  setSelectedArr: Dispatch<SetStateAction<string[]>>,
  setPhotosList?: Dispatch<SetStateAction<string[]>>
) => {
  const { setDialogProps } = useIzmeDialogContext();
  const { setToasterProps } = useToasterContext();
  const { t } = useTranslation();

  const downloadSelectedPhotos = () => () =>
    selectedArray.slice(0, DOWNLOAD_PHOTO_LIMIT).forEach((item) => photoDownload(item));

  const handleDeleteSelected = () => () => {
    setDialogProps({
      type: "warning",
      title: t("delete-images"),
      message: t("delete-images-confirm", { number: selectedArray.length }),
      primaryButton: t("delete"),
      primaryButtonAction: deleteSelectedPhotos,
      secondaryButton: t("cancel"),
    });
  };

  const deleteSelectedPhotos = () => {
    const eventId = getEventIdFromPhotoUrl(selectedArray[0]);
    const photoIds = selectedArray.map((item) => getImgIdFromSrc(item));
    deletePhotos(eventId, photoIds);
    if (setPhotosList) {
      setPhotosList((prev) => prev.filter((item) => !photoIds.includes(getImgIdFromSrc(item))));
    }
    setSelectedArr([]);
    setToasterProps({
      text: t("images-deleted-successfully"),
      type: "success",
    });
  };

  const nonLikedImgs = selectedArray.filter((item) => !favoriteArr.includes(getImgIdFromSrc(item)));
  const isHearthDisabled = nonLikedImgs.length > FAVORITE_LIMIT - favoriteArr.length;

  const handleOnFavClick =
    (
      setFavoriteArr: Dispatch<SetStateAction<string[]>>,
      currentSrc: string,
      selectedArr: string[]
    ) =>
    () => {
      if (selectedArr.length < 1) return;
      const eventId = getEventIdFromPhotoUrl(currentSrc);
      const onlyLikedArr = selectedArr.filter((item) =>
        favoriteArr.includes(getImgIdFromSrc(item))
      );
      if (onlyLikedArr.length === selectedArr.length) {
        const removeArr = onlyLikedArr.map((item) => getImgIdFromSrc(item));
        try {
          setFavoritePhotos({
            eventId,
            photosToRemove: removeArr,
          });
          setFavoriteArr((prev: string[]) => prev.filter((item) => !removeArr.includes(item)));
        } catch (err) {
          console.warn(err);
        }
        return;
      }
      const onlyNotLikedArr = selectedArr.filter(
        (item) => !favoriteArr.includes(getImgIdFromSrc(item))
      );
      const addArr = onlyNotLikedArr.map((item) => getImgIdFromSrc(item));
      try {
        setFavoritePhotos({
          eventId,
          photosToAdd: addArr,
        });
        setFavoriteArr((prev) => [...prev, ...addArr]);
      } catch (err) {
        console.warn(err);
      }
    };

  return [
    {
      id: 1,
      icon:
        selectedArray.every((item) => favoriteArr.includes(getImgIdFromSrc(item))) &&
        selectedArray.length > 0 ? (
          <FavoriteOutlined />
        ) : (
          <FavoriteBorderOutlined />
        ),
      onClick: () => handleOnFavClick(setFavoriteArr, currentSrc, selectedArray),
      className: "",
      tooltip: t("like"),
      disabled: isHearthDisabled,
    },
    {
      id: 2,
      icon: <FileDownload />,
      onClick: downloadSelectedPhotos,
      tooltip: t("download"),
      className: selectedArray.length > DOWNLOAD_PHOTO_LIMIT ? "none" : "",
    },
    {
      id: 4,
      icon: <DeleteOutlined />,
      onClick: handleDeleteSelected,
      tooltip: t("delete"),
      className: "",
    },
  ];
};
