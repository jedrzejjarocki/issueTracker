import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Route, Switch, withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {Grid} from "@material-ui/core";
import * as propTypes from "../propTypes";
import creators from "../redux/actions/creators";
import IssuesList from "./IssuesList";
import IssueDetails from "./IssueDetails";

const Project = ({ project, setCurrentProject, match }) => {
  useEffect(() => {
    setCurrentProject(project.id);
  }, [project.id, project.projectKey]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={match.isExact ? 12 : 8} lg={match.isExact ? 12 : 7}>
        {(project.sprints || []).map((list) => {
          if (list.issues.length) {
            return <IssuesList list={list} project={project} key={list.id} />;
          }
        })}
        {project.backlog && !!project.backlog.issues.length && (
          <IssuesList list={project.backlog} project={project} />
        )}
      </Grid>
      <Switch>
        <Route path={`${match.path}/issues/:issueId`}>
          <IssueDetails project={project} />
        </Route>
      </Switch>
    </Grid>
  );
};

Project.propTypes = {
  project: propTypes.project.isRequired,
  setCurrentProject: PropTypes.func.isRequired,
  match: PropTypes.shape({
    isExact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
};

const getProjectById = (state, id) =>
  state.projects.find((project) => project.id === +id);

const mapStateToProps = (state, { match }) => ({
  project: getProjectById(state, match.params.projectId),
  currentProject: state.ui.currentProject,
});

const matchDispatchToProps = {
  setCurrentProject: creators.setCurrentProject,
};

export default withRouter(
  connect(mapStateToProps, matchDispatchToProps)(Project)
);
