import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { TextField } from 'material-ui-formik-components';
import DialogForm from '../forms/DialogForm';
import FormField from '../forms/fields/FormField';
import { fetchCreateProject } from '../../redux/projects/actionCreators';

interface Props extends ReduxProps {
  first?: boolean
}

const CreateProject: React.FC<Props> = ({ first, fetchCreateProject: fetchCreate }) => {
  interface CreateProjectFormFields {
    name: string
    key: string
  }

  const initialValues = {
    name: '',
    key: '',
  };

  const generateKey = (name: string) => name.split(' ')[0].slice(0, 8).toUpperCase();

  const onSubmit = ({ name, key }: CreateProjectFormFields, { resetForm }: { resetForm: () => void}) => {
    const requestBody = {
      name,
      projectKey: key ? key.toUpperCase() : generateKey(name),
    };
    fetchCreate(requestBody);
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
              error={errors.name as string}
              touched={touched.name as boolean}
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

const connector = connect(null, { fetchCreateProject });
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(CreateProject);
