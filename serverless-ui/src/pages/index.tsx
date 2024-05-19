import { useTranslation } from "react-i18next";
import Navbar from "./landing/components/navbar";
import { useEffect, useRef } from "react";
import { useLandingPageContext } from "./landing/context/landing-page-context";
import { Box, Typography, useTheme } from "@mui/material";
import { Stack, Chats } from "phosphor-react";
import { Link, useSearchParams } from "react-router-dom";
import sideBar from "../components/sidebar/side-bar";
import theme from "../theme";

const MainLayout = () => {
  const [searchParams] = useSearchParams();

  const theme = useTheme();

  const chat_type = "individual";
  const room_id = "123";

  return (
    <Stack direction='row' sx={{ width: "100%" }}>
      <Chats />
      <Box
        sx={{
          height: "100%",
          width:
            // sideBar.open ?
            `calc(100vw - 740px )`,
          // : "calc(100vw - 420px )",
          backgroundColor: theme.palette.mode === "light" ? "#FFF" : theme.palette.background.paper,
          borderBottom:
            searchParams.get("type") === "individual-chat" && searchParams.get("id")
              ? "0px"
              : "6px solid #0162C4",
        }}>
        {chat_type === "individual" && room_id !== null ? (
          <ChatComponent />
        ) : (
          <Stack
            spacing={2}
            sx={{ height: "100%", width: "100%" }}
            alignItems='center'
            justifyContent={"center"}>
            {/* <NoChat /> */}
            <Typography variant='subtitle2'>
              Select a conversation or start a{" "}
              <Link
                style={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                }}
                to='/'>
                new one
              </Link>
            </Typography>
          </Stack>
        )}
      </Box>
      {sideBar.open &&
        (() => {
          switch (sideBar.type) {
            case "CONTACT":
              return <Contact />;

            case "STARRED":
              return <StarredMessages />;

            case "SHARED":
              return <Media />;

            default:
              break;
          }
        })()}
    </Stack>
  );
};
export default MainLayout;
