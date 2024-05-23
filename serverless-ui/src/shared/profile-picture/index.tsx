import { Avatar } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";

interface ProfilePictureProps {
  size?: number;
}

const defaultSize = 30;

const ProfilePicture = ({ size }: ProfilePictureProps) => (
  <Avatar
    alt=''
    sx={{
      backgroundColor: "transparent",
      justifyContent: "flex-start",
      width: `${size || defaultSize}px`,
      height: `${size || defaultSize}px`,
    }}>
    <AccountCircle
      sx={{
        color: "#D0D5DD",
      }}
    />
  </Avatar>
);

export default ProfilePicture;
