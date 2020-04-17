import axios from 'axios';

const http = (function () {
  let __instance;
  let __requestInterceptor;
  let __responseInterceptor;

  function getInstance() {
    if (!__instance) {
      __instance = axios.create();
    }

    return __instance;
  }

  function setBaseURL(url) {
    getInstance().defaults.baseURL = url;
  }

  function setAuthorization(token) {
    getInstance().defaults.headers.common['Authorization'] = token;
  }

  function removeAuthorization() {
    delete getInstance().defaults.headers.common['Authorization'];
  }

  function addRequestInterceptor(success, error) {
    if (__requestInterceptor) {
      __removeInterceptor('request', __requestInterceptor);
    }

    __requestInterceptor = __addInterceptor('request', success, error);
  }

  function addResponseInterceptor(success, error) {
    if (__responseInterceptor) {
      __removeInterceptor('response', __responseInterceptor);
    }

    __responseInterceptor = __addInterceptor('response', success, error);
  }

  function __addInterceptor(type, sucess, error) {
    return axios.interceptors[type].use(sucess, error);
  }

  function __removeInterceptor(type, ref) {
    axios.interceptors[type].eject(ref);
  }

  return {
    getInstance,
    setBaseURL,
    setAuthorization,
    removeAuthorization,
    addRequestInterceptor,
    addResponseInterceptor,
  };
})();

export default http;
