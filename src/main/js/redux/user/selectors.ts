import {RootState} from '../rootReducer';
import {UserRole} from '../utilTypes';

export const getUser = (state: RootState) => state.user;

export interface UserWithProjects {
  userId: number
  username: string
  projects: {
    id: number
    projectName: string
    userRole: UserRole
  }[]
}
