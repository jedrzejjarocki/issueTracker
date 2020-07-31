import { List, Map } from 'immutable';
import Issue from '../../../../main/js/entities/Issue';
import reducer from '../../../../main/js/redux/issues/reducer';
import { addIssue, deleteIssue, setIssues } from '../../../../main/js/redux/issues/actionCreators';
import { setLoading } from '../../../../main/js/redux/ui/actionCreators';
import Sprint from '../../../../main/js/entities/Sprint';
import { deleteSprint } from '../../../../main/js/redux/issuesContainers/actionCreators';
import { deleteMember } from '../../../../main/js/redux/teamMembers/actionCreators';
import { IssuesState } from '../../../../main/js/redux/issues/types';

export const initialState: IssuesState = Map();

export const issue = new Issue({
  id: 32,
  containerId: 41,
  assignee: 20,
});

export const issues: IssuesState = Map({
  [issue.id]: issue,
});

describe('issues reducer', () => {
  it('should return previous state if action type doesn\'t match', () => {
    const action = setLoading(false);
    const newState = reducer(initialState, action);

    expect(newState).toBe(initialState);
  });

  it('should set new state', () => {
    const action = setIssues(issues);
    const newState = reducer(initialState, action);
    expect(newState).toBe(issues);
  });

  it('should add issue', () => {
    const newIssue = new Issue({ id: 32 });

    const action = addIssue(newIssue);

    const prevSize = initialState.size;

    const newState = reducer(initialState, action);

    expect(newState.size).toBe(prevSize + 1);
    expect(newState.get(`${newIssue.id}`)).toBe(newIssue);
  });

  it('should delete issue', () => {
    const action = deleteIssue(issue.id, issue.containerId);
    const prevSize = issues.size;
    const newState = reducer(issues, action);

    expect(newState.size).toBe(prevSize - 1);
    expect(newState.get(`${issue.id}`)).toBeUndefined();
  });

  it('should change containerId if equals deleted sprint id', () => {
    const sprint = new Sprint({
      id: issue.containerId,
      issues: List([issue.id]),
    });

    const backlogId = 100;

    const action = deleteSprint(sprint, backlogId, 10);
    const newState = reducer(issues, action);

    expect(newState.size).toBe(issues.size);
    expect(newState.get(`${issue.id}`).containerId).toBe(backlogId);
  });

  it('should set assignee to null if equals deleted member id', () => {
    const action = deleteMember(100, issue.assignee);
    const newState = reducer(issues, action);

    expect(newState.get(`${issue.id}`).assignee).toBeNull();
  });
});
