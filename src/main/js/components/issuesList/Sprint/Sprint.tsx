import React, {useState} from 'react';
import {Collapse} from '@material-ui/core';
import Wrapper from '../Wrapper';
import SprintHeader from './SprintHeader';
import IssuesList from '../IssuesList';
import {Project, Sprint} from '../../../propTypes';

const Sprint = ({ sprint, project }: { sprint: Sprint, project: Project}) => {
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

export default Sprint;
