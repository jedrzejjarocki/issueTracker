import React from 'react';
import { TextField } from 'material-ui-formik-components/TextField';
import { FormikProps } from 'formik';
import FormField from './FormField';

interface Props {
  name: string
  type?: 'password' | 'number' | 'text'
  formikProps: FormikProps<any>
  [key: string]: any;
}

const BasicTextField: React.FC<Props> = ({
  name, type, formikProps, ...rest
}) => (
  <FormField
    name={name}
    type={type}
    touched={formikProps.touched[name] as boolean}
    error={formikProps.errors[name] as string}
    component={TextField}
    {...rest}
  />
);

export default BasicTextField;
