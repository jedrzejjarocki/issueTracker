import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router-dom';
import creators from '../redux/actions/creators';

export default () => {
  const dispatch = useDispatch();
  const { projectId } = useParams();
  useEffect(() => {
    console.log(projectId);
    dispatch(creators.setCurrentProject(projectId));
  }, [projectId]);
};
