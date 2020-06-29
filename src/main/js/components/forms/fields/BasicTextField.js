import React from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'material-ui-formik-components/TextField';
import FormField from './FormField';

const BasicTextField = ({
  name, type, formikProps, error, ...rest
}) => (
  <FormField
    name={name}
    type={type}
    touched={formikProps.touched[name]}
    error={formikProps.errors[name]}
    component={TextField}
    {...rest}
  />
);

BasicTextField.defaultProps = {
  type: 'text',
  error: null,
};

BasicTextField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
  formikProps: PropTypes.shape({
    touched: PropTypes.objectOf(PropTypes.string),
    errors: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
};

export default BasicTextField;
