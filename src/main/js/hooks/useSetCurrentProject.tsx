import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import {setCurrentProject} from '../redux/ui/actionCreators';
import {UserRole} from '../redux/utilTypes';

export default (userRole: UserRole) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  useEffect(() => {
    dispatch(setCurrentProject(+projectId, userRole));
  }, [projectId, userRole]);
};
