import React from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'material-ui-formik-components/TextField';
import FormField from './FormField';

const TextAreaField = ({ name, rows = 8 }: {name: string, rows: number}) => (
  <FormField
    multiline
    rows={rows}
    name={name}
    component={TextField}
  />
);

TextAreaField.defaultProps = {
  rows: 8,
};

TextAreaField.propTypes = {
  name: PropTypes.string.isRequired,
  rows: PropTypes.number,
};

export default TextAreaField;
