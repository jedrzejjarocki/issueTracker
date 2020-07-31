import { List, Map } from 'immutable';
import reducer from '../../../../main/js/redux/projects/reducer';
import { setLoading } from '../../../../main/js/redux/ui/actionCreators';
import { AddProjectPayload, ProjectsState } from '../../../../main/js/redux/projects/types';
import Project from '../../../../main/js/entities/Project';
import { addProject, setProjects } from '../../../../main/js/redux/projects/actionCreators';
import TeamMember from '../../../../main/js/entities/TeamMember';
import { IssuesContainer } from '../../../../main/js/entities/IssuesContainer';
import Backlog from '../../../../main/js/entities/Backlog';
import Sprint from '../../../../main/js/entities/Sprint';
import { addSprint, deleteSprint } from '../../../../main/js/redux/issuesContainers/actionCreators';
import { addMember, deleteMember } from '../../../../main/js/redux/teamMembers/actionCreators';
import { UserRole } from '../../../../main/js/redux/utilTypes';
import { AddTeamMemberPayload } from '../../../../main/js/redux/teamMembers/types';

const initialState: ProjectsState = Map();

const sprint1 = new Sprint({ id: 100 });
const sprint2 = new Sprint({ id: 200 });

const teamMember = new TeamMember({ id: 1 });

const project1 = new Project({ id: 1, team: List([teamMember.id]) });
const project2 = new Project({ id: 2, sprints: List([sprint2.id]) });
const projects: ProjectsState = Map({
  [project1.id]: project1,
  [project2.id]: project2,
});

describe('projects reducer', () => {
  it('should return previous state if action type doesn\'t match', () => {
    const action = setLoading(false);
    const newState = reducer(initialState, action);

    expect(newState).toBe(initialState);
  });

  it('should set new state', () => {
    const action = setProjects(projects);
    const newState = reducer(initialState, action);

    expect(newState).toBe(projects);
  });

  it('should add new project', () => {
    const payload: AddProjectPayload = {
      name: 'name',
      id: 3,
      projectKey: 'key',
      team: [new TeamMember({ id: 1 })],
      backlog: new Backlog({ id: 1 }) as IssuesContainer,
    };

    const action = addProject(payload);

    // before
    expect(initialState.get(`${payload.id}`)).toBeUndefined();

    const newState = reducer(initialState, action);

    // after
    const expectedProject = new Project({
      id: payload.id,
      name: payload.name,
      projectKey: payload.projectKey,
      sprints: List(),
      team: List([payload.team[0].id]),
      backlog: payload.backlog.id,
    });

    expect(newState.get(`${payload.id}`)).toEqual(expectedProject);
  });

  it('should add sprint id to corresponding project sprints list', () => {
    const projectId = project1.id;
    const action = addSprint(sprint1, projectId);

    // before
    expect(projects.getIn([`${projectId}`, 'sprints']).first()).not.toBe(sprint1.id);

    const newState = reducer(projects, action);

    // after
    expect(newState.getIn([`${projectId}`, 'sprints']).first()).toBe(sprint1.id);
  });

  it('should delete sprint id from corresponding project sprints list', () => {
    const projectId = project2.id;
    const backlogId = 5;
    const action = deleteSprint(sprint2, backlogId, projectId);

    // before
    expect(projects.getIn([`${projectId}`, 'sprints']).contains(sprint2.id)).toBe(true);

    const newState = reducer(projects, action);

    // after
    const projectSprintsList = newState.getIn([`${projectId}`, 'sprints']);
    expect(projectSprintsList.contains(sprint2.id)).toBe(false);
  });

  it('should add member id to corresponding project team list', () => {
    const payload: AddTeamMemberPayload = {
      id: 3,
      projectId: project1.id,
      userId: 1,
      username: 'username',
      role: UserRole.DEVELOPER,
    };
    const action = addMember(payload);

    // before
    expect(projects.getIn([`${payload.projectId}`, 'team']).contains(payload.id)).toBe(false);

    const newState = reducer(projects, action);

    // after
    const projectTeamMembersList = newState.getIn([`${payload.projectId}`, 'team']);
    expect(projectTeamMembersList.first()).toBe(payload.id);
  });

  it('should delete member id from corresponding project team list', () => {
    const memberId = teamMember.id;
    const projectId = project1.id;
    const action = deleteMember(memberId, projectId);

    // before
    expect(projects.getIn([`${projectId}`, 'team']).contains(memberId)).toBe(true);

    const newState = reducer(projects, action);

    // after
    const projectTeamMembersList = newState.getIn([`${projectId}`, 'team']);
    expect(projectTeamMembersList.contains(memberId)).toBe(false);
  });
});
