import reducer from '../issues';
import {setLoading} from '../../actions/ui/creators';
import {setIssues} from '../../actions/issue/creators';
import {IssueStatus, IssueType} from '../../../propTypes';
import {ADD_ISSUE, AddIssueAction, DELETE_ISSUE, DeleteIssueAction,} from '../../actions/issue/types';
import {DELETE_SPRINT, DeleteSprintAction} from '../../actions/issuesList/types';
import {DELETE_MEMBER, DeleteTeamMemberAction} from '../../actions/teamMember/types';

const initialState = {};

const issues = {
  1: {
    id: 1,
    version: 0,
    summary: '',
    type: IssueType.BUG,
    status: IssueStatus.IN_PROGRESS,
    listId: 1,
    description: '',
    assignee: 1,
    storyPointsEstimate: 0,
  },
};

describe('issues reducer', () => {
  it("should return default state if action type doesn't match", () => {
    const newState = reducer(initialState, setLoading(false));
    expect(newState).toBe(initialState);
  });

  it('should set issues', () => {
    const newState = reducer(initialState, setIssues(issues));
    expect(newState).toBe(issues);
  });

  it('should set single issue', () => {
    const issue = {
      id: 1,
      version: 1,
      summary: '',
      type: IssueType.BUG,
      status: IssueStatus.DONE,
      listId: 1,
      description: '',
      assignee: 1,
      storyPointsEstimate: 0,
    };
    const action: AddIssueAction = { type: ADD_ISSUE, payload: issue };
    const newState = reducer(issues, action);

    expect(newState[issue.id]).toBe(issue);
    expect(newState[issue.id].status).toBe(IssueStatus.DONE);
  });

  it('should delete issue', () => {
    const action: DeleteIssueAction = {
      type: DELETE_ISSUE,
      payload: {
        issueId: 1,
        listId: 1,
      },
    };
    const newState = reducer(issues, action);
    expect(newState[1]).toBeUndefined();
  });

  it('should change listId to backlogId', () => {
    const action: DeleteSprintAction = {
      type: DELETE_SPRINT,
      payload: {
        sprint: {
          id: 1,
          name: '',
          issues: [],
        },
        backlogId: 10,
        projectId: 2,
      },
    };

    const newState = reducer(issues, action);
    expect(newState[1].listId).toBe(10);
  });

  it('should set assignee to null', () => {
    const action: DeleteTeamMemberAction = {
      type: DELETE_MEMBER,
      payload: {
        projectId: 1,
        memberId: 1,
      },
    };

    const newState = reducer(issues, action);

    expect(newState[1].assignee).toBeNull();
  });
});
