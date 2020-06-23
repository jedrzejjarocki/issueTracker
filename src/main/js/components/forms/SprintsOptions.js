import {Typography} from '@material-ui/core';
import React from 'react';

export default (sprints) => {
  const options = [{
    value: 0,
    label: (
      <Typography color="textSecondary" component="i">
        add to backlog
      </Typography>
    ),
  }];

  sprints.map(({ id, name }) => {
    options.push({
      value: id,
      label: <Typography>{name}</Typography>,
    });
  });

  return options;
};
