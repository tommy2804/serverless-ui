import React, { MouseEvent, useState } from "react";
import { Avatar, Box, Fade, Menu, MenuItem, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Profile_Menu } from "../../pages/chat/components/data";

interface ProfileMenuItem {
  title: string;
  icon: React.ReactNode;
}

const ProfileMenu: React.FC = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar
        id='profile-positioned-button'
        aria-controls={openMenu ? "profile-positioned-menu" : undefined}
        aria-haspopup='true'
        aria-expanded={openMenu ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        TransitionComponent={Fade}
        id='profile-positioned-menu'
        aria-labelledby='profile-positioned-button'
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}>
        <Box p={1}>
          <Stack spacing={1}>
            {Profile_Menu.map((el: ProfileMenuItem, idx: number) => (
              <MenuItem key={idx} onClick={handleClose}>
                <Stack
                  onClick={() => {
                    if (idx === 0) {
                      navigate("/profile");
                    } else if (idx === 1) {
                      navigate("/settings");
                    } else {
                      console.log("first");
                    }
                  }}
                  sx={{ width: 100 }}
                  direction='row'
                  alignItems='center'
                  justifyContent='space-between'>
                  <span>{el.title}</span>
                  {el.icon}
                </Stack>
              </MenuItem>
            ))}
          </Stack>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
