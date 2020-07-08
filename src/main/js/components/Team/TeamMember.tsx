import React from 'react';
import {Grid, makeStyles, Paper, Typography,} from '@material-ui/core';
import UserAvatar from '../commons/UserAvatar';
import DeleteMember from './DeleteMember';
import ChangeTeamMemberRole from './ChangeTeamMemberRole';
import {TeamMember, UserRole} from "../../propTypes";

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

interface Props {
  member: TeamMember
  userRole: UserRole
  currentUserId: number
}

const TeamMember: React.FC<Props> = ({ member, userRole, currentUserId }) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Paper variant="outlined" className={classes.root}>
        <UserAvatar name={member.username} isCurrentUser={member.userId === currentUserId} size="large" />
        <Typography variant="h5">{member.username}</Typography>
        <Typography variant="overline">{member.role}</Typography>
        {userRole === UserRole.LEADER && (
        <Grid item>
          <ChangeTeamMemberRole member={member} />
          <DeleteMember member={member} />
        </Grid>
        )}
      </Paper>
    </Grid>
  );
};

export default TeamMember;
