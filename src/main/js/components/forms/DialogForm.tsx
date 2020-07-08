import React, {MouseEventHandler, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Tooltip,} from '@material-ui/core';
import {Form, Formik, FormikProps} from 'formik';
import SubmitButton from './SubmitButton';
import {ObjectSchema} from "yup";

const WithTooltip: React.FC<{tooltipText: string}> = ({ children, tooltipText }) => (
  <>
    {
      tooltipText
        ? (
          <Tooltip title={tooltipText}>
            <span>{children}</span>
          </Tooltip>
        ) : children
    }
  </>
);


//@TODO types
interface Props {
  validationSchema?: ObjectSchema
  initialValues: {
    [x: string]: any
  }
  enableReinitialize?: boolean
  onSubmit(values: any, helpers: any, toggleOpen: Function): void
  title: string,
  toggleButtonText?: string
  submitButtonText?: string
  renderToggleComponent?: (toggle: MouseEventHandler) => JSX.Element
  renderFields: (formikProps: FormikProps<any>) => JSX.Element
  renderAdditionalActions?: () => JSX.Element
  toggleButtonTooltipText?: string
  disabled?: boolean
  closeOnSubmit?: boolean
  isOpen?: boolean
}

const DialogForm: React.FC<Props> = ({
  validationSchema,
  initialValues,
  enableReinitialize = true,
  onSubmit,
  title,
  toggleButtonText,
  submitButtonText,
  renderToggleComponent,
  renderFields,
  renderAdditionalActions,
  toggleButtonTooltipText,
  disabled = false,
  closeOnSubmit = true,
  isOpen = false,
}) => {
  const [open, setOpen] = useState(isOpen);
  const toggleOpen = () => setOpen(!open);

  const handleSubmit = (values: any, helpers: any) => {
    onSubmit(values, helpers, toggleOpen);
    if (closeOnSubmit) toggleOpen();
  };

  const classes = makeStyles((theme) => ({
    flexContainer: {
      '& > *': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginBottom: theme.spacing(3),
      },
    },
  }))();

  return (
    <>
      {
        renderToggleComponent ? renderToggleComponent(toggleOpen) : (
          <WithTooltip tooltipText={toggleButtonTooltipText}>
            <Button variant="outlined" color="primary" onClick={toggleOpen} disabled={disabled}>
              {toggleButtonText}
            </Button>
          </WithTooltip>
        )
      }
      <Dialog
        open={open}
        onClose={toggleOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{title}</DialogTitle>
        <Formik
          enableReinitialize={enableReinitialize}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {(formikProps) => (
            <Form>
              <DialogContent className={classes.flexContainer}>
                {renderFields(formikProps)}
              </DialogContent>
              <DialogActions>
                {renderAdditionalActions && renderAdditionalActions()}
                <SubmitButton
                  errors={formikProps.errors}
                  text={submitButtonText}
                />
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

export default DialogForm;
