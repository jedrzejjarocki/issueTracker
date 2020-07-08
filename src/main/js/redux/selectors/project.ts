import {RootState} from "../reducers/rootReducer";
import {getTeamMembersAsArray, getTeamMembersByUserId} from "./teamMembers";
import {UserRole} from "../../propTypes";

export const getProjects = (state: RootState) => state.projects;

export const getProjectsAsArray = (state: RootState) => Object.values(getProjects(state))

export const getProjectById = (state: RootState, id: number | string) => state.projects[id];

export const getProjectsWhereCurrentUserIsLeader = (state: RootState) => {
  return getTeamMembersByUserId(state, state.user.id)
    .filter(member => member.role === UserRole.LEADER)
    .map(member => state.projects[member.projectId]);
}

export interface UserWithProjects {
    userId: number
    username: string
    projects: {
      projectName: string
      userRole: UserRole
    }[]
}

export const getUsersWithTheirProjects = (state: RootState) => {
  const users: { [id: number]: UserWithProjects} = {}
  getTeamMembersAsArray(state).map(({ userId, projectId, username, role}) => {
    const projectName = getProjectById(state, projectId).name
    if (users[userId]) {
      users[userId].projects.push({
        projectName,
        userRole: role
      })
    } else {
      users[userId] = {
        userId,
        username,
        projects: [{
          projectName,
          userRole: role
        }]
      }
    }
  })

  return Object.values(users);
}