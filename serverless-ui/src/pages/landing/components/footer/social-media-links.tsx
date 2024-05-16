import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';

const SocialMediaLinks = () => (
  <div className="social-media-container">
    {/* eslint-disable jsx-a11y/control-has-associated-label */}
    <a
      href="https://twitter.com/izme"
      target="_blank"
      rel="noreferrer"
      className="social-media-link"
    >
      <TwitterIcon className="social-media-icon" />
    </a>
    <a
      href="https://www.linkedin.com/company/izme"
      target="_blank"
      rel="noreferrer"
      className="social-media-link"
    >
      <LinkedInIcon className="social-media-icon" />
    </a>
    <a
      href="https://www.facebook.com/izme"
      target="_blank"
      rel="noreferrer"
      className="social-media-link"
    >
      <FacebookRoundedIcon className="social-media-icon" />
    </a>
    <a
      href="https://www.instagram.com/izme/"
      target="_blank"
      rel="noreferrer"
      className="social-media-link"
    >
      <InstagramIcon className="social-media-icon" />
    </a>
  </div>
);

export default SocialMediaLinks;
