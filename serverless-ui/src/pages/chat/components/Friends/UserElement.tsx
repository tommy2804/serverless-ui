import React from "react";
import { Box, Badge, Stack, Avatar, Typography, IconButton, Button } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Chat } from "phosphor-react";

interface UserProps {
  img: string;
  firstName: string;
  lastName: string;
  online: boolean;
  _id: string;
}

interface FriendRequestProps extends UserProps {
  incoming: boolean;
  missed: boolean;
  id: string;
}

interface FriendProps extends UserProps {
  incoming: boolean;
  missed: boolean;
}

const user_id = window.localStorage.getItem("user_id");

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const UserElement: React.FC<UserProps> = ({ img, firstName, lastName, online, _id }) => {
  const theme = useTheme();
  const name = `${firstName} ${lastName}`;

  const sendFriendRequest = () => {
    socket.emit("friend_request", { to: _id, from: user_id }, () => {
      alert("Request sent");
    });
  };

  return (
    <StyledChatBox>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Stack direction='row' alignItems='center' spacing={2}>
          {online ? (
            <StyledBadge overlap='circular' variant='dot'>
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant='subtitle2'>{name}</Typography>
          </Stack>
        </Stack>
        <Button onClick={sendFriendRequest}>Send Request</Button>
      </Stack>
    </StyledChatBox>
  );
};

const FriendRequestElement: React.FC<FriendRequestProps> = ({
  img,
  firstName,
  lastName,
  incoming,
  missed,
  online,
  id,
  _id,
}) => {
  const name = `${firstName} ${lastName}`;

  const acceptFriendRequest = () => {
    socket.emit("accept_request", { request_id: id });
  };

  return (
    <StyledChatBox>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Stack direction='row' alignItems='center' spacing={2}>
          {online ? (
            <StyledBadge overlap='circular' variant='dot'>
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant='subtitle2'>{name}</Typography>
          </Stack>
        </Stack>
        <Button onClick={acceptFriendRequest}>Accept Request</Button>
      </Stack>
    </StyledChatBox>
  );
};

const FriendElement: React.FC<FriendProps> = ({ img, firstName, lastName, online, _id }) => {
  const name = `${firstName} ${lastName}`;

  const startConversation = () => {
    socket.emit("start_conversation", { to: _id, from: user_id });
  };

  return (
    <StyledChatBox>
      <Stack direction='row' alignItems='center' justifyContent='space-between'>
        <Stack direction='row' alignItems='center' spacing={2}>
          {online ? (
            <StyledBadge overlap='circular' variant='dot'>
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant='subtitle2'>{name}</Typography>
          </Stack>
        </Stack>
        <IconButton onClick={startConversation}>
          <Chat />
        </IconButton>
      </Stack>
    </StyledChatBox>
  );
};

export { UserElement, FriendRequestElement, FriendElement };
