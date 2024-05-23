import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button';
import { CustomTextField, InputValidationCheckIcon } from '../styles/styled-components';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

interface CouponAreaProps {
  couponId?: string;
  setCouponId: (couponId: string) => void;
  showCoupon: boolean;
  isNonMobile: boolean;
  discount?: number;
  calculateCouponDiscount: () => Promise<any>;
  setShowCoupon: React.Dispatch<React.SetStateAction<boolean>>;
}

enum CouponState {
  INITIAL = 'initial',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

const resolveCouponButton = (
  couponState: CouponState,
  handleCalculateCouponDiscount: () => void,
  t: any,
) => {
  switch (couponState) {
    case CouponState.INITIAL:
      return (
        <Button
          onClick={handleCalculateCouponDiscount}
          sx={{
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          {t('send')}
        </Button>
      );
    case CouponState.LOADING:
      return <CircularProgress size={20} />;
    case CouponState.SUCCESS:
      return (
        <InputValidationCheckIcon
          src="/images/users-page/check-icon.svg" // Replace with the cancel icon path
          alt="warning-icon"
        />
      );
    case CouponState.ERROR:
      return (
        <InputValidationCheckIcon
          src="/images/users-page/warning-icon.svg" // Replace with the cancel icon path
          alt="warning-icon"
        />
      );
  }
};

const CouponArea = ({
  showCoupon,
  isNonMobile,
  setShowCoupon,
  calculateCouponDiscount,
  couponId,
  setCouponId,
  discount,
}: CouponAreaProps) => {
  const { t } = useTranslation();
  const [couponState, setCouponState] = useState<CouponState>(CouponState.INITIAL);
  const handleCalculateCouponDiscount = async () => {
    setCouponState(CouponState.LOADING);
    const result = await calculateCouponDiscount();
    const { coupon, discount } = result;
    setCouponState(coupon && discount ? CouponState.SUCCESS : CouponState.ERROR);
  };

  useEffect(() => {
    if (!discount || !couponId || couponState !== CouponState.INITIAL) {
      setCouponState(CouponState.INITIAL);
    }
  }, [discount, couponId]);

  return (
    <div className="coupon-code-container">
      {showCoupon ? (
        <CustomTextField
          isNonMobile={isNonMobile}
          placeholder={t('coupon-code')}
          variant="outlined"
          customHeight
          label={t('coupon-code')}
          name="EventName"
          inputProps={{ maxLength: 100 }}
          value={couponId}
          onChange={(e) => setCouponId(e.target.value)}
          isLeftIcon={false}
          iconComponent={resolveCouponButton(couponState, handleCalculateCouponDiscount, t)}
        />
      ) : (
        <p className="coupon-code-text" onClick={() => setShowCoupon(true)}>
          {t('have-coupon')}
        </p>
      )}
    </div>
  );
};

export default CouponArea;
