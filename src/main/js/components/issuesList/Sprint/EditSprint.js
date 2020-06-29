import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {MenuItem} from '@material-ui/core';
import axios from 'axios';
import {sprint as sprintType} from '../../../propTypes';
import actions from '../../../redux/actions/actions';
import SprintForm from '../../forms/SprintForm';
import {BASE_URL} from '../../../api/commons';

const toggleComponent = (handleToggle) => <MenuItem onClick={handleToggle}>edit sprint</MenuItem>;

const EditSprint = ({
  sprint, projectId, updateSprint, setMessage,
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

    try {
      const { data } = await axios.put(`${BASE_URL}/sprints`, requestBody);
      updateSprint({
        projectId,
        sprint: data,
      });
    } catch (err) {
      if (err.response.status <= 400) {
        setMessage({
          content: 'Something went wrong, try again',
          severity: 'error',
        });
      }
    }
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
  updateSprint: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
};

const mapDispatchToProps = {
  updateSprint: actions.updateSprint,
  setMessage: actions.setMessage,
};

export default connect(null, mapDispatchToProps)(EditSprint);
