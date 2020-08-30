import React, { useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { connect, ConnectedProps } from 'react-redux';
import { List, Typography } from '@material-ui/core';
import { RootState } from '../../redux/rootReducer';
import Project from '../../entities/Project';
import { getTeamMembers } from '../../redux/teamMembers/selectors';
import IssueListItem from './IssueListItem';
import Issue from '../../entities/Issue';
import { DraggingOverContext } from '../Board/Project';
import RouterLink from '../commons/RouterLink';
import TeamMember from '../../entities/TeamMember';

interface Props extends ReduxProps {
  project: Project
  containerId: number
  issues: Issue[]
}

const IssuesList: React.FC<Props> = ({
  issues, project, teamMembers, containerId,
}) => {
  const draggingOver = useContext(DraggingOverContext);
  const getMember = (memberId: number) => teamMembers.get(`${memberId}`) as TeamMember;

  return (
    <Droppable droppableId={`${containerId}`}>
      {({ innerRef, droppableProps, placeholder }) => (
        <List dense ref={innerRef} {...droppableProps}>
          {issues.map((issue, index) => (
            <RouterLink to={`/app/projects/${project.id}/board/issues/${issue.id}`}>
              <IssueListItem
                getMember={getMember}
                issue={issue}
                index={index}
                project={project}
                withStatus
              />
            </RouterLink>
          ))}
          {placeholder}
          {
            !issues.length && draggingOver !== containerId && (<Typography color="textSecondary"><i>empty</i></Typography>)
          }
        </List>
      )}
    </Droppable>
  );
};

const mapStateToProps = (state: RootState) => ({
  teamMembers: getTeamMembers(state),
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(IssuesList);
