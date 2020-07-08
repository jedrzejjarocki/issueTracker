import * as yup from 'yup';
import {email} from '../validators';

export default yup.object().shape({
  email,
});
