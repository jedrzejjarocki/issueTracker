import {Record} from 'immutable';
import BaseEntity from './BaseEntity';
import {UserRole} from '../redux/utilTypes';

export interface TeamMemberProps extends BaseEntity {
  projectId: number
  userId: number,
  username: string,
  role: UserRole
}

const defaultTeamMemberProps: TeamMemberProps = {
  id: 0,
  projectId: 0,
  userId: 0,
  username: '',
  role: null,
};

export default class TeamMember extends Record(defaultTeamMemberProps) {}
