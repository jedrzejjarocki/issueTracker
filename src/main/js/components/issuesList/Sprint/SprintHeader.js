import React from 'react';
import PropTypes from 'prop-types';
import {Button, Typography} from '@material-ui/core';

const SprintHeader = (
  { name },
) => (
  <header>
    <Typography variant="subtitle2">{name}</Typography>
    <Button variant="outlined" color="primary">Start</Button>
  </header>
);

SprintHeader.propTypes = {
  name: PropTypes.string.isRequired,
};

export default SprintHeader;
