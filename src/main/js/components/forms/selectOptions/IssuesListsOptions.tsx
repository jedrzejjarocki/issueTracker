import {Typography} from '@material-ui/core';
import React from 'react';
import {Backlog, Sprint} from '../../../propTypes';

const backlogLabel = (
  <Typography color="textSecondary" component="i">
    add to backlog
  </Typography>
);

export default (issuesLists: (Backlog | Sprint)[]) => issuesLists.map((list) => ({
  value: list.id,
  label: list.type === 'Backlog' ? backlogLabel : <Typography>{list.name}</Typography>,
}));
