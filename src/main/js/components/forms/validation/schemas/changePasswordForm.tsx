import * as yup from 'yup';
import { confirmPassword, password } from '../validators';

export default yup.object().shape({
  password,
  confirmPassword,
});
