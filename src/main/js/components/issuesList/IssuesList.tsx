import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { connect, ConnectedProps } from 'react-redux';
import { List, makeStyles, Typography } from '@material-ui/core';
import { RootState } from '../../redux/rootReducer';
import Project from '../../entities/Project';
import { getUser } from '../../redux/user/selectors';
import { getTeamMembers } from '../../redux/teamMembers/selectors';
import IssueListItem from './IssueListItem';
import Issue from '../../entities/Issue';
import { DraggingOverContext } from '../Board/Project';

const useStyles = makeStyles((theme) => ({
  empty: {
    padding: theme.spacing(2),
  },
}));

interface Props extends ReduxProps {
  project: Project
  containerId: number
  issues: Issue[]
}

const IssuesList: React.FC<Props> = ({
  issues, project, teamMembers, currentUserId, containerId,
}) => {
  const classes = useStyles();
  const draggingOver = useContext(DraggingOverContext);

  return (
    <Droppable droppableId={`${containerId}`}>
      {({ innerRef, droppableProps, placeholder }) => (
        <List dense ref={innerRef} {...droppableProps}>
          {issues.map((issue, index) => (
            <IssueListItem
              issue={issue}
              index={index}
              project={project}
              teamMembers={teamMembers}
              currentUserId={currentUserId}
            />
          ))}
          {placeholder}
          {
            !issues.length && draggingOver !== containerId && (
              <Typography color="textSecondary" className={classes.empty}>
                <i>empty</i>
              </Typography>
            )
          }
        </List>
      )}
    </Droppable>
  );
};

const mapStateToProps = (state: RootState) => ({
  teamMembers: getTeamMembers(state),
  currentUserId: getUser(state).id,
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(IssuesList);
