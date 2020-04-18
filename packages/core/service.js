import http from './http';

function handler(method, endpoint, options) {
  let requestOptions = { url: endpoint };
  let params = getParams(requestOptions.url);

  return function runner(payload = {}) {
    params.forEach(param => {
      const key = ':' + param;
      const value = payload.params[param];

      requestOptions.url = requestOptions.url.replace(key, value);
    });

    requestOptions.data = payload.data;
    requestOptions.params = payload.query;

    return http.instance()[method](requestOptions);
  };
}

function getParams(endpoint) {
  try {
    return endpoint.match(/:\w+/g).map(param => {
      // remove : character
      return param.slice(1);
    });
  } catch (error) {
    return [];
  }
}

function builder(method) {
  return function (endpoint, options = {}) {
    return handler(method, endpoint, options);
  };
}

const service = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'head',
  'options',
].reduce((acc, method) => {
  acc[method] = builder(method);

  return acc;
}, {});

export default service;
