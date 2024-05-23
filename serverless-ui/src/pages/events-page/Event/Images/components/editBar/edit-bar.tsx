import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { CloseOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useIconListEditBar } from "./use-edit-bar-icons";
import "./edit-bar.scss";

interface EditBarProps {
  selectedArray: string[];
  favoriteArr: string[];
  handleCancelClick: () => void;
  setFavoriteArr: Dispatch<SetStateAction<string[]>>;
  currentSrc: string;
  setSelectedArray: Dispatch<SetStateAction<string[]>>;
  setPhotosList?: Dispatch<SetStateAction<string[]>>;
}

const EditBar = ({
  selectedArray,
  favoriteArr,
  handleCancelClick,
  setFavoriteArr,
  currentSrc,
  setSelectedArray,
  setPhotosList,
}: EditBarProps) => {
  const { t } = useTranslation();
  const iconListEditBar = useIconListEditBar(
    selectedArray,
    favoriteArr,
    setFavoriteArr,
    currentSrc,
    setSelectedArray,
    setPhotosList
  );

  return (
    <div className='edit-bar-wrapper'>
      <div className='cancel-selected-container'>
        <IconButton onClick={handleCancelClick}>
          <Tooltip title={t("cancel")}>
            <CloseOutlined />
          </Tooltip>
        </IconButton>
        <span>
          {selectedArray.length} {t("selected")}
        </span>
      </div>
      <div className='edit-bar-svg-container'>
        {iconListEditBar.map((item) => (
          <Tooltip key={item.id} title={item.tooltip}>
            <IconButton
              onClick={item.onClick()}
              className={item.className}
              disabled={item?.disabled}>
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default EditBar;
