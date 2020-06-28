import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,} from '@material-ui/core';
import {issue as issueType} from '../../propTypes';
import creators from '../../redux/actions/creators';
import SubmitButton from '../forms/SubmitButton';
import {BASE_URL} from '../../api/commons';

const DeleteIssue = ({
  issue, deleteIssue, history, projectId,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const handleDelete = async () => {
    try {
      const { status } = await axios.delete(`${BASE_URL}/issues/${issue.id}`);
      if (status === 200) {
        deleteIssue({
          listId: issue.listId,
          issueId: issue.id,
        });
        history.push(`/app/projects/${projectId}/board`);
        toggleOpen();
      }
    } catch (err) {
      console.log(err);
    }
  };

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
  deleteIssue: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = {
  deleteIssue: creators.deleteIssue,
};

export default connect(null, mapDispatchToProps)(DeleteIssue);
