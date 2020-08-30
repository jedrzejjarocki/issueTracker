import { Typography } from '@material-ui/core';
import React from 'react';
import Backlog from '../../../entities/Backlog';
import Sprint from '../../../entities/Sprint';

const backlogLabel = (
  <Typography color="textSecondary" component="i">
    add to backlog
  </Typography>
);

export default (issuesContainers: (Sprint | Backlog)[]) => issuesContainers.map((container) => ({
  value: container.id,
  label: container instanceof Backlog ? backlogLabel : <Typography>{container.name}</Typography>,
}));
