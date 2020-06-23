import React from 'react';
import * as propTypes from '../../../propTypes';
import IssuesList from '../IssuesList';
import BacklogHeader from './BacklogHeader';
import Wrapper from '../Wrapper';

const Backlog = ({ project }) => (
  <Wrapper>
    <BacklogHeader projectKey={project.projectKey} projectId={project.id} />
    <IssuesList
      listId={project.backlog}
      project={project}
    />
  </Wrapper>
);

Backlog.propTypes = {
  project: propTypes.project.isRequired,
};

export default Backlog;
