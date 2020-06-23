import React from 'react';
import {connect} from 'react-redux';
import {Route, Switch, useRouteMatch, withRouter,} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Grid} from '@material-ui/core';
import * as propTypes from '../propTypes';
import IssueDetails from './IssueDetails';
import Sprint from './issuesList/Sprint/Sprint';
import Backlog from './issuesList/Backlog/Backlog';
import {getCurrentProjectId, getProjectById, getSprintsByProjectId} from '../redux/selectors';
import useSetCurrentProject from '../hooks/useSetCurrentProject';

const Project = ({ project, sprints }) => {
  useSetCurrentProject();
  const { isExact, path } = useRouteMatch();
  return (
    <>
      {project && (
        <Grid container spacing={3}>
          <Grid item xs={isExact ? 12 : 8} lg={isExact ? 12 : 7}>
            {sprints && sprints.map((sprint) => (
              <Sprint project={project} sprint={sprint} />
            ))}
            <Backlog project={project} />
          </Grid>
          <Switch>
            <Route path={`${path}/issues/:issueId`}>
              <IssueDetails project={project} />
            </Route>
          </Switch>
        </Grid>
      )}
    </>
  );
};

Project.propTypes = {
  project: propTypes.project.isRequired,
  sprints: PropTypes.arrayOf(propTypes.sprint).isRequired,
};

const mapStateToProps = (state, { match }) => {
  const currentProjectId = +getCurrentProjectId(state);
  return {
    project: getProjectById(match.params.projectId, state),
    sprints: getSprintsByProjectId(match.params.projectId, state),
    currentProjectId,
  };
};

export default withRouter(connect(mapStateToProps)(Project));
