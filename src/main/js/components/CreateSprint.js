import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import {TextField} from 'material-ui-formik-components';
import * as yup from 'yup';
import {role} from '../propTypes';
import creators from '../redux/actions/creators';
import {BASE_URL} from '../api/commons';
import DialogForm from './forms/DialogForm';
import FormField from './forms/FormField';
import withAuth from './withAuth';

const schema = yup.object().shape({
  name: yup.string().required('Must not be empty'),
});

const CreateSprint = ({
  addSprint, setMessage, projectId, userRole,
}) => {
  const initialValues = {
    name: '',
    goal: '',
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/projects/${projectId}/sprints`, values);
      addSprint({
        projectId,
        sprint: data,
      });

      console.log(data);
    } catch (err) {
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
        <DialogForm
          toggleButtonText="Create Sprint"
          title="Create sprint"
          onSubmit={onSubmit}
          initialValues={initialValues}
          validationSchema={schema}
          renderFields={({ errors, touched }) => (
            <>
              <FormField
                autoFocus
                required
                error={errors.name}
                touched={touched.name}
                name="name"
                component={TextField}
              />
              <FormField
                error={errors.goal}
                touched={touched.goal}
                name="goal"
                component={TextField}
              />
            </>
          )}
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

const mapDispatchToProps = {
  addSprint: creators.addSprint,
  setMessage: creators.setMessage,
};

export default withAuth(connect(null, mapDispatchToProps)(CreateSprint));
