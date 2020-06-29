import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import axios from 'axios';
import {connect} from 'react-redux';
import {Select} from 'material-ui-formik-components/Select';
import {TextField} from 'material-ui-formik-components/TextField';
import * as propTypes from '../../propTypes';
import actions from '../../redux/actions/actions';
import DialogForm from '../forms/DialogForm';
import FormField from '../forms/FormField';
import memberRoleOptions from '../forms/memberRoleOptions';
import {BASE_URL} from '../../api/commons';

const schema = yup.object().shape({
  email: yup.string().email('Must be valid email'),
});

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
  projects, currentUserId, teamMembers, setMessage,
}) => {
  const handleSubmit = async ({ role, email, projectId }) => {
    const requestBody = {
      project: {
        id: projectId,
      },
      email,
      role,
    };

    try {
      await axios.post(`${BASE_URL}/members/invitations`, requestBody);
      setMessage({
        content: 'User has been invited',
        severity: 'success',
      });
    } catch (err) {
      setMessage({
        content: 'Something went wrong, try again',
        severity: 'error',
      });
    }
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
        renderFields={({ errors, touched }) => (
          <>
            <FormField
              name="projectId"
              label="Project"
              component={Select}
              options={projectsOptions}
            />
            <FormField
              required
              name="email"
              error={errors.email}
              touched={touched.email}
              component={TextField}
            />
            <FormField
              name="role"
              label="Role"
              component={Select}
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
  setMessage: PropTypes.func.isRequired,
  projects: PropTypes.arrayOf(propTypes.project).isRequired,
  teamMembers: PropTypes.arrayOf(propTypes.teamMember).isRequired,
  currentUserId: PropTypes.number.isRequired,
};

const mapDispatchToProps = {
  setMessage: actions.setMessage,
};

export default connect(null, mapDispatchToProps)(InviteUser);
