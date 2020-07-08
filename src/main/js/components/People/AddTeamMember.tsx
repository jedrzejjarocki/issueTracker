import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import {useHistory} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';
import {IconButton} from '@material-ui/core';
import DialogForm from '../forms/DialogForm';
import memberRoleOptions from '../forms/selectOptions/memberRoleOptions';
import SelectField from '../forms/fields/SelectField';
import {fetchAddTeamMember} from '../../redux/actions/teamMember/creators';
import {UserRole} from "../../propTypes";
import {RootState} from "../../redux/reducers/rootReducer";
import {getProjectsWhereCurrentUserIsLeader} from "../../redux/selectors/project";

const AddTeamMember: React.FC<ReduxProps> = ({ projectsWhereCurrentUserIsLeader, user, fetchAddTeamMember} ) => {
  const history = useHistory();

  interface AddTeamMemberFormFields {
    role: UserRole
    projectId: number
  }

  const handleSubmit = (values: AddTeamMemberFormFields) => {
    const requestBody = {
      user: {
        id: user.id,
      },
      role: values.role,
      project: {
        id: values.projectId,
      },
    };

    fetchAddTeamMember(requestBody, user.username, history);
  };

  const projectsOptions = projectsWhereCurrentUserIsLeader.map(({ id, name }) => ({
      value: id,
      label: name,
    }));

  const initialValues = {
    role: UserRole.DEVELOPER,
    projectId: projectsOptions.length ? projectsOptions[0].value : 0,
  };

  return (
    <DialogForm
      renderFields={() => (
        <>
          <SelectField
            name="projectId"
            label="Project"
            options={projectsOptions}
          />
          <SelectField
            name="role"
            options={memberRoleOptions}
          />
        </>
      )}
      title="Add team member"
      onSubmit={handleSubmit}
      submitButtonText="Add"
      initialValues={initialValues}
      renderToggleComponent={(toggleOpen) => (
        <IconButton disabled={!projectsOptions.length} aria-label="add to project" onClick={toggleOpen}>
          <AddIcon />
        </IconButton>
      )}
    />
  );
};

const mapStateToProps = (state: RootState) => ({
  user: state.user,
  projectsWhereCurrentUserIsLeader: getProjectsWhereCurrentUserIsLeader(state)
})

const connector = connect(mapStateToProps, { fetchAddTeamMember })
type ReduxProps = ConnectedProps<typeof connector>

export default connector(AddTeamMember);
