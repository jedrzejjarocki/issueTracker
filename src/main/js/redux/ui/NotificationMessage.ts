export interface NotificationMessage {
  content: string,
  severity: NotificationSeverity
}

export enum NotificationSeverity {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error'
}

export const checkEmailForPasswordRecoveryLinkMessage: NotificationMessage = {
  content: 'Check your email for password recovery link',
  severity: NotificationSeverity.SUCCESS,
};

export const accountCreatedMessage: NotificationMessage = {
  content: 'Account created!',
  severity: NotificationSeverity.SUCCESS,
};

export const passwordChangedSuccessfullyMessage: NotificationMessage = {
  content: 'Password changed successfully',
  severity: NotificationSeverity.SUCCESS,
};

export const defaultErrorNotificationMessage: NotificationMessage = {
  content: 'Something went wrong',
  severity: NotificationSeverity.ERROR,
};

export const incorrectUsernameOrPasswordMessage: NotificationMessage = {
  content: 'Incorrect username or password',
  severity: NotificationSeverity.ERROR,
};

export const userWithGivenEmailDoesNotExistMessage: NotificationMessage = {
  content: "User with a given email does't exists",
  severity: NotificationSeverity.ERROR,
};
