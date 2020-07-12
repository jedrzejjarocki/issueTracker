import React from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {CreateSprintRequestBody, fetchCreateSprint} from '../../../redux/actions/issuesList/creators';
import SprintForm from '../../forms/SprintForm';
import {RootState} from '../../../redux/reducers/rootReducer';
import {UserRole} from '../../../propTypes';
import {getCurrentProjectUserRole} from '../../../redux/selectors/ui';

interface CreateSprintFormFields {
  name: string
  goal: string
}

interface Props extends ReduxProps {
  projectId: number
  userRole: UserRole
}

const CreateSprint: React.FC<Props> = ({ fetchCreateSprint, projectId, userRole }) => {
  const initialValues: CreateSprintFormFields = {
    name: '',
    goal: '',
  };

  const onSubmit = async (values: CreateSprintFormFields) => {
    const requestBody: CreateSprintRequestBody = {
      name: values.name,
      goal: values.goal,
      '@type': 'Sprint',
      project: {
        id: projectId,
      },
    };
    fetchCreateSprint(requestBody, projectId);
  };

  return (
    <>
      {
        userRole === UserRole.LEADER && (
        <SprintForm
          toggleButtonText="Create Sprint"
          onSubmit={onSubmit}
          initialValues={initialValues}
          title="Create sprint"
          submitButtonText="Create"
        />
        )
      }
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  userRole: getCurrentProjectUserRole(state),
});

const connector = connect(mapStateToProps, { fetchCreateSprint });

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(CreateSprint);
