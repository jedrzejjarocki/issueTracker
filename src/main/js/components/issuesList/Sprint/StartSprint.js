import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {addMinutes, addWeeks} from 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {connect} from 'react-redux';
import {makeStyles} from '@material-ui/core';
import durationOptions from '../../forms/selectOptions/sprintDurationOptions';
import {role, sprint as sprintType} from '../../../propTypes';
import DialogForm from '../../forms/DialogForm';
import {getSprintsByProjectId} from '../../../redux/selectors';
import BasicTextField from '../../forms/fields/BasicTextField';
import SelectField from '../../forms/fields/SelectField';
import TextAreaField from '../../forms/fields/TextAreaField';
import schema from '../../forms/validation/schemas/startSprint';
import {fetchUpdateSprint} from '../../../redux/actions/issuesLists';

const useStyles = makeStyles(() => ({
  halfWidth: {
    width: '50%',
  },
}));

const isStarted = (sprint) => !!sprint.startDate;

const isEmpty = (sprint) => !sprint.issues || !sprint.issues.length;

const projectHasActiveSprint = (sprints) => Object.values(sprints).some((s) => !!s.startDate);

const canBeStarted = (sprint, project) => {
  if (isEmpty(sprint)) return false;
  if (projectHasActiveSprint(project)) return false;

  return true;
};

const StartSprint = ({
  sprint, projectId, fetchUpdateSprint, sprints, userRole,
}) => {
  const classes = useStyles();

  const [startDate, setStartDate] = useState(new Date());

  const initialValues = {
    ...sprint,
    duration: 2,
  };

  const onSubmit = async ({
    name, goal, duration, id,
  }) => {
    const requestBody = {
      project: {
        id: projectId,
      },
      id,
      name,
      goal,
      startDate: addMinutes(startDate, 15).getTime(),
      endDate: addWeeks(startDate, duration).getTime(),
      '@type': 'Sprint',
    };

    fetchUpdateSprint(requestBody, projectId);
  };

  return (
    <>
      {userRole === 'LEADER' && !isStarted(sprint) && (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DialogForm
          enableReinitialize
          title="Create Issue"
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
                onChange={(date) => setStartDate(date)}
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

StartSprint.propTypes = {
  sprint: sprintType.isRequired,
  projectId: PropTypes.number.isRequired,
  fetchUpdateSprint: PropTypes.func.isRequired,
  sprints: PropTypes.arrayOf(sprintType).isRequired,
  userRole: role.isRequired,
};

const mapStateToProps = (state, { projectId }) => ({
  sprints: getSprintsByProjectId(projectId, state),
  userRole: state.ui.currentProjectUserRole,
});

export default connect(mapStateToProps, { fetchUpdateSprint })(StartSprint);
