import React from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/urlConstants';

class RequestService {
  get = (url) => {
    console.log(url)
    return createRequest("GET", url, null);
  };

  post = (url, body) => {
    return createRequest("POST", url, body);
  };
};

const createRequest = (method, url, body) => {
  return axios({
    method: method,
    url: API_BASE_URL + url,
    data: body,
    headers: { "Content-Type": "application/json" }
  });
};

export default new RequestService();