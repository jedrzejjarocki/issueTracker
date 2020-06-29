import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {fetchCurrentUser} from '../redux/actions/user';

const useFetchInitialData = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCurrentUser(dispatch);
  }, [userId]);
};

export default useFetchInitialData;
