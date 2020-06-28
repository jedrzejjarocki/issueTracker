import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch, useRouteMatch, withRouter,} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core';
import * as propTypes from '../../propTypes';
import IssueDetails from '../Issue/IssueDetails';
import Sprint from '../issuesList/Sprint/Sprint';
import Backlog from '../issuesList/Backlog/Backlog';
import {getProjectById, getSprintsByProjectId, getUserRoleByProjectId} from '../../redux/selectors';
import useSetCurrentProject from '../../hooks/useSetCurrentProject';
import Team from '../Team/Team';

const IssuesListsContainer = ({ project, sprints }) => {
  const { isExact } = useRouteMatch();
  return (
    <Grid item xs={isExact ? 12 : 8} lg={isExact ? 12 : 7}>
      {sprints && sprints.map((sprint) => (
        <Sprint key={sprint.id} project={project} sprint={sprint} />
      ))}
      <Backlog project={project} />
    </Grid>
  );
};

const Project = ({
  project, sprints, match: { path, url }, userRole,
}) => {
  useSetCurrentProject(userRole);
  return (
    <>
      <Grid container spacing={3}>
        <Switch>
          <Route path={`${path}/board`}>
            <IssuesListsContainer project={project} sprints={sprints} />
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

Project.propTypes = {
  project: propTypes.project.isRequired,
  sprints: PropTypes.arrayOf(propTypes.sprint).isRequired,
  userRole: PropTypes.string.isRequired,
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, props) => ({
  project: getProjectById(props.match.params.projectId, state),
  sprints: getSprintsByProjectId(props.match.params.projectId, state),
  userRole: getUserRoleByProjectId(props.match.params.projectId, state),
});

export default withRouter(connect(mapStateToProps)(Project));
