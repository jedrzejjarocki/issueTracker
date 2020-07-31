import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import IssuesList from '../IssuesList';
import BacklogHeader from './BacklogHeader';
import Wrapper from '../Wrapper';
import Project from '../../../entities/Project';
import { RootState } from '../../../redux/rootReducer';
import { getIssuesByContainerId } from '../../../redux/issues/selectors';

interface Props extends ReduxProps {
  project: Project
}

const Backlog: React.FC<Props> = ({ project, issues }) => (
  <Wrapper>
    <BacklogHeader projectKey={project.projectKey} projectId={project.id} issues={issues} />
    <IssuesList issues={issues} project={project} containerId={project.backlog} />
  </Wrapper>
);

const mapStateToProps = (state: RootState, { project }: { project: Project }) => ({
  issues: getIssuesByContainerId(state, project.backlog),
});

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Backlog);
