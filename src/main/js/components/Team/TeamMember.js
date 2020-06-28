import React from 'react';
import PropTypes from 'prop-types';
import {Grid, makeStyles, Paper, Typography,} from '@material-ui/core';
import UserAvatar from '../commons/UserAvatar';
import DeleteMember from './DeleteMember';
import ChangeTeamMemberRole from './ChangeTeamMemberRole';

const useStyles = makeStyles(() => ({
  root: {
    minWidth: 150,
    minHeight: 220,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
}));

const TeamMember = ({ member, userRole, currentUserId }) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Paper variant="outlined" className={classes.root}>
        <UserAvatar name={member.username} isCurrentUser={member.userId === currentUserId} size="large" />
        <Typography variant="h5">{member.username}</Typography>
        <Typography variant="overline">{member.role}</Typography>
        {userRole === 'LEADER' && (
        <Grid item>
          <ChangeTeamMemberRole member={member} />
          <DeleteMember member={member} />
        </Grid>
        )}
      </Paper>
    </Grid>
  );
};

TeamMember.propTypes = {
  member: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['LEADER', 'DEVELOPER']).isRequired,
  }).isRequired,
  userRole: PropTypes.oneOf(['LEADER', 'DEVELOPER']).isRequired,
};

export default TeamMember;
