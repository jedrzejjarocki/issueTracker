import React from 'react';
import {
  Grid, makeStyles, Paper, Typography,
} from '@material-ui/core';
import UserAvatar from '../commons/UserAvatar';
import DeleteMember from './DeleteMember';
import ChangeTeamMemberRole from './ChangeTeamMemberRole';
import Member from '../../entities/TeamMember';
import { UserRole } from '../../redux/utilTypes';

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
  member: Member
  userRole: UserRole
}

const TeamMember: React.FC<Props> = ({ member, userRole }) => {
  const classes = useStyles();

  return (
    <Grid item>
      <Paper variant="outlined" className={classes.root}>
        <UserAvatar username={member.username} userId={member.userId} size="large" />
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
