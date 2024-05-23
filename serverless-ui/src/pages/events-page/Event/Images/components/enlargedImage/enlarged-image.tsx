import { Dispatch, SetStateAction } from "react";
import { Dialog, Tooltip } from "@mui/material";
import { IconObj, GetIconsListPhoto } from "../../icon-list";
import "./enlarged-image.scss";

interface ImageModalProps {
  imgSrc: string;
  imgClassName?: string;
  isEnlarged: boolean;
  setIsEnlarged?: Dispatch<SetStateAction<boolean>>;
  closeFunc: () => void;
  favoriteArr?: string[];
  setFavoriteArr?: Dispatch<SetStateAction<string[]>>;
  iconList?: IconObj[];
  setPhotosList?: Dispatch<SetStateAction<string[]>>;
}

// reusable
const EnlargedImage = ({
  imgSrc,
  imgClassName = "main-enlarged-img",
  isEnlarged,
  setIsEnlarged,
  closeFunc,
  favoriteArr,
  setFavoriteArr,
  iconList,
  setPhotosList,
}: ImageModalProps) => {
  const localIconList: IconObj[] =
    iconList ||
    GetIconsListPhoto(
      [1, 2, 3, 4],
      setIsEnlarged!,
      imgSrc,
      favoriteArr,
      setFavoriteArr,
      setPhotosList,
      closeFunc
    );
  const imgUrl = imgSrc.replace("small", "medium");

  return (
    <Dialog
      className='dialog'
      fullWidth={false}
      maxWidth='lg'
      open={isEnlarged}
      onClose={closeFunc}>
      <div className='enlarged-wrapper'>
        <div className='enlarged-icons-wrapper'>
          {localIconList.map((item) => (
            <Tooltip key={item.id} title={item.tooltip}>
              <div className={item.className} onClick={item.onClick(imgUrl)}>
                {item.icon}
              </div>
            </Tooltip>
          ))}
        </div>
        <img draggable={false} src={imgUrl} alt='Modal' className={imgClassName} />
      </div>
    </Dialog>
  );
};

export default EnlargedImage;
