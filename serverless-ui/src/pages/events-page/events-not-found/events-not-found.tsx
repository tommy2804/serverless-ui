import { useTranslation } from "react-i18next";
import "./events-not-found.scss";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Button from "@mui/material/Button";
import { DataNotFoundType } from "../../../types/event-dto";

interface DataNotFoundProps {
  dataType: DataNotFoundType; // Use the enum type
  fromSearch?: boolean;
  icon?: React.ReactNode;
  handleClick?: () => void;
}
interface BasedDataIconProps {
  dataIcon: React.ReactNode;
}

const BasedDataIcon = ({ dataIcon }: BasedDataIconProps) => (
  <div className='search-icon-wrap'>
    <img className='search-background' src='/images/background-pattern-gray.svg' alt='' />
    <div className='search-icon-border'>{dataIcon}</div>
  </div>
);

const DataNotFound = ({ fromSearch, handleClick, dataType, icon }: DataNotFoundProps) => {
  const { t } = useTranslation();
  const fromSearchSuffix = fromSearch ? "-search" : "";

  const renderIcon = (dataType: string) => {
    switch (true) {
      case dataType === DataNotFoundType.Events:
        return <img className='search-icon' src='/images/search.svg' alt='search-icon' />;
      default:
        return <div className='search-icon'>{icon || null}</div>;
    }
  };

  return (
    <div className='events-not-found'>
      <BasedDataIcon dataIcon={renderIcon(dataType)} />
      <div className='not-fount-text'>
        <span className='events-not-found-title'>
          {t(`${dataType}-not-found-title${fromSearchSuffix}`)}
        </span>
        <span className='events-not-found-subtitle'>
          {t(`${dataType}-not-found-subtitle${fromSearchSuffix}`)}
        </span>
        {dataType === DataNotFoundType.Events && (
          <Button
            onClick={handleClick}
            variant='contained'
            color='primary'
            startIcon={<AddCircleOutline />}
            sx={{
              borderRadius: "8px",
              width: "180px",
              alignSelf: "center",
              display: "flex",
              gap: "8px",
              span: {
                marginRight: 0,
                marginLeft: 0,
              },
            }}>
            {t("create-event")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataNotFound;
