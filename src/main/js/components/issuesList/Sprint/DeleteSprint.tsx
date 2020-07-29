import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Typography, } from '@material-ui/core';
import SubmitButton from '../../forms/SubmitButton';
import { fetchDeleteSprint } from '../../../redux/issuesContainers/actionCreators';
import Sprint from '../../../entities/Sprint';

interface Props extends ReduxProps {
  sprint: Sprint
  projectId: number
  backlogId: number
}

const DeleteSprint: React.FC<Props> = ({
  sprint, fetchDeleteSprint: fetchDelete, projectId, backlogId,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const history = useHistory();

  const handleDelete = () => fetchDelete(sprint, backlogId, projectId, history);

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

const connector = connect(null, { fetchDeleteSprint });

type ReduxProps = ConnectedProps<typeof connector>;

export default connector(DeleteSprint);
