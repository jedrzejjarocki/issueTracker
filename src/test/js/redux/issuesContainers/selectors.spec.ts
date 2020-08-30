import { List, Map } from 'immutable';
import {
  getBacklogByProjectId,
  getIssuesContainerById,
  getIssuesContainersByProjectId,
  getSprintsByProjectId,
} from '../../../../main/js/redux/issuesContainers/selectors';
import Sprint from '../../../../main/js/entities/Sprint';
import { IssuesContainer } from '../../../../main/js/entities/IssuesContainer';
import Project from '../../../../main/js/entities/Project';
import { RootState } from '../../../../main/js/redux/rootReducer';
import Backlog from '../../../../main/js/entities/Backlog';

const sprint1 = new Sprint({ id: 1 });
const sprint2 = new Sprint({ id: 2, startDate: 'truthy' });
const sprint3 = new Sprint({ id: 3 });
const backlog = new Backlog({ id: 4 });
const project = new Project({ sprints: List([sprint1.id, sprint2.id]), backlog: backlog.id });
const issuesContainers = Map({
  [sprint1.id]: sprint1 as IssuesContainer,
  [sprint2.id]: sprint2 as IssuesContainer,
  [sprint3.id]: sprint3 as IssuesContainer,
  [backlog.id]: backlog as IssuesContainer,
});

describe('issues containers selectors', () => {
  describe('get issues containers by id', () => {
    it('should return container', () => {
      const state = { issuesContainers } as RootState;
      const result = getIssuesContainerById(state, issuesContainers.first<IssuesContainer>().id);
      expect(result).toBe(issuesContainers.first());
    });
  });

  describe('get sprints by project id', () => {
    it('should return empty array', () => {
      const result = getSprintsByProjectId.resultFunc(new Project(), Map());
      expect(result).toEqual([]);
    });

    it('should return array of sprints with sprint having start date at the beginning', () => {
      const result = getSprintsByProjectId.resultFunc(project, issuesContainers);
      expect(result.length).toBe(project.sprints.size);
      expect(result[0].startDate).toBeTruthy();
    });
  });

  describe('get backlog by project id', () => {
    it('should return backlog', () => {
      const result = getBacklogByProjectId.resultFunc(project, issuesContainers);
      expect(result).toBe(backlog);
    });
  });

  describe('get issues containers by project id', () => {
    it('should return array with backlog', () => {
      const backlog = new Backlog();
      const result = getIssuesContainersByProjectId.resultFunc(backlog, []);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(backlog);
    });

    it('should return array of containers with backlog as last', () => {
      const sprintsArray = [sprint1, sprint2];
      const result = getIssuesContainersByProjectId
        .resultFunc(backlog, sprintsArray);

      expect(result.length).toBe(sprintsArray.length + 1);

      const lastContainer = result[result.length - 1];
      expect(lastContainer).toBe(backlog);
    });
  });
});
