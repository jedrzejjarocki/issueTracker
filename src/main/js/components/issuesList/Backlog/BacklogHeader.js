import React from 'react';
import PropTypes from 'prop-types';
import {Typography} from '@material-ui/core';
import CreateSprint from '../../CreateSprint';

const BacklogHeader = ({ projectId, projectKey }) => (
  <header>
    <Typography variant="subtitle2">Backlog</Typography>
    <CreateSprint projectId={projectId} projectKey={projectKey}>create sprint</CreateSprint>
  </header>
);

BacklogHeader.propTypes = {
  projectId: PropTypes.number.isRequired,
  projectKey: PropTypes.string.isRequired,
};

export default BacklogHeader;
