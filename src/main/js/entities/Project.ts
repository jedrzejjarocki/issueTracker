import {List, Record} from 'immutable';
import BaseEntity from './BaseEntity';

export interface ProjectProps extends BaseEntity {
  name: string,
  projectKey: string,
  team: List<number>,
  backlog: number,
  sprints: List<number>,
}

const defaultProjectProps: ProjectProps = {
  id: 0,
  name: '',
  projectKey: '',
  team: List([]),
  backlog: 0,
  sprints: List([]),
};

export default class Project extends Record(defaultProjectProps) {}
