import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Redirect, Route, RouteComponentProps, Switch, withRouter,} from 'react-router-dom';
import {Grid} from '@material-ui/core';
import IssueDetails from '../Issue/IssueDetails';
import Sprint from '../issuesList/Sprint/Sprint';
import Backlog from '../issuesList/Backlog/Backlog';
import useSetCurrentProject from '../../hooks/useSetCurrentProject';
import Team from '../Team/Team';
import {RootState} from '../../redux/rootReducer';
import {getProjectById} from '../../redux/projects/selectors';
import {getSprintsByProjectId} from '../../redux/issuesContainers/selectors';
import {getCurrentUserRoleByProjectId} from '../../redux/teamMembers/selectors';

const Project: React.FC<RouteComponentProps<any> & ReduxProps> = ({
  project, sprints, match, userRole,
}) => {
  useSetCurrentProject(userRole);
  return (
    <>
      <Grid container>
        <Switch>
          <Route path={`${match.path}/board`}>
            <Grid container spacing={2}>
              <Grid item xs lg>
                {sprints.map((sprint) => (
                  <Sprint key={sprint.id} project={project} sprint={sprint} />
                ))}
                <Backlog project={project} />
              </Grid>
              <Route path={`${match.path}/board/issues/:issueId`}>
                <IssueDetails project={project} />
              </Route>
            </Grid>
          </Route>
          <Route path={`${match.path}/team`}>
            <Team />
          </Route>
          <Route>
            <Redirect to={`${match.url}/board`} />
          </Route>
        </Switch>
      </Grid>
    </>
  );
};

const mapStateToProps = (state: RootState, props: RouteComponentProps<{ projectId: string }>) => ({
  project: getProjectById(state, props.match.params.projectId),
  sprints: getSprintsByProjectId(state, props.match.params.projectId),
  userRole: getCurrentUserRoleByProjectId(state, props.match.params.projectId),
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default withRouter(connector(Project));
