import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {connect, ConnectedProps} from 'react-redux';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography,} from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import SubmitButton from '../forms/SubmitButton';
import {fetchDeleteMember} from '../../redux/actions/teamMember/creators';
import {RootState} from "../../redux/reducers/rootReducer";
import {TeamMember} from "../../propTypes";

interface Props extends ReduxProps {
  member: TeamMember
}

const DeleteMember: React.FC<Props> = ({
  member, currentProjectId, fetchDeleteMember,
}) => {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => setOpen(!open);
  const history = useHistory();

  const handleDelete = () => fetchDeleteMember(currentProjectId, member.id, history, toggleOpen);

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

const mapStateToProps = (state: RootState) => ({
  currentProjectId: state.ui.currentProject,
});

const connector = connect(mapStateToProps, { fetchDeleteMember })
type ReduxProps = ConnectedProps<typeof connector>

export default connector(DeleteMember);
