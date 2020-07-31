import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import CreateSprint from './CreateSprint';
import Issue from '../../../entities/Issue';
import StoryPointsSummary from '../StoryPointsSummary';

interface Props {
  projectId: number
  projectKey: string
  issues: Issue[]
}

const BacklogHeader: React.FC<Props> = ({ projectId, projectKey, issues }) => (
  <Grid component="header" container justify="space-between" direction="row" alignItems="center" wrap="nowrap">
    <Grid item><Typography variant="subtitle2">Backlog</Typography></Grid>
    <Grid container item style={{ margin: '4px 0px' }} justify="flex-end" alignItems="center">
      <StoryPointsSummary issues={issues} />
      <CreateSprint projectId={projectId} {...projectKey} />
    </Grid>
  </Grid>
);

export default BacklogHeader;
