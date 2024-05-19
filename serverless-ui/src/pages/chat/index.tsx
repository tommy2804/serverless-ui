import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { ArchiveBox, CircleDashed, MagnifyingGlass, Users } from "phosphor-react";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
// import ChatElement from "../../components/ChatElement";
import { SearchIconWrapper, StyledInputBase, Search } from "./components/Search";
import BottomNav from "../../components/layouts/BottomNav";
import ChatElement from "./components/Chat/ChatElement";
import Friends from "./components/Friends/Friends";
import { useTranslation } from "react-i18next";
import Navbar from "../landing/components/navbar";

interface ConversationChat {
  img: string;
  name: string;
  msg: string;
  time: string;
  unread: number;
  online: boolean;
  id: number;
}

const ChatApp = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isDesktop = useResponsive("up", "md");
  const [conversations, setConversations] = useState<ConversationChat[]>(
    Array.from({ length: 5 }, (_, idx) => {
      return {
        img: "https://source.unsplash.com/random",
        name: "John Doe",
        msg: "Hello",
        time: "12:00",
        unread: 2,
        online: true,
        id: idx,
        pinned: false,
      };
    })
  );

  const sections = {
    testimonials: {
      ref: useRef(null),
      id: "Chats",
      text: t("Chats"),
      url: "/chats",
    },
  };

  const navItems = Object.values(sections);

  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Navbar navItems={navItems} />
      <Box
        sx={{
          position: "relative",
          marginBlockStart: "7rem",
          width: isDesktop ? 320 : "100vw",
          backgroundColor: theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}>
        {!isDesktop && (
          // Bottom Nav
          <BottomNav />
        )}

        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack alignItems={"center"} justifyContent='space-between' direction='row'>
            <Typography variant='h5'>Chats</Typography>

            <Stack direction={"row"} alignItems='center' spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
                sx={{ width: "max-content" }}>
                <Users />
              </IconButton>
              <IconButton sx={{ width: "max-content" }}>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color='#709CE6' />
              </SearchIconWrapper>
              <StyledInputBase placeholder='Search…' inputProps={{ "aria-label": "search" }} />
            </Search>
          </Stack>
          <Stack spacing={1}>
            <Stack direction={"row"} spacing={1.5} alignItems='center'>
              <ArchiveBox size={24} />
              <Button variant='text'>Archive</Button>
            </Stack>
            <Divider />
          </Stack>
          <Stack sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}>
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              <Stack spacing={2.4}>
                <Typography variant='subtitle2' sx={{ color: "#676667" }}>
                  Pinned
                </Typography>
                {/* Chat List */}
                {/* {ChatList.filter((el) => el.pinned).map((el, idx) => {
                  return <ChatElement {...el} />;
                })} */}
                <Typography variant='subtitle2' sx={{ color: "#676667" }}>
                  All Chats
                </Typography>
                {/* Chat List */}
                {conversations
                  .filter((el) => !el.pinned)
                  .map((el, idx) => {
                    return <ChatElement {...el} />;
                  })}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
      {openDialog && <Friends open={openDialog} handleClose={handleCloseDialog} />}
    </>
  );
};

export default ChatApp;
