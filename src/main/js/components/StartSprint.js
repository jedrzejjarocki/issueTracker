import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {addMinutes, addWeeks} from 'date-fns';
import axios from 'axios';
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {connect} from 'react-redux';
import {TextField} from 'material-ui-formik-components/TextField';
import {Select} from 'material-ui-formik-components/Select';
import * as yup from 'yup';
import {makeStyles, Typography} from '@material-ui/core';
import * as propTypes from '../propTypes';
import FormField from './forms/FormField';
import creators from '../redux/actions/creators';
import DialogForm from './forms/DialogForm';
import {BASE_URL} from '../api/commons';

const useStyles = makeStyles(() => ({
  halfWidth: {
    width: '50%',
  },
}));

const durationOptions = [1, 2, 3, 4].map((duration) => ({
  value: duration,
  label: <Typography>{`${duration} week${duration === 1 ? '' : 's'}`}</Typography>,
}));

const schema = yup.object().shape({
  name: yup.string().required('Must not be empty'),
  goal: yup.string(),
  duration: yup.number().required(),
});

const findTeamMemberByUserId = (team, id) => team.find((member) => member.userId === id);

const isEmpty = (sprint) => !sprint.issues || !sprint.issues.length;

const isNotAuthorized = (team, user) => {
  const teamMember = findTeamMemberByUserId(team, user.id);
  return !teamMember || teamMember.role !== 'LEADER';
};

const projectHasActiveSprint = (project) => project.sprints.some((s) => !!s.startDate);

const canBeStarted = (user, sprint, project) => {
  if (isEmpty(sprint)) return false;
  if (projectHasActiveSprint(project)) return false;

  return true;
};

const StartSprint = ({
  user, sprint, project, setSprint,
}) => {
  const classes = useStyles();

  const [startDate, setStartDate] = useState(new Date());

  const initialValues = {
    ...sprint,
    duration: 2,
  };

  const onSubmit = async ({ name, goal, duration }) => {
    const requestBody = {
      project: {
        id: project.id,
      },
      name,
      goal,
      startDate: addMinutes(startDate, 15).getTime(),
      endDate: addWeeks(startDate, duration).getTime(),
    };

    try {
      const { data } = await axios.put(`${BASE_URL}/projects/${project.id}/sprints/${sprint.id}`, requestBody);
      setSprint({
        projectId: project.id,
        sprint: data,
      });
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <>
      {(!isNotAuthorized(project.team, user) && !sprint.startDate)
      && (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DialogForm
          enableReinitialize
          title="Create Issue"
          onSubmit={onSubmit}
          validationSchema={schema}
          submitButtonText="Start"
          toggleButtonText="Start"
          disabled={!canBeStarted(user, sprint, project)}
          toggleButtonTooltipText={isEmpty(sprint)
            ? 'Cannot be started because it contains no issues'
            : projectHasActiveSprint(project)
              ? 'Can be planned but not started until the completion of above active sprint'
              : ''}
          initialValues={initialValues}
          renderFields={({ errors, touched }) => (
            <>
              <FormField
                autoFocus
                required
                name="name"
                className={classes.halfWidth}
                component={TextField}
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
              <FormField
                required
                name="duration"
                error={errors.duration}
                touched={touched.duration}
                component={Select}
                options={durationOptions}
                className={classes.halfWidth}
              />
              <FormField
                autoFocus
                name="goal"
                multiline
                rows={6}
                component={TextField}
              />
            </>
          )}
        />
      </MuiPickersUtilsProvider>
      )}
    </>
  );
};

StartSprint.propTypes = {
  user: propTypes.user.isRequired,
  sprint: propTypes.sprint.isRequired,
  project: propTypes.project.isRequired,
  setSprint: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {
  setSprint: creators.setSprint,
};

export default connect(mapStateToProps, mapDispatchToProps)(StartSprint);
