import { Box } from "@mui/system";
import linkIcon from "/images/link.svg";
import copyIcon from "/images/copy.svg";
import { useTranslation } from "react-i18next";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { useState } from "react";
import { CircularProgress, useMediaQuery } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { socialMediaLinks } from "./social-medias";
import EnlargedImage from "../Images/components/enlargedImage/enlarged-image";
import { cerateQrCode } from "../../../../api/events-api";
import { GetIconsListPhoto } from "../Images/icon-list";
import "./share.scss";
import { useSingleEventContext } from "../../../../state/single-event-context";

interface BoxCompProps {
  icon: string;
  title: string;
}

const BoxComp = ({ icon, title }: BoxCompProps) => {
  const { t } = useTranslation();

  return (
    <Box key={title} className='media-box'>
      <div className='share-text-wrapper'>
        <span className='share-img-span'>
          <img src={icon} alt='icon' />
        </span>
        <span className='width100'>
          {t("share-via")} {title}
        </span>
      </div>
    </Box>
  );
};

const Share = () => {
  const { t } = useTranslation();
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [barcodeStatus, setBarcodeStatus] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const isMobile = useMediaQuery("(max-width:960px)");
  const { id, name, qrcode, organization } = useSingleEventContext();

  const { hostname } = location;
  const domain = hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);

  const COPY_LINK = `https://${domain}/${id}`;
  const iconList = GetIconsListPhoto([1, 4], setBarcodeOpen, `${name}_qrcode.png`);

  const handleCopyBtn = async () => {
    setCopySuccess(true);
    navigator.clipboard.writeText(COPY_LINK);
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };
  const handleQrCodeClick = async () => {
    if (!qrcode && !barcodeStatus) {
      setBarcodeStatus(1);
      await cerateQrCode(id);
    }
    setBarcodeOpen(true);
    setBarcodeStatus(2);
  };
  return (
    <div className='share-wrapper'>
      <div className='share-boxes-wrapper'>
        <div className='share-media-links-wrapper'>
          {socialMediaLinks.map((item: any) => (
            <item.Component key={item.title} className='media-box' url={COPY_LINK}>
              <BoxComp title={t(item.title)} icon={item.icon} />
            </item.Component>
          ))}
        </div>
        <Box className='share-personal-link-wrapper'>
          <span className='share-personal-link'>
            {isMobile ? "" : <img src={linkIcon} alt='link' />}
            {COPY_LINK}
          </span>
          <button onClick={handleCopyBtn} className='share-copy-btn'>
            {copySuccess ? (
              <CheckCircleOutlineIcon
                sx={{
                  color: "#00C48C",
                }}
              />
            ) : (
              <img src={copyIcon} alt='copy' />
            )}
            {t("copy-btn")}
          </button>
        </Box>
        <Box className='share-personal-link-wrapper'>
          <span className='share-personal-link'>
            {isMobile ? "" : <QrCode2Icon />}
            {`${t("share-via")} ${t("barcode")}`}
          </span>
          <button onClick={handleQrCodeClick} className='share-copy-btn'>
            {barcodeStatus === 1 ? (
              <CircularProgress
                sx={{
                  width: "20px !important",
                  height: "initial !important",
                }}
              />
            ) : (
              <QrCodeScannerIcon />
            )}
            {t("open-barcode")}
          </button>
        </Box>
        {barcodeOpen && (
          <EnlargedImage
            imgSrc={`/organization-assets/qrcodes/${organization}/${id}/qrcode.png`}
            closeFunc={() => setBarcodeOpen(false)}
            isEnlarged={barcodeOpen}
            iconList={iconList}
          />
        )}
      </div>
    </div>
  );
};

export default Share;
