import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'formik';

const FormField = ({
  name, error, touched, ...rest
}) => {
  const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
  return (
    <Field
      name={name}
      label={capitalize(name)}
      variant="outlined"
      error={!!error && touched}
      helperText={touched ? error : ''}
      {...rest}
    />
  );
};

FormField.defaultProps = {
  touched: false,
};

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object.isRequired,
  touched: PropTypes.bool,
};

export default FormField;
