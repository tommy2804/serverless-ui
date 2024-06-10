import React from 'react';
import checkSvg from '/images/title-check.svg';
import { useTranslation } from 'react-i18next';

const ContactUsSuccess = () => {
  const { t } = useTranslation();
  return (
    <div className="contact-success-container">
      <img src={checkSvg} alt="check" />
      <span className="contact-success-title">{t('we-got-it')}</span>
      <div className="contact-success-subtitle-container">
        <span className="contact-success-subtitle">{t('your-message-sent')}</span>
        <span className="contact-success-subtitle">{t('get-back-soon')}</span>
      </div>
    </div>
  );
};

export default ContactUsSuccess;
