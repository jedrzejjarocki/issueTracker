import React, {Fragment} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {Chip, List, ListItem, ListItemIcon, ListItemText, makeStyles, Typography,} from '@material-ui/core';
import IssueType from '../../constants/issueTypes';
import IssueStatus from '../../constants/issueStatuses';
import RouterLink from '../commons/RouterLink';
import UserAvatar from '../commons/UserAvatar';
import {TeamMembersState} from "../../redux/reducers/teamMembers";
import {Project} from "../../propTypes";
import {RootState} from "../../redux/reducers/rootReducer";
import {getIssuesByListId} from "../../redux/selectors/issues";
import {getTeamMembers} from "../../redux/selectors/teamMembers";
import {getUser} from "../../redux/selectors/user";

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

const getMember = (id: number, teamMembers: TeamMembersState) => teamMembers[id];

interface Props extends ReduxProps {
  project: Project
}

const IssuesList: React.FC<Props> = ({ issues, project, teamMembers, currentUserId }) => {
  const classes = useStyles();

  return (
    <>
      {
        issues && issues.length
          ? (
            <List dense>
              {issues.map(({
                id, type, summary, storyPointsEstimate, status, assignee,
              }) =>
                (
                  <Fragment key={id}>
                    <RouterLink to={`/app/projects/${project.id}/board/issues/${id}`}>
                      <ListItem button>
                        <ListItemIcon>{IssueType[type].icon}</ListItemIcon>
                        <ListItemText primary={summary} />
                        <div className={classes.itemDetails}>
                          {!!assignee && (
                            <UserAvatar
                              isCurrentUser={getMember(assignee, teamMembers).userId === currentUserId}
                              name={getMember(assignee, teamMembers).username}
                              size="small"
                            />
                          )}
                          {!!storyPointsEstimate && (
                            <Chip size="small" label={storyPointsEstimate} />
                          )}
                          <Chip
                            size="small"
                            label={IssueStatus[status].text}
                            color={IssueStatus[status].color}
                          />
                          <ListItemText primary={`${project.projectKey}-${id}`} />
                        </div>
                      </ListItem>
                    </RouterLink>
                  </Fragment>
                )
              )}
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

const mapStateToProps = (state: RootState, { listId }: { listId: number }) => ({
  issues: getIssuesByListId(state, listId),
  teamMembers: getTeamMembers(state),
  currentUserId: getUser(state).id,
});

const connector = connect(mapStateToProps)
type ReduxProps = ConnectedProps<typeof connector>

export default connector(IssuesList);
