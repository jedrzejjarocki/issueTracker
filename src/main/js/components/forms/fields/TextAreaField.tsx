import React from 'react';
import { TextField } from 'material-ui-formik-components/TextField';
import FormField from './FormField';

interface Props {
  name: string
  rows?: number
}

const TextAreaField: React.FC<Props> = ({ name, rows = 6 }) => (
  <FormField
    multiline
    rows={rows}
    name={name}
    component={TextField}
  />
);

export default TextAreaField;
