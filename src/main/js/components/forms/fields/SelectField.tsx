import React from 'react';
import {Select} from 'material-ui-formik-components/Select';
import FormField from './FormField';
import {FormikProps} from "formik";

interface Props {
  name: string,
  label?: string
  options: React.ReactNode
  className?: string
  formikProps?: FormikProps<any>
  required?: boolean
}

const SelectField: React.FC<Props > = ({ name, options, ...rest }) => (
  <FormField
    name={name}
    component={Select}
    options={options}
    {...rest}
  />
);

export default SelectField;