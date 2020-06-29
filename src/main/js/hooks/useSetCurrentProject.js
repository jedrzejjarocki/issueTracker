import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import creators from '../redux/actions/actions';

export default (userRole) => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  useEffect(() => {
    dispatch(creators.setCurrentProject({
      id: +projectId,
      userRole,
    }));
  }, [projectId, userRole]);
};
