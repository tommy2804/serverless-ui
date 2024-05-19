import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { FetchUserProfile, SelectConversation, showSnackbar } from "../../redux/slices/app";
import { socket, connectSocket } from "../../socket";
import {
  UpdateDirectConversation,
  AddDirectConversation,
  AddDirectMessage,
} from "../../redux/slices/conversation";
import AudioCallNotification from "../../sections/dashboard/Audio/CallNotification";
import VideoCallNotification from "../../sections/dashboard/video/CallNotification";
import AudioCallDialog from "../../sections/dashboard/Audio/CallDialog";
import VideoCallDialog from "../../sections/dashboard/video/CallDialog";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const { open_audio_notification_dialog, open_audio_dialog } = useSelector(
    (state) => state.audioCall
  );
  const { open_video_notification_dialog, open_video_dialog } = useSelector(
    (state) => state.videoCall
  );
  const { isLoggedIn } = useSelector((state) => state.auth);
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

  useEffect(() => {
    dispatch(FetchUserProfile());
  }, []);

  const handleCloseAudioDialog = () => {
    dispatch(UpdateAudioCallDialog({ state: false }));
  };
  const handleCloseVideoDialog = () => {
    dispatch(UpdateVideoCallDialog({ state: false }));
  };

  return (
    <>
      <Stack direction='row'>
        {isDesktop && (
          // SideBar
          <SideNav />
        )}

        <Outlet />
      </Stack>
      {open_audio_notification_dialog && (
        <AudioCallNotification open={open_audio_notification_dialog} />
      )}
      {open_audio_dialog && (
        <AudioCallDialog open={open_audio_dialog} handleClose={handleCloseAudioDialog} />
      )}
      {open_video_notification_dialog && (
        <VideoCallNotification open={open_video_notification_dialog} />
      )}
      {open_video_dialog && (
        <VideoCallDialog open={open_video_dialog} handleClose={handleCloseVideoDialog} />
      )}
    </>
  );
};

export default DashboardLayout;
