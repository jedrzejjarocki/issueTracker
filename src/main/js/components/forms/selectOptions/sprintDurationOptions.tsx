import {Typography} from '@material-ui/core';
import React from 'react';

export default [1, 2, 3, 4].map((duration) => ({
  value: duration,
  label: <Typography>{`${duration} week${duration === 1 ? '' : 's'}`}</Typography>,
}));
