import { Record } from 'immutable';
import BaseEntity from './BaseEntity';

export interface UserProps extends BaseEntity {
  username: string
}

const defaultUserProps: UserProps = {
  id: 0,
  username: '',
};

export default class User extends Record(defaultUserProps) {}
