import React from 'react';
import {makeStyles} from '@material-ui/core';
import {useLocation} from 'react-router-dom';
import ChangePasswordForm from './ChangePasswordForm';
import PasswordRecoveryRequestForm from './PasswordRecoveryRequestForm';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.main,
    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      marginBottom: theme.spacing(3),
    },
  },
}));

const PasswordRecovery = () => {
  const classes = useStyles();
  const token = useLocation().search.split('=')[1];
  return (
    <div className={classes.root}>
      {token ? (
        <ChangePasswordForm token={token} />
      ) : (
        <PasswordRecoveryRequestForm />
      )}
    </div>
  );
};

export default PasswordRecovery;
