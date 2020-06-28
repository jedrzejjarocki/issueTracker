import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {connect} from 'react-redux';
import {TextField} from 'material-ui-formik-components';
import creators from '../../redux/actions/creators';
import {BASE_URL} from '../../api/commons';
import DialogForm from '../forms/DialogForm';
import FormField from '../forms/FormField';

const CreateProject = ({ first, addProject, setMessage }) => {
  const initialValues = {
    name: '',
    key: null,
  };

  const generateKey = (name) => name.split(' ')[0].slice(0, 8).toUpperCase();

  const onSubmit = async ({ name, key }, { resetForm }) => {
    try {
      const { data } = await axios.post(`${BASE_URL}/projects`, {
        name,
        projectKey: key ? key.toUpperCase() : generateKey(name),
      });
      addProject(data);
    } catch (err) {
      if (err.response.status <= 400) {
        setMessage({
          content: 'Something went wrong, try again',
          severity: 'error',
        });
      }
    }
    resetForm();
  };

  return (
    <>
      <DialogForm
        toggleButtonText={`Create ${first ? 'your first' : 'new'} project`}
        title="Create project"
        // validate={validate}
        onSubmit={onSubmit}
        initialValues={initialValues}
        renderFields={({ errors, touched }) => (
          <>
            <FormField
              autoFocus
              required
              error={errors.name}
              touched={touched.name}
              name="name"
              component={TextField}
            />

            {/* <CustomTextField */}
            {/*  required */}
            {/*  name="key" */}
            {/*  value={ */}
            {/*    values.key === null ? generateKey(values.name) : values.key */}
            {/*  } */}
            {/*  handleChange={handleChange} */}
            {/*  error={errors.key} */}
            {/*  touched={touched.key} */}
            {/*  style={{ maxWidth: "30%" }} */}
            {/* /> */}
          </>
        )}
        submitButtonText="Create"
      />
    </>
  );
};

CreateProject.defaultProps = {
  first: false,
};

CreateProject.propTypes = {
  first: PropTypes.bool,
  addProject: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  addProject: creators.addProject,
  setMessage: creators.setMessage,
};

export default connect(null, mapDispatchToProps)(CreateProject);
