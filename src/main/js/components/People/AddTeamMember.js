import React from 'react';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import {IconButton} from '@material-ui/core';
import {project, teamMember, user} from '../../propTypes';
import DialogForm from '../forms/DialogForm';
import memberRoleOptions from '../forms/selectOptions/memberRoleOptions';
import SelectField from '../forms/fields/SelectField';
import {fetchAddTeamMember} from '../../redux/actions/teamMember';

const isCurrentUserLeaderInProject = (project, currentUserId, teamMembers) => (
  Object.values(teamMembers).some(({ userId, role, projectId }) => (
    userId === currentUserId && projectId === project.id && role === 'LEADER'))
);

const isAlreadyMember = (projectId, user) => (
  user.memberships.some(({ project }) => project.id === projectId)
);

const getAvailableProjects = (user, projects, teamMembers, currentUserId) => {
  const available = [];
  Object.values(projects).map((project) => {
    if (!isAlreadyMember(project.id, user)
      && isCurrentUserLeaderInProject(project, currentUserId, teamMembers)
    ) {
      available.push(project);
    }
  });
  return available;
};

const AddTeamMember = ({
  projects, user, teamMembers, currentUserId, fetchAddTeamMember,
}) => {
  const history = useHistory();

  const handleSubmit = (values) => {
    const requestBody = {
      user: {
        id: user.id,
      },
      role: values.role,
      project: {
        id: values.projectId,
      },
    };

    fetchAddTeamMember(requestBody, user.username, history);
  };

  const projectsOptions = getAvailableProjects(user, projects, teamMembers, currentUserId)
    .map(({ id, name }) => ({
      value: id,
      label: name,
    }));

  const initialValues = {
    role: 'DEVELOPER',
    projectId: projectsOptions.length ? projectsOptions[0].value : 0,
  };

  return (
    <DialogForm
      renderFields={() => (
        <>
          <SelectField
            name="projectId"
            label="Project"
            options={projectsOptions}
          />
          <SelectField
            name="role"
            label="Role"
            options={memberRoleOptions}
          />
        </>
      )}
      title="Add team member"
      onSubmit={handleSubmit}
      submitButtonText="Add"
      initialValues={initialValues}
      renderToggleComponent={(toggleOpen) => (
        <IconButton disabled={!projectsOptions.length} aria-label="add to project" onClick={toggleOpen}>
          <AddIcon />
        </IconButton>
      )}
    />
  );
};

AddTeamMember.propTypes = {
  projects: PropTypes.arrayOf(project).isRequired,
  user: user.isRequired,
  teamMembers: PropTypes.arrayOf(teamMember).isRequired,
  currentUserId: PropTypes.number.isRequired,
  fetchAddTeamMember: PropTypes.func.isRequired,
};

export default connect(null, { fetchAddTeamMember })(AddTeamMember);
