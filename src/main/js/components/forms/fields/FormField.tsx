import React from 'react';
import { Field } from 'formik';

interface Props {
  name: string
  error?: string,
  touched?: boolean
  type?: 'password' | 'number' | 'text'
  component: React.ComponentType
  options?: React.ReactNode
  multiline?: boolean
  rows?: number
  autoFocus?: boolean
  required?: boolean
}

const FormField: React.FC<Props> = ({
  name, error, touched, ...rest
}) => {
  const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);
  return (
    <Field
      name={name}
      label={capitalize(name)}
      variant="outlined"
      error={!!error && touched}
      helperText={(touched && error) || ' '}
      {...rest}
    />
  );
};

export default FormField;
