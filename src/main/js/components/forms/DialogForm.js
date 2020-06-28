import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Tooltip,} from '@material-ui/core';
import {Form, Formik} from 'formik';
import {children} from '../../propTypes';
import SubmitButton from './SubmitButton';

const WithTooltip = ({ children, tooltipText }) => (
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

const DialogForm = ({
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
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const handleSubmit = (values, helpers) => {
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

WithTooltip.defaultProps = {
  tooltipText: null,
};

WithTooltip.propTypes = {
  children: children.isRequired,
  tooltipText: PropTypes.string,
};

DialogForm.defaultProps = {
  enableReinitialize: true,
  closeOnSubmit: true,
  renderAdditionalActions: null,
  renderToggleComponent: null,
  disabled: false,
  toggleButtonTooltipText: null,
};

DialogForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  validationSchema: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  initialValues: PropTypes.object.isRequired,
  enableReinitialize: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  toggleButtonText: PropTypes.string.isRequired,
  renderFields: PropTypes.func.isRequired,
  renderAdditionalActions: PropTypes.func,
  renderToggleComponent: PropTypes.func,
  closeOnSubmit: PropTypes.bool,
  disabled: PropTypes.bool,
  toggleButtonTooltipText: PropTypes.string,
};

export default DialogForm;
