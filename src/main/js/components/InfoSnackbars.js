import React, {useEffect, useState} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import * as propTypes from "../propTypes";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const InfoSnackbar = ({ message }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!message);
  }, [message]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={message.severity}>
        {message.content}
      </Alert>
    </Snackbar>
  );
};

InfoSnackbar.defaultProps = {
  message: null,
};

InfoSnackbar.propTypes = {
  message: propTypes.message,
};

export default InfoSnackbar;
