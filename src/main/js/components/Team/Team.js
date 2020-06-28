import React from 'react';
import {Grid} from '@material-ui/core';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {getTeamMembers} from '../../redux/selectors';
import TeamMember from './TeamMember';

const Team = ({ team, userRole, currentUserId }) => (
  <Grid container item spacing={3}>
    {
      team.map((member) => <TeamMember currentUserId={currentUserId} member={member} userRole={userRole} />)
    }
  </Grid>
);

const mapStateToProps = (state, { match }) => ({
  team: getTeamMembers(match.params.projectId, state),
  userRole: state.ui.currentProjectUserRole,
  currentUserId: state.user.id,
});

export default withRouter(connect(mapStateToProps)(Team));
