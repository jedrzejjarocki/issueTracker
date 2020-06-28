import React from 'react';
import PropTypes from 'prop-types';
import {Grid, Typography} from '@material-ui/core';
import CreateSprint from './CreateSprint';

const BacklogHeader = ({ projectId, projectKey }) => (
  <Grid component="header" container justify="space-between">
    <Grid item><Typography variant="subtitle2">Backlog</Typography></Grid>
    <Grid item style={{ margin: '4px 0px' }}>
      <CreateSprint projectId={projectId} projectKey={projectKey}>create sprint</CreateSprint>
    </Grid>
  </Grid>
);

BacklogHeader.propTypes = {
  projectId: PropTypes.number.isRequired,
  projectKey: PropTypes.string.isRequired,
};

export default BacklogHeader;
