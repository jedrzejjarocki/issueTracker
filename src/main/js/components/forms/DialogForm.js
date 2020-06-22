import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles,} from '@material-ui/core';
import {Form, Formik} from 'formik';
import SubmitButton from './SubmitButton';

const DialogForm = ({
  validationSchema,
  initialValues,
  enableReinitialize = true,
  onSubmit,
  title,
  toggleButtonText,
  submitButtonText,
  renderFields,
  renderAdditionalActions,
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
      <Button variant="outlined" color="primary" onClick={toggleOpen}>
        {toggleButtonText}
      </Button>
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

DialogForm.defaultProps = {
  enableReinitialize: true,
  closeOnSubmit: true,
  renderAdditionalActions: null,
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
  closeOnSubmit: PropTypes.bool,
};

export default DialogForm;
