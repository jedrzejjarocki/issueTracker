/* eslint-disable arrow-body-style */
import {
  Chip, ListItem, ListItemIcon, ListItemText, makeStyles, Typography,
} from '@material-ui/core';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import IssueType from '../../constants/issueTypes';
import UserAvatar from '../commons/UserAvatar';
import IssueStatus from '../../constants/issueStatuses';
import Issue from '../../entities/Issue';
import Project from '../../entities/Project';
import TeamMember from '../../entities/TeamMember';

const useStyles = makeStyles((theme) => ({
  itemDetails: {
    display: 'flex',
    alignItems: 'center',
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
  getMember: (teamMemberId: number) => TeamMember
  withStatus?: boolean
  draggableId?: string
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
  draggableId,
  index,
  project,
  withStatus,
  getMember,
}) => {
  const classes = useStyles();
  const member = assignee ? getMember(assignee) : null;
  return (
    <Draggable draggableId={draggableId || `${id}`} index={index} key={id}>
      {({ draggableProps, dragHandleProps, innerRef }) => (
        <ListItem
          button
          ref={innerRef}
          {...draggableProps}
          {...dragHandleProps}
          className={classes.listItem}
          disableGutters
        >
          <ListItemIcon>{IssueType[type].icon}</ListItemIcon>
          <ListItemText primary={summary} />
          <div className={classes.itemDetails}>
            { member && <UserAvatar username={member.username} userId={member.userId} size="small" /> }
            { !!storyPointsEstimate && <Chip size="small" label={storyPointsEstimate} /> }
            { withStatus && <Chip size="small" label={IssueStatus[status].text} color={IssueStatus[status].color} /> }
            <Typography variant="caption">{`${project.projectKey}-${id}`}</Typography>
          </div>
        </ListItem>
      )}
    </Draggable>
  );
};

export default IssueListItem;
