import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';
import { getIssuesContainerById } from '../issuesContainers/selectors';
import Issue from '../../entities/Issue';

export const getIssues = (state: RootState) => state.issues;

export const getIssuesByContainerId = createSelector(
  getIssuesContainerById, getIssues,
  (container, issues) => (container
    ? container.issues.map((id) => issues.get(`${id}`) as Issue).toArray()
    : []),
);

export const getIssueById = (state: RootState, issueId: string) => state.issues.get(issueId);
