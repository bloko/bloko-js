import http from './http';

function handler(method, endpoint, options) {
  let _endpoint = endpoint;

  let endpointParams = getEndpointParams(_endpoint);

  return function runner(payload = {}) {
    endpointParams.forEach(endpointParam => {
      const key = ':' + endpointParam;
      const value = payload.params[endpointParam];

      _endpoint = _endpoint.replace(key, value);
    });

    const requestParams = buildRequestParams(method, _endpoint, payload);

    return http.instance()[method](...requestParams);
  };
}

function buildRequestParams(method, endpoint, payload) {
  let requestParams = [endpoint];

  if (method === 'post' || method === 'put' || method === 'patch') {
    requestParams.push(payload.data);
  }

  if (payload.query) {
    requestParams.push({ params: payload.query });
  }

  return requestParams;
}

function getEndpointParams(endpoint) {
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
