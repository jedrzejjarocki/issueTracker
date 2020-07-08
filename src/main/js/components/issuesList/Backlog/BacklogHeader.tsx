import React from 'react';
import {Grid, Typography} from '@material-ui/core';
import CreateSprint from './CreateSprint';

interface Props {
  projectId: number
  projectKey: string
}

const BacklogHeader: React.FC<Props> = ({ projectId, projectKey }) => (
  <Grid component="header" container justify="space-between">
    <Grid item><Typography variant="subtitle2">Backlog</Typography></Grid>
    <Grid item style={{ margin: '4px 0px' }}>
      <CreateSprint projectId={projectId} {...projectKey} />
    </Grid>
  </Grid>
);

export default BacklogHeader;
