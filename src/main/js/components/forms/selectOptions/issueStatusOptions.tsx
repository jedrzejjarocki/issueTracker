import { Chip } from '@material-ui/core';
import React from 'react';
import IssueStatuses from '../../../constants/issueStatuses';

export default Object.values(IssueStatuses).map(({ value, color, text }) => ({
  value,
  label: <Chip label={text} color={color} />,
}));
