import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import {setCurrentProject} from '../redux/actions/ui';

export default (userRole) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  useEffect(() => {
    dispatch(setCurrentProject(+projectId, userRole));
  }, [projectId, userRole]);
};
