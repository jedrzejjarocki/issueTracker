import React from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Route, RouteComponentProps, Switch, withRouter,
} from 'react-router-dom';
import ProjectsList from '../Board/ProjectsList';
import Project from '../Board/Project';
import People from '../People/People';

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

const MainContainer: React.FC<RouteComponentProps> = ({ match }) => {
  const classes = useStyles();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
        <Route path={`${match.url}/projects/:projectId`}>
          <Project />
        </Route>
        <Route path={`${match.url}/projects`}>
          <ProjectsList />
        </Route>
        <Route path={`${match.url}/people`}>
          <People />
        </Route>
      </Switch>
    </main>
  );
};

export default withRouter(MainContainer);
