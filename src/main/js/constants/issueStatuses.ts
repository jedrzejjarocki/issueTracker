type color = 'default' | 'primary' | 'secondary';

type IssueStatusProperties = {
  [status: string]: {
    value: string
    text: string
    color: color
  }
};

const issueStatusProperties: IssueStatusProperties = {
  TO_DO: {
    value: 'TO_DO',
    text: 'TO DO',
    color: 'default',
  },
  IN_PROGRESS: {
    value: 'IN_PROGRESS',
    text: 'IN PROGRESS',
    color: 'secondary',
  },
  DONE: {
    value: 'DONE',
    text: 'DONE',
    color: 'primary',
  },
};

export default issueStatusProperties;
