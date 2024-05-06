import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Editform } from '../Editform';

export default function EditModal({user}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} className='flex justify-center items-center content-center'>
        Edit Details
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title " className='bg-green-400'>
        
        </DialogTitle>
        <DialogContent >
          <DialogContentText id="alert-dialog-description"  >
          <Editform userData = {user}/>
          </DialogContentText>
        </DialogContent>

      </Dialog>
    </React.Fragment>
  );
}