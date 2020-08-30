import React from 'react';
import { Grid } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import TeamMember from './TeamMember';
import { RootState } from '../../redux/rootReducer';
import { getTeamMembersByProjectId } from '../../redux/teamMembers/selectors';
import { getCurrentProject } from '../../redux/ui/selectors';

const Team: React.FC<ReduxProps> = ({ team, userRole }) => (
  <Grid container item spacing={3}>
    {
      team.map((member) => (
        <TeamMember
          member={member}
          userRole={userRole}
        />
      ))
    }
  </Grid>
);

const mapStateToProps = (
  state: RootState,
  { match }: RouteComponentProps<{ projectId: string }>,
) => ({
  team: getTeamMembersByProjectId(state, match.params.projectId),
  userRole: getCurrentProject(state)!.userRole,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(connector(Team));
