import { Record } from 'immutable';
import { defaultProps as issuesContainerDefaultProps, IssuesContainerProps } from './IssuesContainer';

export enum SprintStatus {
  PLANNED= 'PLANNED',
  PENDING= 'PENDING',
  COMPLETED= 'COMPLETED'
}

export interface SprintProps extends IssuesContainerProps {
  name: string,
  goal: string,
  startDate: string,
  endDate: string
  type: 'Sprint'
  status: SprintStatus
}

const defaultSprintProps: SprintProps = {
  ...issuesContainerDefaultProps,
  name: '',
  goal: '',
  startDate: '',
  endDate: '',
  type: 'Sprint',
  status: SprintStatus.PLANNED,
};

export default class Sprint extends Record(defaultSprintProps) {}
