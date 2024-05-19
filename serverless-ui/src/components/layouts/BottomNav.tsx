import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton, Stack } from "@mui/material";
import ProfileMenu from "./ProfileMenu";
import { Nav_Buttons } from "../../pages/chat/components/data";

// Define the structure of Nav_Buttons if not already typed
interface NavButton {
  index: number;
  icon: React.ReactNode;
}

const BottomNav: React.FC = () => {
  const theme = useTheme();

  const [selectedTab, setSelectedTab] = useState<number>(0);

  const handleChangeTab = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <Box
      sx={{
        zIndex: 10,
        position: "absolute",
        bottom: 0,
        width: "100vw",
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}>
      <Stack
        sx={{ width: "100%" }}
        direction='row'
        alignItems='center'
        justifyContent='space-between'
        spacing={2}
        p={2}>
        {Nav_Buttons.map((el: NavButton) => {
          return el.index === selectedTab ? (
            <Box
              key={el.index}
              sx={{ backgroundColor: theme.palette.primary.main, borderRadius: 1.5 }}
              p={1}>
              <IconButton sx={{ width: "max-content", color: "#ffffff" }}>{el.icon}</IconButton>
            </Box>
          ) : (
            <IconButton
              key={el.index}
              onClick={() => handleChangeTab(el.index)}
              sx={{
                width: "max-content",
                color: theme.palette.mode === "light" ? "#080707" : theme.palette.text.primary,
              }}>
              {el.icon}
            </IconButton>
          );
        })}
        <ProfileMenu />
      </Stack>
    </Box>
  );
};

export default BottomNav;
