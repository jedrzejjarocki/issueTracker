import React from 'react';
import * as propTypes from '../../../propTypes';
import Wrapper from '../Wrapper';
import SprintHeader from './SprintHeader';
import IssuesList from '../IssuesList';

const Sprint = ({ sprint: { issues, name }, project: { id, projectKey } }) => (
  <Wrapper>
    <SprintHeader name={name} />
    <IssuesList
      issues={issues}
      projectId={id}
      projectKey={projectKey}
    />
  </Wrapper>
);

Sprint.propTypes = {
  sprint: propTypes.sprint.isRequired,
  project: propTypes.project.isRequired,
};

export default Sprint;
