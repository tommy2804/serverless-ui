import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  CloseOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  FileDownload,
  DeleteOutlined,
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { getImgIdFromSrc, photoDownload } from "../../../../utils/helpers";
import { deletePhotos, setFavoritePhotos } from "../../../../api/events-api";
import { useToasterContext } from "../../../../state/toaster-context";
import { useIzmeDialogContext } from "../../../../state/general-dialog-context";

export interface IconObj {
  id: number;
  icon: ReactNode;
  onClick: any;
  className: string;
  tooltip: string;
  disabled?: boolean;
}

export const getEventIdFromPhotoUrl = (photoUrl: string): string => photoUrl.split("/")[3];

export const GetIconsListPhoto = (
  idsList: number[],
  setIsEnlarged: Dispatch<SetStateAction<boolean>>,
  fileName?: string,
  favoriteArr?: string[],
  setFavoriteArr?: Dispatch<SetStateAction<string[]>>,
  setPhotosList?: Dispatch<SetStateAction<string[]>>,
  closeFunc?: () => void
) => {
  const isLiked = favoriteArr?.includes(getImgIdFromSrc(fileName || ""));
  const { setDialogProps } = useIzmeDialogContext();
  const { setToasterProps } = useToasterContext();
  const { t } = useTranslation();

  const handleLike = (photoUrl: string) => () => {
    const eventId = getEventIdFromPhotoUrl(photoUrl);
    if (!setFavoriteArr) return;
    if (isLiked) {
      setFavoritePhotos({
        eventId,
        photosToRemove: [getImgIdFromSrc(photoUrl)],
      });
      setFavoriteArr((prev: string[]) =>
        prev.filter((item: string) => item !== getImgIdFromSrc(photoUrl))
      );
      return;
    }
    setFavoritePhotos({
      eventId,
      photosToAdd: [getImgIdFromSrc(photoUrl)],
    });
    setFavoriteArr((prev) => [...prev, getImgIdFromSrc(photoUrl)]);
  };

  const handleDownload = (photoUrl: string, name?: string) => () => {
    photoDownload(photoUrl, name);
  };

  const handleDelete = (photoUrl: string) => () => {
    setDialogProps({
      type: "warning",
      title: t("delete-image"),
      message: t("delete-image-confirm"),
      primaryButton: t("delete"),
      primaryButtonAction: () => deletePhoto(photoUrl),
      secondaryButton: t("cancel"),
    });
  };

  const deletePhoto = (photoUrl: string) => {
    const eventId = getEventIdFromPhotoUrl(photoUrl);
    const photoId = getImgIdFromSrc(photoUrl);
    deletePhotos(eventId, [photoId]);
    if (setPhotosList) {
      setPhotosList((prev) => prev.filter((item) => item !== getImgIdFromSrc(photoUrl)));
    }
    if (closeFunc) {
      closeFunc();
    }
    setToasterProps({
      text: t("image-deleted-successfully"),
      type: "success",
    });
  };

  return [
    {
      id: 1,
      icon: <CloseOutlined />,
      onClick: () => () => setIsEnlarged(false),
      className: "action-svg close-svg",
      tooltip: t("close"),
    },
    {
      id: 2,
      icon: <DeleteOutlined />,
      onClick: (photoUrl: string) => handleDelete(photoUrl),
      className: "action-svg delete-svg",
      tooltip: t("delete"),
    },
    {
      id: 3,
      icon: isLiked ? <FavoriteOutlined /> : <FavoriteBorderOutlined />,
      onClick: (photoUrl: string) => handleLike(photoUrl),
      className: "action-svg like-svg",
      tooltip: isLiked ? t("unlike") : t("like"),
    },
    {
      id: 4,
      icon: <FileDownload />,
      onClick: (photoUrl: string) => handleDownload(photoUrl, fileName),
      className: "action-svg download-svg",
      tooltip: t("download"),
    },
  ].filter((item) => idsList.includes(item.id));
};
