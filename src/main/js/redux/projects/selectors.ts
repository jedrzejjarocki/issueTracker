/* eslint-disable arrow-body-style */
import {createSelector} from 'reselect';
import {RootState} from '../rootReducer';

export function getProjects(state: RootState) {
  return state.projects;
}

export const getProjectsAsArray = createSelector(getProjects, (projects) => {
  return projects.valueSeq().toArray();
});

export function getProjectById(state: RootState, id: string) {
  return state.projects.get(id);
}
