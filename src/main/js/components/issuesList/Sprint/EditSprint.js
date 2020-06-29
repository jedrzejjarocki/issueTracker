import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {MenuItem} from '@material-ui/core';
import {sprint as sprintType} from '../../../propTypes';
import SprintForm from '../../forms/SprintForm';
import {fetchUpdateSprint} from '../../../redux/actions/issuesLists';

const toggleComponent = (handleToggle) => <MenuItem onClick={handleToggle}>edit sprint</MenuItem>;

const EditSprint = ({
  sprint, projectId, fetchUpdateSprint,
}) => {
  const onSubmit = async ({ id, name, goal }) => {
    const requestBody = {
      id,
      name,
      goal,
    };
    requestBody['@type'] = 'Sprint';
    requestBody.project = {
      id: projectId,
    };
    fetchUpdateSprint(requestBody, projectId);
  };

  return (
    <SprintForm
      toggleComponent={toggleComponent}
      onSubmit={onSubmit}
      initialValues={sprint}
      title="Create sprint"
      submitButtonText="Edit"
    />
  );
};

EditSprint.propTypes = {
  sprint: sprintType.isRequired,
  fetchUpdateSprint: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
};

export default connect(null, { fetchUpdateSprint })(EditSprint);
