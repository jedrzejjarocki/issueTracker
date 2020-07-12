import reducer, {IssuesListsState} from '../issuesLists';
import {setLoading} from '../../actions/ui/creators';
import {addSprint, deleteSprint, setIssuesLists, updateSprint,} from '../../actions/issuesList/creators';
import {Issue, IssueStatus, IssueType, Sprint,} from '../../../propTypes';
import {addIssue, deleteIssue} from '../../actions/issue/creators';
import {addProject} from '../../actions/project/creators';
import {AddProjectPayload} from '../../actions/project/types';

const initialState = {};

const issuesLists: IssuesListsState = {
  1: {
    id: 1,
    issues: [1, 2, 3],
  },
  2: {
    id: 2,
    issues: [4, 5, 6],
  },
};

const sprint: Sprint = {
  id: 3,
  name: '',
  issues: [7, 8, 9],
};

describe('issues lists reducer', () => {
  it('should return state if action type doesn\'t match', () => {
    const action = setLoading(false);
    const newState = reducer({ ...initialState }, action);
    expect(newState).toStrictEqual(initialState);
  });

  it('should set state', () => {
    const action = setIssuesLists({ ...issuesLists });
    const newState = reducer(initialState, action);

    expect(newState).toStrictEqual(issuesLists);
  });

  it('should add sprint', () => {
    const action = addSprint({ ...sprint }, 1);
    const newState = reducer(initialState, action);

    expect(newState[3]).toStrictEqual(sprint);
  });

  it('should update sprint', () => {
    const updatedSprint = { ...sprint, id: 1 };
    const action = updateSprint(updatedSprint, 1);
    const newState = reducer(initialState, action);

    expect(newState[1]).toStrictEqual(updatedSprint);
  });

  it('should delete sprint and add issues to backlog', () => {
    const action = deleteSprint({ ...sprint }, 1, 2);
    const newState = reducer(issuesLists, action);

    expect(newState[sprint.id]).toBeUndefined();
    expect(newState[1].issues).toStrictEqual(expect.arrayContaining(sprint.issues));
  });

  it('should add issue id at beginning of issues array', () => {
    const issue: Issue = {
      id: 1,
      version: 0,
      summary: '',
      type: IssueType.BUG,
      status: IssueStatus.IN_PROGRESS,
      listId: 1,
      description: '',
      assignee: 1,
      storyPointsEstimate: 0,
    };

    const action = addIssue(issue);

    const newState = reducer(issuesLists, action);

    expect(newState[issue.listId].issues[0]).toBe(issue.id);
  });

  it('should remove issue id from issues array', () => {
    const issueId = 5;
    const listId = 2;
    const action = deleteIssue(issueId, listId);
    const newState = reducer(issuesLists, action);

    expect(newState[listId].issues).not.toContain(issueId);
  });

  it('should add backlog', () => {
    const payload: AddProjectPayload = {
      name: 'name',
      id: 1,
      projectKey: 'key',
      team: [],
      backlog: {
        id: 33,
        issues: [],
      },
    };
    const action = addProject(payload);
    const newState = reducer(initialState, action);

    expect(newState[payload.backlog.id]).toStrictEqual(payload.backlog);
  });
});
