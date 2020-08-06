import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Typography,} from '@material-ui/core';
import {sprint as sprintType} from '../../../propTypes';
import SubmitButton from '../../forms/SubmitButton';
import {fetchDeleteSprint} from '../../../redux/actions/issuesLists';

const DeleteSprint = ({
  sprint, fetchDeleteSprint, projectId, backlogId,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const history = useHistory();

  const handleDelete = () => fetchDeleteSprint(sprint, backlogId, projectId, history);

  return (
    <>
      <MenuItem onClick={toggleOpen}>delete sprint</MenuItem>
      <Dialog
        open={open}
        onClose={toggleOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete sprint</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to permanently delete this sprint.
            All its issues will be moved to backlog.
          </Typography>
        </DialogContent>
        <DialogActions>
          <SubmitButton onClick={handleDelete} color="secondary" />
        </DialogActions>
      </Dialog>
    </>
  );
};

DeleteSprint.propTypes = {
  sprint: sprintType.isRequired,
  projectId: PropTypes.number.isRequired,
  backlogId: PropTypes.number.isRequired,
  fetchDeleteSprint: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(null, { fetchDeleteSprint })(DeleteSprint);