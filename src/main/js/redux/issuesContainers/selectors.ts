/* eslint-disable arrow-body-style */
import { createSelector } from 'reselect';
import { RootState } from '../rootReducer';
import { getProjectById } from '../projects/selectors';
import Sprint, { SprintStatus } from '../../entities/Sprint';
import Backlog from '../../entities/Backlog';

const getIssuesContainers = ({ issuesContainers } : RootState) => issuesContainers;

export const getIssuesContainerById = ({ issuesContainers }: RootState, id: number) => issuesContainers.get(`${id}`);

export const getSprintsByProjectId = createSelector(
  getProjectById, getIssuesContainers,
  (project, issuesContainers) => (project ? project.sprints
    .map((sprintId) => (issuesContainers.get(`${sprintId}`)) as Sprint).toArray()
    .reduce((acc, sprint) => {
      return sprint.status === SprintStatus.PENDING ? [sprint, ...acc] : [...acc, sprint];
    }, [] as Sprint[])
    : [] as Sprint[]),
);

export const getBacklogByProjectId = createSelector(
  getProjectById, getIssuesContainers,
  (project, containers) => <Backlog> containers.get(`${project?.backlog}`),
);

export const getIssuesContainersByProjectId = createSelector(
  getBacklogByProjectId, getSprintsByProjectId,
  (backlog, sprints) => (backlog ? [...sprints, backlog] : []),
);

export const getPendingSprintByProjectId = createSelector(getSprintsByProjectId, (sprints) => {
  return sprints.find(({ status }) => status === SprintStatus.PENDING);
});
