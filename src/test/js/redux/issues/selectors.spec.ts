import { List, Map, Record } from 'immutable';
import { getIssueById, getIssuesByContainerId } from '../../../../main/js/redux/issues/selectors';
import { RootState } from '../../../../main/js/redux/rootReducer';
import User from '../../../../main/js/entities/User';
import Project from '../../../../main/js/entities/Project';
import TeamMember from '../../../../main/js/entities/TeamMember';
import Backlog from '../../../../main/js/entities/Backlog';
import Issue from '../../../../main/js/entities/Issue';
import { IssuesContainersState } from '../../../../main/js/redux/issuesContainers/types';
import { IssuesContainer } from '../../../../main/js/entities/IssuesContainer';
import { UIState } from '../../../../main/js/redux/ui/types';

const ui: UIState = Record({
  loading: false,
  currentProject: null,
  notification: null,
})();

const projects = Map({
  1: new Project(),
});

const teamMembers = Map({
  1: new TeamMember(),
});

const issuesContainers: IssuesContainersState = Map({
  1: new Backlog({
    issues: List([1, 2]),
  }) as IssuesContainer,
});

const issues = Map({
  1: new Issue({ id: 1, containerId: (<Backlog> issuesContainers.first()).id }),
  2: new Issue({ id: 2, containerId: (<Backlog> issuesContainers.first()).id }),
});

const state: RootState = {
  ui,
  user: new User(),
  projects,
  teamMembers,
  issuesContainers,
  issues,
};

describe('issues selectors', () => {
  it('should return all issues as array', () => {
    const result = getIssuesByContainerId.resultFunc(issuesContainers.first(), issues);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
  });

  it.each(issues.entrySeq().toArray())('should return issue with id %i', (id, expected) => {
    const result = getIssueById(state, id);
    expect(result).toBe(expected);
  });
});
