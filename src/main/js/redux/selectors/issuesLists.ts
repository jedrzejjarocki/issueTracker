import {createSelector} from 'reselect';
import {RootState} from '../reducers/rootReducer';
import {getProjectById} from './project';
import {Backlog, Sprint} from '../../propTypes';

const getIssuesLists = (state: RootState) => state.issuesLists;

export const getIssuesListById = (state: RootState, id: number | string) => state.issuesLists[id];

export const getSprintsByProjectId = createSelector(getProjectById, getIssuesLists, (project, issuesLists) => ((project === undefined) ? [] : (project.sprints || [])
  .map((sprintId) => (<Sprint> {
    ...issuesLists[sprintId],
    type: 'Sprint',
  })).sort((s1, s2) => +(s1.startDate === null) - +(s2.startDate === null))));

export const getIssuesListsByProjectId = createSelector(getProjectById, getSprintsByProjectId, getIssuesLists, (project, sprints, issuesLists) => {
  if (project === undefined) return [];
  const backlog = <Backlog> {
    ...issuesLists[project.backlog],
    type: 'Backlog',
  };
  return [...sprints, backlog];
});
