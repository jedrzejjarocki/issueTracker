import React from 'react';
import clsx from 'clsx';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Card, CardActions, CardContent, Collapse, Grid, IconButton, makeStyles, Typography,} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {getUsersWithMemberships} from '../../redux/selectors';
import UserAvatar from '../commons/UserAvatar';
import AddTeamMember from './AddTeamMember';
import InviteUser from './InviteUser';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 180,
    minHeight: 230,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

const User = ({
  user, currentUserId, projects, teamMembers,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Grid item key={user.id}>
      <Card variant="outlined" className={classes.root}>
        <CardContent>
          <Grid container direction="column" alignItems="center" justify="space-between">
            <UserAvatar name={user.username} isCurrentUser={user.id === currentUserId} size="large" />
            <Typography style={{ paddingTop: '12px' }} variant="h5">{user.username}</Typography>
          </Grid>
        </CardContent>
        <CardActions disableSpacing>
          <AddTeamMember user={user} projects={projects} currentUserId={currentUserId} teamMembers={teamMembers} />
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Grid container direction="column" justify="center" alignItems="center">
              <Typography>PROJECTS</Typography>
              {user.memberships.map(({ project, role }) => (
                <Typography variant="overline">
                  {`${project.name} \u2022 ${role}`}
                </Typography>
              ))}
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

const People = ({
  users, currentUserId, projects, teamMembers,
}) => (
  <>
    <Grid container item spacing={3}>
      {users.map((user) => (
        <User
          user={user}
          currentUserId={currentUserId}
          projects={projects}
          teamMembers={teamMembers}
        />
      ))}
    </Grid>
    <InviteUser teamMembers={teamMembers} projects={projects} currentUserId={currentUserId} />
  </>
);

User.propTypes = {
  user: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    memberships: PropTypes.arrayOf(PropTypes.shape({
      project: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
      }),
      role: PropTypes.string.isRequired,
    })),
  })).isRequired,
  currentUserId: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  users: getUsersWithMemberships(state),
  currentUserId: state.user.id,
  projects: state.projects,
  teamMembers: state.teamMembers,
});

export default connect(mapStateToProps)(People);
