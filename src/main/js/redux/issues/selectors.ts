import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';
import { getIssuesContainerById } from '../issuesContainers/selectors';

const getIssues = (state: RootState) => state.issues;

export const getIssuesByContainerId = createSelector(
  getIssuesContainerById, getIssues,
  (container, issues) => container?.issues.map((id) => issues.get(`${id}`))
    .sort((a, b) => b.priority - a.priority)
    .toArray(),
);

export const getIssueById = (state: RootState, issueId: string) => state.issues.get(issueId);
