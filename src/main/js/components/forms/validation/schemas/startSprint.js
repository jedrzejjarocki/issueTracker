import * as yup from 'yup';
import {sprintDuration, sprintGoal, sprintName} from '../validators';

export default yup.object().shape({
  name: sprintName,
  goal: sprintGoal,
  duration: sprintDuration,
});
