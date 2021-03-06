import React, { useState } from 'react';
import { addMinutes, addWeeks } from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { connect, ConnectedProps } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import durationOptions from '../../forms/selectOptions/sprintDurationOptions';
import DialogForm from '../../forms/DialogForm';
import BasicTextField from '../../forms/fields/BasicTextField';
import SelectField from '../../forms/fields/SelectField';
import TextAreaField from '../../forms/fields/TextAreaField';
import schema from '../../forms/validation/schemas/startSprint';
import { fetchUpdateSprint, UpdateSprintRequestBody } from '../../../redux/issuesContainers/actionCreators';
import { RootState } from '../../../redux/rootReducer';

import Sprint, { SprintStatus } from '../../../entities/Sprint';
import { UserRole } from '../../../redux/utilTypes';
import { getSprintsByProjectId } from '../../../redux/issuesContainers/selectors';
import { getCurrentProject } from '../../../redux/ui/selectors';

const useStyles = makeStyles(() => ({
  halfWidth: {
    width: '50%',
  },
}));

const isStarted = ({ status }: Sprint) => status === SprintStatus.PENDING;

const isEmpty = (sprint: Sprint) => !sprint.issues || !sprint.issues.size;

const projectHasActiveSprint = (sprints: Sprint[]) => sprints.some(isStarted);

const canBeStarted = (sprint: Sprint, sprints: Sprint[]) => !(isEmpty(sprint) || projectHasActiveSprint(sprints));

interface Props extends ReduxProps {
  sprint: Sprint
  projectId: number
}

const StartSprint: React.FC<Props> = ({
  sprint, projectId, fetchUpdateSprint: fetchUpdate, sprints, userRole,
}) => {
  const classes = useStyles();

  const [startDate, setStartDate] = useState(new Date());

  interface StartSprintFormValues extends Sprint {
    duration: number
  }

  const initialValues = {
    ...sprint.toJS(),
    duration: 2,
  };

  const onSubmit = async ({
    name, goal, duration, id,
  }: StartSprintFormValues) => {
    const requestBody: UpdateSprintRequestBody = {
      project: {
        id: projectId,
      },
      id,
      name,
      goal,
      startDate: addMinutes(startDate, 15).toISOString(),
      endDate: addWeeks(startDate, duration).toISOString(),
      '@type': 'Sprint',
      status: SprintStatus.PENDING,
    };

    fetchUpdate(requestBody);
  };

  return (
    <>
      {userRole === UserRole.LEADER && !isStarted(sprint) && (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DialogForm
          enableReinitialize
          title="Start sprint"
          onSubmit={onSubmit}
          validationSchema={schema}
          submitButtonText="Start"
          toggleButtonText="Start"
          disabled={!canBeStarted(sprint, sprints)}
          toggleButtonTooltipText={isEmpty(sprint)
            ? 'Cannot be started because it contains no issues'
            : projectHasActiveSprint(sprints)
              ? 'Can be planned but not started until the completion of above active sprint'
              : ''}
          initialValues={initialValues}
          renderFields={(formikProps) => (
            <>
              <BasicTextField
                formikProps={formikProps}
                autoFocus
                required
                name="name"
                className={classes.halfWidth}
              />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                inputVariant="outlined"
                format="MM/dd/yyyy"
                margin="normal"
                label="Start date"
                value={startDate}
                minDate={new Date()}
                onChange={(date) => setStartDate(date as Date)}
                className={classes.halfWidth}
                KeyboardButtonProps={{
                  'aria-label': 'start date',
                }}
              />
              <SelectField
                required
                name="duration"
                options={durationOptions}
                className={classes.halfWidth}
              />
              <TextAreaField name="goal" />
            </>
          )}
        />
      </MuiPickersUtilsProvider>
      )}
    </>
  );
};

const mapStateToProps = (state: RootState, { projectId }: { projectId: number}) => ({
  sprints: getSprintsByProjectId(state, String(projectId)),
  userRole: getCurrentProject(state)?.userRole,
});

const connector = connect(mapStateToProps, { fetchUpdateSprint });
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(StartSprint);
