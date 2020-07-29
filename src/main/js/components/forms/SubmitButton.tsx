import React from 'react';
import { Button } from '@material-ui/core';
import { FormikErrors } from 'formik/dist/types';

type Errors = {
  [key: string]: string
} | FormikErrors<any>;

const SubmitButton = ({ errors = {}, text = 'Submit', ...rest }) => {
  const hasErrors = (err: Errors) => Object.values(err).some((error) => !!error);

  return (
    <Button
      type="submit"
      color="primary"
      variant="contained"
      disabled={hasErrors(errors)}
      {...rest}
    >
      {text}
    </Button>
  );
};

export default SubmitButton;
