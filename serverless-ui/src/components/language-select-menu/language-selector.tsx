import React from "react";
import "./language-selector.scss";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language.includes("-") ? i18n.language.split("-")[0] : i18n.language;

  return (
    <div className='language-selector'>
      <Button
        variant='text'
        className='language-button'
        color={currentLanguage === "en" ? "primary" : "inherit"}
        onClick={() => i18n.changeLanguage("en")}>
        En
      </Button>
      <svg xmlns='http://www.w3.org/2000/svg' width='2' height='16' viewBox='0 0 2 16' fill='none'>
        <path d='M1 1.5L1 14.5' stroke='#667085' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
      <Button
        variant='text'
        className='language-button'
        color={currentLanguage === "he" ? "primary" : "inherit"}
        onClick={() => i18n.changeLanguage("he")}>
        עב
      </Button>
    </div>
  );
};

export default LanguageSelector;
