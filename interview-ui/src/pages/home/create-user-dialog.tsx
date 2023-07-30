import React, { useState } from 'react';
import { Button, Dialog, Divider } from '@mui/material';

import './styles.scss';

// const Transition = React.forwardRef(function Transition(
//   props: TransitionProps & {
//     children: React.ReactElement<any, any>;
//   },
//   ref: React.Ref<unknown>
// ) {
//   return <Slide direction="right" ref={ref} {...props} />;
// });

interface CreateUserProps {
  handleClickOpen: () => void;
  handleClose: () => void;
  openDialog: boolean;
}

const CreateUserDialog: React.FC<CreateUserProps> = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <div className="container">
      <button className="rmv-default add-user-button" onClick={handleClickOpen}>
        <p className="title-text">Add User</p>
      </button>
      <Dialog
        open={openDialog}
        // TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth={'md'}>
        <>
          <div className="dialog-header">
            <p className="dialog-title">Create User</p>
            <Button
              className="rmv-default"
              variant="contained"
              color="primary"
              onClick={handleClose}>
              Cancel
            </Button>
          </div>
          <Divider />

          <Divider />
        </>
      </Dialog>
    </div>
  );
};
export default CreateUserDialog;
