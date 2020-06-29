import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import axios from 'axios';
import normalize from '../redux/schema';
import creators from '../redux/actions/actions';
import {BASE_URL} from '../api/commons';

const {
  setUser,
  setLoading,
  setProjects,
  setIssues,
  setTeamMembers,
  setIssuesLists,
} = creators;

const setData = (data, dispatch) => {
  const {
    user,
    projects,
    issues,
    teamMembers,
    issuesLists,
  } = normalize(data);

  const actions = [
    setUser(Object.values(user)[0]),
    setProjects(projects),
    setIssues(issues),
    setIssuesLists(issuesLists),
    setTeamMembers(teamMembers),
  ];

  actions.map((action) => dispatch(action));
};

const useFetchInitialData = (userId) => {
  const dispatch = useDispatch();
  const fetchInitialData = async () => {
    try {
      const { status, data } = await axios.get(`${BASE_URL}/users/current`);
      if (status === 200) {
        setData(data, dispatch);
      }
    } catch (err) {
      console.log(err);
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchInitialData();
  }, [userId]);
};

export default useFetchInitialData;
