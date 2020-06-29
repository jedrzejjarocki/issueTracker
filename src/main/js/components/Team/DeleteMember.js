import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,} from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import axios from 'axios';
import actions from '../../redux/actions/actions';
import SubmitButton from '../forms/SubmitButton';
import {teamMember} from '../../propTypes';
import {BASE_URL} from '../../api/commons';

const DeleteMember = ({
  member, currentProjectId, deleteTeamMember, setMessage,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const history = useHistory();

  const handleDelete = async () => {
    try {
      const { status } = await axios.delete(`${BASE_URL}/members/${member.id}`);
      if (status === 200) {
        deleteTeamMember({
          projectId: currentProjectId,
          memberId: member.id,
        });
        history.push(`/app/projects/${currentProjectId}/team`);
      }
    } catch (err) {
      if (err.response.status === 409) {
        setMessage({
          content: err.response.data.message,
          severity: 'error',
        });
      }
    }
    toggleOpen();
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
        <DialogTitle>Delete member</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to permanently delete this member,
            All issues he was supposed to do will now become unassigned.
          </Typography>
        </DialogContent>
        <DialogActions>
          <SubmitButton onClick={handleDelete} color="secondary" />
        </DialogActions>
      </Dialog>
    </>
  );
};

DeleteMember.propTypes = {
  member: teamMember.isRequired,
  deleteTeamMember: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
  currentProjectId: PropTypes.number.isRequired,
};

const mapDispatchToProps = {
  deleteTeamMember: actions.deleteTeamMember,
  setMessage: actions.setMessage,
};

const mapStateToProps = (state) => ({
  currentProjectId: state.ui.currentProject,
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMember);
