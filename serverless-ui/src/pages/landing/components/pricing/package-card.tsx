import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';
import './pricing.scss';

interface FeatureLineProps {
  text: string;
  bold?: boolean;
}

const FeatureLine = ({ text, bold }: FeatureLineProps) => (
  <div className="feature-line">
    <img src="/images/check-green.svg" alt="check-icon" className="check-icon" />
    <span className={`feature-text ${bold && 'bold600'}`}>{text}</span>
  </div>
);

interface PackageCardProps {
  index: number;
  price: number;
  discount?: number;
  originalPrice?: number;
  numberOfPhotos?: number;
  customText?: string;
  linkTo?: string;
  secondaryAction?: () => void;
}

const PackageCard = ({
  index,
  price,
  discount,
  originalPrice,
  numberOfPhotos,
  customText,
  linkTo,
  secondaryAction,
}: PackageCardProps) => {
  const { t } = useTranslation();
  return (
    <div className={`card ${index === 2 ? 'middle-card' : ''}`}>
      {index === 2 && <img src="/images/most-popular.svg" className="most-popular" alt="popular" />}
      <div className="card-header">
        <h4 className="price">
          {price.toLocaleString()}₪{' '}
          {originalPrice && (
            <span className="original-price">{originalPrice.toLocaleString()}₪</span>
          )}
        </h4>
        <h5 className="photos-ammount">
          {customText || t('images-num', { images: numberOfPhotos?.toLocaleString() })}
        </h5>
      </div>
      <div className="card-body">
        {discount && <FeatureLine text={t('feature-1', { discount })} bold />}
        <FeatureLine text={t('feature-2')} />
        <FeatureLine text={t('feature-3')} />
        <FeatureLine text={t('feature-4')} />
        <FeatureLine text={t('feature-5')} />
      </div>
      <div className="card-footer">
        <Button
          type="submit"
          href={linkTo}
          className="button-gap width100 border-radius8 bold600"
          variant="contained"
        >
          {t('get-started-no-icon')}
        </Button>
        <Button
          type="submit"
          onClick={secondaryAction}
          className="secondary-button button-gap width100 border-radius8 bold600"
          variant="contained"
          color="secondary"
          sx={{
            color: '#344054',
          }}
        >
          {t('contact-us')}
        </Button>
      </div>
    </div>
  );
};

export default PackageCard;
