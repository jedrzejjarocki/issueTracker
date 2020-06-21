import React from "react";
import {makeStyles} from "@material-ui/core";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import ProjectsList from "../ProjectsList";
import Project from "../Project";

const useStyles = makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const MainContainer = () => {
  const classes = useStyles();
  const match = useRouteMatch();

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Switch>
        <Route path={`${match.url}/:projectId`}>
          <Project />
        </Route>
        <Route path={match.url}>
          <ProjectsList />
        </Route>
      </Switch>
    </main>
  );
};

export default MainContainer;
