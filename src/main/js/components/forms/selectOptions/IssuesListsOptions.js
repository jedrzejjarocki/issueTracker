import {Typography} from '@material-ui/core';
import React from 'react';

const backlogLabel = (
  <Typography color="textSecondary" component="i">
    add to backlog
  </Typography>
);

export default (issuesLists) => issuesLists.map(({ id, name, type }) => ({
  value: id,
  label: type === 'Backlog' ? backlogLabel : <Typography>{name}</Typography>,
}));
