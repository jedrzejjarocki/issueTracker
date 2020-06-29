import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import {IconButton} from '@material-ui/core';
import {Select} from 'material-ui-formik-components/Select';
import FormField from '../forms/FormField';
import DialogForm from '../forms/DialogForm';
import {BASE_URL} from '../../api/commons';
import actions from '../../redux/actions/actions';
import memberRoleOptions from '../forms/memberRoleOptions';

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
  projects, user, teamMembers, currentUserId, addTeamMember, setMessage,
}) => {
  const history = useHistory();

  const handleSubmit = async (values) => {
    const requestBody = {
      user: {
        id: user.id,
      },
      role: values.role,
      project: {
        id: values.projectId,
      },
    };
    try {
      const { data } = await axios.post(`${BASE_URL}/members`, requestBody);
      const payload = { ...data };
      payload.username = user.username;
      addTeamMember(payload);
      setMessage({
        content: 'Team member successfully added',
        severity: 'success',
      });
      history.push('/app/people');
    } catch (err) {
      console.log(err);
    }
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
          <FormField
            name="projectId"
            label="Project"
            component={Select}
            options={projectsOptions}
          />
          <FormField
            name="role"
            label="Role"
            component={Select}
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

AddTeamMember.propTypes = {};

const mapDispatchToProps = {
  addTeamMember: actions.addTeamMember,
  setMessage: actions.setMessage,
};
export default connect(null, mapDispatchToProps)(AddTeamMember);
