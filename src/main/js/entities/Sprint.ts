import { Record } from 'immutable';
import { defaultProps as issuesContainerDefaultProps, IssuesContainerProps } from './IssuesContainer';

export interface SprintProps extends IssuesContainerProps {
  name: string,
  goal?: string,
  startDate?: string,
  endDate?: string
  type?: 'Sprint'
}

const defaultSprintProps: SprintProps = {
  ...issuesContainerDefaultProps,
  name: '',
  goal: '',
  startDate: null,
  endDate: null,
  type: 'Sprint',
};

export default class Sprint extends Record(defaultSprintProps) {}
