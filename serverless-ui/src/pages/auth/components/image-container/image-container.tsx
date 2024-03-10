import { PropsWithChildren } from 'react';
// import { useMediaQuery } from '@mui/material';
// import ImageWithReview from '../../../../shared/image-with-review/image-with-review';
// import mock from './image-mock.json';
import gridBackground from '/images/grid-background.png';
import './image-container.scss';

const ImageContainer = ({ children }: PropsWithChildren) => (
  <div className="image-container-wrapper">
    <img className="grid-background" src={gridBackground} alt="grid-background" />
    {children}
  </div>
);

export default ImageContainer;

// {isMobile ? (
//   ''
// ) : (
//   <div className="image-container-center-wrapper">
//     {/* @ts-ignore mock json type not match, wont be a prob with real data */}
//     <ImageWithReview reviews={mock.reviews} imgSrc={mock.imgSrc} />
//   </div>
// )}
