import * as yup from 'yup';
import issueTypes from '../../../constants/issueTypes';

const number = yup.number();
const numberRequired = number.required('Required');
const string = yup.string();
const stringRequired = string.required('Must not be empty');

export const projectId = numberRequired;
export const issueType = stringRequired.oneOf(Object.keys(issueTypes));
export const issueSummary = stringRequired;
export const description = string;
export const assigneeId = number;
export const listId = number;
export const storyPointsEstimate = number.moreThan(-1, 'Must not be negative integer');

export const username = stringRequired;
export const email = string.email('Must be valid email');
export const password = string.min(8, 'Must be at least 8 characters long')
  .max(128, 'Must be at most 128 characters long')
  .required('Must be 8 characters or more');
export const confirmPassword = string.oneOf([yup.ref('password'), null], 'Passwords must match');

export const sprintName = stringRequired;
export const sprintDuration = numberRequired.oneOf([1, 2, 3, 4]);
export const sprintGoal = string;
