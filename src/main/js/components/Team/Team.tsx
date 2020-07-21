import React from 'react';
import {Grid} from '@material-ui/core';
import {connect, ConnectedProps} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import TeamMember from './TeamMember';
import {RootState} from '../../redux/rootReducer';
import {getTeamMembersByProjectId} from '../../redux/teamMembers/selectors';
import {getUser} from '../../redux/user/selectors';
import {getCurrentProjectUserRole} from '../../redux/ui/selectors';

const Team: React.FC<ReduxProps> = ({ team, userRole, currentUserId }) => (
  <Grid container item spacing={3}>
    {
      team.map((member) => (
        <TeamMember
          currentUserId={currentUserId}
          member={member}
          userRole={userRole}
        />
      ))
    }
  </Grid>
);

const mapStateToProps = (state: RootState, { match }: RouteComponentProps<{ projectId: string }>) => ({
  team: getTeamMembersByProjectId(state, match.params.projectId),
  userRole: getCurrentProjectUserRole(state),
  currentUserId: getUser(state).id,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(connector(Team));
