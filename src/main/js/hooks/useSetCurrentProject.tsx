import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import {setCurrentProject} from '../redux/actions/ui/creators';
import {UserRole} from '../propTypes';

export default (userRole: UserRole) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  useEffect(() => {
    dispatch(setCurrentProject(+projectId, userRole));
  }, [projectId, userRole]);
};
