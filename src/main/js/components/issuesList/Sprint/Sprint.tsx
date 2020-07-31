import React, { useState } from 'react';
import { Collapse } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import Wrapper from '../Wrapper';
import SprintHeader from './SprintHeader';
import IssuesList from '../IssuesList';
import Sprint from '../../../entities/Sprint';
import Project from '../../../entities/Project';
import { RootState } from '../../../redux/rootReducer';
import { getIssuesByContainerId } from '../../../redux/issues/selectors';

interface Props extends ReduxProps {
  sprint: Sprint,
  project: Project,
}

const SprintComponent: React.FC<Props> = ({ sprint, project, issues }) => {
  const [expanded, setExpanded] = useState(true);
  const handleExpand = () => setExpanded(!expanded);

  return (
    <Wrapper>
      <SprintHeader
        project={project}
        sprint={sprint}
        issues={issues}
        handleExpand={handleExpand}
        expanded={expanded}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <IssuesList
          containerId={sprint.id}
          project={project}
          issues={issues}
        />
      </Collapse>
    </Wrapper>
  );
};

const mapStateToProps = (state: RootState, { sprint }: { sprint: Sprint }) => ({
  issues: getIssuesByContainerId(state, sprint.id),
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(SprintComponent);
