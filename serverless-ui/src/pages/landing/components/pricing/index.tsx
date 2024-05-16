import React from 'react';
import { useTranslation } from 'react-i18next';
import { SectionProps } from '../../utils/interface';
import './pricing.scss';
import { useContactUsContext } from '../../context/contact-us-context';
import PackageCard from './package-card';

const Pricing = ({ sectionRef, sectionId }: SectionProps) => {
  const { t, i18n } = useTranslation();
  const { handleOpenDialog } = useContactUsContext();
  const startNowLink = `https://manage.izme.ai/sign-up?lang=${i18n.language}`;

  const pricingCardsRenderer = () => (
    <div className="cards">
      <PackageCard
        index={1}
        price={0.3}
        originalPrice={0.5}
        customText={t('per-image')}
        linkTo={startNowLink}
        secondaryAction={handleOpenDialog}
      />
      <PackageCard
        index={2}
        price={300}
        discount={40}
        originalPrice={500}
        numberOfPhotos={1000}
        linkTo={startNowLink}
        secondaryAction={handleOpenDialog}
      />
      <PackageCard
        index={3}
        price={3000}
        discount={40}
        originalPrice={5000}
        numberOfPhotos={10000}
        linkTo={startNowLink}
        secondaryAction={handleOpenDialog}
      />
    </div>
  );

  return (
    <section id={sectionId} ref={sectionRef}>
      <div className="pricing-title-container">
        <h2 className="section-title">{t('pricing')}</h2>
        <span className="section-subtitle">{t('pricing-subtitle')}</span>
        <p className="section-description">{t('pricing-description')}</p>
      </div>
      {pricingCardsRenderer()}
    </section>
  );
};

export default Pricing;
