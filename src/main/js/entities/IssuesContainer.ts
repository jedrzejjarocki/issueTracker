import {List, Record} from 'immutable';
import BaseEntity from './BaseEntity';

export interface IssuesContainerProps extends BaseEntity {
  issues: List<number>
}

export const defaultProps: IssuesContainerProps = {
  id: 0,
  issues: List(),
};

export class IssuesContainer extends Record(defaultProps) {}
