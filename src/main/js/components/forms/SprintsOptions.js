import {Typography} from '@material-ui/core';
import React from 'react';

export default (currentProject) => {
  const sprints = [];
  if (!currentProject) return sprints;
  sprints.push({
    value: 0,
    label: (
      <Typography color="textSecondary" component="i">
        add to backlog
      </Typography>
    ),
  });
  if (currentProject.sprints) {
    currentProject.sprints.map(({ id, name }) => {
      sprints.push({
        value: id,
        label: <Typography>{name}</Typography>,
      });
    });
  }
  return sprints;
};
