import React from 'react';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import {children} from '../../propTypes';
import DialogForm from './DialogForm';
import BasicTextField from './fields/BasicTextField';

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
    renderFields={(formikProps) => (
      <>
        <BasicTextField
          autoFocus
          required
          formikProps={formikProps}
          name="name"
        />
        <BasicTextField
          formikProps={formikProps}
          name="goal"
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
