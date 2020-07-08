import {IssueStatus} from "../propTypes";

type color = "default" | "primary" | "secondary"

type IssueStatusProperties = {
  [status in IssueStatus]: {
    value: string
    text: string
    color: color
  }
};

const issueStatusProperties: IssueStatusProperties = {
  [IssueStatus.TO_DO]: {
    value: "TO_DO",
    text: "To do",
    color: "default"
  },
  [IssueStatus.IN_PROGRESS]: {
    value: "IN_PROGRESS",
    text: "In progress",
    color: "secondary"
  },
  [IssueStatus.DONE]: {
    value: "DONE",
    text: "Done",
    color: "primary"
  }
}

export default issueStatusProperties