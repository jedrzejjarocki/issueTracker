import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {fetchCurrentUser} from '../redux/actions/user/creators';

const useFetchInitialData = (userId: number) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCurrentUser(dispatch);
  }, [userId]);
};

export default useFetchInitialData;
