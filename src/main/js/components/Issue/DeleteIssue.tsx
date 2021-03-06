import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fetchDeleteIssue } from '../../redux/issues/actionCreators';
import SubmitButton from '../forms/SubmitButton';
import { RouterHistory } from '../../redux/utilTypes';
import Issue from '../../entities/Issue';

interface Props extends ReduxProps {
  issue: Issue
  history: RouterHistory,
  projectId: number
}

const useStyles = makeStyles((theme) => ({
  submitButton: {
    backgroundColor: theme.palette.error.main,
  },
}));

const DeleteIssue: React.FC<Props> = ({
  issue,
  fetchDeleteIssue: fetchDelete,
  history,
  projectId,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const classes = useStyles();

  const handleDelete = () => fetchDelete(issue.id, issue.containerId, projectId, history);

  return (
    <>
      <IconButton aria-label="delete" onClick={toggleOpen}>
        <DeleteOutlinedIcon fontSize="inherit" color="error" />
      </IconButton>
      <Dialog
        open={open}
        onClose={toggleOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete issue</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to permanently delete this issue,
            its comments and attachments, and all of its data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <SubmitButton
            onClick={handleDelete}
            className={classes.submitButton}
            text="delete"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

const connector = connect(null, { fetchDeleteIssue });
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(DeleteIssue);
