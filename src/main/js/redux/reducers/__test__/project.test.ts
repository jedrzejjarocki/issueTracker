import reducer, {ProjectsState} from '../project';
import {setLoading} from '../../actions/ui/creators';
import {setProjects} from '../../actions/project/creators';
import {addSprint, deleteSprint} from '../../actions/issuesList/creators';
import {Sprint, UserRole} from '../../../propTypes';
import {addMember, deleteMember} from '../../actions/teamMember/creators';

const initialState = {};

const projects: ProjectsState = {
  1: {
    id: 1,
    name: 'name',
    projectKey: 'key',
    team: [],
    backlog: 1,
    sprints: [],
  },
  2: {
    id: 2,
    name: 'name',
    projectKey: 'key',
    team: [1000],
    backlog: 2,
    sprints: [11],
  },
};

const sprint: Sprint = {
  id: 11,
  name: 'name',
  issues: [],
};

describe('project reducer', () => {
  it('should return state if action type doesn\'t match', () => {
    const action = setLoading(false);
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual(initialState);
  });

  it('should set state', () => {
    const action = setProjects(projects);
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual(action.payload);
  });

  it('should add sprint id at beggining of sprints array', () => {
    const projectId = 1;
    const action = addSprint(sprint, projectId);
    const newState = reducer(projects, action);

    expect(newState[action.payload.projectId].sprints[0]).toBe(action.payload.sprint.id);
  });

  it('should delete sprint id from sprints array', () => {
    const projectId = 2;
    const action = deleteSprint(sprint, 0, projectId);
    const newState = reducer(projects, action);

    expect(newState[projectId].sprints).not.toContain(action.payload.sprint.id);
  });

  it('should add member id to team array', () => {
    const member = {
      id: 1,
      projectId: 1,
      userId: 1,
      username: 'name',
      role: UserRole.DEVELOPER,
    };
    const action = addMember(member);
    const newState = reducer(projects, action);

    expect(newState[action.payload.projectId].team).toContain(action.payload.id);
  });

  it('should delete member id from team array', () => {
    const projectId = 2;
    const action = deleteMember(projectId, projects[projectId].team[0]);
    const newState = reducer(projects, action);

    expect(newState[projectId].team).not.toContain(action.payload.memberId);
  });
});
