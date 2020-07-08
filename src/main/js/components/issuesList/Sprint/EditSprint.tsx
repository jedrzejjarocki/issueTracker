import React, {MouseEventHandler} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {MenuItem} from '@material-ui/core';
import SprintForm from '../../forms/SprintForm';
import {fetchUpdateSprint, UpdateSprintRequestBody} from '../../../redux/actions/issuesList/creators';
import {Sprint} from "../../../propTypes";

const toggleComponent = (handleToggle: MouseEventHandler) => <MenuItem onClick={handleToggle}>edit sprint</MenuItem>;

interface Props extends ReduxProps {
    sprint: Sprint
    projectId: number
}

const EditSprint: React.FC<Props> = ({ sprint, projectId, fetchUpdateSprint }) => {
  const onSubmit = async (values: Sprint) => {
    const requestBody: UpdateSprintRequestBody = {
      id: values.id,
      name: values.name,
      goal: values.goal,
      project: {
        id: projectId,
      },
      ['@type']: 'Sprint'
    };
    fetchUpdateSprint(requestBody, projectId);
  };

  return (
    <SprintForm
      toggleComponent={toggleComponent}
      onSubmit={onSubmit}
      initialValues={sprint}
      title="Create sprint"
      submitButtonText="Edit"
    />
  );
};

const connector = connect(null, { fetchUpdateSprint })

type ReduxProps = ConnectedProps<typeof connector>

export default connector(EditSprint);
