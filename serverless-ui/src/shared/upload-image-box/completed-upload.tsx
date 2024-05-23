import Box from "@mui/system/Box";
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import greenCheckMark from "/images/green-check-mark.svg";
import { useTranslation } from "react-i18next";
import { SetStateAction, useState } from "react";
import EnlargedImage from "../../pages/events-page/Event/Images/components/enlargedImage/enlarged-image";
import { GetIconsListPhoto } from "../../pages/events-page/Event/Images/icon-list";
import "./completed-upload.scss";

interface CompletedUploadProps {
  title: string;
  editFunc: React.Dispatch<SetStateAction<any>>;
  currentImgSrc: string;
}

const CompletedUpload = ({ title, editFunc, currentImgSrc }: CompletedUploadProps) => {
  const [isEnlarged, setIsEnlarged] = useState<boolean>(false);
  const { t } = useTranslation();
  const iconList = GetIconsListPhoto([1], setIsEnlarged);

  const toggleEnlargeImage = () => {
    if (isEnlarged) return;
    setIsEnlarged((prev) => !prev);
  };

  const handleEdit = () => editFunc((prev: any) => !prev);

  return (
    <Box className='completed-upload-wrapper'>
      {isEnlarged && currentImgSrc ? (
        <EnlargedImage
          iconList={iconList}
          closeFunc={toggleEnlargeImage}
          isEnlarged={isEnlarged}
          imgSrc={currentImgSrc}
        />
      ) : (
        ""
      )}
      <div className='completed-upload-info no-wrap'>
        <img src={greenCheckMark} alt='checkmark' />
        {title}
        {/* <InfoOutlinedIcon /> */}
      </div>
      <div className='completed-upload-btn-wrapper'>
        <button onClick={toggleEnlargeImage} className='completed-upload-btn'>
          {t("view")}
        </button>
        <div className='completed-upload-divider' />
        <button onClick={handleEdit} className='completed-upload-btn'>
          {t("edit")}
        </button>
      </div>
    </Box>
  );
};

export default CompletedUpload;
