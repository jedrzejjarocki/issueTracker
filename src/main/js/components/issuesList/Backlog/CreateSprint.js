import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import {role} from '../../../propTypes';
import creators from '../../../redux/actions/creators';
import {BASE_URL} from '../../../api/commons';
import SprintForm from '../../forms/SprintForm';

const CreateSprint = ({
  addSprint, setMessage, projectId, userRole,
}) => {
  const initialValues = {
    name: '',
    goal: '',
  };

  const onSubmit = async (values, { resetForm }) => {
    const requestBody = { ...values };
    requestBody['@type'] = 'Sprint';
    requestBody.project = {
      id: projectId,
    };

    try {
      const { data } = await axios.post(`${BASE_URL}/sprints`, requestBody);
      addSprint({
        projectId,
        sprint: data,
      });
    } catch (err) {
      console.log(err);
      if (err.response.status <= 400) {
        setMessage({
          content: 'Something went wrong, try again',
          severity: 'error',
        });
      }
    }
    resetForm();
  };

  return (
    <>
      {
        userRole === 'LEADER' && (
        <SprintForm
          toggleButtonText="Create Sprint"
          onSubmit={onSubmit}
          initialValues={initialValues}
          title="Create sprint"
          submitButtonText="Create"
        />
        )
      }
    </>
  );
};

CreateSprint.propTypes = {
  addSprint: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
  userRole: role.isRequired,
};

const mapStateToProps = (state) => ({
  userRole: state.ui.currentProjectUserRole,
});

const mapDispatchToProps = {
  addSprint: creators.addSprint,
  setMessage: creators.setMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateSprint);
