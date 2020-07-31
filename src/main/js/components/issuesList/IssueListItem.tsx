import { Chip, ListItem, ListItemIcon, ListItemText, makeStyles, } from '@material-ui/core';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import IssueType from '../../constants/issueTypes';
import UserAvatar from '../commons/UserAvatar';
import IssueStatus from '../../constants/issueStatuses';
import RouterLink from '../commons/RouterLink';
import Issue from '../../entities/Issue';
import Project from '../../entities/Project';
import { TeamMembersState } from '../../redux/teamMembers/types';

const getMember = (id: number, teamMembers: TeamMembersState) => teamMembers.get(`${id}`);

const useStyles = makeStyles((theme) => ({
  itemDetails: {
    display: 'flex',
    '& > *': {
      marginLeft: theme.spacing(1),
    },
  },
  listItem: {
    background: theme.palette.background.paper,
  },
}));

interface Props {
  issue: Issue
  project: Project
  index: number
  teamMembers: TeamMembersState
  currentUserId: number
}

const IssueListItem: React.FC<Props> = ({
  issue: {
    id,
    type,
    summary,
    storyPointsEstimate,
    status,
    assignee,
  },
  index,
  project,
  teamMembers,
  currentUserId,
}) => {
  const classes = useStyles();
  return (
    <RouterLink to={`/app/projects/${project.id}/board/issues/${id}`}>
      <Draggable draggableId={`${id}`} index={index} key={id}>
        {({ draggableProps, dragHandleProps, innerRef }) => (
          <ListItem
            button
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            className={classes.listItem}
          >
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
        )}
      </Draggable>
    </RouterLink>
  );
};

export default IssueListItem;
