import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,} from '@material-ui/core';
import {teamMember} from '../../propTypes';
import creators from '../../redux/actions/creators';
import SubmitButton from '../forms/SubmitButton';
import {BASE_URL} from '../../api/commons';

const ChangeRole = ({
  member, updateMemberRole, setMessage, history,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);

  const handleSubmit = async () => {
    const requestBody = {
      id: member.id,
      project: {
        id: member.projectId,
      },
      user: {
        id: member.userId,
      },
      role: member.role === 'DEVELOPER' ? 'LEADER' : 'DEVELOPER',
    };

    try {
      const { data } = await axios.put(`${BASE_URL}/members`, requestBody);
      updateMemberRole(data);
    } catch (err) {
      setMessage({
        content: err.response.data.message,
        severity: 'error',
      });
    }
    toggleOpen();
  };

  return (
    <>
      <IconButton aria-label="delete" onClick={toggleOpen}>
        <EditOutlinedIcon fontSize="small" />
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
            {`Are you sure you want to change role to ${member.role === 'DEVELOPER' ? 'LEADER' : 'DEVELOPER'}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <SubmitButton onClick={handleSubmit} color="secondary" text="change" />
        </DialogActions>
      </Dialog>
    </>
  );
};

ChangeRole.propTypes = {
  member: teamMember.isRequired,
  updateMemberRole: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = {
  updateMemberRole: creators.updateMemberRole,
  setMessage: creators.setMessage,
};

export default connect(null, mapDispatchToProps)(ChangeRole);
