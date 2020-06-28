import PropTypes from 'prop-types';

export const user = PropTypes.shape({
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
});

export const children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

export const issue = PropTypes.shape({
  id: PropTypes.number.isRequired,
  summary: PropTypes.string.isRequired,
  description: PropTypes.string,
});

export const backlog = PropTypes.shape({
  id: PropTypes.number.isRequired,
  issues: PropTypes.arrayOf(issue),
}).isRequired;

export const sprint = PropTypes.shape({
  id: PropTypes.number.isRequired,

  issues: PropTypes.arrayOf(issue),
});

export const project = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  projectKey: PropTypes.string.isRequired,
  team: PropTypes.arrayOf(PropTypes.number).isRequired,
  backlog: PropTypes.number.isRequired,
  sprints: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
});

export const message = PropTypes.shape({
  content: PropTypes.string.isRequired,
  severity: PropTypes.string.isRequired,
});

export const role = PropTypes.oneOf(['LEADER', 'DEVELOPER']);

export const teamMember = PropTypes.shape({
  id: PropTypes.number.isRequired,
  userId: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  role,
});
