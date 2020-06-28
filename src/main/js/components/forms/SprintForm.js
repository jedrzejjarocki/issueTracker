import {TextField} from 'material-ui-formik-components';
import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import {children} from '../../propTypes';
import FormField from './FormField';
import DialogForm from './DialogForm';

const schema = yup.object().shape({
  name: yup.string().required('Must not be empty'),
});

const SprintForm = ({
  toggleButtonText, title, onSubmit, initialValues, submitButtonText, toggleComponent,
}) => (
  <DialogForm
    renderToggleComponent={toggleComponent}
    toggleButtonText={toggleButtonText}
    title={title}
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
    submitButtonText={submitButtonText}
  />
);

SprintForm.propTypes = {
  toggleButtonText: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  toggleComponent: children.isRequired,
  submitButtonText: PropTypes.string.isRequired,
};

export default SprintForm;
