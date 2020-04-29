import http from './utils/http';

function createRepository(repositoryString, options = {}) {
  let [method, endpoint] = repositoryString.split(' ');
  let _method = method.toLowerCase();
  let _endpoint = endpoint;

  if (options.params) {
    _endpoint = getEndpointParams(_endpoint, options.params);
  }

  return function (payload) {
    const requestParams = buildRequestParams(
      _method,
      _endpoint,
      payload,
      options
    );

    return http.instance()[_method].apply(null, requestParams);
  };
}

function buildRequestParams(method, endpoint, payload, options) {
  let requestParams = [endpoint];

  if (method === 'post' || method === 'put' || method === 'patch') {
    requestParams.push(payload);
  }

  if (options.query) {
    requestParams.push({ params: options.query });
  }

  return requestParams;
}

function getEndpointParams(endpoint, params) {
  const matchParams = endpoint.match(/:\w+/g);

  if (!matchParams) {
    const paramKeys = Object.keys(params).join(', ');

    throw new Error(`Cannot found params ${paramKeys} in endpoint ${endpoint}`);
  }

  return matchParams.reduce((acc, param) => {
    // remove :
    const key = param.slice(1);
    const value = params[key];

    if (!value) {
      const paramKeys = Object.keys(params).join(', ');

      throw new Error(
        `Cannot found param ${key} in params object { ${paramKeys} }`
      );
    }

    return acc.replace(param, value);
  }, endpoint);
}

export default createRepository;
