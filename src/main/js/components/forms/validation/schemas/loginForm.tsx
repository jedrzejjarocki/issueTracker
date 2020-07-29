import * as yup from 'yup';
import { password, username } from '../validators';

export default yup.object().shape({
  username,
  password,
});
