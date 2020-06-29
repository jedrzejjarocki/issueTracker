import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSprint} from '../../../redux/actions/issuesLists';
import {role} from '../../../propTypes';
import SprintForm from '../../forms/SprintForm';

const CreateSprint = ({
  createSprint, projectId, userRole,
}) => {
  const initialValues = {
    name: '',
    goal: '',
  };

  const onSubmit = async (values) => {
    const requestBody = { ...values };
    requestBody['@type'] = 'Sprint';
    requestBody.project = {
      id: projectId,
    };

    createSprint(requestBody, projectId);
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
  createSprint: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
  userRole: role.isRequired,
};

const mapStateToProps = (state) => ({
  userRole: state.ui.currentProjectUserRole,
});

export default connect(mapStateToProps, { createSprint })(CreateSprint);
