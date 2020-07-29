import React, { SyntheticEvent, useEffect, useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { NotificationMessage } from '../redux/ui/NotificationMessage';

interface Props {
  onClose: (event: SyntheticEvent) => void
  message: NotificationMessage
}

const Alert: React.FC<Props> = ({ onClose, message }) => (
  <MuiAlert elevation={6} variant="filled" severity={message.severity} onClose={onClose}>
    {message.content}
  </MuiAlert>
);

const InfoSnackbar = ({ message }: { message: NotificationMessage}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!message);
  }, [message]);

  const handleClose = (event: SyntheticEvent) => {
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} message={message} />
    </Snackbar>
  );
};

export default InfoSnackbar;
