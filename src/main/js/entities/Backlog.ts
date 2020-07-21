import {Record} from 'immutable';
import {defaultProps as IssuesContainerDefaultProps, IssuesContainerProps} from './IssuesContainer';

export interface BacklogProps extends IssuesContainerProps {
  type?: 'Backlog'
}

const defaultBacklogProps: BacklogProps = {
  ...IssuesContainerDefaultProps,
  type: 'Backlog',
};

export default class Backlog extends Record(defaultBacklogProps) {}
