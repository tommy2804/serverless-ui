import React, { useEffect, useRef, useState } from "react";
import calendarSvg from "/images/calendar.svg";
import pointSvg from "/images/point.svg";
import { useTranslation } from "react-i18next";
import { Switch, Tooltip } from "@mui/material";

import CouponArea from "../components/coupon-area";
import "../styles/dialog-payment.scss";

import { calculateCoupon } from "../../../api/events-api";
import { FormActionType, FormState } from "../../../shared/create-event-helpers";

interface DialogPaymentProps {
  formState: FormState;
  isNonMobile: boolean;
  dispatch: React.Dispatch<any>;
}

const creditsToDolars = (num: number, pricePerPhoto: number): number =>
  Number((num * pricePerPhoto).toFixed(1));

const DialogPayment: React.FunctionComponent<DialogPaymentProps> = ({
  isNonMobile,
  formState,
  dispatch,
}) => {
  const called = useRef(false);
  const [showCoupon, setShowCoupon] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const {
    couponId,
    discount,
    location,
    eventDate,
    files,
    eventName,
    useAccountCredits,
    creditsToUse,
    giftCreditsToUse,
    eventURL,
    credits,
  } = formState;
  const uploadedImages = files.length || 0;

  const imagesDolars = creditsToDolars(uploadedImages, 0);
  const giftCreditsToUseDoalrs = creditsToDolars(giftCreditsToUse, 0);
  const creditsToUseDoalrs = creditsToDolars(creditsToUse, 0);
  const discountDolars = couponId && discount ? Number(discount) : 0;
  const totalCost = (
    imagesDolars -
    giftCreditsToUseDoalrs -
    creditsToUseDoalrs -
    discountDolars
  ).toFixed(2);

  const handleUseAccountCredits = () => {
    const oldUseAccountCredits = useAccountCredits;
    dispatch({
      type: FormActionType.SetField,
      field: "useAccountCredits",
      value: !oldUseAccountCredits,
    });
    if (!oldUseAccountCredits && discount) {
      dispatch({
        type: FormActionType.SetField,
        field: "discount",
        value: 0,
      });
      dispatch({
        type: FormActionType.SetField,
        field: "couponId",
        value: "",
      });
    }
  };

  const setCouponId = (couponId: string) => {
    dispatch({
      type: FormActionType.SetField,
      field: "couponId",
      value: couponId,
    });
    if (discount) {
      dispatch({
        type: FormActionType.SetField,
        field: "discount",
        value: 0,
      });
    }
  };

  const calculateCouponDiscount = async () => {
    if (!couponId) return;
    const { coupon, discount } = await calculateCoupon(couponId, uploadedImages);
    if (coupon && discount) {
      dispatch({
        type: FormActionType.SetField,
        field: "discount",
        value: discount,
      });
    }
    return { coupon, discount }; // for CouponArea component
  };

  return (
    <div className='container-dialog-pay'>
      <div className='address-container'>
        <p className='address-title'>
          <span>{eventName}</span>
          <span className='mar-left'>({t("files", { uploadedImages })})</span>
        </p>
        <p className='event-url'>
          <span>izme.com/{eventURL}</span>
        </p>
        {location && (
          <p className='sub-title'>
            <span className='icon-sub-title'>
              <img src={pointSvg} alt='details-icon' />
            </span>
            {location}
          </p>
        )}
        <p className='sub-title'>
          <span className='icon-sub-title'>
            <img src={calendarSvg} alt='details-icon' />
          </span>
          {eventDate?.format("MMMM D, YYYY")}
        </p>
      </div>
      {/* pricing Cards
      <div className="packages-container">
        <div className="pricing-card">
          <div className="pricing-header">
            <p className="price">
              {package1?.price}$ <span className="instead"> {package1?.originalPrice}$</span>
            </p>
            <button className="is-popular rmv-default">{t('popular')}</button>
          </div>
          <div className="price-detail">
            {isNonMobile ? (
              <img src={checkSvg} alt="checkSvg" className="price-detail__icon" />
            ) : null}

            <p className="price-detail__text">{t('get-less')}</p>
          </div>
          <div className="add-button">
            <button className="rmv-default row">
              <img src={plusSvg} alt="plus-circle" className="plus-circle" />
              <span className="add-text">{t('add')}</span>
            </button>
          </div>
        </div>
        <div className="pricing-card">
          <div className="pricing-header">
            <p className="price">
              {package2?.price}$<span className="instead">{package2?.originalPrice}$</span>
            </p>
            <button className="is-popular rmv-default">{t('popular')}</button>
          </div>
          <div className="price-detail">
            {isNonMobile ? (
              <img src={checkSvg} alt="checkSvg" className="price-detail__icon" />
            ) : null}

            <p className="price-detail__text">{t('get-more')}</p>
          </div>
          <div className="add-button">
            <button className="rmv-default row">
              <img src={plusSvg} alt="plus-circle" className="plus-circle" />
              <span className="add-text">{t('add')}</span>
            </button>
          </div>
        </div>
      </div> */}

      {!giftCreditsToUse && (!useAccountCredits || !creditsToUse) ? (
        <CouponArea
          couponId={couponId}
          setCouponId={setCouponId}
          calculateCouponDiscount={calculateCouponDiscount}
          showCoupon={showCoupon}
          isNonMobile={isNonMobile}
          setShowCoupon={setShowCoupon}
        />
      ) : null}
      <div className='total-cost-container'>
        <p className='total-cost'>{t("order-ammount")}</p>
        <p className='total-cost'>{imagesDolars}₪</p>
      </div>
      <div className='total-cost-container'>
        {giftCreditsToUse ? (
          <>
            <p className='total-cost'>{t("gift-credits")}</p>
            <p className='total-cost'>-{giftCreditsToUseDoalrs}₪</p>
          </>
        ) : null}
      </div>
      {couponId && discount ? (
        <div className='total-cost-container'>
          <p className='total-cost'>{t("coupon-discount")}</p>
          <p className='total-cost'>-{discount}₪</p>
        </div>
      ) : null}
      {creditsToUse || !giftCreditsToUse ? (
        <div className='total-cost-container'>
          <Tooltip title={!Number(credits) ? t("no-account-tokens") : null} placement='top' arrow>
            <p className='total-cost'>
              {t("account-credits")}
              <Switch
                value={useAccountCredits}
                color='primary'
                size='small'
                checked={!!credits && useAccountCredits}
                onChange={handleUseAccountCredits}
                disabled={!credits}
                sx={{
                  transform: i18n.dir() === "rtl" ? "scaleX(-1)" : "",
                }}
              />
            </p>
          </Tooltip>
          <p className='total-cost'>-{creditsToUseDoalrs}₪</p>
        </div>
      ) : null}
      <div className='total-cost-container'>
        <p className='total-cost-title'>{t("total-cost")}</p>
        <p className='total-cost-title'>{totalCost}₪</p>
      </div>
    </div>
  );
};

export default DialogPayment;
