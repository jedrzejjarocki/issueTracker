import { Map } from 'immutable';
import { getProjectById, getProjectsAsArray } from '../../../../main/js/redux/projects/selectors';
import Project from '../../../../main/js/entities/Project';
import { RootState } from '../../../../main/js/redux/rootReducer';

const project1 = new Project({ id: 1 });
const project2 = new Project({ id: 2 });

const rootState = {
  projects: Map({
    [project1.id]: project1,
    [project2.id]: project2,
  }),
} as RootState;

describe('projects selectors', () => {
  describe(' get projects by id', () => {
    it('should return single project1', () => {
      const expectedProject = rootState.projects.first() as Project;
      const result = getProjectById(rootState, `${expectedProject.id}`);

      expect(result).toBe(expectedProject);
    });
  });

  describe('get projects as array', () => {
    it('should return all projects as array', () => {
      const result = getProjectsAsArray.resultFunc(rootState.projects);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(rootState.projects.size);
    });
  });
});
