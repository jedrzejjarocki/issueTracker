import {ListItem, ListItemIcon} from '@material-ui/core';
import React from 'react';
import IssueTypes from '../../../constants/issueTypes';

export default Object.values(IssueTypes).map(({ value, icon }) => ({
  value,
  label: (
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      {value}
    </ListItem>
  ),
}));
