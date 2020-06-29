import React, {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,} from '@material-ui/core';
import {teamMember} from '../../propTypes';
import SubmitButton from '../forms/SubmitButton';
import {changeRole} from '../../redux/actions/teamMember';

const ChangeRole = ({
  member, changeRole,
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

    changeRole(requestBody, toggleOpen);
  };

  return (
    <>
      <IconButton aria-label="edit" onClick={toggleOpen}>
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
      <Dialog
        open={open}
        onClose={toggleOpen}
        aria-labelledby="form-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Chenge role</DialogTitle>
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
  changeRole: PropTypes.func.isRequired,
};

export default connect(null, { changeRole })(ChangeRole);
