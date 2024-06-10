import { useTranslation } from "react-i18next";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import "./page-not-found.scss";
import CustomButton from "../../shared/buttons/custom-button";

const PageNotFound = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className='page-not-found'>
      <div className='page-not-found-body'>
        <img className='not-found-icon' src='/images/404.svg' alt='404' />
        <div className='page-not-fount-text'>
          <span className='page-not-found-title'>{t("page-not-found-title")}</span>
          <span className='page-not-found-subtitle'>{t("page-not-found-subtitle")}</span>
          <div className='not-found-buttons'>
            <Button
              variant='contained'
              color='secondary'
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: "8px",
                height: "60px",
                width: "164px",
                fontWeight: "600",
                svg: {
                  transform: i18n.dir() === "ltr" ? "" : "scaleX(-1)",
                  marginLeft: i18n.dir() === "ltr" ? "" : "7px",
                },
                "&:hover": {
                  backgroundColor: "#D0D5DD",
                },
              }}>
              {t("go-back")}
            </Button>
            <Link className='link-title' to='/' relative='path'>
              <CustomButton variant='contained'>{t("go-home")}</CustomButton>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
