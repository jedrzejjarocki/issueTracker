import {ListItemIcon, Typography} from '@material-ui/core';
import React from 'react';
import UserAvatar from '../commons/UserAvatar';

export default (currentProject, user) => {
  const members = [
    {
      value: 0,
      label: (
        <Typography color="textSecondary" component="i">
          not assigned
        </Typography>
      ),
    },
  ];

  if (currentProject && currentProject.team) {
    currentProject.team.map(({ username, id, userId }) => {
      const isCurrentUser = userId === user.id;
      members.push({
        value: id,
        label: (
          <Typography>
            <ListItemIcon>
              <UserAvatar name={username} isCurrentUser={isCurrentUser} />
            </ListItemIcon>
            {username}
            {isCurrentUser && (
              <Typography color="textSecondary" component="i">
                {' (yourself)'}
              </Typography>
            )}
          </Typography>
        ),
      });
    });
  }
  return members;
};
