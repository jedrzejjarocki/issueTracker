import React, {useState} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,} from '@material-ui/core';
import SubmitButton from '../forms/SubmitButton';
import {fetchChangeTeamMemberRole} from '../../redux/actions/teamMember/creators';
import {TeamMember, UserRole} from "../../propTypes";

interface Props extends ReduxProps {
  member: TeamMember
}

const ChangeRole: React.FC<Props> = ({
  member, fetchChangeTeamMemberRole,
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
      role: member.role === UserRole.DEVELOPER ? UserRole.LEADER : UserRole.DEVELOPER,
    };

    fetchChangeTeamMemberRole(requestBody, toggleOpen);
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
        <DialogTitle>Change role</DialogTitle>
        <DialogContent>
          <Typography>
            {`Are you sure you want to change role to ${member.role === UserRole.DEVELOPER ? 'LEADER' : 'DEVELOPER'}?`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <SubmitButton onClick={handleSubmit} color="secondary" text="change" />
        </DialogActions>
      </Dialog>
    </>
  );
};

const connector = connect(null, { fetchChangeTeamMemberRole })
type ReduxProps  =ConnectedProps<typeof connector>

export default connector(ChangeRole);
