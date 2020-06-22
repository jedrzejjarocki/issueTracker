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
}));

const IssuesList = ({ issues, projectId, projectKey }) => {
  const classes = useStyles();
  return (
    <>
      {
        issues && issues.length
          ? (
            <List dense>
              {issues.map(({
                id, type, summary, storyPointsEstimate, status,
              }) => (
                <>
                  <RouterLink to={`/projects/${projectId}/issues/${id}`}>
                    <ListItem button key={id}>
                      <ListItemIcon>{issueTypes[type]}</ListItemIcon>
                      <ListItemText primary={summary} />
                      <div className={classes.itemDetails}>
                        {!!storyPointsEstimate && (
                        <Chip size="small" label={storyPointsEstimate} />
                        )}
                        <Chip
                          size="small"
                          label={status}
                          color={issueStatus[status]}
                        />
                        <ListItemText primary={`${projectKey}-${id}`} />
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
  projectId: PropTypes.number.isRequired,
  projectKey: PropTypes.string.isRequired,
};

export default IssuesList;
