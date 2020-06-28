import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Typography,} from '@material-ui/core';
import {sprint as sprintType} from '../../../propTypes';
import creators from '../../../redux/actions/creators';
import SubmitButton from '../../forms/SubmitButton';
import {BASE_URL} from '../../../api/commons';

const DeleteSprint = ({
  sprint, deleteSprint, projectId, backlogId,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const history = useHistory();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/sprints/${sprint.id}`);
      if (response.status === 200) {
        alert(sprint.id);
        deleteSprint({
          sprint,
          backlogId,
          projectId,
        });
        history.push(`/projects/${projectId}/board`);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
  deleteSprint: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = {
  deleteSprint: creators.deleteSprint,
};

export default connect(null, mapDispatchToProps)(DeleteSprint);
