import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import {TextField} from 'material-ui-formik-components';
import * as yup from 'yup';
import creators from '../redux/actions/creators';
import {BASE_URL} from '../api/commons';
import DialogForm from './forms/DialogForm';
import FormField from './forms/FormField';

const schema = yup.object().shape({
  name: yup.string().required('Must not be empty'),
});

const CreateSprint = ({ addSprint, setMessage, projectId }) => {
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
    </>
  );
};

CreateSprint.propTypes = {
  addSprint: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  projectId: PropTypes.number.isRequired,
};

const mapDispatchToProps = {
  addSprint: creators.addSprint,
  setMessage: creators.setMessage,
};

export default connect(null, mapDispatchToProps)(CreateSprint);
