import React from 'react';
import IssuesList from '../IssuesList';
import BacklogHeader from './BacklogHeader';
import Wrapper from '../Wrapper';
import Project from '../../../entities/Project';

const Backlog: React.FC<{ project: Project }> = ({ project }) => (
  <Wrapper>
    <BacklogHeader projectKey={project.projectKey} projectId={project.id} />
    <IssuesList containerId={project.backlog} project={project} />
  </Wrapper>
);

export default Backlog;
