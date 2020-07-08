import axios from 'axios';
import {BASE_URL, ISSUES_URL} from '../../../api/commons';
import {setMessage} from '../ui/creators';
import {
  ADD_ISSUE,
  AddIssueAction,
  DELETE_ISSUE,
  DeleteIssueAction,
  SET_ISSUES,
  SetIssuesAction,
  UPDATE_ISSUE,
  UpdateIssueAction
} from "./types";
import {Issue, IssueStatus, IssueType} from "../../../propTypes";
import {IssuesState} from "../../reducers/issues";
import {RouterHistory} from "../../utilTypes";
import {RootThunk} from "../../store";

export interface IssueRequestBody {
    id?: number
    list: {
        id: number
        '@type': "Backlog" | "Sprint"
    }
    version?: number
    type: IssueType
    status: IssueStatus
    summary: string
    description: string
    assignee: { id: number } | null
    storyPointsEstimate: number
}

const addIssue = (issue: Issue): AddIssueAction => ({
    type: ADD_ISSUE,
    payload: issue,
});

export const setIssues = (issues: IssuesState): SetIssuesAction => ({
    type: SET_ISSUES,
    payload: issues,
});

const updateIssue = (issue: Issue): UpdateIssueAction => ({
    type: UPDATE_ISSUE,
    payload: issue,
});

const deleteIssue = (issueId: number, listId: number): DeleteIssueAction => ({
    type: DELETE_ISSUE,
    payload: {
        listId,
        issueId,
    },
});

export const fetchCreateIssue = (requestBody: IssueRequestBody): RootThunk => async (dispatch) => {
    const { data } = await axios.post(ISSUES_URL, requestBody);

    const issueData = { ...data };
    issueData.assignee = data.assignee ? data.assignee.id : null;

    dispatch(addIssue(issueData));
};

export const fetchUpdateIssue = (requestBody: IssueRequestBody, projectId: number, history: RouterHistory): RootThunk => (
    async (dispatch) => {
        try {
            const { data } = await axios.put(`${BASE_URL}/issues`, requestBody);
            const issueData = { ...data };
            issueData.assignee = data.assignee ? data.assignee.id : null;
            dispatch(updateIssue(issueData));
            history.push(`/app/projects/${projectId}/board/issues/${data.id}`);
        } catch (err) {
            dispatch(setMessage({
                content: err.response.data.message,
                severity: 'error'
            }));
        }
    }
)

export const fetchDeleteIssue = (id: number, listId: number, projectId: number, history: RouterHistory): RootThunk => (
    async (dispatch) => {
        const { status } = await axios.delete(`${ISSUES_URL}/${id}`);
        if (status === 200) {
            dispatch(deleteIssue(id, listId));
            history.push(`/app/projects/${projectId}/board`);
        }
    }
);
