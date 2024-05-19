import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Slide, Stack, Tab, Tabs } from "@mui/material";

import { FriendElement, FriendRequestElement, UserElement } from "./UserElement";

interface UserProps {
  img: string;
  firstName: string;
  lastName: string;
  online: boolean;
  _id: string;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const UsersList = () => {
  const [users, setUsers] = useState([
    {
      img: "https://source.unsplash.com/random",
      firstName: "John",
      lastName: "Doe",
      online: true,
      _id: "1",
    },
    {
      img: "https://source.unsplash.com/random",
      firstName: "Jane",
      lastName: "Doe",
      online: false,
      _id: "2",
    },
  ]);

  useEffect(() => {
    // dispatch(FetchUsers());
  }, []);

  return (
    <>
      {users.map((el, idx) => {
        return <UserElement key={idx} {...el} />;
      })}
    </>
  );
};

const FriendsList = () => {
  const [friends, setFriends] = useState([
    {
      img: "https://source.unsplash.com/random",
      firstName: "John",
      lastName: "Doe",
      online: true,
      _id: "1",
    },
    {
      img: "https://source.unsplash.com/random",
      firstName: "Jane",
      lastName: "Doe",
      online: false,
      _id: "2",
    },
  ]);
  useEffect(() => {
    // dispatch(FetchFriends());
  }, []);

  return (
    <>
      {friends.map((el, idx) => {
        return <FriendElement key={idx} {...el} />;
      })}
    </>
  );
};

const RequestsList = () => {
  const [friendRequests, setFriendRequests] = useState([
    {
      sender: {
        img: "https://source.unsplash.com/random",
        firstName: "John",
        lastName: "Doe",
        online: true,
        _id: "1",
      },
      _id: "1",
    },
    {
      sender: {
        img: "https://source.unsplash.com/random",
        firstName: "Jane",
        lastName: "Doe",
        online: false,
        _id: "2",
      },
      _id: "2",
    },
  ]);
  useEffect(() => {
    // dispatch(FetchFriendRequests());
  }, []);

  return (
    <>
      {friendRequests.map((el, idx) => {
        return <FriendRequestElement key={idx} {...el.sender} id={el._id} />;
      })}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth='xs'
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby='alert-dialog-slide-description'
      sx={{ p: 4 }}>
      {/* <DialogTitle>{"Friends"}</DialogTitle> */}
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label='Explore' />
          <Tab label='Friends' />
          <Tab label='Requests' />
        </Tabs>
      </Stack>
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.4}>
            {(() => {
              switch (value) {
                case 0: // display all users in this list
                  return <UsersList />;

                case 1: // display friends in this list
                  return <FriendsList />;

                case 2: // display request in this list
                  return <RequestsList />;

                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
