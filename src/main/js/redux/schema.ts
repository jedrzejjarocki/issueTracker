import {normalize, schema} from 'normalizr';
import {CurrentUserResponseBody} from "./actions/user/creators";

const teamMember = new schema.Entity('teamMembers');

const issue = new schema.Entity('issues', {
  assignee: teamMember,
  reporter: teamMember,
});

const issuesList = new schema.Entity('issuesLists', {
  issues: [issue],
});

const project = new schema.Entity('projects', {
  team: [teamMember],
  sprints: [issuesList],
  backlog: issuesList,
});

const user = new schema.Entity('user', {
  projects: [project],
});

export default (currentUserResponseBody: CurrentUserResponseBody) => normalize(currentUserResponseBody, user).entities;
