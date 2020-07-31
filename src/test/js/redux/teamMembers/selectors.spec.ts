import { List, Map } from 'immutable';
import {
  getCurrentUserRoleByProjectId,
  getTeamMembersByProjectId,
  getTeamMembersByUserId,
  getTeamMembersByUserIdAndRole,
} from '../../../../main/js/redux/teamMembers/selectors';
import TeamMember from '../../../../main/js/entities/TeamMember';
import { RootState } from '../../../../main/js/redux/rootReducer';
import { UserRole } from '../../../../main/js/redux/utilTypes';
import Project from '../../../../main/js/entities/Project';
import { User } from '../../../../main/js/entities/User';

const user = new User({ id: 1 });
const member1 = new TeamMember({ id: 1 });
const member2 = new TeamMember({ id: 2, userId: user.id, role: UserRole.LEADER });
const member3 = new TeamMember({ id: 3, userId: user.id });

const project = new Project({ id: 1, team: List([member1.id, member2.id]) });
const members = Map({
  [member1.id]: member1,
  [member2.id]: member2,
  [member3.id]: member3,
});

const rootState = {
  teamMembers: members,
} as RootState;

describe('team members selectors', () => {
  describe('get team members by user id', () => {
    it('should return all team members having provided user id', () => {
      const { userId } = member2;
      const membersWithUserIdCount = members
        .filter((member) => member.userId === userId)
        .size;

      const result = getTeamMembersByUserId(rootState, userId);

      expect(result.size).toBe(membersWithUserIdCount);
      expect(result.every((member) => member.userId === userId)).toBe(true);
    });
  });

  describe('get team members by user id and role', () => {
    it('should return list of members with provided userId and role', () => {
      const { userId, role } = member2;
      const membersByUserId = members.filter((member) => member.userId === userId);
      const expectedResult = membersByUserId.filter((member) => member.role === role);

      const result = getTeamMembersByUserIdAndRole(role).resultFunc(membersByUserId);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('get team members by project id', () => {
    it('should return array of members with provided project id', () => {
      const result = getTeamMembersByProjectId.resultFunc(project, members);
      const expectedResultLength = project.team.size;

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(expectedResultLength);
    });
  });

  describe('get current user role by project id', () => {
    const membersByProjectId = members
      .filter((member) => project.team.contains(member.id))
      .valueSeq().toArray();
    const expectedRole = membersByProjectId.find(({ userId }) => userId === user.id).role;

    const result = getCurrentUserRoleByProjectId.resultFunc(membersByProjectId, user);
    expect(result).toBe(expectedRole);
  });
});
