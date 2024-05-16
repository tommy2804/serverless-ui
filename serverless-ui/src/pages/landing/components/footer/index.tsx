import React from "react";
import { useTranslation } from "react-i18next";
import "./footer.scss";
import Logo from "../logo";
// import TermsOfServiceLinks from "./terms-of-service-links";

import SocialMediaLinks from "./social-media-links";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className='footer'>
      <div className='footer__links'>
        <SocialMediaLinks />

        <Logo />
      </div>
      <div className='all-rights-reserved'>{t("all-rights-reserved")}</div>
    </footer>
  );
};

export default Footer;
