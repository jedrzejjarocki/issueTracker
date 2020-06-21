import React from "react";
import {Chip, List, ListItem, ListItemIcon, ListItemText, makeStyles, Paper, Typography,} from "@material-ui/core";
import * as propTypes from "../propTypes";
import issueTypes from "../constants/issueTypes";
import issueStatus from "../constants/issuStatuses";
import RouterLink from "./commons/RouterLink";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(3),
  },
  heading: {
    margin: theme.spacing(2),
  },
  list: {
    padding: 0,
  },
  itemDetails: {
    display: "flex",
    "& > *": {
      marginLeft: theme.spacing(1),
    },
  },
}));

const IssuesList = ({ list, project }) => {
  const classes = useStyles();
  return (
    <Paper elevation={2} variant="outlined" className={classes.root}>
      <Typography
        variant="subtitle1"
        color="textSecondary"
        className={classes.heading}
      >
        {list.name || "Backlog"}
      </Typography>
      <List dense className={classes.list}>
        {list.issues.map((issue) => (
          <>
            <RouterLink to={`/projects/${project.id}/issues/${issue.id}`}>
              <ListItem button key={issue.id}>
                <ListItemIcon>{issueTypes[issue.type]}</ListItemIcon>
                <ListItemText primary={issue.summary} />
                <div className={classes.itemDetails}>
                  {!!issue.storyPointsEstimate && (
                    <Chip size="small" label={issue.storyPointsEstimate} />
                  )}
                  <Chip
                    size="small"
                    label={issue.status}
                    color={issueStatus[issue.status]}
                  />
                  <ListItemText primary={`${project.projectKey}-${issue.id}`} />
                </div>
              </ListItem>
            </RouterLink>
          </>
        ))}
      </List>
    </Paper>
  );
};

IssuesList.propTypes = {
  list: propTypes.sprint.isRequired,
  project: propTypes.project.isRequired,
};

export default IssuesList;
