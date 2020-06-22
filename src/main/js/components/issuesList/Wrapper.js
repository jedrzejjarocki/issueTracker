import {makeStyles, Paper} from '@material-ui/core';
import React from 'react';
import * as propTypes from '../../propTypes';

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

const Wrapper = ({ children }) => {
  const classes = useStyles();
  return (
    <Paper variant="outlined" className={classes.root} component="section">
      {children}
    </Paper>
  );
};

Wrapper.propTypes = {
  children: propTypes.children.isRequired,
};

export default Wrapper;
