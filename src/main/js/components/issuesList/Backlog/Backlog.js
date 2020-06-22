import React from 'react';
import * as propTypes from '../../../propTypes';
import IssuesList from '../IssuesList';
import BacklogHeader from './BacklogHeader';
import Wrapper from '../Wrapper';

const Backlog = ({ project: { id, projectKey, backlog } }) => (
  <Wrapper>
    <BacklogHeader projectKey={projectKey} projectId={id} />
    <IssuesList
      issues={backlog.issues}
      projectId={id}
      projectKey={projectKey}
    />
  </Wrapper>
);

Backlog.propTypes = {
  project: propTypes.project.isRequired,
};

export default Backlog;
