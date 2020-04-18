import axios from 'axios';

const http = (function () {
  let __instance;
  let __requestInterceptor;
  let __responseInterceptor;
  let INTERCEPTOR_TYPE = {
    REQUEST: 'request',
    RESPONSE: 'response',
  };

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

  function setRequestInterceptor(success, error) {
    __requestInterceptor = __setInterceptor(
      INTERCEPTOR_TYPE.REQUEST,
      success,
      error
    );
  }

  function setResponseInterceptor(success, error) {
    __responseInterceptor = __setInterceptor(
      INTERCEPTOR_TYPE.RESPONSE,
      success,
      error
    );
  }

  function __setInterceptor(type, success, error) {
    // Allow only one interceptor type per instance
    __removeInterceptor(type);

    return instance().interceptors[type].use(success, error);
  }

  function __removeInterceptor(type) {
    const handlers = instance().interceptors[type].handlers;
    const ref =
      type === INTERCEPTOR_TYPE.RESPONSE
        ? __responseInterceptor
        : __requestInterceptor;

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
    setRequestInterceptor,
    setResponseInterceptor,
  };
})();

export default http;
