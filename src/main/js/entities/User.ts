import {Record} from 'immutable';
import BaseEntity from './BaseEntity';

export interface UserProps extends BaseEntity {
  username: string
}

const defaultUserProps: UserProps = {
  id: null,
  username: '',
};

export class User extends Record(defaultUserProps) {}
