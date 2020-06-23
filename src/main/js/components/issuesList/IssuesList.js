import React from 'react';
import PropTypes from 'prop-types';
import {Chip, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography,} from '@material-ui/core';
import * as propTypes from '../../propTypes';
import issueTypes from '../../constants/issueTypes';
import issueStatus from '../../constants/issuStatuses';
import RouterLink from '../commons/RouterLink';

const useStyles = makeStyles((theme) => ({
  itemDetails: {
    display: 'flex',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
  empty: {
    padding: theme.spacing(2),
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const getMemberName = (id, project) => project.team.find((member) => member.id === id);

const IssuesList = ({ issues, project }) => {
  const classes = useStyles();
  console.log(project);
  return (
    <>
      {
        issues && issues.length
          ? (
            <List dense>
              {issues.map(({
                id, type, summary, storyPointsEstimate, status, assignee,
              }) => (
                <>
                  <RouterLink to={`/projects/${project.id}/issues/${id}`}>
                    <ListItem button key={id}>
                      <ListItemIcon>{issueTypes[type]}</ListItemIcon>
                      <ListItemText primary={summary} />
                      <div className={classes.itemDetails}>
                        {/* {!!assignee && ( */}
                        {/* <UserAvatar */}
                        {/*  name={assignee.username || getMemberName(assignee.id, project)} */}
                        {/*  classes={classes.avatar} */}
                        {/* /> */}
                        {/* )} */}
                        {!!storyPointsEstimate && (
                        <Chip size="small" label={storyPointsEstimate} />
                        )}
                        <Chip
                          size="small"
                          label={issueStatus[status].text}
                          color={issueStatus[status].color}
                        />
                        <ListItemText primary={`${project.projectKey}-${id}`} />
                      </div>
                    </ListItem>
                  </RouterLink>
                </>
              ))}
            </List>
          ) : (
            <Typography color="textSecondary" className={classes.empty}>
              <i>empty</i>
            </Typography>
          )
      }
    </>
  );
};

IssuesList.propTypes = {
  issues: PropTypes.arrayOf(propTypes.issue).isRequired,
  project: propTypes.project.isRequired,
};

export default IssuesList;
