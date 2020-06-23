import {Chip} from '@material-ui/core';
import React from 'react';
import issueStatus from '../../constants/issuStatuses';

export default Object.entries(issueStatus).map(([value, props]) => ({
  value,
  label: <Chip label={props.text} color={props.color} />,
}));
