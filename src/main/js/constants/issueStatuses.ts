type Color = 'default' | 'primary' | 'secondary';

type IssueStatusProperties = {
  [status: string]: {
    value: string
    text: string
    color: Color
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
    color: 'primary',
  },
  DONE: {
    value: 'DONE',
    text: 'DONE',
    color: 'secondary',
  },
};

export default issueStatusProperties;
