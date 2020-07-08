import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Redirect, Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom';
import {Grid} from '@material-ui/core';
import IssueDetails from '../Issue/IssueDetails';
import Sprint from '../issuesList/Sprint/Sprint';
import Backlog from '../issuesList/Backlog/Backlog';
import useSetCurrentProject from '../../hooks/useSetCurrentProject';
import Team from '../Team/Team';
import {RootState} from "../../redux/reducers/rootReducer";
import {getProjectById} from "../../redux/selectors/project";
import {getSprintsByProjectId} from "../../redux/selectors/issuesLists";
import {getCurrentUserRoleByProjectId} from "../../redux/selectors/teamMembers";

interface ProjectProps extends RouteComponentProps<any>, ReduxProps{}

const Project: React.FC<ProjectProps> = ({
  project, sprints, match: { path, url, isExact }, userRole,
}) => {
  useSetCurrentProject(userRole);
  return (
    <>
      <Grid container spacing={3}>
        <Switch>
          <Route path={`${path}/board`}>
              <Grid item xs={isExact ? 12 : 8} lg={isExact ? 12 : 7}>
              {sprints && sprints.map((sprint) => (
                <Sprint key={sprint.id} project={project} sprint={sprint} />
              ))}
              <Backlog project={project} />
              </Grid>
            <Route path={`${path}/board/issues/:issueId`}>
              <IssueDetails project={project} />
            </Route>
          </Route>
          <Route path={`${path}/team`}>
            <Team />
          </Route>
          <Route>
            <Redirect to={`${url}/board`} />
          </Route>
        </Switch>
      </Grid>
    </>
  );
};

const mapStateToProps = (state: RootState, props: RouteComponentProps<{ projectId: string }>) => ({
  project: getProjectById(state, props.match.params.projectId),
  sprints: getSprintsByProjectId(state, +props.match.params.projectId),
  userRole: getCurrentUserRoleByProjectId(state, +props.match.params.projectId),
});

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>

export default withRouter(connector(Project));
