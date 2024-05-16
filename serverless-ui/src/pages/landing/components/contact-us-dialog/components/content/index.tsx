import React from 'react';
import chatIcon from '/images/contact-us/chat-icon.svg';
import { useTranslation } from 'react-i18next';

interface ContactUsIconProps {
  link: string;
  src: string;
}

const ContactUsIcon = ({ link, src }: ContactUsIconProps) => {
  return (
    <a href={link} target="_blank" rel="noreferrer">
      <img className="contact-us-icon" src={src} alt="icon" />
    </a>
  );
};

const ContactUsContent = () => {
  const { t } = useTranslation();
  return (
    <div className="get-in-touch-container">
      <div>
        <div className="contact-us-title">{t('get-in-touch')}</div>
        <div className="contact-us-sub-title">{t('love-to-hear')}</div>
        <div className="contact-us-chat-with">
          <span className="chat-with-icon">
            <img src={chatIcon} alt="chat-with-icon" />
          </span>
          <span className="chat-with-content">{t('chat-with-us')}</span>
        </div>
        <div className="here-to-help">
          <span>{t('here-to-help')}</span>
        </div>
        <div className="contact-via-email">customers@izme.ai</div>
        <div className="contact-via-email">972-543450625</div>
      </div>
      <div className="contact-us-icons-group">
        <ContactUsIcon
          link="https://www.facebook.com/share/N1WSayHCTKvrUsZC/?mibextid=LQQJ4d"
          src="/images/contact-us/facebook-icon.svg"
        />
        <ContactUsIcon
          link="https://www.linkedin.com/company/izme-ai/"
          src="/images/contact-us/linkdein-icon.svg"
        />
        <ContactUsIcon
          link="https://www.instagram.com/izme.ai_?igsh=MzJlaDQ2dHQwa3Ju&utm_source=qr"
          src="/images/contact-us/globe-icon.svg"
        />
      </div>
    </div>
  );
};

export default ContactUsContent;
