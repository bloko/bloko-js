import axios from 'axios';

const http = (function () {
  let __instance;
  let __requestInterceptor;
  let __responseInterceptor;

  function instance() {
    if (!__instance) {
      __instance = axios.create();
    }

    return __instance;
  }

  function destroy() {
    __instance = null;
  }

  function setBaseURL(url) {
    instance().defaults.baseURL = url;
  }

  function setAuthorization(token) {
    instance().defaults.headers.common['Authorization'] = token;
  }

  function removeAuthorization() {
    delete instance().defaults.headers.common['Authorization'];
  }

  function addRequestInterceptor(success, error) {
    __removeInterceptor('request', __requestInterceptor);
    __requestInterceptor = __addInterceptor('request', success, error);
  }

  function addResponseInterceptor(success, error) {
    __removeInterceptor('response', __responseInterceptor);
    __responseInterceptor = __addInterceptor('response', success, error);
  }

  function __addInterceptor(type, success, error) {
    return instance().interceptors[type].use(success, error);
  }

  function __removeInterceptor(type, ref) {
    const handlers = instance().interceptors[type].handlers;

    if (handlers[ref]) {
      handlers.splice(ref, 1);
    }
  }

  return {
    instance,
    destroy,
    setBaseURL,
    setAuthorization,
    removeAuthorization,
    addRequestInterceptor,
    addResponseInterceptor,
  };
})();

export default http;
