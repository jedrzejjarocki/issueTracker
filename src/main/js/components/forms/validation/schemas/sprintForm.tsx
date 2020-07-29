import * as yup from 'yup';
import { sprintName } from '../validators';

export default yup.object().shape({
  name: sprintName,
});
