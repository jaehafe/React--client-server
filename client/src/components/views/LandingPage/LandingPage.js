import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Authen from '../../../hoc/auth';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/hello') // server/index.js app.get
      .then((response) => console.log(response.data));
  }, []);

  const onClickHandler = () => {
    axios.get(`/api/users/logout`).then((response) => {
      if (response.data.success) {
        navigate('/login');
      } else {
        alert('Failed to logout');
      }
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
};

export default Authen(LandingPage, null);
