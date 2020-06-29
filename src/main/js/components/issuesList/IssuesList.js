import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Chip, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography,} from '@material-ui/core';
import * as propTypes from '../../propTypes';
import issueTypes from '../../constants/issueTypes';
import issueStatus from '../../constants/issueStatuses';
import RouterLink from '../commons/RouterLink';
import UserAvatar from '../commons/UserAvatar';
import {getIssuesByListId} from '../../redux/selectors';

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

const getMember = (id, teamMembers) => teamMembers[id];

const IssuesList = ({
  issues, project, teamMembers, currentUserId,
}) => {
  const classes = useStyles();
  return (
    <>
      {
        issues && issues.length
          ? (
            <List dense>
              {issues.map(({
                id, type, summary, storyPointsEstimate, status, assignee,
              }) => (
                <Fragment key={id}>
                  <RouterLink to={`/app/projects/${project.id}/board/issues/${id}`}>
                    <ListItem button>
                      <ListItemIcon>{issueTypes[type]}</ListItemIcon>
                      <ListItemText primary={summary} />
                      <div className={classes.itemDetails}>
                        {!!assignee && (
                        <UserAvatar
                          isCurrentUser={getMember(assignee, teamMembers).userId === currentUserId}
                          name={getMember(assignee, teamMembers).username}
                          classes={classes.avatar}
                          size="small"
                        />
                        )}
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
                </Fragment>
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
  teamMembers: PropTypes.objectOf(propTypes.teamMember).isRequired,
  currentUserId: PropTypes.number.isRequired,
};

const mapStateToProps = (state, props) => ({
  issues: getIssuesByListId(props.listId, state),
  teamMembers: state.teamMembers,
  currentUserId: state.user.id,
});

export default connect(mapStateToProps)(IssuesList);
