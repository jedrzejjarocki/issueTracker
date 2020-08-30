import { Map } from 'immutable';
import {
  getProjectsWhereCurrentUserIsLeader,
  getUsersWithTheirProjects,
} from '../../../main/js/redux/compoundSelectors';
import TeamMember from '../../../main/js/entities/TeamMember';
import { UserRole } from '../../../main/js/redux/utilTypes';
import Project from '../../../main/js/entities/Project';

const member1 = new TeamMember({
  id: 1,
  userId: 1,
  projectId: 1,
  username: 'user1',
  role: UserRole.DEVELOPER,
});
const member2 = new TeamMember({
  id: 2,
  userId: 1,
  projectId: 2,
  username: 'user1',
  role: UserRole.LEADER,
});
const member3 = new TeamMember({
  id: 3,
  userId: 2,
  projectId: 2,
  username: 'user2',
  role: UserRole.DEVELOPER,
});
const teamMembers = Map({
  [member1.id]: member1,
  [member2.id]: member2,
  [member3.id]: member3,
});

const project1 = new Project({ id: 1, name: 'pro1' });
const project2 = new Project({ id: 2, name: 'pro2' });
const projects = Map({
  [project1.id]: project1,
  [project2.id]: project2,
});

describe('compound selectors', () => {
  describe('getUsersWithTheirProjects', () => {
    it('should return array of users with their projects', () => {
      const result = getUsersWithTheirProjects.resultFunc(teamMembers, projects);

      const expectedNumOfUsers = 2;
      expect(result.length).toBe(expectedNumOfUsers);

      const user1Result = result.find(({ userId }) => userId === 1);
      expect(user1Result!.projects).toEqual([{
        id: project1.id,
        projectName: project1.name,
        userRole: UserRole.DEVELOPER,
      }, {
        id: project2.id,
        projectName: project2.name,
        userRole: UserRole.LEADER,
      },
      ]);

      const user2Result = result.find(({ userId }) => userId === 2);
      expect(user2Result!.projects).toEqual([{
        id: project2.id,
        projectName: project2.name,
        userRole: UserRole.DEVELOPER,
      }]);
    });
  });

  describe('getProjectsWhereCurrentUserIsLeader', () => {
    it('should return projects where current user is leader', () => {
      const teamMembers = Map({ [member2.id]: member2 });
      const expectedResult = projects.filter((p) => p.id === member2.projectId)
        .valueSeq().toArray();

      const result = getProjectsWhereCurrentUserIsLeader.resultFunc(teamMembers, projects);
      expect(result).toEqual(expectedResult);
    });
  });
});
