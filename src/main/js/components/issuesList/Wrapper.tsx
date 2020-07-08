import {makeStyles, Paper} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
    '& header': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing(1, 2),
    },
  },
}));

const Wrapper: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Paper variant="outlined" className={classes.root} component="section">
      {children}
    </Paper>
  );
};

export default Wrapper;
