import axios from 'axios';
import { API_BASE_URL } from '../constants/urlConstants';

class RequestService {
  get = (url, isAuthRequired = false) => {
    return createRequest('GET', url, null, isAuthRequired);
  };

  post = (url, body, isAuthRequired = false) => {
    return createRequest('POST', url, body, isAuthRequired);
  };

  delete = (url, isAuthRequired = true) => {
    return createRequest('DELETE', url, null, isAuthRequired);
  };
}

const createRequest = (method, url, body, isAuthRequired) => {
  return axios({
    method: method,
    url: API_BASE_URL + url,
    data: body,
    headers: setHeader(isAuthRequired, 'application/json'),
    withCredentials: true,
  });
};

const setHeader = (isAuthRequired, contentType) => {
  const token = localStorage.getItem('TOKEN_KEY');
  if (isAuthRequired && token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
  axios.defaults.headers.common['Content-Type'] = contentType;
};

export default new RequestService();
