import React from 'react';
import PropTypes from 'prop-types';
import {Select} from 'material-ui-formik-components/Select';
import FormField from './FormField';

const SelectField = ({ name, options, ...rest }) => (
  <FormField
    name={name}
    component={Select}
    options={options}
    {...rest}
  />
);

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOf([PropTypes.number.isRequired, PropTypes.string.isRequired]).isRequired,
    label: PropTypes.oneOf([PropTypes.string.isRequired, PropTypes.element.isRequired]).isRequired,
  })).isRequired,
};

export default SelectField;
