import {ListItem, ListItemIcon} from '@material-ui/core';
import React from 'react';
import issueTypes from '../../constants/issueTypes';

export default Object.entries(issueTypes).map(([name, icon]) => ({
  value: name,
  label: (
    <ListItem>
      <ListItemIcon>{icon}</ListItemIcon>
      {name}
    </ListItem>
  ),
}));
