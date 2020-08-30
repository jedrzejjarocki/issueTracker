import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../redux/user/actionCreators';

const useFetchInitialData = (userId: number | null) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCurrentUser(dispatch);
  }, [userId]);
};

export default useFetchInitialData;
