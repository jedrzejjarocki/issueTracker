import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TextField} from 'material-ui-formik-components';
import DialogForm from '../forms/DialogForm';
import FormField from '../forms/fields/FormField';
import {createProject} from '../../redux/actions/project';

const CreateProject = ({ first, createProject }) => {
  const initialValues = {
    name: '',
    key: null,
  };

  const generateKey = (name) => name.split(' ')[0].slice(0, 8).toUpperCase();

  const onSubmit = ({ name, key }, { resetForm }) => {
    createProject(name, key ? key.toUpperCase() : generateKey(name));
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
  createProject: PropTypes.func.isRequired,
};

export default connect(null, {
  createProject,
})(CreateProject);
