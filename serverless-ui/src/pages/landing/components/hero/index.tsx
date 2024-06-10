import './hero.scss';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DoneIcon from '@mui/icons-material/Done';
import { SectionProps } from '../../utils/interface';
import { useContactUsContext } from '../../context/contact-us-context';

const Hero = ({ sectionRef, sectionId }: SectionProps) => {
  const { t, i18n } = useTranslation();
  const { handleOpenDialog } = useContactUsContext();
  const domain = window.location.hostname;

  return (
    <section id={sectionId} ref={sectionRef}>
      <img
        src="/images/background-pattern.png"
        alt="background pattern"
        className={`background-pattern ${i18n.dir() === 'rtl' ? 'rtl' : ''}`}
      />
      <div className="hero-section__container">
        <div className="hero-section__content">
          <div className="hero-section__text">
            <h1 className="hero-section__title">{t('hero-temp-title')}</h1>
            <p className="hero-section__subtitle">{t('hero-temp-subtitle')}</p>
          </div>
          <div className="hero-section__buttons_container">
            <div className="hero-section__buttons">
              <Button
                href={`https://manage.izme.ai/sign-up?lang=${i18n.language}`}
                className="main-button"
              >
                {t('start-now')}
              </Button>
              <Button className="secondary-button" onClick={handleOpenDialog}>
                <img src="/images/contact-us-icon.svg" alt="contact us" />
                {t('contact-us')}
              </Button>
            </div>
            <div className="hero-section__subtext">
              <span className="secured-privacy">
                <LockOutlinedIcon />
                {t('secured-privacy')}
              </span>
              <span className="secured-privacy">
                <DoneIcon />
                {t('accurate')}
              </span>
            </div>
          </div>
        </div>
        <div className="hero-section__images_container">
          <img src="/images/hero-main-image.png" alt="hero main" className="hero-main-image" />
          <div
            className={`hero-section__small-images-container ${i18n.dir() === 'rtl' ? 'rtl' : ''}`}
          >
            <img
              src="/images/hero-small-image-1.png"
              alt="hero small 1"
              className="hero-small-image"
            />
            <img
              src="/images/hero-small-image-2.png"
              alt="hero small 2"
              className="hero-small-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
