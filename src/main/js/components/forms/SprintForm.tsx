import React, {MouseEventHandler} from 'react';
import schema from './validation/schemas/sprintForm';
import DialogForm from './DialogForm';
import BasicTextField from './fields/BasicTextField';

interface Props {
    title: string
    toggleButtonText?: string
    onSubmit: (values: any) => Promise<void>
    initialValues: any
    submitButtonText?: string
    toggleComponent?: (toggle: MouseEventHandler) => JSX.Element
}

const SprintForm: React.FC<Props> = ({
  toggleButtonText, title, onSubmit, initialValues, submitButtonText, toggleComponent,
}) => (
  <DialogForm
    renderToggleComponent={toggleComponent}
    toggleButtonText={toggleButtonText}
    title={title}
    onSubmit={onSubmit}
    initialValues={initialValues}
    validationSchema={schema}
    renderFields={(formikProps) => (
      <>
        <BasicTextField
          autoFocus
          required
          formikProps={formikProps}
          name="name"
        />
        <BasicTextField
          formikProps={formikProps}
          name="goal"
        />
      </>
    )}
    submitButtonText={submitButtonText}
  />
);

export default SprintForm;
