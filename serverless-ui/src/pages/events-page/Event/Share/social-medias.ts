import facebookIcon from "/images/facebook.svg";
import gmailIcon from "/images/gmail.svg";
import linkedinIcon from "/images/linkedin.svg";
import whatsappIcon from "/images/whatsapp.svg";
import {
  FacebookShareButton,
  WhatsappShareButton,
  EmailShareButton,
  LinkedinShareButton,
} from "react-share";

interface SocialMediaItem {
  title: string;
  icon: string;
  Component: any;
}

export const socialMediaLinks: SocialMediaItem[] = [
  {
    title: "facebook",
    icon: facebookIcon,
    Component: FacebookShareButton,
  },
  {
    title: "linkedin",
    icon: linkedinIcon,
    Component: LinkedinShareButton,
  },
  {
    title: "whatsapp",
    icon: whatsappIcon,
    Component: WhatsappShareButton,
  },
  {
    title: "gmail",
    icon: gmailIcon,
    Component: EmailShareButton,
  },
];
