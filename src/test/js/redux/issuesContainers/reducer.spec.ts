import { List, Map } from 'immutable';
import reducer from '../../../../main/js/redux/issuesContainers/reducer';
import { setLoading } from '../../../../main/js/redux/ui/actionCreators';
import Backlog from '../../../../main/js/entities/Backlog';
import {
  deleteSprint,
  setIssuesContainers,
  updateSprint,
} from '../../../../main/js/redux/issuesContainers/actionCreators';
import Sprint from '../../../../main/js/entities/Sprint';
import { IssuesContainer } from '../../../../main/js/entities/IssuesContainer';
import { IssuesContainersState } from '../../../../main/js/redux/issuesContainers/types';
import Issue from '../../../../main/js/entities/Issue';
import { addIssue, deleteIssue } from '../../../../main/js/redux/issues/actionCreators';
import { addProject } from '../../../../main/js/redux/projects/actionCreators';
import { AddProjectPayload } from '../../../../main/js/redux/projects/types';

const backlog1 = new Backlog({ id: 2, issues: List() });
const sprint1 = new Sprint({ id: 1, issues: List([2]) });

const issue1 = new Issue({ id: 100, containerId: sprint1.id });
const issue2 = new Issue({ id: 2, containerId: sprint1.id });

const initialState: IssuesContainersState = Map();
const issuesContainers: IssuesContainersState = Map({
  [sprint1.id]: sprint1 as IssuesContainer,
  [backlog1.id]: backlog1 as IssuesContainer,
});

describe('issues containers reducer', () => {
  it('should return previous state if action type doesn\'t match', () => {
    const action = setLoading(false);
    const newState = reducer(initialState, action);

    expect(newState).toBe(initialState);
  });

  it('should return action payload', () => {
    const action = setIssuesContainers(issuesContainers);
    const newState = reducer(initialState, action);

    expect(newState).toBe(issuesContainers);
  });

  it('should return state with updated sprints', () => {
    const updatedSprint = sprint1.set('name', 'new name');
    const action = updateSprint(updatedSprint, 0);
    const newState = reducer(issuesContainers, action);

    expect(newState.get(String(sprint1.get('id')))).toBe(updatedSprint);
  });

  it('should delete sprint and move all it\'s issues to backlog', () => {
    const backlogId = backlog1.get('id');

    const action = deleteSprint(sprint1, backlogId, 0);
    const newState = reducer(issuesContainers, action);

    expect(newState.get(`${sprint1.id}`)).toBeUndefined();

    const backlogIssuesArray = newState.getIn([`${backlog1.id}`, 'issues']).toArray();
    expect(backlogIssuesArray).toEqual(expect.arrayContaining(sprint1.issues.toArray()));
  });

  it('should add issue to container issues list', () => {
    const action = addIssue(issue1);

    const newState = reducer(issuesContainers, action);
    expect(newState.getIn([`${issue1.containerId}`, 'issues']).toArray()[0]).toBe(issue1.id);
  });

  it('should delete issue from container issues list', () => {
    const action = deleteIssue(issue2.id, issue2.containerId);

    const newState = reducer(issuesContainers, action);
    expect(newState.getIn([`${issue2.containerId}`, 'issues']).toArray()).not.toContain(issue2.id);
  });

  it('should add backlog to state', () => {
    const payload = { backlog: { id: 100 } } as AddProjectPayload;
    const action = addProject(payload);

    const newState = reducer(initialState, action);
    expect(newState.get(`${payload.backlog.id}`)).toEqual(new Backlog({ id: payload.backlog.id }));
  });
});
