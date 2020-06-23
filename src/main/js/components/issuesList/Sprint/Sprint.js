import React, {useState} from 'react';
import {Collapse} from '@material-ui/core';
import * as propTypes from '../../../propTypes';
import Wrapper from '../Wrapper';
import SprintHeader from './SprintHeader';
import IssuesList from '../IssuesList';

const Sprint = ({ sprint, project }) => {
  const [expanded, setExpanded] = useState(true);
  const handleExpand = () => setExpanded(!expanded);

  return (
    <Wrapper>
      <SprintHeader
        project={project}
        sprint={sprint}
        handleExpand={handleExpand}
        expanded={expanded}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <IssuesList
          listId={sprint.id}
          project={project}
        />
      </Collapse>
    </Wrapper>
  );
};

Sprint.propTypes = {
  sprint: propTypes.sprint.isRequired,
  project: propTypes.project.isRequired,
};

export default Sprint;
