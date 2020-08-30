import React from 'react';
import { Grid } from '@material-ui/core';
import { connect, ConnectedProps } from 'react-redux';
import IssuesCard from './IssuesCard';
import { IssueStatus } from '../../redux/utilTypes';
import { RootState } from '../../redux/rootReducer';
import { getPendingSprintByProjectId } from '../../redux/issuesContainers/selectors';
import { getIssuesByContainerId } from '../../redux/issues/selectors';

const ActiveSprint: React.FC<ReduxProps> = ({ issues }) => (
  <>
    { issues && (
    <Grid container xs spacing={2}>
      {Object.values(IssueStatus).map((issueStatus) => (
        <Grid item xs>
          <IssuesCard
            status={issueStatus}
            issues={issues.filter(({ status }) => status === issueStatus)}
          />
        </Grid>
      ))}
    </Grid>
    )}
  </>
);

const mapStateToProps = (state: RootState) => {
  const sprint = getPendingSprintByProjectId(state, `${state.ui.get('currentProject')?.id}`);
  return {
    sprint,
    issues: sprint ? getIssuesByContainerId(state, sprint.id) : [],
  };
};

const connector = connect(mapStateToProps);

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(ActiveSprint);
