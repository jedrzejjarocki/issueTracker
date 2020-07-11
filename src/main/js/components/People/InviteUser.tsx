import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {TextField} from 'material-ui-formik-components/TextField';
import schema from '../forms/validation/schemas/inviteUserForm';
import DialogForm from '../forms/DialogForm';
import memberRoleOptions from '../forms/selectOptions/memberRoleOptions';
import BasicTextField from '../forms/fields/BasicTextField';
import SelectField from '../forms/fields/SelectField';
import {fetchInviteUser} from '../../redux/actions/teamMember/creators';
import {UserRole} from "../../propTypes";
import {RootState} from "../../redux/reducers/rootReducer";
import {getProjectsWhereCurrentUserIsLeader} from "../../redux/selectors/project";

const InviteUser: React.FC<ReduxProps> = ({ projectsWhereCurrentUserIsLeader, fetchInviteUser }) => {

  interface InviteUserFormFields {
    projectId: number
    email: string
    role: UserRole
  }

  const handleSubmit = async ({ role, email, projectId }: InviteUserFormFields) => {
    const requestBody = {
      project: {
        id: projectId,
      },
      email,
      role,
    };

    fetchInviteUser(requestBody);
  };

  const projectsOptions = projectsWhereCurrentUserIsLeader.map(({ id, name }) => ({
      value: id,
      label: name,
    }));

  const initialValues = {
    projectId: projectsOptions.length ? projectsOptions[0].value : 0,
    email: '',
    role: UserRole.DEVELOPER,
  };

  return (
    <>
      {!!projectsOptions.length && (
      <DialogForm
        title="Invite to project"
        toggleButtonText="Invite by email"
        onSubmit={handleSubmit}
        submitButtonText="Invite"
        validationSchema={schema}
        initialValues={initialValues}
        renderFields={(formikProps) => (
          <>
            <SelectField
              name="projectId"
              label="Project"
              options={projectsOptions}
            />
            <BasicTextField
              formikProps={formikProps}
              autoFocus
              required
              name="email"
              component={TextField}
            />
            <SelectField
              name="role"
              options={memberRoleOptions}
            />
          </>
        )}
      />
      )}
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  projectsWhereCurrentUserIsLeader: getProjectsWhereCurrentUserIsLeader(state, state.user.id)
})

const connector = connect(mapStateToProps, { fetchInviteUser })
type ReduxProps = ConnectedProps<typeof connector>

export default connector(InviteUser);
