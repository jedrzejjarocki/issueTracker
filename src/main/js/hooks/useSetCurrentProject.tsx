import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setCurrentProject } from '../redux/ui/actionCreators';
import { UserRole } from '../redux/utilTypes';

export default (userRole: UserRole | null) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  useEffect(() => {
    if (userRole) dispatch(setCurrentProject(+projectId, userRole));
  }, [projectId, userRole]);
};
