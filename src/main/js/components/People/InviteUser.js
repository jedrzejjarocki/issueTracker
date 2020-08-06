import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TextField} from 'material-ui-formik-components/TextField';
import schema from '../forms/validation/schemas/inviteUserForm';
import * as propTypes from '../../propTypes';
import DialogForm from '../forms/DialogForm';
import memberRoleOptions from '../forms/selectOptions/memberRoleOptions';
import BasicTextField from '../forms/fields/BasicTextField';
import SelectField from '../forms/fields/SelectField';
import {inviteUser} from '../../redux/actions/teamMember';

const isCurrentUserLeaderInProject = (project, currentUserId, teamMembers) => (
  Object.values(teamMembers).some(({ userId, role, projectId }) => (
    userId === currentUserId && projectId === project.id && role === 'LEADER'))
);

const getAvailableProjects = (projects, currentUserId, teamMembers) => {
  const available = [];
  Object.values(projects).map((project) => {
    if (isCurrentUserLeaderInProject(project, currentUserId, teamMembers)) {
      available.push(project);
    }
  });
  return available;
};

const InviteUser = ({
  projects, currentUserId, teamMembers, inviteUser,
}) => {
  const handleSubmit = async ({ role, email, projectId }) => {
    const requestBody = {
      project: {
        id: projectId,
      },
      email,
      role,
    };

    inviteUser(requestBody);
  };

  const projectsOptions = getAvailableProjects(projects, currentUserId, teamMembers)
    .map(({ id, name }) => ({
      value: id,
      label: name,
    }));

  const initialValues = {
    projectId: projectsOptions.length ? projectsOptions[0].value : 0,
    email: '',
    role: 'DEVELOPER',
  };

  return (
    <>
      {!!projectsOptions.length && (
      <DialogForm
        title="Invite to project"
        toggleButtonText="Invite by email"
        onSubmit={handleSubmit}
        submitButtonText="Invite"
        validationSchema={schema}
        initialValues={initialValues}
        renderFields={(formikProps) => (
          <>
            <SelectField
              name="projectId"
              label="Project"
              options={projectsOptions}
            />
            <BasicTextField
              formikProps={formikProps}
              autoFocus
              required
              name="email"
              component={TextField}
            />
            <SelectField
              name="role"
              label="Role"
              options={memberRoleOptions}
            />
          </>
        )}
      />
      )}
    </>
  );
};

InviteUser.propTypes = {
  inviteUser: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(propTypes.project).isRequired,
  teamMembers: PropTypes.arrayOf(propTypes.teamMember).isRequired,
  currentUserId: PropTypes.number.isRequired,
};

export default connect(null, { inviteUser })(InviteUser);