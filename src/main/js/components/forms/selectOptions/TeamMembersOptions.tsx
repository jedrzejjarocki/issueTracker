import { Typography } from '@material-ui/core';
import React from 'react';
import UserAvatar from '../../commons/UserAvatar';
import TeamMember from '../../../entities/TeamMember';

export default (teamMembers: TeamMember[], currentUserId: number) => {
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

  teamMembers.map(({ username, id, userId }) => {
    const isCurrentUser = userId === currentUserId;
    members.push({
      value: id,
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <UserAvatar username={username} currentUser={isCurrentUser} size="small" style={{ marginRight: '8px' }} />
          <Typography style={{ display: 'inline' }}>
            {username}
            {isCurrentUser && (
              <Typography color="textSecondary" component="i">
                {' (yourself)'}
              </Typography>
            )}
          </Typography>
        </div>
      ),
    });
  });

  return members;
};
