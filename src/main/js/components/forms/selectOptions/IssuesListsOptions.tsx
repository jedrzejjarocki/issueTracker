import { Typography } from '@material-ui/core';
import React from 'react';
import Backlog from '../../../entities/Backlog';
import Sprint from '../../../entities/Sprint';

const backlogLabel = (
  <Typography color="textSecondary" component="i">
    add to backlog
  </Typography>
);

export default (issuesLists: (Sprint | Backlog)[]) => issuesLists.map((list) => ({
  value: list.id,
  label: list.type === 'Backlog' ? backlogLabel : <Typography>{list.name}</Typography>,
}));
