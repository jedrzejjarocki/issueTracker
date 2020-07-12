import {ListItem, ListItemAvatar, ListItemText, Typography,} from '@material-ui/core';
import React from 'react';
import UserAvatar from '../../commons/UserAvatar';

// @TODO types
export default (teamMembers: { username: string, id: number, userId: number}[], currentUserId: number) => {
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

  if (teamMembers) {
    teamMembers.map(({ username, id, userId }) => {
      const isCurrentUser = userId === currentUserId;
      members.push({
        value: id,
        label: (
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <UserAvatar name={username} isCurrentUser={isCurrentUser} size="small" />
            </ListItemAvatar>
            <ListItemText primary={(
              <Typography style={{ display: 'inline' }}>
                {username}
                {isCurrentUser && (
                  <Typography color="textSecondary" component="i">
                    {' (yourself)'}
                  </Typography>
                )}
              </Typography>
            )}
            />
          </ListItem>
        ),
      });
    });
  }

  return members;
};
