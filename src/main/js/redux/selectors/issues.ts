import {createSelector} from 'reselect';
import {RootState} from '../reducers/rootReducer';
import {getIssuesListById} from './issuesLists';

const getIssues = (state: RootState) => state.issues;

export const getIssuesByListId = createSelector(getIssuesListById, getIssues, (list, issues) => list.issues.map((id) => issues[id]));

export const getIssueById = (state: RootState, issueId: number | string) => state.issues[issueId];
