import { LOGIN_USER, REGISTER_USER, AUTH_USER } from '../_actions/types';

export default function reducer(state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload };
    // 서버에서 가져온 response를 action.payload에 넣어줌
    case REGISTER_USER:
      return { ...state, register: action.payload };
    case AUTH_USER:
      return { ...state, userData: action.payload };
    default:
      return state;
  }
}
