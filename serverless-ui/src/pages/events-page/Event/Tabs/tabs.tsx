import { useState } from "react";
import Box from "@mui/system/Box";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Tab, Tabs, useMediaQuery } from "@mui/material";
import CustomTabPanel from "./custom-tab-panel";
import Overview from "../Overview/overview";
import Images from "../Images/images";
import Share from "../Share/share";

interface EventTabsProps {
  favorite_photos: string[];
}

const EventTabs = ({ favorite_photos }: EventTabsProps) => {
  const [favoriteArr, setFavoriteArr] = useState<string[]>(favorite_photos || []);
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:960px)");
  const location = useLocation();
  const navigate = useNavigate();
  const param = useParams();
  const continueUpload = new URLSearchParams(location.search).get("continueUpload");

  enum TABS {
    overview = "overview",
    images = "images",
    share = "share",
  }
  const currentTab = param?.tab || TABS.overview;

  const handleChange = (event: React.SyntheticEvent, newValue: TABS) => {
    const { pathname } = location;
    const path = pathname.split("/").slice(0, -1).join("/");
    navigate(`${path}/${newValue}`);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant={isMobile ? "fullWidth" : "standard"}
          value={currentTab}
          onChange={handleChange}
          aria-label='tabs'>
          <Tab value={TABS.overview} className='tab' label={t("overview")} />
          <Tab value={TABS.images} className='tab' label={t("images")} />
          <Tab value={TABS.share} className='tab' label={t("share")} />
        </Tabs>
      </Box>
      <CustomTabPanel value={currentTab} tag={TABS.overview}>
        <Overview favoriteArr={favoriteArr} setFavoriteArr={setFavoriteArr} />
      </CustomTabPanel>
      <CustomTabPanel value={currentTab} tag={TABS.images}>
        <Images
          favoriteArr={favoriteArr}
          setFavoriteArr={setFavoriteArr}
          isContinueUpload={continueUpload === "true"}
        />
      </CustomTabPanel>
      <CustomTabPanel value={currentTab} tag={TABS.share}>
        <Share />
      </CustomTabPanel>
    </>
  );
};

export default EventTabs;
