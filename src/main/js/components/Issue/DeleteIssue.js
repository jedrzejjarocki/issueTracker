import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,} from '@material-ui/core';
import {issue as issueType} from '../../propTypes';
import {fetchDeleteIssue} from '../../redux/actions/issue';
import SubmitButton from '../forms/SubmitButton';

const DeleteIssue = ({
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

DeleteIssue.propTypes = {
  issue: issueType.isRequired,
  projectId: PropTypes.number.isRequired,
  fetchDeleteIssue: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(null, { fetchDeleteIssue })(DeleteIssue);
