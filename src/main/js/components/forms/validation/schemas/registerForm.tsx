import * as yup from 'yup';
import {
  confirmPassword, email, password, username,
} from '../validators';

export default yup.object().shape({
  username,
  password,
  email,
  confirmPassword,
});
