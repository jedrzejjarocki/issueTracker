import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';
import { getProjectById } from '../projects/selectors';
import Sprint from '../../entities/Sprint';
import Backlog from '../../entities/Backlog';

const getIssuesContainers = ({ issuesContainers } : RootState) => issuesContainers;

export const getIssuesContainerById = ({ issuesContainers }: RootState, id: number) => issuesContainers.get(`${id}`);

const compareHavingStartDateGoesFirst = (a: Sprint, b: Sprint) => +(!a.startDate) - +(!b.startDate);

export const getSprintsByProjectId = createSelector(
  getProjectById, getIssuesContainers,
  (project, issuesContainers) => (project ? project.sprints
    .map((sprintId) => <Sprint> issuesContainers.get(`${sprintId}`)).toArray()
    .sort(compareHavingStartDateGoesFirst)
    : []),
);

export const getBacklogByProjectId = createSelector(
  getProjectById, getIssuesContainers,
  (project, containers) => <Backlog> containers.get(`${project?.backlog}`),
);

export const getIssuesContainersByProjectId = createSelector(
  getBacklogByProjectId, getSprintsByProjectId,
  (backlog, sprints) => (backlog ? [...sprints, backlog] : []),
);
