import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,} from '@material-ui/core';
import {fetchDeleteIssue} from '../../redux/actions/issue/creators';
import SubmitButton from '../forms/SubmitButton';
import {Issue} from '../../propTypes';
import {RouterHistory} from '../../redux/utilTypes';

interface Props extends ReduxProps {
  issue: Issue
  history: RouterHistory,
  projectId: number
}

const DeleteIssue: React.FC<Props> = ({
  issue, fetchDeleteIssue, history, projectId,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const handleDelete = () => fetchDeleteIssue(issue.id, issue.listId, projectId, history);

  return (
    <>
      <IconButton color="secondary" aria-label="delete" onClick={toggleOpen}>
        <DeleteOutlinedIcon fontSize="inherit" />
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
          <SubmitButton onClick={handleDelete} color="secondary" />
        </DialogActions>
      </Dialog>
    </>
  );
};

const connector = connect(null, { fetchDeleteIssue });
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(DeleteIssue);
