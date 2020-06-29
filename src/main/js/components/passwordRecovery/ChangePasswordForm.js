import React from 'react';
import {connect} from 'react-redux';
import {Button, Card, CardActions, CardContent, makeStyles, Typography,} from '@material-ui/core';
import PropTypes from 'prop-types';
import {Link as RouterLink, useHistory} from 'react-router-dom';
import {Form, Formik} from 'formik';
import schema from '../forms/validation/schemas/changePasswordForm';
import SubmitButton from '../forms/SubmitButton';
import BasicTextField from '../forms/fields/BasicTextField';
import {changePassword} from '../../redux/actions/user';

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    '& > *': {
      display: 'flex',
      flexDirection: 'column',
      margin: theme.spacing(2, 0),
      width: '40ch',
      height: '200',
    },
  },
  justifyRight: {
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2, 2),
  },
}));

const ChangePasswordForm = ({ token, changePassword }) => {
  const classes = useStyles();
  const history = useHistory();

  const onSubmit = ({ password }) => changePassword(password, token, history);

  return (
    <Card variant="outlined">
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
        }}
        onSubmit={onSubmit}
        validationSchema={schema}
      >
        {(formikProps) => (
          <Form>
            <CardContent>
              <Typography variant="h6" component="h2">
                Change password
              </Typography>
              <BasicTextField
                formikProps={formikProps}
                required
                type="password"
                name="password"
              />
              <BasicTextField
                required
                name="confirmPassword"
                label="Confirm password"
                type="password"
                formikProps={formikProps}
              />
            </CardContent>
            <CardActions className={classes.justifyRight}>
              <RouterLink to="/">
                <Button color="primary">Cancel</Button>
              </RouterLink>
              <SubmitButton errors={formikProps.errors} text="Change" />
            </CardActions>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

ChangePasswordForm.propTypes = {
  token: PropTypes.string.isRequired,
  changePassword: PropTypes.func.isRequired,
};

export default connect(null, { changePassword })(ChangePasswordForm);
